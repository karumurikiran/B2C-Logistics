import { useState, useMemo } from 'react';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import type { Trip } from './pages/TripsPage';

interface TripRouteMapDialogProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip | null;
}

// Fixed route data for each trip - these routes never change
const FIXED_TRIP_ROUTES: Record<string, { lat: number; lng: number; status: string; retailerName: string }[]> = {
  '1': [
    { lat: 17.4925, lng: 78.3967, status: 'delivered', retailerName: 'METRO SUPERMART' },
    { lat: 17.4400, lng: 78.3489, status: 'delivered', retailerName: 'FRESH BAZAAR' },
    { lat: 17.4239, lng: 78.4738, status: 'planned', retailerName: 'CITY MART' },
  ],
  '2': [
    { lat: 17.4483, lng: 78.3915, status: 'planned', retailerName: 'SUNRISE TRADERS' },
    { lat: 17.4851, lng: 78.4851, status: 'planned', retailerName: 'GREEN VALLEY STORE' },
    { lat: 17.4435, lng: 78.3913, status: 'planned', retailerName: 'FRESH CORNER' },
    { lat: 17.4933, lng: 78.3986, status: 'planned', retailerName: 'COMMUNITY STORE' },
    { lat: 17.4126, lng: 78.4306, status: 'planned', retailerName: 'SMART RETAIL' },
    { lat: 17.3850, lng: 78.4867, status: 'planned', retailerName: 'QUICK SHOP' },
    { lat: 17.4067, lng: 78.5520, status: 'planned', retailerName: 'ROYAL STORES' },
    { lat: 17.4250, lng: 78.3356, status: 'planned', retailerName: 'SUPER BAZAR' },
    { lat: 17.3616, lng: 78.4747, status: 'planned', retailerName: 'PREMIUM MART' },
    { lat: 17.4290, lng: 78.4063, status: 'planned', retailerName: 'LOCAL STORE' },
    { lat: 17.4599, lng: 78.3577, status: 'planned', retailerName: 'URBAN MART' },
    { lat: 17.4320, lng: 78.4120, status: 'planned', retailerName: 'DAILY NEEDS' },
  ],
  '3': [
    { lat: 17.4126, lng: 78.4306, status: 'delivered', retailerName: 'SMART RETAIL' },
    { lat: 17.3850, lng: 78.4867, status: 'delivered', retailerName: 'QUICK SHOP' },
    { lat: 17.4250, lng: 78.3356, status: 'delivered', retailerName: 'SUPER BAZAR' },
    { lat: 17.4320, lng: 78.4120, status: 'delivered', retailerName: 'DAILY NEEDS' },
    { lat: 17.4599, lng: 78.3577, status: 'delivered', retailerName: 'URBAN MART' },
    { lat: 17.4435, lng: 78.3913, status: 'delivered', retailerName: 'FRESH CORNER' },
    { lat: 17.4483, lng: 78.3915, status: 'delivered', retailerName: 'SUNRISE TRADERS' },
    { lat: 17.4851, lng: 78.4851, status: 'delivered', retailerName: 'GREEN VALLEY STORE' },
    { lat: 17.4925, lng: 78.3967, status: 'delivered', retailerName: 'METRO SUPERMART' },
    { lat: 17.4400, lng: 78.3489, status: 'delivered', retailerName: 'FRESH BAZAAR' },
    { lat: 17.4239, lng: 78.4738, status: 'delivered', retailerName: 'CITY MART' },
    { lat: 17.4067, lng: 78.5520, status: 'delivered', retailerName: 'ROYAL STORES' },
    { lat: 17.3616, lng: 78.4747, status: 'delivered', retailerName: 'PREMIUM MART' },
    { lat: 17.4933, lng: 78.3986, status: 'delivered', retailerName: 'COMMUNITY STORE' },
  ],
  '4': [
    { lat: 17.4925, lng: 78.3967, status: 'delivered', retailerName: 'METRO SUPERMART' },
    { lat: 17.4435, lng: 78.3913, status: 'delivered', retailerName: 'FRESH CORNER' },
    { lat: 17.4483, lng: 78.3915, status: 'delivered', retailerName: 'SUNRISE TRADERS' },
    { lat: 17.4851, lng: 78.4851, status: 'delivered', retailerName: 'GREEN VALLEY STORE' },
    { lat: 17.4126, lng: 78.4306, status: 'delivered', retailerName: 'SMART RETAIL' },
    { lat: 17.4239, lng: 78.4738, status: 'delivered', retailerName: 'CITY MART' },
    { lat: 17.3850, lng: 78.4867, status: 'delivered', retailerName: 'QUICK SHOP' },
    { lat: 17.4067, lng: 78.5520, status: 'delivered', retailerName: 'ROYAL STORES' },
  ],
  '5': [
    { lat: 17.4400, lng: 78.3489, status: 'delivered', retailerName: 'FRESH BAZAAR' },
  ],
  '6': [
    { lat: 17.4925, lng: 78.3967, status: 'delivered', retailerName: 'METRO SUPERMART' },
    { lat: 17.4400, lng: 78.3489, status: 'delivered', retailerName: 'FRESH BAZAAR' },
    { lat: 17.4126, lng: 78.4306, status: 'delivered', retailerName: 'SMART RETAIL' },
    { lat: 17.4851, lng: 78.4851, status: 'delivered', retailerName: 'GREEN VALLEY STORE' },
    { lat: 17.4435, lng: 78.3913, status: 'delivered', retailerName: 'FRESH CORNER' },
    { lat: 17.4239, lng: 78.4738, status: 'delivered', retailerName: 'CITY MART' },
    { lat: 17.4483, lng: 78.3915, status: 'delivered', retailerName: 'SUNRISE TRADERS' },
    { lat: 17.3850, lng: 78.4867, status: 'delivered', retailerName: 'QUICK SHOP' },
    { lat: 17.4067, lng: 78.5520, status: 'delivered', retailerName: 'ROYAL STORES' },
    { lat: 17.4933, lng: 78.3986, status: 'delivered', retailerName: 'COMMUNITY STORE' },
    { lat: 17.4250, lng: 78.3356, status: 'delivered', retailerName: 'SUPER BAZAR' },
    { lat: 17.3616, lng: 78.4747, status: 'delivered', retailerName: 'PREMIUM MART' },
    { lat: 17.4290, lng: 78.4063, status: 'delivered', retailerName: 'LOCAL STORE' },
    { lat: 17.4599, lng: 78.3577, status: 'delivered', retailerName: 'URBAN MART' },
    { lat: 17.4320, lng: 78.4120, status: 'delivered', retailerName: 'DAILY NEEDS' },
    { lat: 17.4670, lng: 78.3620, status: 'delivered', retailerName: 'MODERN STORE' },
    { lat: 17.4510, lng: 78.4450, status: 'delivered', retailerName: 'PRIME RETAIL' },
    { lat: 17.3920, lng: 78.4230, status: 'delivered', retailerName: 'BEST MART' },
  ],
  '7': [
    { lat: 17.4126, lng: 78.4306, status: 'delivered', retailerName: 'SMART RETAIL' },
    { lat: 17.4851, lng: 78.4851, status: 'delivered', retailerName: 'GREEN VALLEY STORE' },
    { lat: 17.4239, lng: 78.4738, status: 'delivered', retailerName: 'CITY MART' },
    { lat: 17.3850, lng: 78.4867, status: 'delivered', retailerName: 'QUICK SHOP' },
    { lat: 17.4067, lng: 78.5520, status: 'delivered', retailerName: 'ROYAL STORES' },
    { lat: 17.4250, lng: 78.3356, status: 'delivered', retailerName: 'SUPER BAZAR' },
    { lat: 17.3616, lng: 78.4747, status: 'delivered', retailerName: 'PREMIUM MART' },
    { lat: 17.4925, lng: 78.3967, status: 'delivered', retailerName: 'METRO SUPERMART' },
    { lat: 17.4435, lng: 78.3913, status: 'delivered', retailerName: 'FRESH CORNER' },
    { lat: 17.4483, lng: 78.3915, status: 'delivered', retailerName: 'SUNRISE TRADERS' },
    { lat: 17.4933, lng: 78.3986, status: 'delivered', retailerName: 'COMMUNITY STORE' },
    { lat: 17.4400, lng: 78.3489, status: 'delivered', retailerName: 'FRESH BAZAAR' },
    { lat: 17.4290, lng: 78.4063, status: 'delivered', retailerName: 'LOCAL STORE' },
    { lat: 17.4599, lng: 78.3577, status: 'delivered', retailerName: 'URBAN MART' },
    { lat: 17.4320, lng: 78.4120, status: 'delivered', retailerName: 'DAILY NEEDS' },
  ],
  '8': [
    { lat: 17.4925, lng: 78.3967, status: 'planned', retailerName: 'METRO SUPERMART' },
    { lat: 17.4400, lng: 78.3489, status: 'planned', retailerName: 'FRESH BAZAAR' },
    { lat: 17.4239, lng: 78.4738, status: 'planned', retailerName: 'CITY MART' },
    { lat: 17.4483, lng: 78.3915, status: 'planned', retailerName: 'SUNRISE TRADERS' },
    { lat: 17.4851, lng: 78.4851, status: 'planned', retailerName: 'GREEN VALLEY STORE' },
  ],
};

