import { ArrowLeft, Calendar, Store, User, MapPin, Hash, IndianRupee, Weight, Package, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { useState } from 'react';
import { OptimizedRoutesModal } from '../OptimizedRoutesModal';

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

interface CreateDeliveryRoutePageProps {
  onBack: () => void;
  onConfirm: (selectedOrders: Order[], deliveryDate: string) => void;
}

export function CreateDeliveryRoutePage({ onBack, onConfirm }: CreateDeliveryRoutePageProps) {
  const [deliveryDate, setDeliveryDate] = useState('2026-02-20');
  const [selectedOrderDates, setSelectedOrderDates] = useState<string[]>(['7-1-2025']);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showOptimizedModal, setShowOptimizedModal] = useState(false);

  // Available order dates
  const orderDates = [
    '7-1-2025',
    '17-2-2025',
    '20-2-2025',
    '26-7-2025',
    '14-8-2025',
    '2-11-2025',
    '8-12-2025',
    '12-12-2025',
    '28-12-2025',
    '18-2-2026',
    '2-7-2026',
  ];

  // Sample orders data
  const allOrders: Order[] = [
    {
      id: '1',
      orderDate: '02-07-2026',
      retailerName: 'ROHIT DEPARTMENTAL STORE',
      salesPerson: 'John Doe',
      beatName: 'Beat 1',
      refOrderNumber: '2026/FEB/002...',
      invoiceValue: 9675.36,
      totalWeight: 26.00,
      totalVolWeight: 30.39,
    },
    {
      id: '2',
      orderDate: '18-02-2026',
      retailerName: 'SHARMA GENERAL STORE',
      salesPerson: 'John Doe',
      beatName: 'Beat 1',
      refOrderNumber: 'IOW/25-26/0021692/3',
      invoiceValue: 3528.33,
      totalWeight: 2.52,
      totalVolWeight: 2.52,
    },
    {
      id: '3',
      orderDate: '07-01-2025',
      retailerName: 'ROHIT DEPARTMENTAL STORE',
      salesPerson: 'N/A',
      beatName: 'N/A',
      refOrderNumber: 'I07-01002121',
      invoiceValue: 5154.57,
      totalWeight: 13.68,
      totalVolWeight: 16.64,
    },
    {
      id: '4',
      orderDate: '07-01-2025',
      retailerName: 'SHARMA GENERAL STORE',
      salesPerson: 'N/A',
      beatName: 'N/A',
      refOrderNumber: 'I07-01002',
      invoiceValue: 5154.57,
      totalWeight: 13.68,
      totalVolWeight: 16.64,
    },
    {
      id: '5',
      orderDate: '07-01-2025',
      retailerName: 'ROHIT DEPARTMENTAL STORE',
      salesPerson: 'Hema',
      beatName: 'Beat 1',
      refOrderNumber: 'I07-01002111',
      invoiceValue: 3728.33,
      totalWeight: 7.52,
      totalVolWeight: 7.52,
    },
    {
      id: '6',
      orderDate: '07-01-2025',
      retailerName: 'SHARMA GENERAL STORE',
      salesPerson: 'Hema',
      beatName: 'Beat 1',
      refOrderNumber: 'I07-01001',
      invoiceValue: 3728.33,
      totalWeight: 7.52,
      totalVolWeight: 7.52,
    },
    {
      id: '7',
      orderDate: '07-01-2025',
      retailerName: 'ROHIT DEPARTMENTAL STORE',
      salesPerson: 'Vijay',
      beatName: 'Hema',
      refOrderNumber: 'I07-01003',
      invoiceValue: 792.45,
      totalWeight: 4.80,
      totalVolWeight: 6.23,
    },
    {
      id: '8',
      orderDate: '07-01-2025',
      retailerName: 'SHARMA GENERAL STORE',
      salesPerson: 'Vijay',
      beatName: 'Hema',
      refOrderNumber: 'I07-01002131',
      invoiceValue: 792.45,
      totalWeight: 4.80,
      totalVolWeight: 6.23,
    },
  ];

  const handleOrderDateToggle = (date: string) => {
    setSelectedOrderDates(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  const handleRemoveOrderDate = (date: string) => {
    setSelectedOrderDates(prev => prev.filter(d => d !== date));
  };

  const handleOrderSelection = (orderId: string) => {
    setSelectedOrderIds(prev => 
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
    setSelectAll(false);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(allOrders.map(order => order.id));
    }
    setSelectAll(!selectAll);
  };

  const selectedOrders = allOrders.filter(order => selectedOrderIds.includes(order.id));
  const totalInvoiceValue = selectedOrders.reduce((sum, order) => sum + order.invoiceValue, 0);
  const totalVolWeight = selectedOrders.reduce((sum, order) => sum + order.totalVolWeight, 0);

  const handleConfirm = () => {
    setShowOptimizedModal(true);
  };

  const handleCloseModal = () => {
    setShowOptimizedModal(false);
  };

  return (
    <>
      <div className="h-full flex flex-col px-6 py-6 bg-gray-50">
        {/* Page Header */}
        <div className="mb-6 flex items-center gap-3 flex-shrink-0">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-lg border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#2D6EF5] rounded flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create Delivery Route</h1>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex-1 overflow-y-auto">
          {/* Delivery Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Date
            </label>
            <div className="relative max-w-xs">
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6EF5] focus:border-transparent"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Order Dates */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Order Dates
            </label>
            <div className="flex gap-3 overflow-x-auto pb-2 mb-3">
              {orderDates.map((date) => (
                <label
                  key={date}
                  className="flex items-center gap-2 cursor-pointer px-3 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex-shrink-0"
                >
                  <Checkbox
                    checked={selectedOrderDates.includes(date)}
                    onCheckedChange={() => handleOrderDateToggle(date)}
                  />
                  <span className="text-sm text-gray-700 whitespace-nowrap">{date}</span>
                </label>
              ))}
            </div>
            
            {/* Selected Date Pills */}
            {selectedOrderDates.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedOrderDates.map((date) => (
                  <div
                    key={date}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-[#2D6EF5] rounded-md text-sm font-medium"
                  >
                    {date}
                    <button
                      onClick={() => handleRemoveOrderDate(date)}
                      className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Orders */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Available Orders
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-gray-700">Select All</span>
              </label>
            </div>

            {/* Orders Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 max-h-[400px] flex flex-col">
              <div className="overflow-x-auto overflow-y-auto flex-1">
                <table className="min-w-full">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left w-12 bg-gray-50"></th>
                      <th className="px-4 py-3 text-left bg-gray-50">
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                          <Calendar className="w-4 h-4 text-[#2D6EF5]" />
                          Order Date
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left bg-gray-50">
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                          <Store className="w-4 h-4 text-[#2D6EF5]" />
                          Retailer Name
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left bg-gray-50">
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                          <User className="w-4 h-4 text-[#2D6EF5]" />
                          Sales Person
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left bg-gray-50">
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                          <MapPin className="w-4 h-4 text-[#2D6EF5]" />
                          Beat Name
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left bg-gray-50">
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                          <Hash className="w-4 h-4 text-[#2D6EF5]" />
                          Ref Order Number
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left bg-gray-50">
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                          <IndianRupee className="w-4 h-4 text-[#2D6EF5]" />
                          Invoice Value
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left bg-gray-50">
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                          <Weight className="w-4 h-4 text-[#2D6EF5]" />
                          Total Weight (KG)
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left bg-gray-50">
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                          <Package className="w-4 h-4 text-[#2D6EF5]" />
                          Total Vol. Weight (KG)
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allOrders.map((order) => (
                      <tr 
                        key={order.id}
                        className={selectedOrderIds.includes(order.id) ? 'bg-blue-50' : ''}
                      >
                        <td className="px-4 py-3">
                          <Checkbox
                            checked={selectedOrderIds.includes(order.id)}
                            onCheckedChange={() => handleOrderSelection(order.id)}
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                          {order.orderDate}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {order.retailerName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                          {order.salesPerson}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                          {order.beatName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                          {order.refOrderNumber}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                          ₹ {order.invoiceValue.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                          {order.totalWeight.toFixed(2)} Kgs
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                          {order.totalVolWeight.toFixed(2)} Kgs
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            {selectedOrderIds.length > 0 && (
              <div className="flex items-center justify-end gap-8 mb-4">
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-[#2D6EF5]" />
                  <span className="text-sm font-medium text-gray-700">Total Invoice Value:</span>
                  <span className="text-lg font-bold text-gray-900">₹ {totalInvoiceValue.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#2D6EF5]" />
                  <span className="text-sm font-medium text-gray-700">Total Vol. Weight:</span>
                  <span className="text-lg font-bold text-gray-900">{totalVolWeight.toFixed(2)} Kgs</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              <Button
                onClick={onBack}
                className="px-6 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={selectedOrderIds.length === 0}
                className="px-6 py-2 bg-[#2D6EF5] hover:bg-[#2557D6] text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </div>
      <OptimizedRoutesModal
        isOpen={showOptimizedModal}
        onClose={handleCloseModal}
        selectedOrders={selectedOrders}
        deliveryDate={deliveryDate}
      />
    </>
  );
}