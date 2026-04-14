import { useState, useEffect, useMemo } from 'react';
import { MapPin, Map as MapIcon, Truck, ChevronDown, ChevronUp, X, Search, Loader2, Package } from 'lucide-react';
import { Button } from './ui/button';
import type { Trip } from './pages/TripsPage';

interface Order {
  id: string;
  orderDate: string;
  retailerName: string;
  salesPerson: string;
  beatName: string;
  refOrderNumber: string;
  invoiceValue: number;
  totalWeight: number;
  totalVolWeight: number;
}

interface Vehicle {
  id: number;
  name: string;
  category: string;
  price: number;
  estDelivery: string;
}

interface OrderGroup {
  id: string;
  routeName: string;
  orders: Order[];
  totalInvoice: number;
  totalWeight: number;
}

const availableVehicles: Vehicle[] = [
  { id: 1, name: 'ONDC Pramaaan Logistics', category: 'Immediate Delivery', price: 24.47, estDelivery: '13-04-2026, 06:27 PM' },
  { id: 2, name: 'Prorouting', category: 'Next Day Delivery', price: 25.00, estDelivery: '14-04-2026, 05:26 PM' },
  { id: 3, name: 'Delhivery Express', category: 'Same Day Delivery', price: 35.00, estDelivery: '13-04-2026, 08:00 PM' },
  { id: 4, name: 'Blue Dart', category: 'Next Day Delivery', price: 45.00, estDelivery: '14-04-2026, 10:00 AM' },
  { id: 5, name: 'Xpressbees', category: 'Next Day Delivery', price: 50.00, estDelivery: '14-04-2026, 05:26 PM' },
];

/**
 * Groups orders by delivery route proximity.
 * Orders sharing the same beat/area are batched together since their
 * delivery locations fall along the same route from the pickup point.
 */
