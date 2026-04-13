import { useState, useMemo, Fragment } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { ChevronDown, ChevronUp, Eye, X, CheckCircle, Check } from "lucide-react";
import { Badge } from "./ui/badge";
import { MultiSelect, MultiSelectOption } from "./ui/multi-select";
import type { Order } from "./OrdersTable";

interface MergeOrdersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orders: Order[];
  onMergeOrders: (mergedOrders: MergedOrder[]) => void;
}

export interface MergedOrder {
  id: string;
  retailerName: string;
  orderDate: string;
  orderType: string;
  salesPerson: string;
  beatName: string;
  mobileNumber: string;
  status: string;
  totalOrders: number;
  subOrders: Order[];
  isMerged: true;
}

interface GroupedOrder {
  retailerName: string;
  orderDate: string;
  orderType: string;
  salesPerson: string;
  beatName: string;
  mobileNumber: string;
  status: string;
  orders: Order[];
  selected: boolean;
}

// Mock retailer data for auto-suggestions
const mockRetailers = [
  { id: "1", name: "ABC Retail Store", address: "123 Main St, Delhi", beat: "North Delhi" },
  { id: "2", name: "XYZ Supermart", address: "456 Park Ave, Mumbai", beat: "South Mumbai" },
  { id: "3", name: "PQR Trading Co", address: "789 Market Rd, Bangalore", beat: "Central Bangalore" },
  { id: "4", name: "LMN Wholesale", address: "321 Commerce St, Chennai", beat: "West Chennai" },
  { id: "5", name: "DEF Retail Hub", address: "654 Business Park, Pune", beat: "East Pune" },
];

