import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import type { Trip } from './pages/TripsPage';

interface Route {
  id: string;
  tripId: string;
  name: string;
  stops: number;
  distance: number;
  tripNumber: string;
  time: string;
  vehicle: string;
  weight: number;
  volume: number;
  capacity: number;
  utilization: number;
  color: string;
  type: 'planned' | 'delivered';
  points: { lat: number; lng: number; label: string }[];
}

interface TripsMapViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  trips: Trip[];
}

type RouteViewType = 'both' | 'planned' | 'delivered';

export function TripsMapViewDialog({ isOpen, onClose, trips }: TripsMapViewDialogProps) {
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [expandedRoutes, setExpandedRoutes] = useState<Set<string>>(new Set());
  const [viewType, setViewType] = useState<RouteViewType>('both');
  
  // Track which routes are selected (by default all are selected)
  const [selectedRouteIds, setSelectedRouteIds] = useState<Set<string>>(() => {
    // Initialize with all route IDs
    return new Set(trips.map(trip => trip.id));
  });

  // Generate routes dynamically from trips
  const routeColors = ['#EF4444', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];
  
  const allRoutes: Route[] = trips.flatMap((trip, index) => {
    const colorIndex = index % routeColors.length;
    const color = routeColors[colorIndex];
    const baseWarehouse = { lat: 17.385044, lng: 78.486671, label: 'Warehouse' };
    
    // Generate planned route points (original planned path)
    const plannedDropPoints = Array.from({ length: trip.dropPoints }, (_, i) => {
      const angle = (index * 45 + i * 25) * (Math.PI / 180);
      const distance = 0.02 + (i * 0.01);
      return {
        lat: 17.385044 + Math.cos(angle) * distance,
        lng: 78.486671 + Math.sin(angle) * distance,
        label: String(i + 1),
      };
    });

    // Generate delivered route points (actual delivery path - slightly different)
    const deliveredDropPoints = Array.from({ length: trip.dropPoints }, (_, i) => {
      const angle = (index * 45 + i * 25 + 5) * (Math.PI / 180); // Slight angle offset
      const distance = 0.02 + (i * 0.01) + 0.003; // Slight distance variation
      return {
        lat: 17.385044 + Math.cos(angle) * distance,
        lng: 78.486671 + Math.sin(angle) * distance,
        label: String(i + 1),
      };
    });

    const baseRouteData = {
      tripId: trip.id,
      name: `Route ${index + 1}`,
      stops: trip.dropPoints,
      distance: 25.0 + (index * 5.5),
      tripNumber: trip.tripNumber,
      time: trip.arrivalTime,
      vehicle: trip.provider,
      weight: 50.0 + (index * 15.5),
      volume: 500.0 + (index * 100.5),
      capacity: 800.0 + (index * 50.0),
      utilization: 65 + (index * 5),
      color: color,
    };

    return [
      {
        ...baseRouteData,
        id: `${trip.id}-planned`,
        type: 'planned' as const,
        points: [baseWarehouse, ...plannedDropPoints],
      },
      {
        ...baseRouteData,
        id: `${trip.id}-delivered`,
        type: 'delivered' as const,
        points: [baseWarehouse, ...deliveredDropPoints],
      },
    ];
  });

  // Filter routes based on view type
  const routes = allRoutes.filter(route => {
    if (viewType === 'both') return true;
    return route.type === viewType;
  });

  // Get unique trips for the sidebar
  const uniqueTrips = trips.map((trip, index) => ({
    tripId: trip.id,
    name: `Route ${index + 1}`,
    color: routeColors[index % routeColors.length],
    ...allRoutes.find(r => r.tripId === trip.id),
  }));

  // Set initial selected trip
  if (trips.length > 0 && !selectedTripId) {
    setSelectedTripId(trips[0].id);
  }

  const toggleRouteExpansion = (routeId: string) => {
    const newExpanded = new Set(expandedRoutes);
    if (newExpanded.has(routeId)) {
      newExpanded.delete(routeId);
    } else {
      newExpanded.add(routeId);
    }
    setExpandedRoutes(newExpanded);
  };

  // Toggle route selection
  const toggleRouteSelection = (tripId: string) => {
    const newSelected = new Set(selectedRouteIds);
    if (newSelected.has(tripId)) {
      newSelected.delete(tripId);
    } else {
      newSelected.add(tripId);
    }
    setSelectedRouteIds(newSelected);
  };

  // Convert lat/lng to pixel coordinates for overlay
  const latLngToPixel = (lat: number, lng: number, mapWidth: number, mapHeight: number) => {
    const minLat = 17.28;
    const maxLat = 17.50;
    const minLng = 78.38;
    const maxLng = 78.60;
    
    const x = ((lng - minLng) / (maxLng - minLng)) * mapWidth;
    const y = ((maxLat - lat) / (maxLat - minLat)) * mapHeight;
    
    return { x, y };
  };

  if (!isOpen) return null;

  // Center coordinates for the map
  const centerLat = 17.385044;
  const centerLng = 78.486671;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-[95vw] h-[90vh] flex flex-col max-w-[1400px]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Trips Map View</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Route List */}
          <div className="w-80 border-r bg-gray-50 overflow-y-auto flex-shrink-0">
            <div className="p-4">
              {/* Routes */}
              <div className="space-y-3">
                {uniqueTrips.map((trip) => (
                  <div
                    key={trip.tripId}
                    className={`bg-white rounded-lg border-2 transition-all cursor-pointer ${
                      selectedTripId === trip.tripId
                        ? 'border-[#2D6EF5] shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTripId(trip.tripId)}
                  >
                    <div className="p-4">
                      {/* Route Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedRouteIds.has(trip.tripId)}
                            onCheckedChange={() => toggleRouteSelection(trip.tripId)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: trip.color }}
                          />
                          <span className="font-semibold text-gray-900">{trip.name}</span>
                        </div>
                      </div>

                      {/* Route Stats */}
                      <div className="text-xs text-gray-600 space-y-1 mb-3">
                        <div>
                          {trip.stops} stops · {trip.distance.toFixed(1)} km
                        </div>
                        <div>
                          {trip.tripNumber} · {trip.time} · {trip.vehicle}
                        </div>
                        <div>
                          Wt: {trip.weight.toFixed(2)} kg · Vol: {trip.volume.toFixed(2)} kg · Cap: {trip.capacity.toFixed(1)} kg
                        </div>
                      </div>

                      {/* Vehicle Utilization */}
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600">VEHICLE UTILIZED</span>
                          <span className="font-semibold text-gray-900">{trip.utilization}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              trip.utilization === 100 ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${trip.utilization}%` }}
                          />
                        </div>
                      </div>

                      {/* Show Details */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRouteExpansion(trip.tripId);
                        }}
                        className="text-xs text-[#2D6EF5] hover:text-[#2557D6] font-medium flex items-center gap-1"
                      >
                        <ChevronDown
                          className={`w-3 h-3 transition-transform ${
                            expandedRoutes.has(trip.tripId) ? 'rotate-180' : ''
                          }`}
                        />
                        {expandedRoutes.has(trip.tripId) ? 'Hide details' : 'Show details'}
                      </button>

                      {/* Expanded Details */}
                      {expandedRoutes.has(trip.tripId) && (
                        <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
                          {/* Info Section */}
                          <div className="text-xs text-gray-700 leading-relaxed bg-amber-50 border-l-4 border-amber-500 p-3 rounded">
                            <p className="mb-2">
                              Serves East sector, 5.8km from depot. 0/4 beats fully contained. Vehicle 96% utilized (2797.63 kg).
                            </p>
                            <div className="space-y-1 text-amber-800">
                              <p className="font-medium">4 of 4 sales beats are split across routes.</p>
                              <ul className="ml-4 space-y-1 list-disc">
                                <li>MS MARTHA G92 has 3 of its 6 delivery points in this route (3 assigned to other routes due to vehicle capacity or distance constraints).</li>
                                <li>MS MARTHA PRIME C has 2 of its 5 delivery points in this route (3 assigned to other routes due to vehicle capacity or distance constraints).</li>
                                <li>DAIRA G02 has 3 of its 8 delivery points in this route (3 assigned to other routes due to vehicle capacity or distance constraints).</li>
                                <li>ROMO & MASS 1C has 2 of its 3 delivery points in this route (1 assigned to other routes due to vehicle capacity or distance constraints).</li>
                              </ul>
                              <p className="mt-2 text-xs italic">
                                (Beats are split when a single vehicle cannot serve all customers in a territory due to weight capacity limits or maximum stop constraints.)
                              </p>
                            </div>
                          </div>

                          {/* Stop List */}
                          <div>
                            <h4 className="text-xs font-semibold text-gray-700 mb-2">Stops ({trip.stops})</h4>
                            <div className="space-y-1.5 max-h-40 overflow-y-auto">
                              {Array.from({ length: Math.min(trip.stops, 5) }, (_, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs">
                                  <div 
                                    className="w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5"
                                    style={{ backgroundColor: trip.color }}
                                  >
                                    {i + 1}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">
                                      {i === 0 ? 'Warehouse - Start' : `Delivery Point ${i}`}
                                    </p>
                                    <p className="text-gray-600">
                                      {i === 0 ? 'Sree Venkateswara Traders' : `Customer ${i}`}
                                    </p>
                                  </div>
                                </div>
                              ))}
                              {trip.stops > 5 && (
                                <p className="text-xs text-gray-500 text-center pt-1">
                                  + {trip.stops - 5} more stops
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map Area */}
          <div className="flex-1 relative overflow-hidden">
            {/* OpenStreetMap iframe */}
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${78.38}%2C${17.28}%2C${78.60}%2C${17.50}&layer=mapnik&marker=${centerLat}%2C${centerLng}`}
              className="w-full h-full border-0"
              title="Map"
            />

            {/* SVG Overlay for routes */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 10 }}
              viewBox="0 0 1000 700"
              preserveAspectRatio="none"
            >
              {routes.filter(route => selectedRouteIds.has(route.tripId)).map((route) => {
                const pathData = route.points.map((point, index) => {
                  const { x, y } = latLngToPixel(point.lat, point.lng, 1000, 700);
                  return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
                }).join(' ');

                const isSelected = selectedTripId === route.tripId;
                const isPlanned = route.type === 'planned';

                return (
                  <g key={route.id}>
                    {/* Route line */}
                    <path
                      d={pathData}
                      stroke={route.color}
                      strokeWidth={isSelected ? 5 : 3}
                      fill="none"
                      opacity={isSelected ? 0.9 : 0.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={isPlanned ? "0" : "10,5"}
                      className="pointer-events-auto"
                    />
                    
                    {/* Markers - only show for selected route or if viewing single type */}
                    {(isSelected || viewType !== 'both') && route.points.map((point, index) => {
                      const { x, y } = latLngToPixel(point.lat, point.lng, 1000, 700);
                      const isWarehouse = index === 0;
                      
                      if (isWarehouse) {
                        return (
                          <g key={`${route.id}-${index}`} className="pointer-events-auto">
                            <rect
                              x={x - 15}
                              y={y - 15}
                              width="30"
                              height="30"
                              fill="#FBBF24"
                              stroke="white"
                              strokeWidth="4"
                              transform={`rotate(45 ${x} ${y})`}
                            />
                          </g>
                        );
                      }
                      
                      return (
                        <g key={`${route.id}-${index}`} className="pointer-events-auto">
                          <circle
                            cx={x}
                            cy={y}
                            r="20"
                            fill={route.color}
                            stroke="white"
                            strokeWidth="4"
                            opacity={isSelected ? 1 : 0.7}
                          />
                          <text
                            x={x}
                            y={y + 6}
                            textAnchor="middle"
                            fontSize="14"
                            fontWeight="bold"
                            fill="white"
                          >
                            {point.label}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </svg>

            {/* Route View Filter - Top Left */}
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-4 py-3 border border-gray-200" style={{ zIndex: 20 }}>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="routeView"
                    value="both"
                    checked={viewType === 'both'}
                    onChange={() => setViewType('both')}
                    className="w-4 h-4 text-[#2D6EF5] border-gray-300 focus:ring-2 focus:ring-[#2D6EF5]"
                  />
                  <span className="text-sm text-gray-700">Both</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="routeView"
                    value="planned"
                    checked={viewType === 'planned'}
                    onChange={() => setViewType('planned')}
                    className="w-4 h-4 text-[#2D6EF5] border-gray-300 focus:ring-2 focus:ring-[#2D6EF5]"
                  />
                  <span className="text-sm text-gray-700">Planned</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="routeView"
                    value="delivered"
                    checked={viewType === 'delivered'}
                    onChange={() => setViewType('delivered')}
                    className="w-4 h-4 text-[#2D6EF5] border-gray-300 focus:ring-2 focus:ring-[#2D6EF5]"
                  />
                  <span className="text-sm text-gray-700">Delivered</span>
                </label>
              </div>
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200" style={{ zIndex: 20 }}>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Routes</h4>
              
              {/* Route Type Legend */}
              {viewType === 'both' && (
                <div className="mb-4 pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                    <div className="w-8 h-0.5 bg-gray-900 rounded"></div>
                    <span>Planned</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <svg width="32" height="2" className="flex-shrink-0">
                      <line x1="0" y1="1" x2="32" y2="1" stroke="currentColor" strokeWidth="2" strokeDasharray="4,2" />
                    </svg>
                    <span>Delivered</span>
                  </div>
                </div>
              )}
              
              {/* Trip List */}
              <div className="space-y-2">
                {uniqueTrips.map((trip) => (
                  <button
                    key={trip.tripId}
                    onClick={() => setSelectedTripId(trip.tripId)}
                    className={`flex items-center gap-2 text-sm hover:bg-gray-50 px-2 py-1 rounded w-full ${
                      selectedTripId === trip.tripId ? 'bg-gray-100' : ''
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: trip.color }}
                    />
                    <span className="font-medium text-gray-700">{trip.name}</span>
                    <span className="text-gray-500 text-xs ml-auto">{trip.stops} stops</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}