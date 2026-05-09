import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { X, MapPin, Package, IndianRupee } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Order } from './OrdersTable';

interface OrdersMapViewProps {
  orders: Order[];
  onClose: () => void;
}

function PinIcon({ count }: { count: number }) {
  return (
    <div style={{
      position: 'relative',
      width: '32px',
      height: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        backgroundColor: '#2D6EF5',
        borderRadius: '50% 50% 50% 0',
        transform: 'rotate(-45deg)',
        border: '2px solid #1a4fc4',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          transform: 'rotate(45deg)',
          color: 'white',
          fontSize: count > 1 ? '11px' : '13px',
          fontWeight: 'bold',
          lineHeight: 1,
        }}>
          {count > 1 ? count : ''}
          {count === 1 ? '•' : ''}
        </div>
      </div>
    </div>
  );
}

export function OrdersMapView({ orders, onClose }: OrdersMapViewProps) {
  // Group orders by lat/lng for clustering
  const locationGroups = useMemo(() => {
    const groups = new Map<string, Order[]>();
    orders.forEach(order => {
      if (order.latitude && order.longitude) {
        const key = `${order.latitude},${order.longitude}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(order);
      }
    });
    return Array.from(groups.entries()).map(([key, groupOrders]) => {
      const [lat, lng] = key.split(',').map(Number);
      return { lat, lng, orders: groupOrders };
    });
  }, [orders]);

  const center: [number, number] = locationGroups.length > 0
    ? [
        locationGroups.reduce((s, g) => s + g.lat, 0) / locationGroups.length,
        locationGroups.reduce((s, g) => s + g.lng, 0) / locationGroups.length,
      ]
    : [17.4239, 78.4738];

  const totalOrders = orders.length;
  const uniqueLocations = locationGroups.length;
  const totalValue = orders.reduce((s, o) => s + (o.invoiceValue || 0), 0);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#2D6EF5] rounded flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Orders Map View</h2>
            <p className="text-xs text-gray-500">Ready for Planning orders — customer locations</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Package className="w-4 h-4 text-[#2D6EF5]" />
              <span className="font-semibold text-gray-900">{totalOrders}</span>
              <span>orders</span>
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-1.5 text-gray-600">
              <MapPin className="w-4 h-4 text-[#2D6EF5]" />
              <span className="font-semibold text-gray-900">{uniqueLocations}</span>
              <span>locations</span>
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-1.5 text-gray-600">
              <IndianRupee className="w-4 h-4 text-[#2D6EF5]" />
              <span className="font-semibold text-gray-900">
                {totalValue.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
              <span>total value</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Close Map
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        {locationGroups.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-lg font-medium">No orders to display</p>
              <p className="text-sm text-gray-400">No Ready for Planning orders with location data</p>
            </div>
          </div>
        ) : (
          <MapContainer
            center={center}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locationGroups.map(({ lat, lng, orders: groupOrders }) => {
              const count = groupOrders.length;
              const iconHtml = renderToStaticMarkup(<PinIcon count={count} />);
              const icon = divIcon({
                html: iconHtml,
                className: '',
                iconSize: [32, 40],
                iconAnchor: [16, 40],
                popupAnchor: [0, -42],
              });

              return (
                <Marker key={`${lat},${lng}`} position={[lat, lng]} icon={icon}>
                  <Popup minWidth={220} maxWidth={280}>
                    <div className="py-1">
                      <div className="font-semibold text-gray-900 text-sm mb-2 pb-2 border-b border-gray-100">
                        {groupOrders[0].retailerName}
                      </div>
                      <div className="text-xs text-gray-500 mb-2 flex items-start gap-1">
                        <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-[#2D6EF5]" />
                        <span>{groupOrders[0].address || 'No address'}</span>
                      </div>
                      <div className="space-y-1.5 mt-2">
                        {groupOrders.map(order => (
                          <div key={order.id} className="bg-gray-50 rounded p-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">{order.invoiceNumber}</span>
                              <span className="font-semibold text-gray-900">
                                ₹{(order.invoiceValue || 0).toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="text-gray-400 mt-0.5">
                              {order.salesPerson} · {order.beatName}
                            </div>
                          </div>
                        ))}
                      </div>
                      {count > 1 && (
                        <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
                          <span>{count} orders at this location</span>
                          <span className="font-semibold text-gray-900">
                            ₹{groupOrders.reduce((s, o) => s + (o.invoiceValue || 0), 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
