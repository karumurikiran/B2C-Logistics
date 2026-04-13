import { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface QuickOrderPageProps {
  onBack: () => void;
  onSave?: (order: any) => void;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: string;
  weight: string;
}

export function QuickOrderPage({ onBack, onSave }: QuickOrderPageProps) {
  const [addressMode, setAddressMode] = useState<'google' | 'geo'>('google');
  const [insuranceEnabled, setInsuranceEnabled] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const [form, setForm] = useState({
    customerName: '',
    businessName: '',
    mobileNumber: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    country: 'India',
    latitude: '',
    longitude: '',
    orderAmount: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddItem = () => {
    setOrderItems(prev => [
      ...prev,
      { id: Date.now().toString(), name: '', quantity: '', weight: '' },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: string, value: string) => {
    setOrderItems(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const dateStr = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;
    const orderId = `QO-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

    const newOrder = {
      id: orderId,
      createdDate: dateStr,
      orderDate: dateStr,
      invoiceNumber: orderId,
      retailerName: form.businessName || form.customerName,
      orderType: 'Sales' as const,
      salesPerson: '',
      beatName: '',
      mobileNumber: form.mobileNumber,
      status: 'Ready for Planning' as const,
      tripNumber: '-',
      address: `${form.address}${form.city ? ', ' + form.city : ''}${form.state ? ', ' + form.state : ''}${form.pincode ? ' - ' + form.pincode : ''}`,
      invoiceValue: parseFloat(form.orderAmount) || 0,
      volumetricWeight: orderItems.reduce((sum, item) => sum + (parseFloat(item.weight) || 1), 0),
      latitude: parseFloat(form.latitude) || undefined,
      longitude: parseFloat(form.longitude) || undefined,
    };

    if (onSave) {
      onSave(newOrder);
    } else {
      onBack();
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Create Order</h1>
      </div>

      <div className="px-6 py-6 space-y-8 max-w-5xl">

        {/* Customer Details */}
        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Customer Details</h2>
          <div className="grid grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter customer name"
                value={form.customerName}
                onChange={e => handleChange('customerName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Business Name</label>
              <Input
                placeholder="Enter business name (optional)"
                value={form.businessName}
                onChange={e => handleChange('businessName', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter 10-digit mobile number"
              value={form.mobileNumber}
              onChange={e => handleChange('mobileNumber', e.target.value)}
              className="max-w-[calc(50%-10px)]"
            />
          </div>
        </section>

        {/* Delivery Address */}
        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Delivery Address</h2>

          {/* Address with Google/Geo toggle */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm text-gray-700">
                Address <span className="text-red-500">*</span>
              </label>
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setAddressMode('google')}
                  className={`px-4 py-1 text-sm font-medium transition-colors ${
                    addressMode === 'google'
                      ? 'bg-[#2D6EF5] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Google
                </button>
                <button
                  onClick={() => setAddressMode('geo')}
                  className={`px-4 py-1 text-sm font-medium transition-colors ${
                    addressMode === 'geo'
                      ? 'bg-[#2D6EF5] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Geo
                </button>
              </div>
            </div>
            <Input
              placeholder="Start typing delivery address..."
              value={form.address}
              onChange={e => handleChange('address', e.target.value)}
            />
          </div>

          {/* Pincode + City */}
          <div className="grid grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">
                Pincode <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter pincode"
                value={form.pincode}
                onChange={e => handleChange('pincode', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">
                City <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter city"
                value={form.city}
                onChange={e => handleChange('city', e.target.value)}
              />
            </div>
          </div>

          {/* State + Country */}
          <div className="grid grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">
                State <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter state"
                value={form.state}
                onChange={e => handleChange('state', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Country</label>
              <Input
                value={form.country}
                onChange={e => handleChange('country', e.target.value)}
              />
            </div>
          </div>

          {/* Latitude + Longitude */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Latitude</label>
              <Input
                placeholder="Optional"
                value={form.latitude}
                onChange={e => handleChange('latitude', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Longitude</label>
              <Input
                placeholder="Optional"
                value={form.longitude}
                onChange={e => handleChange('longitude', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Order Details */}
        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Order Details</h2>
          <div className="max-w-[calc(50%-10px)]">
            <label className="block text-sm text-gray-700 mb-1.5">
              Order Amount (INR) <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter order amount"
              value={form.orderAmount}
              onChange={e => handleChange('orderAmount', e.target.value)}
            />
          </div>
        </section>

        {/* Order Items */}
        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">
              Order Items <span className="text-sm font-normal text-gray-500">(Optional)</span>
            </h2>
            <button
              onClick={handleAddItem}
              className="flex items-center gap-1 text-sm text-[#2D6EF5] hover:underline font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          {orderItems.length === 0 ? (
            <div className="border border-gray-200 rounded-md p-4 text-sm text-gray-500">
              Add items to auto-apply defaults (1 kg weight, 10×10×10 cm dimensions). Without items, fill in the fields above manually.
            </div>
          ) : (
            <div className="space-y-3">
              {orderItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-3 gap-3 items-end">
                  <div>
                    {index === 0 && <label className="block text-xs text-gray-600 mb-1">Item Name</label>}
                    <Input
                      placeholder="Item name"
                      value={item.name}
                      onChange={e => handleItemChange(item.id, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    {index === 0 && <label className="block text-xs text-gray-600 mb-1">Quantity</label>}
                    <Input
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={e => handleItemChange(item.id, 'quantity', e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      {index === 0 && <label className="block text-xs text-gray-600 mb-1">Weight (kg)</label>}
                      <Input
                        placeholder="Weight"
                        value={item.weight}
                        onChange={e => handleItemChange(item.id, 'weight', e.target.value)}
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-400 hover:text-red-600 mt-auto mb-0.5"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Insurance */}
        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Insurance</h2>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={insuranceEnabled}
              onChange={e => setInsuranceEnabled(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#2D6EF5] cursor-pointer"
            />
            <div>
              <p className="text-sm font-medium text-gray-800">Enable shipment insurance for this order</p>
              <p className="text-sm text-gray-500 mt-0.5">
                I agree to insure this shipment and understand that insurance fees will be applied based on the declared order value.
              </p>
            </div>
          </label>
        </section>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pb-6">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="gap-2 bg-gray-400 hover:bg-[#2D6EF5] text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save Order
          </Button>
        </div>
      </div>
    </div>
  );
}