export function TripRouteMapDialog({ isOpen, onClose, trip }: TripRouteMapDialogProps) {
  const [filter, setFilter] = useState<'both' | 'planned' | 'delivered'>('both');

  // Get fixed delivery points for this trip - memoized so they stay consistent
  // Must call useMemo before any early returns to follow Rules of Hooks
  const deliveryPoints = useMemo(() => {
    if (!trip) return [];
    return FIXED_TRIP_ROUTES[trip.id] || [];
  }, [trip?.id]);

  if (!isOpen || !trip) return null;

  // Fixed warehouse location
  const warehouseLocation = { lat: 17.385044, lng: 78.486671 };
  
  // Filter points based on selected filter
  const filteredPoints = deliveryPoints.filter(point => {
    if (filter === 'both') return true;
    return point.status === filter;
  });

  // All points for route line (always show the complete route)
  const allPoints = [warehouseLocation, ...deliveryPoints];
  
  // Convert lat/lng to pixel coordinates for overlay
  const latLngToPixel = (lat: number, lng: number, mapWidth: number, mapHeight: number) => {
    const minLat = warehouseLocation.lat - 0.1;
    const maxLat = warehouseLocation.lat + 0.1;
    const minLng = warehouseLocation.lng - 0.1;
    const maxLng = warehouseLocation.lng + 0.1;
    
    const x = ((lng - minLng) / (maxLng - minLng)) * mapWidth;
    const y = ((maxLat - lat) / (maxLat - minLat)) * mapHeight;
    
    return { x, y };
  };

  // Calculate bounding box for the map
  const bbox = {
    minLng: warehouseLocation.lng - 0.1,
    minLat: warehouseLocation.lat - 0.1,
    maxLng: warehouseLocation.lng + 0.1,
    maxLat: warehouseLocation.lat + 0.1,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-[90vw] h-[85vh] flex flex-col max-w-[1200px]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Trip Route Map - {trip.tripNumber}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter Radio Buttons */}
        <div className="px-6 py-3 border-b bg-gray-50">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="filter"
                value="both"
                checked={filter === 'both'}
                onChange={() => setFilter('both')}
                className="w-4 h-4 text-[#2D6EF5] border-gray-300 focus:ring-[#2D6EF5]"
              />
              <span className="text-sm text-gray-700">Both</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="filter"
                value="planned"
                checked={filter === 'planned'}
                onChange={() => setFilter('planned')}
                className="w-4 h-4 text-[#2D6EF5] border-gray-300 focus:ring-[#2D6EF5]"
              />
              <span className="text-sm text-gray-700">Planned</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="filter"
                value="delivered"
                checked={filter === 'delivered'}
                onChange={() => setFilter('delivered')}
                className="w-4 h-4 text-[#2D6EF5] border-gray-300 focus:ring-[#2D6EF5]"
              />
              <span className="text-sm text-gray-700">Delivered</span>
            </label>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative overflow-hidden">
          {/* OpenStreetMap iframe */}
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox.minLng}%2C${bbox.minLat}%2C${bbox.maxLng}%2C${bbox.maxLat}&layer=mapnik&marker=${warehouseLocation.lat}%2C${warehouseLocation.lng}`}
            className="w-full h-full border-0"
            title="Trip Route Map"
          />

          {/* SVG Overlay for route and markers */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 10 }}
            viewBox="0 0 1000 700"
            preserveAspectRatio="none"
          >
            {/* Route line - always show complete route */}
            <path
              d={allPoints.map((point, index) => {
                const { x, y } = latLngToPixel(point.lat, point.lng, 1000, 700);
                return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
              }).join(' ')}
              stroke="#2D6EF5"
              strokeWidth="4"
              fill="none"
              opacity="0.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Warehouse marker - always show */}
            <g className="pointer-events-auto">
              {(() => {
                const { x, y } = latLngToPixel(warehouseLocation.lat, warehouseLocation.lng, 1000, 700);
                return (
                  <>
                    <circle
                      cx={x}
                      cy={y}
                      r="25"
                      fill="#10B981"
                      stroke="white"
                      strokeWidth="4"
                    />
                    <text
                      x={x}
                      y={y + 7}
                      textAnchor="middle"
                      fontSize="16"
                      fontWeight="bold"
                      fill="white"
                    >
                      W
                    </text>
                  </>
                );
              })()}
            </g>

            {/* Delivery point markers - filtered */}
            {filteredPoints.map((point, index) => {
              const { x, y } = latLngToPixel(point.lat, point.lng, 1000, 700);
              const isDelivered = point.status === 'delivered';
              
              return (
                <g key={`${point.retailerName}-${point.lat}-${point.lng}`} className="pointer-events-auto">
                  <circle
                    cx={x}
                    cy={y}
                    r="22"
                    fill={isDelivered ? '#6366F1' : '#F59E0B'}
                    stroke="white"
                    strokeWidth="4"
                  />
                  <text
                    x={x}
                    y={y + 6}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="bold"
                    fill="white"
                  >
                    {deliveryPoints.indexOf(point) + 1}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Map Legend */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200" style={{ zIndex: 20 }}>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#10B981] border-2 border-white shadow-sm flex items-center justify-center">
                  <span className="text-xs font-bold text-white">W</span>
                </div>
                <span className="text-sm text-gray-700">Warehouse</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#6366F1] border-2 border-white shadow-sm" />
                <span className="text-sm text-gray-700">Delivered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#F59E0B] border-2 border-white shadow-sm" />
                <span className="text-sm text-gray-700">Planned</span>
              </div>
            </div>
          </div>

          {/* Fullscreen button */}
          <button
            className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 border border-gray-200 hover:bg-gray-50 transition-colors"
            style={{ zIndex: 20 }}
            onClick={() => {
              // Fullscreen functionality could be added here
            }}
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}