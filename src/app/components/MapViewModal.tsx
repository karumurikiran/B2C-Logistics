import { useEffect, useRef, useState } from 'react';
import { X, CheckCircle, Truck } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import mapImage from 'figma:asset/0fda83f64954000698f9c535f09825f9fc18b63c.png';

interface Order {
  id: string;
  createdDate: string;
  orderDate: string;
  invoiceNumber: string;
  retailerName: string;
  orderType: string;
  salesPerson: string;
  beatName: string;
  mobileNumber: string;
  status: string;
  tripNumber: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  invoiceValue?: number;
  volumetricWeight?: number;
  deliveryTime?: string;
}

interface MapViewModalProps {
  open: boolean;
  onClose: () => void;
  orders: Order[];
  onSelectOrder: (orderId: string) => void;
  onCreateRoute: (selectedOrders: Order[]) => void;
}

export function MapViewModal({ open, onClose, orders, onCreateRoute }: MapViewModalProps) {
  const dateDropdownRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const selectionBoxRef = useRef<HTMLDivElement | null>(null);
  const markerRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  
  // Get unique dates from orders
  const uniqueDates = Array.from(new Set(orders.map(o => o.createdDate))).sort((a, b) => {
    const parseDate = (date: string) => {
      const [day, month, year] = date.split('-');
      return new Date(parseInt('20' + year), parseInt(month) - 1, parseInt(day));
    };
    return parseDate(b).getTime() - parseDate(a).getTime();
  });
  
  // State - Initialize with all dates selected
  const [selectedDates, setSelectedDates] = useState<Set<string>>(() => new Set(uniqueDates));
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [selectedBeat, setSelectedBeat] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [hoveredOrder, setHoveredOrder] = useState<string | null>(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  
  // Update selected dates when uniqueDates changes
  useEffect(() => {
    setSelectedDates(new Set(uniqueDates));
  }, [uniqueDates.join(',')]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target as Node)) {
        setIsDateDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Shift+Drag multi-selection
  useEffect(() => {
    if (!open || !mapContainerRef.current) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.shiftKey && mapContainerRef.current?.contains(e.target as Node)) {
        isDraggingRef.current = true;
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        e.preventDefault();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current && dragStartRef.current) {
        if (selectionBoxRef.current) {
          selectionBoxRef.current.remove();
        }

        const box = document.createElement('div');
        box.style.position = 'fixed';
        box.style.border = '2px dashed #2D6EF5';
        box.style.backgroundColor = 'rgba(45, 110, 245, 0.1)';
        box.style.pointerEvents = 'none';
        box.style.zIndex = '9999';
        
        const left = Math.min(dragStartRef.current.x, e.clientX);
        const top = Math.min(dragStartRef.current.y, e.clientY);
        const width = Math.abs(e.clientX - dragStartRef.current.x);
        const height = Math.abs(e.clientY - dragStartRef.current.y);
        
        box.style.left = left + 'px';
        box.style.top = top + 'px';
        box.style.width = width + 'px';
        box.style.height = height + 'px';
        
        document.body.appendChild(box);
        selectionBoxRef.current = box;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDraggingRef.current && dragStartRef.current) {
        const boxLeft = Math.min(dragStartRef.current.x, e.clientX);
        const boxTop = Math.min(dragStartRef.current.y, e.clientY);
        const boxRight = Math.max(dragStartRef.current.x, e.clientX);
        const boxBottom = Math.max(dragStartRef.current.y, e.clientY);

        const newSelected = new Set(selectedOrders);
        markerRefs.current.forEach((markerElement, orderId) => {
          if (markerElement) {
            const rect = markerElement.getBoundingClientRect();
            const markerCenterX = rect.left + rect.width / 2;
            const markerCenterY = rect.top + rect.height / 2;

            if (
              markerCenterX >= boxLeft &&
              markerCenterX <= boxRight &&
              markerCenterY >= boxTop &&
              markerCenterY <= boxBottom
            ) {
              newSelected.add(orderId);
            }
          }
        });

        setSelectedOrders(newSelected);

        if (selectionBoxRef.current) {
          selectionBoxRef.current.remove();
          selectionBoxRef.current = null;
        }

        isDraggingRef.current = false;
        dragStartRef.current = null;
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (selectionBoxRef.current) {
        selectionBoxRef.current.remove();
        selectionBoxRef.current = null;
      }
    };
  }, [open, selectedOrders]);

  // Get unique beats
  const beats = Array.from(new Set(orders.map(o => o.beatName))).filter(Boolean);

  // Filter digital orders with location data
  const ordersWithLocation = orders.filter(
    (order) => 
      order.latitude !== undefined && 
      order.longitude !== undefined &&
      order.orderType === 'Digital'
  );

  // Apply date and beat filters
  const filteredOrders = ordersWithLocation.filter((order) => {
    if (selectedBeat !== 'all' && order.beatName !== selectedBeat) return false;
    if (selectedDates.size > 0 && !selectedDates.has(order.createdDate)) return false;
    return true;
  });

  const selectedOrdersList = filteredOrders.filter(order => selectedOrders.has(order.id));

  // Calculate cumulative totals for selected orders
  const cumulativeTotals = selectedOrdersList.reduce((acc, order) => {
    return {
      totalValue: acc.totalValue + (order.invoiceValue || 0),
      totalVWeight: acc.totalVWeight + (order.volumetricWeight || 0),
    };
  }, { totalValue: 0, totalVWeight: 0 });

  // Helper: Get marker color based on invoice value and selection
  const getMarkerColor = (invoiceValue: number | undefined, isSelected: boolean) => {
    if (isSelected) return '#2D6EF5';
    if (!invoiceValue) return '#6B7280'; // Gray for missing value
    if (invoiceValue < 1000) return '#EF4444'; // Red - Under 1000
    if (invoiceValue >= 1000 && invoiceValue <= 3000) return '#F59E0B'; // Yellow - 1000-3000
    return '#10B981'; // Green - Above 3000
  };

  // Helper: Toggle order selection
  const toggleOrderSelection = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  // Map bounds for Hyderabad (approximate)
  const MAP_BOUNDS = {
    minLat: 17.2,
    maxLat: 17.6,
    minLng: 78.2,
    maxLng: 78.7
  };

  // Convert lat/lng to x/y percentage on the static map
  const latLngToPixel = (lat: number, lng: number) => {
    const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100;
    const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
    return { x, y };
  };

  // Mark selected orders as delivered
  const handleMarkDelivered = () => {
    if (selectedOrdersList.length === 0) return;
    toast.success(`Marked ${selectedOrdersList.length} order(s) as delivered.`);
  };

  // Open confirmation dialog for shared logistics
  const handleRequestSharedLogistics = () => {
    if (selectedOrdersList.length === 0) return;
    setShowConfirmationDialog(true);
  };

  // Confirm shared logistics request
  const handleConfirmRequest = () => {
    toast.success(`Request for shared logistics has been sent for ${selectedOrdersList.length} order(s).`);
    setShowConfirmationDialog(false);
    onClose(); // Close the map view modal
  };

  // Deselect all orders
  const handleDeselectAll = () => {
    setSelectedOrders(new Set());
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-none !w-[75vw] !h-[75vh] !p-0 !gap-0 !rounded-lg !border-0" showCloseButton={false}>
        <DialogTitle className="sr-only">Orders Map View</DialogTitle>
        <DialogDescription className="sr-only">Map view showing orders with their locations</DialogDescription>
        
        {/* Header */}
        <div className="bg-[#F5F5F5] border-b border-gray-300 flex items-center justify-between px-[16px] py-[12px]">
          <h2 className="text-base font-semibold text-gray-900">Orders Map View</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Map Section */}
          <div className="flex-1 flex flex-col bg-gray-100">
            {/* Filters */}
            <div className="px-4 py-2 bg-white border-b border-gray-200">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Date Multi-Select */}
                <div className="flex items-center gap-2 relative" ref={dateDropdownRef}>
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Date:</label>
                  <button
                    onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D6EF5] focus:border-transparent bg-white hover:bg-gray-50 min-w-[160px] flex items-center justify-between"
                  >
                    <span className="text-gray-700">
                      {selectedDates.size === 0 ? 'Select Dates' : selectedDates.size === 1 ? '1 date selected' : `${selectedDates.size} dates selected`}
                    </span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isDateDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
                      {selectedDates.size > 0 && (
                        <div className="px-3 py-2 border-b border-gray-200">
                          <button onClick={() => setSelectedDates(new Set())} className="text-xs text-[#2D6EF5] hover:text-[#2557D6] font-medium">
                            Clear All
                          </button>
                        </div>
                      )}
                      <div className="py-1">
                        {uniqueDates.map((date) => {
                          const isChecked = selectedDates.has(date);
                          const orderCount = ordersWithLocation.filter(o => o.createdDate === date).length;
                          return (
                            <label key={date} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  const newSelected = new Set(selectedDates);
                                  if (checked) {
                                    newSelected.add(date);
                                  } else {
                                    newSelected.delete(date);
                                  }
                                  setSelectedDates(newSelected);
                                }}
                              />
                              <span className="text-sm text-gray-700 flex-1">{date}</span>
                              <span className="text-xs text-gray-500">({orderCount})</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Beat Filter */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Beat:</label>
                  <select
                    value={selectedBeat}
                    onChange={(e) => setSelectedBeat(e.target.value)}
                    className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D6EF5] focus:border-transparent min-w-[120px]"
                  >
                    <option value="all">All Beats</option>
                    {beats.map(beat => (
                      <option key={beat} value={beat}>{beat}</option>
                    ))}
                  </select>
                </div>

                {/* Info */}
                <div className="flex items-center gap-3 ml-auto">
                  <span className="text-sm text-gray-600">
                    {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
                  </span>
                  {selectedOrders.size > 0 && (
                    <span className="text-sm text-gray-600">| {selectedOrders.size} selected</span>
                  )}
                </div>
              </div>
              
              {/* Tip for multiple selection */}
              <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><span className="font-medium">Tip:</span> Hold <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">Shift</kbd> and drag to select multiple orders</span>
              </div>
            </div>

            {/* Static Map with Markers */}
            <div className="flex-1 relative overflow-hidden">
              {ordersWithLocation.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-md">
                    <span className="text-4xl">📍</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Location Data Available</h3>
                  <p className="text-sm text-gray-600 max-w-md">
                    {orders.filter(o => o.orderType === 'Digital').length === 0
                      ? 'No digital orders found. The map view only displays digital orders.'
                      : 'Digital orders found, but geocoordinates are missing or invalid.'}
                  </p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-md">
                    <span className="text-4xl">🔍</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Match Filter</h3>
                  <p className="text-sm text-gray-600 max-w-md">Try adjusting your date or beat selection.</p>
                </div>
              ) : (
                <div 
                  className="w-full h-full relative bg-gray-200"
                  ref={mapContainerRef}
                >
                  {/* Static Map Background */}
                  <img 
                    src={mapImage}
                    alt="Hyderabad Map"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Map Markers Overlay */}
                  <div className="absolute inset-0">
                    {filteredOrders.map((order, index) => {
                      const position = latLngToPixel(order.latitude!, order.longitude!);
                      const isSelected = selectedOrders.has(order.id);
                      const markerColor = getMarkerColor(order.invoiceValue, isSelected);
                      const isHovered = hoveredOrder === order.id;

                      return (
                        <div
                          key={order.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                          style={{
                            left: `${position.x}%`,
                            top: `${position.y}%`,
                            zIndex: isHovered ? 9999 : 1,
                          }}
                          onClick={() => toggleOrderSelection(order.id)}
                          onMouseEnter={() => setHoveredOrder(order.id)}
                          onMouseLeave={() => setHoveredOrder(null)}
                          ref={el => markerRefs.current.set(order.id, el!)}
                        >
                          {/* Marker Pin */}
                          <div
                            className="flex items-center justify-center rounded-full text-white font-bold text-sm transition-all duration-200"
                            style={{
                              backgroundColor: markerColor,
                              width: isSelected ? '40px' : '32px',
                              height: isSelected ? '40px' : '32px',
                              border: `${isSelected ? '4px' : '3px'} solid white`,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                              transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                            }}
                          >
                            {index + 1}
                          </div>

                          {/* Tooltip on Hover */}
                          {isHovered && (
                            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 pointer-events-none">
                              <div className="bg-white rounded-lg shadow-xl px-4 py-3 min-w-[280px] border border-gray-200">
                                <div className="space-y-1">
                                  <div className="text-sm">
                                    <span className="font-semibold text-gray-900">Invoice Number : </span>
                                    <span className="text-gray-900">{order.invoiceNumber || 'N/A'}</span>
                                  </div>
                                  <div className="text-sm">
                                    <span className="font-semibold text-gray-900">Retailer Name : </span>
                                    <span className="text-gray-900">{order.retailerName || 'Unknown'}</span>
                                  </div>
                                  <div className="text-sm">
                                    <span className="font-semibold text-gray-900">Invoice Value : </span>
                                    <span className="text-gray-900">
                                      {order.invoiceValue ? `₹ ${order.invoiceValue.toFixed(2)}` : 'N/A'}
                                    </span>
                                  </div>
                                  <div className="text-sm">
                                    <span className="font-semibold text-gray-900">Volumetric Weight : </span>
                                    <span className="text-gray-900">
                                      {order.volumetricWeight ? `${order.volumetricWeight.toFixed(2)} Kg` : 'N/A'}
                                    </span>
                                  </div>
                                  <div className="text-sm">
                                    <span className="font-semibold text-gray-900">Delivery Time : </span>
                                    <span className="text-gray-900">
                                      {order.deliveryTime || 'N/A'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Selected Orders Sidebar */}
          <div className="w-80 border-l border-gray-200 bg-white flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-900">Selected Orders ({selectedOrders.size})</h3>
                {selectedOrders.size > 0 && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selectedOrders.size > 0}
                      onCheckedChange={handleDeselectAll}
                    />
                    <span className="text-xs text-gray-600">Deselect All</span>
                  </label>
                )}
              </div>
              {selectedOrders.size > 0 && (
                <div className="flex items-center gap-4 text-xs pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-600">Total Value:</span>
                    <span className="font-semibold text-gray-900">₹ {cumulativeTotals.totalValue.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-600">Total V.Wt:</span>
                    <span className="font-semibold text-gray-900">{cumulativeTotals.totalVWeight.toFixed(2)} Kg</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {selectedOrdersList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-2xl">📦</span>
                  </div>
                  <p className="text-sm text-gray-500">No orders selected. Click on map markers to select orders.</p>
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  {selectedOrdersList.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-3 bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-2">
                        <Checkbox
                          checked={selectedOrders.has(order.id)}
                          onCheckedChange={() => toggleOrderSelection(order.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-gray-900 truncate mb-1">{order.invoiceNumber || 'N/A'}</div>
                          <div className="text-xs text-gray-600 truncate mb-1">{order.retailerName}</div>
                          <div className="text-xs mb-0.5">
                            <span className="text-gray-500">Beat: </span>
                            <span className="text-gray-700 font-medium">{order.beatName}</span>
                          </div>
                          <div className="text-xs mb-0.5">
                            <span className="text-gray-500">Invoice Value: </span>
                            <span className="text-gray-700 font-medium">
                              {order.invoiceValue ? `₹ ${order.invoiceValue.toFixed(2)}` : 'N/A'}
                            </span>
                          </div>
                          <div className="text-xs">
                            <span className="text-gray-500">Volumetric Weight: </span>
                            <span className="text-gray-700 font-medium">
                              {order.volumetricWeight ? `${order.volumetricWeight.toFixed(2)} Kg` : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-gray-200 space-y-2">
              <button
                onClick={handleMarkDelivered}
                disabled={selectedOrders.size === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2D6EF5] text-white rounded-lg text-sm font-medium hover:bg-[#2557D6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-4 h-4" />
                Mark as Delivered
              </button>
              <button
                onClick={handleRequestSharedLogistics}
                disabled={selectedOrders.size === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2D6EF5] text-white rounded-lg text-sm font-medium hover:bg-[#2557D6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Truck className="w-4 h-4" />
                Request Shared Logistics
              </button>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
        <AlertDialogContent className="sm:max-w-[460px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Request</AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              Are you sure you want to send a shared logistics request for {selectedOrdersList.length} order{selectedOrdersList.length !== 1 ? 's' : ''}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {/* Request Summary */}
          <div className="bg-[#F5F5F5] rounded-lg px-4 py-3 space-y-2">
            <div className="text-sm text-gray-600 mb-2">Request Summary:</div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">Selected Orders:</span>
              <span className="font-semibold text-gray-900">{selectedOrdersList.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">Total Value:</span>
              <span className="font-semibold text-gray-900">₹ {cumulativeTotals.totalValue.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">Total Weight:</span>
              <span className="font-semibold text-gray-900">{cumulativeTotals.totalVWeight.toFixed(2)} Kg</span>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRequest} className="bg-[#2D6EF5] hover:bg-[#2557D6] flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Confirm Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}