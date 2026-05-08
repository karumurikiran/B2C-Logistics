import { Truck, Calendar, Hash, MapPin, Weight, Clock, Wrench, Download, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Pagination } from '../Pagination';
import { useState } from 'react';
import { CreateDeliveryRoutePage } from './CreateDeliveryRoutePage';
import { MarkDeliveredDialog } from '../MarkDeliveredDialog';
import { Order as OrderType } from '../OrdersTable';

// Orders data for map view
const initialOrders: OrderType[] = [
  {
    id: "1",
    createdDate: "20-02-2026",
    orderDate: "20-02-2026",
    invoiceNumber: "INV-2026-001",
    retailerName: "METRO SUPERMART",
    orderType: "Digital",
    salesPerson: "Rajesh Kumar",
    beatName: "Kphb",
    mobileNumber: "9182234567",
    status: "Ready for Planning",
    tripNumber: "-",
    latitude: 17.4925,
    longitude: 78.3967,
    address: "Plot 45, Miyapur Main Road, Hyderabad, Telangana 500049",
    invoiceValue: 4100.00,
    volumetricWeight: 22.50,
    deliveryTime: "2026-02-20 10:00 AM",
  },
  {
    id: "2",
    createdDate: "20-02-2026",
    orderDate: "20-02-2026",
    invoiceNumber: "INV-2026-002",
    retailerName: "FRESH BAZAAR",
    orderType: "Digital",
    salesPerson: "Priya Sharma",
    beatName: "Beat 2",
    mobileNumber: "9876123456",
    status: "In Transit",
    tripNumber: "Q-20260220091234-ABCD",
    latitude: 17.4400,
    longitude: 78.3489,
    address: "Cyber Towers, Gachibowli, Hyderabad, Telangana 500032",
    invoiceValue: 2800.90,
    volumetricWeight: 16.80,
    deliveryTime: "2026-02-20 09:12 AM",
  },
  {
    id: "3",
    createdDate: "19-02-2026",
    orderDate: "19-02-2026",
    invoiceNumber: "INV-2026-003",
    retailerName: "SMART RETAIL",
    orderType: "Digital",
    salesPerson: "Kumar Reddy",
    beatName: "Beat 3",
    mobileNumber: "9192837465",
    status: "Delivered",
    tripNumber: "Q-20260219161144-DHZA",
    latitude: 17.4126,
    longitude: 78.4306,
    address: "Road No 12, Banjara Hills, Hyderabad, Telangana 500034",
    invoiceValue: 5200.00,
    volumetricWeight: 28.30,
    deliveryTime: "2026-02-19 04:22 PM",
  },
  {
    id: "4",
    createdDate: "19-02-2026",
    orderDate: "19-02-2026",
    invoiceNumber: "INV-2026-004",
    retailerName: "GREEN VALLEY STORE",
    orderType: "Digital",
    salesPerson: "Anita Rao",
    beatName: "Beat 4",
    mobileNumber: "9345678901",
    status: "Ready for Planning",
    tripNumber: "-",
    latitude: 17.4851,
    longitude: 78.4851,
    address: "Kompally Circle, Kompally, Hyderabad, Telangana 500014",
    invoiceValue: 650.50,
    volumetricWeight: 9.50,
    deliveryTime: "2026-02-19 12:30 PM",
  },
  {
    id: "5",
    createdDate: "19-02-2026",
    orderDate: "19-02-2026",
    invoiceNumber: "INV-2026-005",
    retailerName: "FRESH CORNER",
    orderType: "Digital",
    salesPerson: "Amit Singh",
    beatName: "Beat 1",
    mobileNumber: "9123456789",
    status: "Ready for Planning",
    tripNumber: "-",
    latitude: 17.4435,
    longitude: 78.3772,
    address: "JNTU Road, Kukatpally, Hyderabad, Telangana 500072",
    invoiceValue: 2450.50,
    volumetricWeight: 15.30,
    deliveryTime: "2026-02-19 02:30 PM",
  },
  {
    id: "6",
    createdDate: "18-02-2026",
    orderDate: "18-02-2026",
    invoiceNumber: "INV-2026-006",
    retailerName: "URBAN MART",
    orderType: "Digital",
    salesPerson: "Vikram Patel",
    beatName: "Kphb",
    mobileNumber: "9456789012",
    status: "In Transit",
    tripNumber: "Q-20260218151234-WXYZ",
    latitude: 17.4599,
    longitude: 78.3577,
    address: "Hitech City Main Road, Madhapur, Hyderabad, Telangana 500081",
    invoiceValue: 3600.00,
    volumetricWeight: 19.70,
    deliveryTime: "2026-02-18 03:51 PM",
  },
  {
    id: "7",
    createdDate: "18-02-2026",
    orderDate: "18-02-2026",
    invoiceNumber: "INV-2026-007",
    retailerName: "DAILY NEEDS",
    orderType: "Digital",
    salesPerson: "Sanjay Gupta",
    beatName: "Beat 2",
    mobileNumber: "9567890123",
    status: "Delivered",
    tripNumber: "Q-20260218101234-LMNO",
    latitude: 17.3616,
    longitude: 78.4747,
    address: "Kothapet Main Road, LB Nagar, Hyderabad, Telangana 500074",
    invoiceValue: 4500.25,
    volumetricWeight: 24.00,
    deliveryTime: "2026-02-18 10:12 AM",
  },
  {
    id: "8",
    createdDate: "18-02-2026",
    orderDate: "18-02-2026",
    invoiceNumber: "INV-2026-008",
    retailerName: "CITY MART",
    orderType: "Digital",
    salesPerson: "Sarah Khan",
    beatName: "Beat 2",
    mobileNumber: "9876543210",
    status: "Ready for Planning",
    tripNumber: "-",
    latitude: 17.4239,
    longitude: 78.4738,
    address: "Paradise Circle, Begumpet, Hyderabad, Telangana 500016",
    invoiceValue: 850.00,
    volumetricWeight: 8.20,
    deliveryTime: "2026-02-18 11:15 AM",
  },
  {
    id: "9",
    createdDate: "17-02-2026",
    orderDate: "17-02-2026",
    invoiceNumber: "INV-2026-009",
    retailerName: "QUICK SHOP",
    orderType: "Digital",
    salesPerson: "Mike Johnson",
    beatName: "Beat 3",
    mobileNumber: "9123456789",
    status: "Ready for Planning",
    tripNumber: "-",
    latitude: 17.3850,
    longitude: 78.4867,
    address: "Chaitanyapuri Main Road, Dilsukhnagar, Hyderabad, Telangana 500060",
    invoiceValue: 7552.79,
    volumetricWeight: 192.48,
    deliveryTime: "2026-02-17 01:11 PM",
  },
  {
    id: "10",
    createdDate: "17-02-2026",
    orderDate: "17-02-2026",
    invoiceNumber: "INV-2026-010",
    retailerName: "BEST CHOICE",
    orderType: "Digital",
    salesPerson: "Neha Verma",
    beatName: "Beat 3",
    mobileNumber: "9678901234",
    status: "In Planning",
    tripNumber: "-",
    latitude: 17.4399,
    longitude: 78.4983,
    address: "MG Road, Secunderabad, Hyderabad, Telangana 500003",
    invoiceValue: 1900.00,
    volumetricWeight: 13.20,
    deliveryTime: "2026-02-17 02:18 PM",
  },
  {
    id: "11",
    createdDate: "17-02-2026",
    orderDate: "17-02-2026",
    invoiceNumber: "INV-2026-011",
    retailerName: "PRIME RETAIL",
    orderType: "Digital",
    salesPerson: "Ramesh Iyer",
    beatName: "Beat 4",
    mobileNumber: "9789012345",
    status: "In Planning",
    tripNumber: "-",
    latitude: 17.3753,
    longitude: 78.5262,
    address: "NGOs Colony, Uppal, Hyderabad, Telangana 500039",
    invoiceValue: 2200.75,
    volumetricWeight: 14.80,
    deliveryTime: "2026-02-17 05:33 PM",
  },
  {
    id: "12",
    createdDate: "16-02-2026",
    orderDate: "16-02-2026",
    invoiceNumber: "INV-2026-012",
    retailerName: "SUPER STORE",
    orderType: "Digital",
    salesPerson: "Tom D'Souza",
    beatName: "Beat 4",
    mobileNumber: "9234567890",
    status: "Trip Assigned",
    tripNumber: "Q-20260216141234-MNOP",
    latitude: 17.4065,
    longitude: 78.4772,
    address: "Raj Bhavan Road, Ameerpet, Hyderabad, Telangana 500016",
    invoiceValue: 1550.25,
    volumetricWeight: 12.00,
    deliveryTime: "2026-02-16 03:45 PM",
  },
  {
    id: "13",
    createdDate: "16-02-2026",
    orderDate: "16-02-2026",
    invoiceNumber: "INV-2026-013",
    retailerName: "VALUE MART",
    orderType: "Digital",
    salesPerson: "Deepa Nair",
    beatName: "Kphb",
    mobileNumber: "9890123456",
    status: "Trip Assigned",
    tripNumber: "Q-20260216121234-PQRS",
    latitude: 17.4290,
    longitude: 78.4063,
    address: "Erragadda Main Road, SR Nagar, Hyderabad, Telangana 500038",
    invoiceValue: 3900.50,
    volumetricWeight: 21.00,
    deliveryTime: "2026-02-16 12:12 PM",
  },
  {
    id: "14",
    createdDate: "16-02-2026",
    orderDate: "16-02-2026",
    invoiceNumber: "INV-2026-014",
    retailerName: "COMMUNITY STORE",
    orderType: "Digital",
    salesPerson: "Arjun Mehta",
    beatName: "Beat 2",
    mobileNumber: "9901234567",
    status: "In Transit",
    tripNumber: "Q-20260216081234-EFGH",
    latitude: 17.4933,
    longitude: 78.3986,
    address: "Nizampet Road, Bachupally, Hyderabad, Telangana 500090",
    invoiceValue: 2650.00,
    volumetricWeight: 17.50,
    deliveryTime: "2026-02-16 08:12 AM",
  },
  {
    id: "15",
    createdDate: "20-02-2026",
    orderDate: "N/A",
    invoiceNumber: "",
    retailerName: "ROHIT DEPARTMENTAL STORE",
    orderType: "Sales",
    salesPerson: "John Doe",
    beatName: "Beat 1",
    mobileNumber: "9182115778",
    status: "Ready for Planning",
    tripNumber: "-",
  },
  {
    id: "16",
    createdDate: "20-02-2026",
    orderDate: "N/A",
    invoiceNumber: "20-02/26/002169",
    retailerName: "VIJAY TRADERS",
    orderType: "Sales",
    salesPerson: "Jane Smith",
    beatName: "Beat 2",
    mobileNumber: "9182115779",
    status: "Ready for Planning",
    tripNumber: "-",
  },
  {
    id: "17",
    createdDate: "20-02-2026",
    orderDate: "18-02-2026",
    invoiceNumber: "ION/25-26/002169923",
    retailerName: "SHARMA GENERAL STORE",
    orderType: "Sales",
    salesPerson: "Rajesh Kumar",
    beatName: "Beat 1",
    mobileNumber: "9182399712",
    status: "In Planning",
    tripNumber: "-",
  },
  {
    id: "18",
    createdDate: "20-02-2026",
    orderDate: "19-02-2026",
    invoiceNumber: "ION/25-26/002169967",
    retailerName: "LAKSHMI ENTERPRISES",
    orderType: "Sales",
    salesPerson: "Amit Singh",
    beatName: "Beat 3",
    mobileNumber: "9182399613",
    status: "Trip Assigned",
    tripNumber: "Q-20260219161144-DHZA",
  },
  {
    id: "19",
    createdDate: "19-02-2026",
    orderDate: "02-07-2026",
    invoiceNumber: "2026/FEB/002169",
    retailerName: "ANNAPURNA STORES",
    orderType: "Sales",
    salesPerson: "Priya Sharma",
    beatName: "Beat 1",
    mobileNumber: "9182115778",
    status: "In Transit",
    tripNumber: "Q-20260219161144-DHZA",
  },
  {
    id: "20",
    createdDate: "19-02-2026",
    orderDate: "19-02-2026",
    invoiceNumber: "INV-2026-020",
    retailerName: "RELIANCE FRESH",
    orderType: "Sales",
    salesPerson: "Ramesh Iyer",
    beatName: "Beat 1",
    mobileNumber: "9640491532",
    status: "Partial Return",
    tripNumber: "Q-20260219161144-DHZA",
  },
];

