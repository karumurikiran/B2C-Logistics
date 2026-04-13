import { useState } from 'react';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';

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

interface RouteData {
  id: string;
  vehicleType: string;
  actualWeight: number;
  vehicleUtilization: number;
  invoiceValue: number;
  deliveryCost: number;
  deliveryCostPercent: number;
  digitalPercent: number;
  salesPercent: number;
  date: string;
  orders: Order[];
}

interface OptimizedRoutesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrders: Order[];
  deliveryDate: string;
}

export function OptimizedRoutesModal({ 
  isOpen, 
  onClose, 
  selectedOrders,
  deliveryDate 
}: OptimizedRoutesModalProps) {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'optimizations'>('vehicles');
  const [expandedRoutes, setExpandedRoutes] = useState<string[]>(['route-1']);

  // Calculate optimized routes
  const routes: RouteData[] = generateOptimizedRoutes(selectedOrders, deliveryDate);

  // Calculate summary statistics
  const totalVehicleTypes = new Set(routes.map(r => r.vehicleType)).size;
  const totalWeight = routes.reduce((sum, r) => sum + r.actualWeight, 0);
  const totalInvoiceValue = routes.reduce((sum, r) => sum + r.invoiceValue, 0);
  const totalDeliveryCost = routes.reduce((sum, r) => sum + r.deliveryCost, 0);
  const avgVehicleUtilization = routes.length > 0 
    ? routes.reduce((sum, r) => sum + r.vehicleUtilization, 0) / routes.length 
    : 0;
  const avgDeliveryCostPercent = totalInvoiceValue > 0 
    ? (totalDeliveryCost / totalInvoiceValue) * 100 
    : 0;

  const toggleRouteExpansion = (routeId: string) => {
    setExpandedRoutes(prev => 
      prev.includes(routeId)
        ? prev.filter(id => id !== routeId)
        : [...prev, routeId]
    );
  };

  const handleConfirmRoutes = () => {
    // Handle route confirmation logic
    alert(`Confirming ${routes.length} optimized route(s)`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] h-[85vh] p-0 gap-0 bg-white flex flex-col">
        <DialogTitle className="sr-only">Optimized Delivery Routes</DialogTitle>
        <DialogDescription className="sr-only">
          View and manage optimized delivery routes with vehicle assignments and order details
        </DialogDescription>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Optimized Delivery Routes</h2>
        </div>

        {/* Tabs */}
        <div className="flex bg-white border-b border-gray-200">
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'vehicles'
                ? 'text-[#2D6EF5]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Available Vehicles
            {activeTab === 'vehicles' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2D6EF5]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('optimizations')}
            className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'optimizations'
                ? 'text-[#2D6EF5]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Optimizations
            {activeTab === 'optimizations' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2D6EF5]" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-[#F9FAFB] px-6 py-6">
          {activeTab === 'vehicles' ? (
            <>
              {/* Summary Statistics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1.5">Total Vehicle Types</div>
                  <div className="text-2xl font-bold text-gray-900">
                    1 Ton ({totalVehicleTypes})
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1.5">Total Weight</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {totalWeight.toFixed(0)} kgs
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1.5">Total Vehicle Utilization</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {avgVehicleUtilization.toFixed(2)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1.5">Total Invoice Value</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ₹ {totalInvoiceValue.toFixed(1)}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1.5">Total Delivery Cost</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ₹ {totalDeliveryCost.toFixed(0)}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1.5">Total Delivery Cost %</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {avgDeliveryCostPercent.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Routes */}
              <div className="space-y-4">
                {routes.map((route, index) => (
                  <div key={route.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    {/* Route Header */}
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-[#2D6EF5]" />
                          <span className="text-lg font-bold text-gray-900">Route {index + 1}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-[#EFF6FF] text-[#2D6EF5] text-xs font-medium rounded-md">
                            {route.digitalPercent}% Digital + {route.salesPercent}% Sales
                          </span>
                          <span className="text-sm font-medium text-gray-600">{route.date}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6 mb-4">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">
                            Vehicle Wt / Actual Wt / Vehicle Utilization
                          </div>
                          <div className="text-sm font-semibold text-gray-900">
                            {route.vehicleType} / {route.actualWeight.toFixed(0)} kgs / {route.vehicleUtilization.toFixed(2)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">
                            Invoice Value / Delivery Cost / Delivery Cost %
                          </div>
                          <div className="text-sm font-semibold text-gray-900">
                            ₹ {route.invoiceValue.toFixed(1)} / ₹ {route.deliveryCost.toFixed(0)} / {route.deliveryCostPercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>

                      {/* Orders Toggle */}
                      <button
                        onClick={() => toggleRouteExpansion(route.id)}
                        className="flex items-center justify-between w-full px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <span className="text-sm font-semibold text-gray-700">
                          Orders ({route.orders.length})
                        </span>
                        {expandedRoutes.includes(route.id) ? (
                          <ChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    </div>

                    {/* Expanded Orders List */}
                    {expandedRoutes.includes(route.id) && (
                      <div className="border-t border-gray-200 bg-[#F9FAFB] px-5 py-4">
                        <div className="space-y-2">
                          {route.orders.map((order) => (
                            <div
                              key={order.id}
                              className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200"
                            >
                              <div className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900">
                                  {order.retailerName}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500">1 orders</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">Optimizations view coming soon...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white">
          <Button
            onClick={onClose}
            className="px-8 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-md font-medium"
          >
            Back
          </Button>
          <Button
            onClick={handleConfirmRoutes}
            className="px-8 py-2 bg-[#2D6EF5] hover:bg-[#2557D6] text-white rounded-md font-medium"
          >
            Confirm Routes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to generate optimized routes
function generateOptimizedRoutes(orders: Order[], deliveryDate: string): RouteData[] {
  if (orders.length === 0) return [];

  // Group orders by retailer to create routes
  const routeGroups = new Map<string, Order[]>();
  
  orders.forEach(order => {
    const key = order.retailerName;
    if (!routeGroups.has(key)) {
      routeGroups.set(key, []);
    }
    routeGroups.get(key)!.push(order);
  });

  // Create route data for each group
  const routes: RouteData[] = Array.from(routeGroups.entries()).map(([retailer, routeOrders], index) => {
    const totalInvoiceValue = routeOrders.reduce((sum, o) => sum + o.invoiceValue, 0);
    const totalWeight = routeOrders.reduce((sum, o) => sum + o.totalVolWeight, 0);
    const deliveryCost = Math.round(totalInvoiceValue * 0.054); // 5.4% average
    const vehicleCapacity = 1000; // 1 Ton = 1000 kgs
    const vehicleUtilization = (totalWeight / vehicleCapacity) * 100;

    // Calculate digital vs sales percentages (mock calculation)
    const digitalPercent = Math.round(Math.random() * 30 + 20); // 20-50%
    const salesPercent = 100 - digitalPercent;

    return {
      id: `route-${index + 1}`,
      vehicleType: '1 Ton',
      actualWeight: totalWeight,
      vehicleUtilization,
      invoiceValue: totalInvoiceValue,
      deliveryCost,
      deliveryCostPercent: (deliveryCost / totalInvoiceValue) * 100,
      digitalPercent,
      salesPercent,
      date: formatDate(deliveryDate),
      orders: routeOrders,
    };
  });

  return routes;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}