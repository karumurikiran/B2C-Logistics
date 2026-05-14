import { useState } from "react";
import { Search, Filter, Plus, Package, Users, TrendingUp, Weight, Map } from "lucide-react";
import { OrdersTable, Order } from "../OrdersTable";
import { CreateOrderDialog } from "../CreateOrderDialog";
import { FiltersDialog } from "../FiltersDialog";
import { MarkDeliveredDialog } from "../MarkDeliveredDialog";
import { MergeOrdersDialog, MergedOrder } from "../MergeOrdersDialog";
import { OrdersMapView } from "../OrdersMapView";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useData } from "../../context/DataContext";

interface OrdersPageProps {
  onNavigateToCreateOrder: () => void;
  onNavigateToQuickOrder?: () => void;
  onNavigateToCreateDeliveryRoute: (selectedOrders: Order[]) => void;
  onNavigateToOrderDetails?: (order: Order | MergedOrder) => void;
}

export function OrdersPage({
  onNavigateToCreateOrder,
  onNavigateToQuickOrder,
  onNavigateToCreateDeliveryRoute,
  onNavigateToOrderDetails,
}: OrdersPageProps) {
  const { orders: contextOrders, addOrder, deleteOrder, updateOrderStatus, updateOrder, customers } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [createOrderOpen, setCreateOrderOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [markDeliveredOpen, setMarkDeliveredOpen] = useState(false);
  const [orderToMarkDelivered, setOrderToMarkDelivered] = useState<Order | null>(null);
  const [mergeOrdersOpen, setMergeOrdersOpen] = useState(false);
  const [selectedOrdersForMerge, setSelectedOrdersForMerge] = useState<Order[]>([]);
  const [mergedOrders, setMergedOrders] = useState<MergedOrder[]>([]);
  const [showMapView, setShowMapView] = useState(false);

  // Combine regular orders and merged orders for display
  const allOrders: (Order | MergedOrder)[] = [...contextOrders, ...mergedOrders];

  const handleCreateOrder = (newOrder: Order) => {
    addOrder(newOrder);
  };

  const handleDeleteOrder = (id: string) => {
    const orderToDelete = allOrders.find((order) => order.id === id);
    if (orderToDelete && 'subOrders' in orderToDelete) {
      // It's a merged order, remove from merged orders list
      setMergedOrders(mergedOrders.filter((order) => order.id !== id));
    } else {
      // It's a regular order, delete from context
      deleteOrder(id);
    }
  };

  const handleMarkDeliveredClick = (id: string) => {
    const order = allOrders.find(o => o.id === id) as Order;
    if (order) {
      setOrderToMarkDelivered(order);
      setMarkDeliveredOpen(true);
    }
  };

  const handleConfirmMarkDelivered = () => {
    if (orderToMarkDelivered) {
      updateOrderStatus(orderToMarkDelivered.id, 'Delivered');
      setOrderToMarkDelivered(null);
    }
  };

  const handleSelectOrder = (orderId: string) => {
    const orderExists = allOrders.find(order => order.id === orderId);
    if (orderExists) {
      setSelectedOrderId(orderId);
      // Scroll to the order in the table
      setTimeout(() => {
        setSelectedOrderId(null);
      }, 3000); // Reset highlight after 3 seconds
    }
  };

  const handleMake3PL = (id: string) => {
    updateOrder(id, { deliveryType: '3PL' });
  };

  const handleCancelOrder = (id: string) => {
    updateOrderStatus(id, 'Cancelled');
  };

  const handleMarkDeliveredDirect = (id: string) => {
    updateOrderStatus(id, 'Delivered');
  };

  const handleSelectOrdersForMerge = (orderIds: string[]) => {
    const selectedOrders = allOrders.filter(order => orderIds.includes(order.id)) as Order[];
    setSelectedOrdersForMerge(selectedOrders);
    setMergeOrdersOpen(true);
  };

  const handleConfirmMergeOrders = (mergedOrders: MergedOrder[]) => {
    // Get all sub-order IDs from merged orders
    const allSubOrderIds = mergedOrders.flatMap(mo => mo.subOrders.map(so => so.id));
    
    // Add merged orders to the list
    setMergedOrders([...mergedOrders]);
    setMergeOrdersOpen(false);
  };

  const filteredOrders = allOrders.filter((order) => {
    const matchesSearch =
      searchQuery === "" ||
      order.retailerName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.mobileNumber.includes(searchQuery) ||
      order.invoiceNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatuses.length === 0 ||
      selectedStatuses.includes(order.status);

    return matchesSearch && matchesStatus;
  });

  const ordersNeedingAttention = allOrders.filter(
    (order) =>
      order.status === "Pending" ||
      order.status === "Ready For Planning",
  ).length;

  // Filter orders for KPIs - only 'Ready for Planning' orders
  const kpiFilteredOrders = allOrders.filter((order) => order.status === 'Ready for Planning');

  // Calculate KPIs
  const uniqueCustomers = new Set(
    kpiFilteredOrders.map((order) => {
      if ('subOrders' in order) {
        // For merged orders, get all unique customer IDs from sub-orders
        return order.subOrders.map((so: Order) => so.customerId || so.retailerName);
      }
      return (order as Order).customerId || order.retailerName;
    }).flat()
  ).size;

  const totalOrders = kpiFilteredOrders.length;

  const totalVolumetricWeight = kpiFilteredOrders.reduce((sum, order) => {
    if ('subOrders' in order) {
      // For merged orders, sum all sub-orders
      return sum + order.subOrders.reduce((subSum: number, so: Order) => subSum + (so.volumetricWeight || 0), 0);
    }
    return sum + ((order as Order).volumetricWeight || 0);
  }, 0);

  // Format weight in Kgs
  const formatWeight = (kg: number) => {
    return `${kg.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Kgs`;
  };

  return (
    <div className="h-full overflow-y-auto px-6 py-6">
      {/* Page Header Row 1: Title + Action Buttons */}
      <div className="mb-3 flex items-start justify-between flex-shrink-0">
        <div className="flex-1">
          <div className="flex items-start gap-2 mb-2">
            <div className="w-6 h-6 bg-[#2D6EF5] rounded flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          </div>
          <p className="text-gray-600 text-sm">
            Track, manage, and fulfill customer orders with ease.
          </p>
          {ordersNeedingAttention > 0 && (
            <p className="text-[#D97706] text-sm mt-1">
              ({ordersNeedingAttention} orders need attention)
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 ml-6">
          <Button
            variant="outline"
            className="gap-2"
            onClick={onNavigateToQuickOrder}
          >
            <Plus className="w-4 h-4 text-green-600" />
            Quick Order
          </Button>
          <Button
            onClick={onNavigateToCreateOrder}
            className="gap-2 bg-[#2D6EF5] hover:bg-[#2557D6]"
          >
            <Plus className="w-4 h-4" />
            Create Order
          </Button>
        </div>
      </div>

      {/* Page Header Row 2: Search + Filters */}
      <div className="mb-6 flex gap-3 flex-shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search by retailer name, mobile number, or invoice number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 w-full"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setFiltersOpen(true)}
          className="gap-2"
        >
          <Filter className="w-4 h-4 text-[#2D6EF5]" />
          Filters
          {selectedStatuses.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-[#2D6EF5] text-white text-xs rounded-full">
              {selectedStatuses.length}
            </span>
          )}
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 flex-shrink-0">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* No. of Customers */}
          <div
            className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-[#2D6EF5] hover:shadow-md transition-all group"
            onClick={() => setShowMapView(true)}
            title="Click to view on map"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm text-gray-600 mb-1">No. of Customers</p>
                <p className="text-3xl font-bold text-gray-900">{uniqueCustomers}</p>
              </div>
              <div className="w-10 h-10 bg-[#DBEAFE] rounded-lg flex items-center justify-center group-hover:bg-[#2D6EF5] transition-colors">
                <Users className="w-5 h-5 text-[#2563EB] group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">To be delivered</p>
              <span className="text-xs text-[#2D6EF5] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <Map className="w-3 h-3" /> View map
              </span>
            </div>
          </div>

          {/* Total Orders */}
          <div
            className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-[#2D6EF5] hover:shadow-md transition-all group"
            onClick={() => setShowMapView(true)}
            title="Click to view on map"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
              </div>
              <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center group-hover:bg-[#2D6EF5] transition-colors">
                <TrendingUp className="w-5 h-5 text-[#059669] group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">To be delivered</p>
              <span className="text-xs text-[#2D6EF5] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <Map className="w-3 h-3" /> View map
              </span>
            </div>
          </div>

          {/* Total Vol.wt */}
          <div
            className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-[#2D6EF5] hover:shadow-md transition-all group"
            onClick={() => setShowMapView(true)}
            title="Click to view on map"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Vol.wt</p>
                <p className="text-2xl font-bold text-gray-900">{formatWeight(totalVolumetricWeight)}</p>
              </div>
              <div className="w-10 h-10 bg-[#FEF3C7] rounded-lg flex items-center justify-center group-hover:bg-[#2D6EF5] transition-colors">
                <Weight className="w-5 h-5 text-[#D97706] group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">To be delivered</p>
              <span className="text-xs text-[#2D6EF5] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <Map className="w-3 h-3" /> View map
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div>
        <OrdersTable
          orders={filteredOrders}
          onDeleteOrder={handleDeleteOrder}
          onSelectOrder={handleSelectOrder}
          selectedOrderId={selectedOrderId}
          onMarkDelivered={handleMarkDeliveredClick}
          onViewOrder={(orderId) => {
            const order = allOrders.find(o => o.id === orderId);
            if (order && onNavigateToOrderDetails) {
              onNavigateToOrderDetails(order);
            }
          }}
          onMake3PL={handleMake3PL}
          onCancelOrder={handleCancelOrder}
          onMarkDeliveredDirect={handleMarkDeliveredDirect}
        />
      </div>

      {/* No results message */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No orders found matching your criteria.
        </div>
      )}

      {/* Dialogs */}
      <FiltersDialog
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        selectedStatuses={selectedStatuses}
        onStatusChange={setSelectedStatuses}
      />
      <MarkDeliveredDialog
        open={markDeliveredOpen}
        onOpenChange={setMarkDeliveredOpen}
        order={orderToMarkDelivered}
        onMarkDelivered={handleConfirmMarkDelivered}
      />
      <MergeOrdersDialog
        open={mergeOrdersOpen}
        onOpenChange={setMergeOrdersOpen}
        orders={allOrders}
        onMergeOrders={handleConfirmMergeOrders}
      />
      <OrdersMapView
        open={showMapView}
        orders={kpiFilteredOrders as Order[]}
        onClose={() => setShowMapView(false)}
        onMarkDelivered={(ids) => ids.forEach(id => updateOrderStatus(id, 'Delivered'))}
      />
    </div>
  );
}