function groupOrdersByRoute(orders: Order[]): OrderGroup[] {
  const groups = new Map<string, Order[]>();

  orders.forEach(order => {
    const key = order.beatName && order.beatName !== 'N/A' ? order.beatName : `single-${order.id}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(order);
  });

  let routeCounter = 1;
  return Array.from(groups.entries()).map(([_key, groupOrders], idx) => {
    // Multi-order groups get "Route 1", "Route 2" etc.
    // Single-order groups get the retailer/drop location name
    const routeName = groupOrders.length > 1
      ? `Route ${routeCounter++}`
      : groupOrders[0].retailerName;

    return {
      id: `group-${idx + 1}`,
      routeName,
      orders: groupOrders,
      totalInvoice: groupOrders.reduce((sum, o) => sum + o.invoiceValue, 0),
      totalWeight: groupOrders.reduce((sum, o) => sum + o.totalVolWeight, 0),
    };
  });
}

interface OptimizedRoutesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrders: Order[];
  deliveryDate: string;
  onConfirmRoutes?: (trips: Trip[]) => void;
}

export function OptimizedRoutesModal({
  isOpen,
  onClose,
  selectedOrders,
  deliveryDate,
  onConfirmRoutes,
}: OptimizedRoutesModalProps) {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'mapview' | 'optimizations'>('vehicles');
  // vehicleAssignments keyed by group ID
  const [vehicleAssignments, setVehicleAssignments] = useState<Record<string, number>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [vehiclesSearched, setVehiclesSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Group orders by route/beat after search
  const orderGroups = useMemo(() => {
    if (!vehiclesSearched) return [];
    return groupOrdersByRoute(selectedOrders);
  }, [selectedOrders, vehiclesSearched]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setVehiclesSearched(false);
      setIsSearching(false);
      setVehicleAssignments({});
      setOpenDropdown(null);
      setExpandedGroups([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const assignedCount = Object.keys(vehicleAssignments).length;
  const totalGroups = orderGroups.length;
  const canConfirm = vehiclesSearched && totalGroups > 0 && assignedCount === totalGroups;

  const handleSearchVehicles = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setVehiclesSearched(true);
      // Auto-expand first group
      const groups = groupOrdersByRoute(selectedOrders);
      if (groups.length > 0) setExpandedGroups([groups[0].id]);
    }, 2000);
  };

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleVehicleSelect = (groupId: string, vehicleId: number) => {
    setVehicleAssignments(prev => ({ ...prev, [groupId]: vehicleId }));
    setOpenDropdown(null);
  };

  const handleRemoveVehicle = (groupId: string) => {
    setVehicleAssignments(prev => {
      const next = { ...prev };
      delete next[groupId];
      return next;
    });
  };

  const handleConfirmRoutes = () => {
    const trips: Trip[] = [];
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');

    Object.entries(vehicleAssignments).forEach(([groupId, vehicleId], idx) => {
      const group = orderGroups.find(g => g.id === groupId);
      const vehicle = availableVehicles.find(v => v.id === vehicleId);
      if (!group || !vehicle) return;

      const offsetMs = idx * 1000;
      const tripTime = new Date(now.getTime() + offsetMs);
      const ts = `${tripTime.getFullYear()}${pad(tripTime.getMonth() + 1)}${pad(tripTime.getDate())}${pad(tripTime.getHours())}${pad(tripTime.getMinutes())}${pad(tripTime.getSeconds())}`;
      const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
      const tripNumber = `Q-${ts}-${rand}`;

      trips.push({
        id: tripNumber,
        tripNumber,
        provider: vehicle.name,
        sla: vehicle.category,
        status: 'Planned',
        dropPoints: group.orders.length,
        arrivalTime: vehicle.estDelivery,
        charges: `₹ ${vehicle.price.toFixed(2)}`,
      });
    });

    if (onConfirmRoutes) {
      onConfirmRoutes(trips);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) { setOpenDropdown(null); onClose(); } }}
    >
      <div
        className="bg-white rounded-lg shadow-xl flex flex-col w-[95vw] max-w-5xl h-[85vh] overflow-hidden"
        onClick={() => setOpenDropdown(null)}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Assign Vehicles to Orders</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-white border-b border-gray-200 flex-shrink-0">
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'vehicles' ? 'text-[#2D6EF5]' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Available Vehicles
            {activeTab === 'vehicles' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2D6EF5]" />}
          </button>
          <button
            onClick={() => setActiveTab('mapview')}
            className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors relative flex items-center justify-center gap-2 ${
              activeTab === 'mapview' ? 'text-[#2D6EF5]' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            Route Map
            {activeTab === 'mapview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2D6EF5]" />}
          </button>
          <button
            onClick={() => setActiveTab('optimizations')}
            className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'optimizations' ? 'text-[#2D6EF5]' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Optimizations
            {activeTab === 'optimizations' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2D6EF5]" />}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-[#F9FAFB] px-6 py-6">
          {activeTab === 'vehicles' && (
            <div className="space-y-3">
              {/* Summary bar + Search CTA */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  {selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''}
                  {vehiclesSearched && ` · ${totalGroups} route group${totalGroups !== 1 ? 's' : ''}`}
                  {' · '}{assignedCount} vehicle{assignedCount !== 1 ? 's' : ''} assigned
                </span>
                <div className="flex items-center gap-3">
                  {deliveryDate && (
                    <span className="text-sm text-gray-500">
                      Delivery Date: <span className="font-medium text-gray-700">{deliveryDate}</span>
                    </span>
                  )}
                  {!vehiclesSearched && (
                    <Button
                      onClick={handleSearchVehicles}
                      disabled={isSearching}
                      className="gap-2 bg-[#2D6EF5] hover:bg-[#2557D6] text-white text-sm px-4 py-2"
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          Search Vehicles
                        </>
                      )}
                    </Button>
                  )}
                  {vehiclesSearched && (
                    <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      {availableVehicles.length} vehicles found
                    </span>
                  )}
                </div>
              </div>

              {/* Searching indicator */}
              {isSearching && (
                <div className="bg-white border border-blue-200 rounded-lg p-6 flex flex-col items-center gap-3 mb-3">
                  <Loader2 className="w-8 h-8 text-[#2D6EF5] animate-spin" />
                  <p className="text-sm font-medium text-gray-700">
                    Analyzing pickup & delivery locations to group nearby orders...
                  </p>
                  <p className="text-xs text-gray-400">Optimizing routes for batch delivery</p>
                </div>
              )}

              {/* Before search — show ungrouped orders as disabled */}
              {!vehiclesSearched && !isSearching && selectedOrders.map((order) => (
                <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-[#2D6EF5] flex-shrink-0" />
                        <span className="text-sm font-semibold text-gray-900 truncate">
                          {order.retailerName}
                        </span>
                      </div>
                      <div className="ml-6 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span>Order: {order.orderDate}</span>
                        <span>Ref: {order.refOrderNumber}</span>
                        <span className="font-medium text-gray-700">₹ {order.invoiceValue.toFixed(2)}</span>
                        <span>{order.totalVolWeight.toFixed(2)} Kgs</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 w-72">
                      <button
                        disabled
                        className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                      >
                        <span className="flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          Search vehicles first
                        </span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* After search — show grouped orders */}
              {vehiclesSearched && orderGroups.map((group) => {
                const assignedVehicleId = vehicleAssignments[group.id];
                const assignedVehicle = assignedVehicleId
                  ? availableVehicles.find(v => v.id === assignedVehicleId)
                  : null;
                const isDropdownOpen = openDropdown === group.id;
                const isExpanded = expandedGroups.includes(group.id);
                const isBatched = group.orders.length > 1;

                return (
                  <div
                    key={group.id}
                    className={`bg-white border rounded-lg overflow-hidden transition-colors ${
                      assignedVehicle ? 'border-[#2D6EF5]' : 'border-gray-200'
                    }`}
                  >
                    {/* Group header */}
                    <div className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Left: Group info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-6 h-6 rounded-full bg-[#2D6EF5] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {group.orders.length}
                            </div>
                            <span className="text-sm font-bold text-gray-900">
                              {group.routeName}
                            </span>
                            {isBatched && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                                Batched
                              </span>
                            )}
                          </div>
                          <div className="ml-8 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              {group.orders.length} delivery point{group.orders.length !== 1 ? 's' : ''}
                            </span>
                            <span className="font-medium text-gray-700">₹ {group.totalInvoice.toFixed(2)}</span>
                            <span>{group.totalWeight.toFixed(2)} Kgs</span>
                          </div>

                          {/* Expand/collapse delivery points */}
                          <button
                            onClick={() => toggleGroupExpansion(group.id)}
                            className="ml-8 mt-2 flex items-center gap-1 text-xs text-[#2D6EF5] hover:text-[#2557D6] font-medium"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-3.5 h-3.5" />
                                Hide delivery points
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3.5 h-3.5" />
                                View {group.orders.length} delivery point{group.orders.length !== 1 ? 's' : ''}
                              </>
                            )}
                          </button>
                        </div>

                        {/* Right: Vehicle dropdown (one per group) */}
                        <div className="flex-shrink-0 w-72 relative">
                          {assignedVehicle ? (
                            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-[#2D6EF5] rounded-lg">
                              <Truck className="w-4 h-4 text-[#2D6EF5] flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">{assignedVehicle.name}</div>
                                <div className="text-xs text-gray-500">{assignedVehicle.category} · ₹ {assignedVehicle.price.toFixed(2)}</div>
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleRemoveVehicle(group.id); }}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(isDropdownOpen ? null : group.id);
                              }}
                              className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#2D6EF5] hover:text-gray-700 transition-colors bg-white cursor-pointer"
                            >
                              <span className="flex items-center gap-2">
                                <Truck className="w-4 h-4" />
                                Select Vehicle
                              </span>
                              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                          )}

                          {/* Dropdown panel */}
                          {isDropdownOpen && (
                            <div
                              className="absolute right-0 top-full mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {availableVehicles.map((vehicle, idx) => (
                                <button
                                  key={vehicle.id}
                                  onClick={() => handleVehicleSelect(group.id, vehicle.id)}
                                  className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-start gap-3 ${
                                    idx < availableVehicles.length - 1 ? 'border-b border-gray-100' : ''
                                  }`}
                                >
                                  <Truck className="w-4 h-4 text-[#2D6EF5] mt-0.5 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium text-gray-900">{vehicle.name}</span>
                                      <span className="text-sm font-semibold text-green-600">₹ {vehicle.price.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-0.5">
                                      <span className="text-xs text-gray-500">{vehicle.category}</span>
                                      <span className="text-xs text-[#2D6EF5]">{vehicle.estDelivery}</span>
                                    </div>
                                    {idx === 0 && (
                                      <span className="inline-block mt-1 px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                                        Best Price
                                      </span>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded delivery points */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-[#F9FAFB] px-4 py-3">
                        <div className="space-y-2">
                          {group.orders.map((order, idx) => (
                            <div
                              key={order.id}
                              className="flex items-center gap-3 bg-white px-3 py-2.5 rounded-lg border border-gray-200"
                            >
                              <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {idx + 1}
                              </div>
                              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-medium text-gray-900">{order.retailerName}</span>
                                <span className="text-xs text-gray-400 ml-2">Ref: {order.refOrderNumber}</span>
                              </div>
                              <span className="text-xs font-medium text-gray-600 flex-shrink-0">₹ {order.invoiceValue.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'mapview' && (
            <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">Route Map view coming soon...</p>
            </div>
          )}

          {activeTab === 'optimizations' && (
            <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">Optimizations view coming soon...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white flex-shrink-0">
          <span className="text-sm text-gray-500">
            {!vehiclesSearched
              ? 'Click "Search Vehicles" to find available providers'
              : canConfirm
                ? `All ${totalGroups} route${totalGroups !== 1 ? 's' : ''} assigned — ready to confirm`
                : `${assignedCount} of ${totalGroups} route${totalGroups !== 1 ? 's' : ''} assigned — assign all to continue`}
          </span>
          <div className="flex items-center gap-3">
            <Button
              onClick={onClose}
              className="px-8 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-md font-medium"
            >
              Back
            </Button>
            <Button
              onClick={handleConfirmRoutes}
              disabled={!canConfirm}
              className="px-8 py-2 bg-[#2D6EF5] hover:bg-[#2557D6] text-white rounded-md font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Confirm Routes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
