import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { X, MapPin, Package, IndianRupee } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Order } from './OrdersTable';

interface OrdersMapViewProps {
  open: boolean;
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

export function OrdersMapView({ open, orders, onClose }: OrdersMapViewProps) {
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden"
        style={{ width: '85vw', height: '80vh', maxWidth: '1100px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#2D6EF5] rounded flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Orders Map View</h2>
              <p className="text-xs text-gray-500">Ready for Planning — customer locations</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
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
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative overflow-hidden rounded-b-xl">
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

                const totalInvoice = groupOrders.reduce((s, o) => s + (o.invoiceValue || 0), 0);
                const totalWeight = groupOrders.reduce((s, o) => s + (o.volumetricWeight || 0), 0);
                const orderType = groupOrders[0].deliveryType || groupOrders[0].orderType || 'Self';

              return (
                  <Marker key={`${lat},${lng}`} position={[lat, lng]} icon={icon}>
                    <Tooltip direction="top" offset={[0, -44]} opacity={1} className="leaflet-order-tooltip">
                      <div style={{ minWidth: '180px', fontFamily: 'inherit' }}>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: '#111827', marginBottom: '6px', paddingBottom: '6px', borderBottom: '1px solid #e5e7eb' }}>
                          {groupOrders[0].retailerName}
                          {count > 1 && <span style={{ fontWeight: 400, fontSize: '11px', color: '#6b7280', marginLeft: '4px' }}>+{count - 1} more</span>}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                            <span style={{ color: '#6b7280' }}>Order Type</span>
                            <span style={{ fontWeight: 500, color: '#111827' }}>{orderType}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                            <span style={{ color: '#6b7280' }}>Invoice Value</span>
                            <span style={{ fontWeight: 500, color: '#111827' }}>₹{totalInvoice.toLocaleString('en-IN')}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                            <span style={{ color: '#6b7280' }}>Vol. Weight</span>
                            <span style={{ fontWeight: 500, color: '#111827' }}>{totalWeight.toFixed(1)} Kg</span>
                          </div>
                        </div>
                      </div>
                    </Tooltip>
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
    </div>
  );
}