export function MergeOrdersDialog({
  open,
  onOpenChange,
  orders,
  onMergeOrders,
}: MergeOrdersDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedRetailers, setSelectedRetailers] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set()); // Individual order IDs
  
  // Step 2 states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRetailer, setSelectedRetailer] = useState<typeof mockRetailers[0] | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Get unique filter options from mergeable orders
  const filterOptions = useMemo(() => {
    const mergeableOrders = orders.filter(
      (order) =>
        order.status === "Ready for Planning" ||
        order.status === "In Planning" ||
        order.status === "Pending"
    );

    const dates = Array.from(new Set(mergeableOrders.map((o) => o.orderDate)))
      .sort()
      .map((date) => ({ label: date, value: date }));

    const retailers = Array.from(new Set(mergeableOrders.map((o) => o.retailerName)))
      .sort()
      .map((name) => ({ label: name, value: name }));

    const locations = Array.from(new Set(mergeableOrders.map((o) => o.beatName)))
      .sort()
      .map((location) => ({ label: location, value: location }));

    return { dates, retailers, locations };
  }, [orders]);

  // Group orders by retailer
  const groupedOrders = useMemo(() => {
    // Filter orders that are mergeable (Ready for Planning)
    const mergeableOrders = orders.filter(
      (order) =>
        order.status === "Ready for Planning" ||
        order.status === "In Planning" ||
        order.status === "Pending"
    );

    // Apply filters - only filter if selections are made
    let filtered = mergeableOrders;
    if (selectedDates.length > 0) {
      filtered = filtered.filter((order) => selectedDates.includes(order.orderDate));
    }
    if (selectedRetailers.length > 0) {
      filtered = filtered.filter((order) => selectedRetailers.includes(order.retailerName));
    }
    if (selectedLocations.length > 0) {
      filtered = filtered.filter((order) => selectedLocations.includes(order.beatName));
    }

    // Group by retailer only
    const groups = new Map<string, GroupedOrder>();
    filtered.forEach((order) => {
      const key = order.retailerName;
      if (!groups.has(key)) {
        groups.set(key, {
          retailerName: order.retailerName,
          orderDate: order.orderDate,
          orderType: order.orderType,
          salesPerson: order.salesPerson,
          beatName: order.beatName,
          mobileNumber: order.mobileNumber,
          status: order.status,
          orders: [],
          selected: false,
        });
      }
      groups.get(key)!.orders.push(order);
    });

    // Only show groups with multiple orders and update combined info
    return Array.from(groups.values())
      .filter((group) => group.orders.length > 1)
      .map((group) => {
        // Get unique dates
        const uniqueDates = Array.from(new Set(group.orders.map(o => o.orderDate))).sort();
        return {
          ...group,
          orderDate: uniqueDates.length > 1 ? `${uniqueDates.length} dates` : uniqueDates[0],
        };
      });
  }, [orders, selectedDates, selectedRetailers, selectedLocations]);

  // Calculate summary data
  const summaryData = useMemo(() => {
    const allSelectedOrders = orders.filter(order => selectedOrders.has(order.id));
    const totalValue = allSelectedOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
    const totalWeight = allSelectedOrders.reduce((sum, order) => sum + (order.weight || 0), 0);
    
    return {
      orderCount: selectedOrders.size,
      totalValue,
      totalWeight,
    };
  }, [selectedOrders, orders]);

  // Filter retailers based on search query
  const filteredRetailers = useMemo(() => {
    if (!searchQuery) return mockRetailers;
    const query = searchQuery.toLowerCase();
    return mockRetailers.filter(
      (retailer) =>
        retailer.name.toLowerCase().includes(query) ||
        retailer.address.toLowerCase().includes(query) ||
        retailer.beat.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const toggleRow = (retailerName: string) => {
    const key = retailerName;
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedRows(newExpanded);
  };

  const handleRetailerCheckboxChange = (retailerName: string, group: GroupedOrder) => {
    const newSelectedGroups = new Set(selectedGroups);
    const newSelectedOrders = new Set(selectedOrders);
    
    if (newSelectedGroups.has(retailerName)) {
      // Unselect retailer and all its orders
      newSelectedGroups.delete(retailerName);
      group.orders.forEach(order => newSelectedOrders.delete(order.id));
    } else {
      // Select retailer and all its orders
      newSelectedGroups.add(retailerName);
      group.orders.forEach(order => newSelectedOrders.add(order.id));
    }
    
    setSelectedGroups(newSelectedGroups);
    setSelectedOrders(newSelectedOrders);
  };

  const handleOrderCheckboxChange = (orderId: string, retailerName: string, group: GroupedOrder) => {
    const newSelectedOrders = new Set(selectedOrders);
    const newSelectedGroups = new Set(selectedGroups);
    
    if (newSelectedOrders.has(orderId)) {
      // Unselect this order
      newSelectedOrders.delete(orderId);
      // If retailer was selected, unselect it too
      newSelectedGroups.delete(retailerName);
    } else {
      // Select this order
      newSelectedOrders.add(orderId);
      // Check if all orders of this retailer are now selected
      const allSelected = group.orders.every(o => 
        o.id === orderId || newSelectedOrders.has(o.id)
      );
      if (allSelected) {
        newSelectedGroups.add(retailerName);
      }
    }
    
    setSelectedOrders(newSelectedOrders);
    setSelectedGroups(newSelectedGroups);
  };

  // Select/deselect all orders
  const handleSelectAll = () => {
    if (selectedOrders.size === groupedOrders.reduce((sum, g) => sum + g.orders.length, 0)) {
      // Deselect all
      setSelectedOrders(new Set());
      setSelectedGroups(new Set());
    } else {
      // Select all
      const allOrders = new Set<string>();
      const allGroups = new Set<string>();
      groupedOrders.forEach(group => {
        allGroups.add(group.retailerName);
        group.orders.forEach(order => allOrders.add(order.id));
      });
      setSelectedOrders(allOrders);
      setSelectedGroups(allGroups);
    }
  };

  const handleNext = () => {
    if (selectedOrders.size > 0) {
      setCurrentStep(2);
    }
  };

  const handleMergeReassign = () => {
    if (!selectedRetailer) return;

    const mergedOrders: MergedOrder[] = [];

    groupedOrders.forEach((group) => {
      const key = group.retailerName;
      if (selectedGroups.has(key)) {
        // Create merged order with new retailer
        const mergedOrder: MergedOrder = {
          id: `MERGED-${Date.now()}-${group.orders[0].id}`,
          retailerName: selectedRetailer.name,
          orderDate: group.orderDate,
          orderType: group.orderType,
          salesPerson: group.salesPerson,
          beatName: selectedRetailer.beat,
          mobileNumber: group.mobileNumber,
          status: group.status,
          totalOrders: group.orders.length,
          subOrders: group.orders,
          isMerged: true,
        };
        mergedOrders.push(mergedOrder);
      }
    });

    if (mergedOrders.length > 0) {
      onMergeOrders(mergedOrders);
      // Show success message (you can implement toast notification here)
      onOpenChange(false);
      // Reset state
      resetDialog();
    }
  };

  const resetDialog = () => {
    setCurrentStep(1);
    setSelectedGroups(new Set());
    setSelectedOrders(new Set());
    setExpandedRows(new Set());
    setSelectedDates([]);
    setSelectedRetailers([]);
    setSelectedLocations([]);
    setSearchQuery("");
    setSelectedRetailer(null);
  };

  const handleCancel = () => {
    onOpenChange(false);
    resetDialog();
  };

  const getOrderTypeBadge = (type: string) => {
    return type === "Digital" ? (
      <Badge className="bg-[#ECFDF5] text-[#065F46] rounded px-2 py-1 text-xs font-medium hover:bg-[#ECFDF5]">
        Digital
      </Badge>
    ) : (
      <Badge className="bg-[#F3F4F6] text-[#374151] rounded px-2 py-1 text-xs font-medium hover:bg-[#F3F4F6]">
        Sales
      </Badge>
    );
  };

  const isAllSelected = groupedOrders.length > 0 && 
    selectedOrders.size === groupedOrders.reduce((sum, g) => sum + g.orders.length, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-[95vw] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b">
          <DialogTitle className="text-lg sm:text-xl font-bold">Reassign Orders</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-gray-600 mt-1">
            {currentStep === 1 
              ? "Select orders to reassign from the same retailer" 
              : "Select the retailer to reassign selected orders"}
          </DialogDescription>
          
          {/* Stepper */}
          <div className="flex items-center gap-2 sm:gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                currentStep === 1 ? "bg-[#2D6EF5] text-white" : "bg-green-500 text-white"
              }`}>
                {currentStep === 1 ? "1" : <Check className="w-4 h-4" />}
              </div>
              <span className={`text-xs sm:text-sm font-medium ${
                currentStep === 1 ? "text-[#2D6EF5]" : "text-green-600"
              }`}>
                Select Orders
              </span>
            </div>
            <div className={`flex-1 h-0.5 ${currentStep === 2 ? "bg-[#2D6EF5]" : "bg-gray-300"}`}></div>
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                currentStep === 2 ? "bg-[#2D6EF5] text-white" : "bg-gray-300 text-gray-600"
              }`}>
                2
              </div>
              <span className={`text-xs sm:text-sm font-medium ${
                currentStep === 2 ? "text-[#2D6EF5]" : "text-gray-500"
              }`}>
                Select Retailer
              </span>
            </div>
          </div>
        </DialogHeader>

        {currentStep === 1 ? (
          <>
            {/* Filters Section */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b bg-gray-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="filter-date" className="text-xs font-semibold text-gray-700 mb-1.5 block">
                    Date
                  </Label>
                  <MultiSelect
                    id="filter-date"
                    placeholder="Select date..."
                    value={selectedDates}
                    onChange={setSelectedDates}
                    options={filterOptions.dates}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="filter-retailer" className="text-xs font-semibold text-gray-700 mb-1.5 block">
                    Retailer Name
                  </Label>
                  <MultiSelect
                    id="filter-retailer"
                    placeholder="Select retailer..."
                    value={selectedRetailers}
                    onChange={setSelectedRetailers}
                    options={filterOptions.retailers}
                    className="w-full"
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <Label htmlFor="filter-location" className="text-xs font-semibold text-gray-700 mb-1.5 block">
                    Beat
                  </Label>
                  <MultiSelect
                    id="filter-location"
                    placeholder="Select beat..."
                    value={selectedLocations}
                    onChange={setSelectedLocations}
                    options={filterOptions.locations}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div className="flex-1 overflow-auto px-4 sm:px-6 py-3 sm:py-4">
              {groupedOrders.length === 0 ? (
                <div className="text-center py-8 sm:py-12 text-gray-500">
                  <p className="text-xs sm:text-sm">No mergeable orders found.</p>
                  <p className="text-xs mt-2 text-gray-400">
                    Orders must be from the same retailer and in a mergeable status.
                  </p>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 w-12 sm:w-14">
                            <Checkbox
                              checked={isAllSelected}
                              onCheckedChange={handleSelectAll}
                            />
                          </th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700">Retailer Name</th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700">Order Date</th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700">Order Type</th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700">Sales Person</th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700">Beat Name</th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700">Total Orders</th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {groupedOrders.flatMap((group) => {
                          const key = group.retailerName;
                          const isExpanded = expandedRows.has(key);
                          const isSelected = selectedGroups.has(key);

                          const rows = [
                            // Main collapsed row
                            <tr
                              key={key}
                              className={`hover:bg-gray-50 ${isSelected ? "bg-blue-50" : ""}`}
                            >
                              <td className="px-2 sm:px-4 py-2 sm:py-3">
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => handleRetailerCheckboxChange(group.retailerName, group)}
                                />
                              </td>
                              <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-900">
                                {group.retailerName}
                              </td>
                              <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">{group.orderDate}</td>
                              <td className="px-2 sm:px-4 py-2 sm:py-3">{getOrderTypeBadge(group.orderType)}</td>
                              <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">{group.salesPerson}</td>
                              <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">{group.beatName}</td>
                              <td className="px-2 sm:px-4 py-2 sm:py-3">
                                <Badge className="bg-[#2D6EF5] hover:bg-[#2D6EF5] text-white rounded px-2 py-1 text-xs font-medium">
                                  {group.orders.length}
                                </Badge>
                              </td>
                              <td className="px-2 sm:px-4 py-2 sm:py-3 text-right">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => toggleRow(group.retailerName)}
                                  className="gap-1 text-xs h-7 sm:h-8 px-2 sm:px-3"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span className="hidden sm:inline">View</span>
                                </Button>
                              </td>
                            </tr>
                          ];

                          // Add expanded rows if open
                          if (isExpanded) {
                            group.orders.forEach((order, index) => {
                              const isOrderSelected = selectedOrders.has(order.id);
                              rows.push(
                                <tr key={order.id} className={`bg-gray-50 ${isOrderSelected ? "bg-blue-100" : ""}`}>
                                  <td className="px-2 sm:px-4 py-1.5 sm:py-2 pl-8 sm:pl-12">
                                    <Checkbox
                                      checked={isOrderSelected}
                                      onCheckedChange={() => handleOrderCheckboxChange(order.id, group.retailerName, group)}
                                    />
                                  </td>
                                  <td className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700">
                                    <span className="text-xs text-gray-500 mr-2">└</span>
                                    Invoice: {order.invoiceNumber}
                                  </td>
                                  <td className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600">{order.orderDate}</td>
                                  <td className="px-2 sm:px-4 py-1.5 sm:py-2">{getOrderTypeBadge(order.orderType)}</td>
                                  <td className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600">{order.salesPerson}</td>
                                  <td className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600">{order.beatName}</td>
                                  <td className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600">
                                    {order.tripNumber || "-"}
                                  </td>
                                  <td className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-500 text-right">
                                    Order {index + 1} of {group.orders.length}
                                  </td>
                                </tr>
                              );
                            });
                          }

                          return rows;
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="px-4 sm:px-6 py-3 sm:py-4 border-t bg-gray-50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3 sm:gap-0">
                <p className="text-xs sm:text-sm text-gray-600">
                  {selectedOrders.size > 0 && (
                    <span className="font-semibold text-[#2D6EF5]">
                      {selectedOrders.size} order{selectedOrders.size > 1 ? "s" : ""} selected
                    </span>
                  )}
                </p>
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                  <Button variant="outline" onClick={handleCancel} className="flex-1 sm:flex-none text-sm">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={selectedOrders.size === 0}
                    className="flex-1 sm:flex-none bg-[#2D6EF5] hover:bg-[#2557D6] disabled:bg-gray-300 text-sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </>
        ) : (
          <>
            {/* Step 2: Select Retailer */}
            <div className="flex-1 overflow-auto px-4 sm:px-6 py-3 sm:py-4">
              <div className="max-w-3xl mx-auto space-y-6">
                {/* Search Section */}
                <div>
                  <Label htmlFor="retailer-search" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Search and Select Retailer
                  </Label>
                  <div className="relative">
                    <Input
                      id="retailer-search"
                      type="text"
                      placeholder="Search by retailer name, address, or beat..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      className="w-full"
                    />
                    {showSuggestions && filteredRetailers.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {filteredRetailers.map((retailer) => (
                          <button
                            key={retailer.id}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                            onClick={() => {
                              setSelectedRetailer(retailer);
                              setSearchQuery(retailer.name);
                              setShowSuggestions(false);
                            }}
                          >
                            <div className="font-medium text-sm text-gray-900">{retailer.name}</div>
                            <div className="text-xs text-gray-600 mt-1">{retailer.address}</div>
                            <div className="text-xs text-gray-500 mt-0.5">Beat: {retailer.beat}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedRetailer && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-sm text-gray-900">{selectedRetailer.name}</div>
                          <div className="text-xs text-gray-600 mt-1">{selectedRetailer.address}</div>
                          <div className="text-xs text-gray-500 mt-0.5">Beat: {selectedRetailer.beat}</div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Selected</Badge>
                      </div>
                    </div>
                  )}
                </div>

                {/* Summary Section */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-600">Total Orders</div>
                      <div className="text-lg font-bold text-gray-900 mt-1">{summaryData.orderCount}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Total Value</div>
                      <div className="text-lg font-bold text-gray-900 mt-1">₹{summaryData.totalValue.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Total Weight</div>
                      <div className="text-lg font-bold text-gray-900 mt-1">{summaryData.totalWeight} kg</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Selected Retailer</div>
                      <div className="text-sm font-medium text-gray-900 mt-1">
                        {selectedRetailer ? selectedRetailer.name : "Not selected"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="px-4 sm:px-6 py-3 sm:py-4 border-t bg-gray-50">
              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto ml-auto">
                <Button variant="outline" onClick={handleCancel} className="flex-1 sm:flex-none text-sm">
                  Cancel
                </Button>
                <Button
                  onClick={handleMergeReassign}
                  disabled={!selectedRetailer}
                  className="flex-1 sm:flex-none bg-[#2D6EF5] hover:bg-[#2557D6] disabled:bg-gray-300 text-sm"
                >
                  Merge & Reassign
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}