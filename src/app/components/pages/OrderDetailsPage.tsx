import { ArrowLeft, User, Package, Truck, Calendar, MapPin, Phone, DollarSign, Hash, Clock, FileText, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import type { Order } from "../OrdersTable";
import { useState, useEffect } from "react";
import type { MergedOrder } from "../MergeOrdersDialog";

const availableVehicles = [
  {
    id: 1,
    name: 'Prorouting',
    category: 'Next Day Delivery',
    price: 25.00,
    estDelivery: '14-04-2026, 05:26 PM',
  },
  {
    id: 2,
    name: 'Prorouting',
    category: 'Next Day Delivery',
    price: 50.00,
    estDelivery: '14-04-2026, 05:26 PM',
  },
  {
    id: 3,
    name: 'ONDC Pramaaan Logistics',
    category: 'Immediate Delivery',
    price: 24.47,
    estDelivery: '13-04-2026, 06:27 PM',
  },
  {
    id: 4,
    name: 'Delhivery Express',
    category: 'Same Day Delivery',
    price: 35.00,
    estDelivery: '13-04-2026, 08:00 PM',
  },
  {
    id: 5,
    name: 'Blue Dart',
    category: 'Next Day Delivery',
    price: 45.00,
    estDelivery: '14-04-2026, 10:00 AM',
  },
];

function CountdownTimer({ seconds }: { seconds: number }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  return (
    <span className="text-xs text-red-500 font-medium flex items-center gap-1">
      <Clock className="w-3 h-3" />
      {m}m {s}s left
    </span>
  );
}

interface OrderDetailsPageProps {
  order: Order | MergedOrder;
  onBack: () => void;
}

export function OrderDetailsPage({ order, onBack }: OrderDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "products" | "suborders">("summary");
  const [showVehicles, setShowVehicles] = useState(false);

  const isMergedOrder = 'isMerged' in order && order.isMerged;

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string }> = {
      "Ready for Planning": { bg: "bg-[#FEF3C7]", text: "text-[#92400E]" },
      "In Planning": { bg: "bg-[#DBEAFE]", text: "text-[#1E40AF]" },
      "Trip Assigned": { bg: "bg-[#E0E7FF]", text: "text-[#3730A3]" },
      "In Transit": { bg: "bg-[#FBBF24]", text: "text-[#78350F]" },
      "Delivered": { bg: "bg-[#D1FAE5]", text: "text-[#065F46]" },
      "Partial Return": { bg: "bg-[#FEE2E2]", text: "text-[#991B1B]" },
      "Pending": { bg: "bg-[#FEF3C7]", text: "text-[#92400E]" },
      "Return": { bg: "bg-[#FEE2E2]", text: "text-[#991B1B]" },
    };

    const config = statusConfig[status] || { bg: "bg-gray-100", text: "text-gray-700" };
    return (
      <Badge className={`${config.bg} ${config.text} rounded px-3 py-1 text-sm font-medium hover:${config.bg}`}>
        {status}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <button onClick={onBack} className="mt-1 text-gray-500 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#2D6EF5] rounded flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
              </div>
              <p className="text-sm text-gray-500 mt-1 ml-11">
                Order #{order.invoiceNumber || 'N/A'} · Order Date {order.orderDate}
              </p>
            </div>
          </div>
          <Button
            className="gap-2 bg-[#2D6EF5] hover:bg-[#2557D6]"
            onClick={() => setShowVehicles(true)}
          >
            <Search className="w-4 h-4" />
            Search Vehicles
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b px-6 flex-shrink-0">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("summary")}
            className={`pb-3 pt-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "summary"
                ? "border-[#2D6EF5] text-[#2D6EF5]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Order Summary
            </div>
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 pt-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "products"
                ? "border-[#2D6EF5] text-[#2D6EF5]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Product Details
            </div>
          </button>
          {isMergedOrder && (
            <button
              onClick={() => setActiveTab("suborders")}
              className={`pb-3 pt-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "suborders"
                  ? "border-[#2D6EF5] text-[#2D6EF5]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Sub Orders ({(order as MergedOrder).totalOrders})
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 flex gap-6">
        <div className="flex-1 min-w-0">
        {activeTab === "summary" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl">
            {/* Customer Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-[#2D6EF5]" />
                </div>
                <h3 className="font-semibold text-gray-900">Customer Information</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Package className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-0.5">Business Name</div>
                    <div className="text-sm font-medium text-gray-900">{order.retailerName}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-0.5">Contact Number</div>
                    <div className="text-sm font-medium text-gray-900">{order.mobileNumber}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-0.5">Address</div>
                    <div className="text-sm font-medium text-gray-900">
                      {(order as Order).address || "No address available"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Truck className="w-4 h-4 text-[#2D6EF5]" />
                </div>
                <h3 className="font-semibold text-gray-900">Delivery Information</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-0.5">Delivery Date</div>
                    <div className="text-sm font-medium text-gray-900">{order.orderDate || 'N/A'}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-0.5">Delivery Executive</div>
                    <div className="text-sm font-medium text-gray-900">{order.salesPerson || 'N/A'}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-0.5">Delivery Schedule</div>
                    <div className="text-sm font-medium text-gray-900">
                      {(order as Order).deliveryTime || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Hash className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-0.5">Trip Number</div>
                    <div className="text-sm font-medium text-gray-900">{order.tripNumber || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[#2D6EF5]" />
                </div>
                <h3 className="font-semibold text-gray-900">Order Information</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Hash className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-0.5">Order Number</div>
                    <div className="text-sm font-medium text-gray-900">{order.invoiceNumber || 'N/A'}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-0.5">Order Status</div>
                    <div className="mt-1">{getStatusBadge(order.status)}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-0.5">Total Amount</div>
                    <div className="text-sm font-medium text-gray-900">
                      {(order as Order).invoiceValue ? formatCurrency((order as Order).invoiceValue!) : 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-0.5">Volumetric Weight</div>
                    <div className="text-sm font-medium text-gray-900">
                      {(order as Order).volumetricWeight ? `${(order as Order).volumetricWeight} kg` : 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-0.5">Beat Name</div>
                    <div className="text-sm font-medium text-gray-900">{order.beatName}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-7xl">
            <h3 className="font-semibold text-gray-900 mb-4">Product Details</h3>
            <div className="text-sm text-gray-600">
              Product information will be displayed here.
            </div>
          </div>
        )}

        {activeTab === "suborders" && isMergedOrder && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-7xl">
            <div className="p-6 border-b">
              <h3 className="font-semibold text-gray-900">Sub Orders</h3>
              <p className="text-sm text-gray-600 mt-1">
                This order contains {(order as MergedOrder).totalOrders} merged orders
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Invoice Number</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Order Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Order Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Sales Person</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Beat Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(order as MergedOrder).subOrders.map((subOrder, index) => (
                    <tr key={subOrder.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {subOrder.invoiceNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{subOrder.orderDate}</td>
                      <td className="px-6 py-4 text-sm">
                        {subOrder.orderType === "Digital" ? (
                          <Badge className="bg-[#ECFDF5] text-[#065F46] rounded px-2 py-1 text-xs font-medium hover:bg-[#ECFDF5]">
                            Digital
                          </Badge>
                        ) : (
                          <Badge className="bg-[#F3F4F6] text-[#374151] rounded px-2 py-1 text-xs font-medium hover:bg-[#F3F4F6]">
                            Sales
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{subOrder.salesPerson}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{subOrder.beatName}</td>
                      <td className="px-6 py-4 text-sm">{getStatusBadge(subOrder.status)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right">
                        {subOrder.invoiceValue ? formatCurrency(subOrder.invoiceValue) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                      Total Amount:
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                      {formatCurrency(
                        (order as MergedOrder).subOrders.reduce(
                          (sum, subOrder) => sum + (subOrder.invoiceValue || 0),
                          0
                        )
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
        </div>

        {/* Available Vehicles Side Panel */}
        {showVehicles && (
          <div className="w-80 flex-shrink-0 flex flex-col border border-gray-200 rounded-lg bg-white overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#2D6EF5]" />
              <h3 className="font-semibold text-gray-900">Available Vehicles</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {availableVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-[#2D6EF5] hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-900">{vehicle.name}</span>
                    <CountdownTimer seconds={280} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Category</span>
                      <span className="text-xs text-gray-700">{vehicle.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Price</span>
                      <span className="text-sm font-semibold text-green-600">
                        ₹ {vehicle.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Est. Delivery</span>
                      <span className="text-xs text-[#2D6EF5] font-medium">{vehicle.estDelivery}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-gray-200">
              <button
                onClick={() => setShowVehicles(false)}
                className="w-full py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel Search
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