interface DeliveryRoute {
  id: string;
  createdDate: string;
  routeId: string;
  dropPoints: number;
  sla: string;
  weight: string;
  volume: string;
  routeExpiry: string;
  actionType: 'view' | 'request';
  deliveryType: '3pl' | 'self';
}

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

interface DeliveryPlanningPageProps {
  activeTab?: '3pl' | 'self';
  onTripsCreated?: (trips: any[]) => void;
}

export function DeliveryPlanningPage({ activeTab = '3pl', onTripsCreated }: DeliveryPlanningPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [showCreateRoute, setShowCreateRoute] = useState(false);
  const [markDeliveredOpen, setMarkDeliveredOpen] = useState(false);
  const [orderToMarkDelivered, setOrderToMarkDelivered] = useState<OrderType | null>(null);
  const [deliveryRoutes, setDeliveryRoutes] = useState<DeliveryRoute[]>([
    {
      id: '1',
      createdDate: 'Feb 20, 2026, 1:17:55 PM',
      routeId: 'O-20260220131752-GFJZ',
      dropPoints: 1,
      sla: 'Same Day',
      weight: '2.52 Kgs',
      volume: '2.52 Kgs',
      routeExpiry: '2m 50s left',
      actionType: 'view',
      deliveryType: '3pl',
    },
    {
      id: '2',
      createdDate: 'Feb 20, 2026, 1:17:44 PM',
      routeId: 'O-20260220131738-PURL',
      dropPoints: 1,
      sla: 'Same Day',
      weight: '2.52 Kgs',
      volume: '2.52 Kgs',
      routeExpiry: '2m 28s left',
      actionType: 'request',
      deliveryType: '3pl',
    },
    {
      id: '3',
      createdDate: 'Feb 20, 2026, 1:16:10 PM',
      routeId: 'O-20260220131607-NFQP',
      dropPoints: 1,
      sla: 'Same Day',
      weight: '26.00 Kgs',
      volume: '30.39 Kgs',
      routeExpiry: '54s left',
      actionType: 'request',
      deliveryType: '3pl',
    },
  ]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleCreateRouteClick = () => {
    setShowCreateRoute(true);
  };

  const handleCloseCreateRoute = () => {
    setShowCreateRoute(false);
  };

  const handleConfirmRoute = (selectedOrders: Order[], deliveryDate: string) => {
    // Generate a new route ID
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const randomId = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newRouteId = `O-${timestamp}-${randomId}`;
    
    // Calculate totals
    const totalWeight = selectedOrders.reduce((sum, order) => sum + order.totalWeight, 0);
    const totalVolWeight = selectedOrders.reduce((sum, order) => sum + order.totalVolWeight, 0);
    
    // Create new delivery route
    const newRoute: DeliveryRoute = {
      id: String(deliveryRoutes.length + 1),
      createdDate: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      routeId: newRouteId,
      dropPoints: selectedOrders.length,
      sla: 'Same Day',
      weight: `${totalWeight.toFixed(2)} Kgs`,
      volume: `${totalVolWeight.toFixed(2)} Kgs`,
      routeExpiry: '5m 0s left',
      actionType: 'request',
      deliveryType: activeTab,
    };
    
    // Add the new route to the beginning of the list
    setDeliveryRoutes([newRoute, ...deliveryRoutes]);
    setShowCreateRoute(false);
  };

  const handleSelectOrder = (orderId: string) => {
    // Placeholder for order selection
  };

  const handleMarkDeliveredClick = (orderId: string) => {
    const order = initialOrders.find(o => o.id === orderId);
    if (order) {
      setOrderToMarkDelivered(order);
      setMarkDeliveredOpen(true);
    }
  };

  const handleConfirmMarkDelivered = () => {
    // Mark order as delivered logic would go here
    setOrderToMarkDelivered(null);
  };

  // If showing create route, render it instead of the main page
  if (showCreateRoute) {
    return (
      <CreateDeliveryRoutePage
        onBack={handleCloseCreateRoute}
        onConfirm={handleConfirmRoute}
        onTripsCreated={(trips) => {
          setShowCreateRoute(false);
          if (onTripsCreated) onTripsCreated(trips);
        }}
      />
    );
  }

  return (
    <div className="h-full flex flex-col px-6 py-6">
      {/* Page Header */}
      <div className="mb-6 flex items-start justify-between flex-shrink-0">
        <div>
          <div className="flex items-start gap-2 mb-2">
            <div className="w-6 h-6 bg-[#2D6EF5] rounded flex items-center justify-center">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Delivery Planning</h1>
          </div>
          <p className="text-gray-600 text-sm">
            Manage and track your delivery routes
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="gap-2 bg-[#2D6EF5] hover:bg-[#2557D6]" onClick={handleCreateRouteClick}>
            <Download className="w-4 h-4" />
            Create Delivery Route
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="overflow-x-auto flex-1 min-h-0 overflow-y-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left bg-gray-50">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    <Calendar className="w-4 h-4 text-[#2D6EF5]" />
                    Created Date
                  </div>
                </th>
                <th className="px-4 py-3 text-left bg-gray-50">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    <Hash className="w-4 h-4 text-[#2D6EF5]" />
                    Route ID
                  </div>
                </th>
                <th className="px-4 py-3 text-left bg-gray-50">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-[#2D6EF5]" />
                    Drop Points
                  </div>
                </th>
                <th className="px-4 py-3 text-left bg-gray-50">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    <Truck className="w-4 h-4 text-[#2D6EF5]" />
                    SLA
                  </div>
                </th>
                <th className="px-4 py-3 text-left bg-gray-50">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    <Weight className="w-4 h-4 text-[#2D6EF5]" />
                    Weight / Vol
                  </div>
                </th>
                <th className="px-4 py-3 text-left bg-gray-50">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-[#2D6EF5]" />
                    Route Expiry
                  </div>
                </th>
                <th className="px-4 py-3 text-left bg-gray-50">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    <Wrench className="w-4 h-4 text-[#2D6EF5]" />
                    Actions
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {deliveryRoutes.filter(r => r.deliveryType === activeTab).map((route) => (
                <tr key={route.id} className="border-t border-gray-200">
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {route.createdDate}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {route.routeId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {route.dropPoints} points
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <span className="text-[#F59E0B] font-medium">{route.sla}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {route.weight} / {route.volume}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <span className="text-[#EF4444] font-medium">{route.routeExpiry}</span>
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    {route.actionType === 'view' ? (
                      <Button className="gap-1.5 bg-[#2D6EF5] hover:bg-[#2557D6] text-white px-4 py-1.5 h-auto text-sm">
                        <Eye className="w-4 h-4" />
                        View Quotation
                      </Button>
                    ) : (
                      <Button className="gap-1.5 bg-[#10B981] hover:bg-[#059669] text-white px-4 py-1.5 h-auto text-sm">
                        Request Quotation
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalItems={deliveryRoutes.filter(r => r.deliveryType === activeTab).length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      {/* Modals */}
      <MarkDeliveredDialog
        open={markDeliveredOpen}
        onOpenChange={setMarkDeliveredOpen}
        order={orderToMarkDelivered}
        onMarkDelivered={handleConfirmMarkDelivered}
      />
    </div>
  );
}