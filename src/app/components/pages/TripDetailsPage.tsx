import { useState } from 'react';
import { ChevronLeft, Download, Truck, User, Phone, Users, Clock, MapPin, Package, CreditCard, IndianRupee, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { Trip } from './TripsPage';

// ─── Mock customer pool used to generate delivery points ───────────────────
interface DeliveryPoint {
  id: string;
  stopNumber: number;
  storeName: string;
  contactPerson: string;
  phone: string;
  address: string;
  otp: string;
  status: 'Delivered' | 'Partially Returned' | 'Pending' | 'In Transit' | 'Order Picked Up';
  timestamp: string;
  invoiceValue: number;
  invoiceNumber: string;
  paymentMode: 'COD' | 'Digital' | 'Credit';
  paymentAmount: number;
}

const MOCK_CUSTOMER_POOL: Omit<DeliveryPoint, 'id' | 'stopNumber' | 'otp' | 'status' | 'timestamp'>[] = [
  {
    storeName: 'ROHIT DEPARTMENTAL STORE',
    contactPerson: 'Rohit Sharma',
    phone: '9491234567',
    address: 'Plot 12, Sector 52, Gurgaon, Haryana 122003',
    invoiceValue: 9675.36,
    invoiceNumber: '2026/FEB/002',
    paymentMode: 'Digital',
    paymentAmount: 9675.36,
  },
  {
    storeName: 'SHARMA GENERAL STORE',
    contactPerson: 'Mohan Sharma',
    phone: '9876543210',
    address: 'Shop 4, Main Market, Wazirabad, Haryana 132103',
    invoiceValue: 3528.33,
    invoiceNumber: 'IOW/25-26/0021692',
    paymentMode: 'COD',
    paymentAmount: 3528.33,
  },
  {
    storeName: 'METRO SUPERMART',
    contactPerson: 'Ravi Kumar',
    phone: '9182234567',
    address: 'Plot 45, Miyapur Main Road, Hyderabad, Telangana 500049',
    invoiceValue: 5154.57,
    invoiceNumber: 'I07-01002121',
    paymentMode: 'Digital',
    paymentAmount: 5154.57,
  },
  {
    storeName: 'FRESH BAZAAR',
    contactPerson: 'Sita Devi',
    phone: '9876123456',
    address: 'Cyber Towers, Gachibowli, Hyderabad, Telangana 500032',
    invoiceValue: 7892.00,
    invoiceNumber: 'FB/2026/034',
    paymentMode: 'Credit',
    paymentAmount: 0,
  },
  {
    storeName: 'GREEN VALLEY STORE',
    contactPerson: 'Suresh Patel',
    phone: '9345678901',
    address: 'Kompally Circle, Kompally, Hyderabad, Telangana 500014',
    invoiceValue: 4230.75,
    invoiceNumber: 'GVS/2026/112',
    paymentMode: 'COD',
    paymentAmount: 4230.75,
  },
  {
    storeName: 'CITY MART',
    contactPerson: 'Priya Singh',
    phone: '9123456789',
    address: 'Road No 12, Banjara Hills, Hyderabad, Telangana 500034',
    invoiceValue: 2350.00,
    invoiceNumber: 'CM/2026/089',
    paymentMode: 'Digital',
    paymentAmount: 2350.00,
  },
  {
    storeName: 'SREE VENKATESWARA TRADERS',
    contactPerson: 'Venkat Rao',
    phone: '9490290265',
    address: '676 Prosacco Divide, Jubilee Hills, Hyderabad, Telangana 500033',
    invoiceValue: 3268.69,
    invoiceNumber: 'SVT/2026/045',
    paymentMode: 'COD',
    paymentAmount: 3268.69,
  },
  {
    storeName: 'SMART RETAIL',
    contactPerson: 'Anita Joshi',
    phone: '9012345678',
    address: 'HITEC City Main Road, Madhapur, Hyderabad, Telangana 500081',
    invoiceValue: 6540.20,
    invoiceNumber: 'SR/2026/201',
    paymentMode: 'Digital',
    paymentAmount: 6540.20,
  },
  {
    storeName: 'FRESH CORNER',
    contactPerson: 'Deepak Mehta',
    phone: '9654321087',
    address: 'Kukatpally Housing Board Colony, Hyderabad, Telangana 500072',
    invoiceValue: 1980.50,
    invoiceNumber: 'FC/2026/067',
    paymentMode: 'Credit',
    paymentAmount: 0,
  },
  {
    storeName: 'DAILY NEEDS MART',
    contactPerson: 'Ramesh Yadav',
    phone: '9871234560',
    address: 'Dilsukhnagar Market, Dilsukhnagar, Hyderabad, Telangana 500060',
    invoiceValue: 8120.80,
    invoiceNumber: 'DNM/2026/153',
    paymentMode: 'COD',
    paymentAmount: 8120.80,
  },
  {
    storeName: 'QUICK SHOP',
    contactPerson: 'Kavya Reddy',
    phone: '9988776655',
    address: 'LB Nagar Main Road, L.B. Nagar, Hyderabad, Telangana 500074',
    invoiceValue: 3750.00,
    invoiceNumber: 'QS/2026/092',
    paymentMode: 'Digital',
    paymentAmount: 3750.00,
  },
  {
    storeName: 'SUPER SAVINGS STORE',
    contactPerson: 'Ajay Nair',
    phone: '9445566778',
    address: 'Uppal X Roads, Uppal, Hyderabad, Telangana 500039',
    invoiceValue: 5670.30,
    invoiceNumber: 'SSS/2026/078',
    paymentMode: 'COD',
    paymentAmount: 5670.30,
  },
  {
    storeName: 'MORNING FRESH MART',
    contactPerson: 'Lakshmi Narayanan',
    phone: '9332211440',
    address: 'Sainikpuri Colony, Secunderabad, Telangana 500094',
    invoiceValue: 2890.00,
    invoiceNumber: 'MFM/2026/041',
    paymentMode: 'Digital',
    paymentAmount: 2890.00,
  },
  {
    storeName: 'BUDGET BAZAAR',
    contactPerson: 'Satish Goud',
    phone: '9667788990',
    address: 'Malkajgiri Main Road, Malkajgiri, Hyderabad, Telangana 500047',
    invoiceValue: 4410.60,
    invoiceNumber: 'BB/2026/119',
    paymentMode: 'COD',
    paymentAmount: 4410.60,
  },
  {
    storeName: 'ROYAL PROVISIONS',
    contactPerson: 'Farhan Ahmed',
    phone: '9223344556',
    address: 'Chandrayangutta, Old City, Hyderabad, Telangana 500005',
    invoiceValue: 7340.90,
    invoiceNumber: 'RP/2026/188',
    paymentMode: 'Credit',
    paymentAmount: 0,
  },
  {
    storeName: 'THE GROCERY POINT',
    contactPerson: 'Hema Priya',
    phone: '9900112233',
    address: 'Alwal Cross Roads, Alwal, Secunderabad, Telangana 500010',
    invoiceValue: 3100.25,
    invoiceNumber: 'TGP/2026/055',
    paymentMode: 'Digital',
    paymentAmount: 3100.25,
  },
  {
    storeName: 'VALUE MART',
    contactPerson: 'Srinivas Reddy',
    phone: '9556677889',
    address: 'Nacharam Industrial Area, Nacharam, Hyderabad, Telangana 500076',
    invoiceValue: 6200.00,
    invoiceNumber: 'VM/2026/143',
    paymentMode: 'COD',
    paymentAmount: 6200.00,
  },
  {
    storeName: 'NEIGHBOURHOOD STORE',
    contactPerson: 'Usha Rani',
    phone: '9778899001',
    address: 'Moula-Ali, Hyderabad, Telangana 500040',
    invoiceValue: 1750.80,
    invoiceNumber: 'NS/2026/029',
    paymentMode: 'Digital',
    paymentAmount: 1750.80,
  },
  {
    storeName: 'GRAND PROVISIONS',
    contactPerson: 'Bharat Reddy',
    phone: '9444333222',
    address: 'Kothapet Main Road, Kothapet, Hyderabad, Telangana 500035',
    invoiceValue: 9100.00,
    invoiceNumber: 'GP/2026/210',
    paymentMode: 'COD',
    paymentAmount: 9100.00,
  },
  {
    storeName: 'SUNRISE STORES',
    contactPerson: 'Manisha Gupta',
    phone: '9123789456',
    address: 'Himayatnagar, Hyderabad, Telangana 500029',
    invoiceValue: 4850.50,
    invoiceNumber: 'SS/2026/097',
    paymentMode: 'Digital',
    paymentAmount: 4850.50,
  },
];

const STATUSES: DeliveryPoint['status'][] = [
  'Delivered', 'Delivered', 'Delivered',
  'Partially Returned', 'In Transit', 'Pending', 'Order Picked Up',
];
const OTPS = ['9445', '3472', '7823', '6091', '5534', '2817', '4490', '8861', '1253', '7704',
              '3319', '6627', '9981', '4455', '2233', '8800', '5577', '1166', '9302', '4481'];

const TIMES = [
  '2026-02-24 02:47 PM', '2026-02-24 03:00 PM', '2026-02-24 03:20 PM',
  '2026-02-24 03:45 PM', '2026-02-24 04:05 PM', '2026-02-24 04:28 PM',
  '2026-02-24 04:50 PM', '2026-02-24 05:10 PM', '2026-02-24 05:35 PM',
  '2026-02-24 05:55 PM', '2026-02-24 06:15 PM', '2026-02-24 06:40 PM',
  '2026-02-24 07:00 PM', '2026-02-24 07:25 PM', '2026-02-24 07:50 PM',
  '2026-02-24 08:10 PM', '2026-02-24 08:35 PM', '2026-02-24 08:55 PM',
  '2026-02-24 09:20 PM', '2026-02-24 09:45 PM',
];

function generateDeliveryPoints(tripId: string, count: number): DeliveryPoint[] {
  // Use tripId as a seed offset so different trips get different customers
  const seed = tripId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const points: DeliveryPoint[] = [];
  for (let i = 0; i < count; i++) {
    const poolIdx = (seed + i * 7) % MOCK_CUSTOMER_POOL.length;
    const customer = MOCK_CUSTOMER_POOL[poolIdx];
    const statusIdx = (seed + i * 3) % STATUSES.length;
    points.push({
      ...customer,
      id: `${tripId}-pt-${i + 1}`,
      stopNumber: i + 1,
      otp: OTPS[(seed + i) % OTPS.length],
      status: count === 1 ? 'Order Picked Up' : STATUSES[statusIdx],
      timestamp: TIMES[i % TIMES.length],
    });
  }
  return points;
}

// ─── Props ──────────────────────────────────────────────────────────────────
interface TripDetailsPageProps {
  tripId: string;
  trip: Trip | null;
  onBack: () => void;
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function stopCircleColor(status: DeliveryPoint['status']) {
  switch (status) {
    case 'Delivered':          return 'bg-green-500';
    case 'Order Picked Up':    return 'bg-blue-500';
    case 'Partially Returned': return 'bg-red-500';
    case 'In Transit':         return 'bg-amber-500';
    case 'Pending':            return 'bg-gray-400';
    default:                   return 'bg-gray-400';
  }
}

function statusBadgeClass(status: DeliveryPoint['status']) {
  switch (status) {
    case 'Delivered':        return 'bg-green-100 text-green-700';
    case 'Order Picked Up':  return 'bg-blue-100 text-blue-700';
    case 'Partially Returned': return 'bg-red-100 text-red-600';
    case 'In Transit':       return 'bg-amber-100 text-amber-700';
    case 'Pending':          return 'bg-gray-100 text-gray-600';
    default:                 return 'bg-gray-100 text-gray-600';
  }
}

// ─── Component ──────────────────────────────────────────────────────────────
export function TripDetailsPage({ tripId, trip, onBack }: TripDetailsPageProps) {
  const [activeTab, setActiveTab] = useState('summary');

  const dropPoints = trip?.dropPoints ?? 2;
  const deliveryPoints = generateDeliveryPoints(tripId, dropPoints);

  const totalSaleValue    = deliveryPoints.reduce((s, p) => s + p.invoiceValue, 0);
  const deliveredPoints   = deliveryPoints.filter(p => p.status === 'Delivered' || p.status === 'Order Picked Up');
  const totalDeliveredVal = deliveredPoints.reduce((s, p) => s + p.invoiceValue, 0);
  const returnedPoints    = deliveryPoints.filter(p => p.status === 'Partially Returned');
  const totalReturnVal    = returnedPoints.reduce((s, p) => s + p.invoiceValue * 0.1, 0);
  const codTotal          = deliveryPoints.filter(p => p.paymentMode === 'COD').reduce((s, p) => s + p.paymentAmount, 0);
  const digitalTotal      = deliveryPoints.filter(p => p.paymentMode === 'Digital').reduce((s, p) => s + p.paymentAmount, 0);

  const tripData = {
    tripNumber:          trip?.tripNumber ?? tripId,
    provider:            trip?.provider   ?? 'Logistics Provider',
    vehicle:             'MH01AB1234',
    driverName:          'Hema',
    contactNumber:       '9490290265',
    helper:              'Darrin Cruickshank II',
    startTime:           '2026-02-24 02:38 PM',
    estimatedCompletion: '2026-02-24 03:56 PM',
    pickupOTP:           '9445',
    returnOTP:           '6088',
  };

  const tabs = [
    { id: 'summary',          label: 'Summary' },
    { id: 'customer-wise',    label: 'Customer Wise Orders' },
    { id: 'ordered-products', label: 'Ordered Products' },
    { id: 'return-products',  label: 'Return Products' },
  ];

  return (
    <div className="h-full overflow-y-auto bg-[#F9FAFB]">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-600 hover:text-gray-900 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{tripData.tripNumber}</h1>
              <p className="text-sm text-gray-500">
                Provider: <span className="font-medium text-gray-700">{tripData.provider}</span>
                <span className="mx-2">·</span>
                <span className={`font-medium ${
                  trip?.status === 'Completed' ? 'text-green-600' :
                  trip?.status === 'In Progress' ? 'text-amber-600' :
                  trip?.status === 'Planned' ? 'text-blue-600' : 'text-gray-600'
                }`}>{trip?.status ?? 'Planned'}</span>
                <span className="mx-2">·</span>
                {dropPoints} drop point{dropPoints !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-[#2D6EF5] hover:bg-[#2557D6] text-white gap-2 text-sm">
              <Download className="w-4 h-4" />Order Details
            </Button>
            <Button className="bg-[#2D6EF5] hover:bg-[#2557D6] text-white gap-2 text-sm">
              <Download className="w-4 h-4" />Return Report
            </Button>
            <Button className="bg-[#2D6EF5] hover:bg-[#2557D6] text-white gap-2 text-sm">
              <Download className="w-4 h-4" />Pickup List
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-6 border-b border-gray-200 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#2D6EF5] text-[#2D6EF5]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-6 py-6">

        {/* ── SUMMARY TAB ── */}
        {activeTab === 'summary' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Route Overview */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-base font-bold text-gray-900 mb-4">Route Overview</h2>
              <div className="space-y-3">
                {[
                  { icon: Truck,   label: 'Vehicle',              value: tripData.vehicle },
                  { icon: User,    label: 'Driver Name',          value: tripData.driverName },
                  { icon: Phone,   label: 'Contact Number',       value: tripData.contactNumber },
                  { icon: Users,   label: 'Helper',               value: tripData.helper },
                  { icon: Clock,   label: 'Start Time',           value: tripData.startTime },
                  { icon: Clock,   label: 'Est. Completion',      value: tripData.estimatedCompletion },
                  { icon: Package, label: 'Pickup OTP',           value: tripData.pickupOTP },
                  { icon: Package, label: 'Return OTP',           value: tripData.returnOTP },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-[#2D6EF5] flex-shrink-0" />
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm text-gray-600">{label}</span>
                      <span className="text-sm font-medium text-gray-900">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trip Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-base font-bold text-gray-900 mb-4">Trip Summary</h2>
              <div className="space-y-3">
                {[
                  { icon: IndianRupee, label: 'Total Sale Value',      value: `₹ ${totalSaleValue.toFixed(2)}` },
                  { icon: IndianRupee, label: 'Total Delivered Value', value: `₹ ${totalDeliveredVal.toFixed(2)}` },
                  { icon: IndianRupee, label: 'Total Return Value',    value: `₹ ${totalReturnVal.toFixed(2)}` },
                  { icon: MapPin,      label: 'Total Delivery Points', value: String(dropPoints) },
                  { icon: CheckCircle2,label: 'Delivered',             value: `${deliveredPoints.length} / ${dropPoints}` },
                  { icon: CreditCard,  label: 'COD Collection',        value: `₹ ${codTotal.toFixed(2)}` },
                  { icon: CreditCard,  label: 'Digital Collection',    value: `₹ ${digitalTotal.toFixed(2)}` },
                  { icon: CreditCard,  label: 'Net Collection',        value: `₹ ${(codTotal + digitalTotal).toFixed(2)}` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-[#2D6EF5] flex-shrink-0" />
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm text-gray-600">{label}</span>
                      <span className="text-sm font-medium text-gray-900">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Delivery Progress ── */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col">
              <h2 className="text-base font-bold text-gray-900 mb-4">Delivery Progress</h2>

              <div className="flex-1 overflow-y-auto -mr-1 pr-1" style={{ maxHeight: '480px' }}>
                {/* Pickup stop — orange circle, no number */}
                {(() => {
                  const pickup = deliveryPoints[0];
                  const rest   = deliveryPoints.slice(1);
                  return (
                    <>
                      {/* ── Pickup entry ── */}
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className="w-9 h-9 rounded-full bg-[#F97316] flex items-center justify-center flex-shrink-0">
                            <Package className="w-4 h-4 text-white" />
                          </div>
                          {deliveryPoints.length > 1 && (
                            <div className="w-px flex-1 bg-gray-200 my-1 min-h-[12px]" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="text-sm font-bold text-gray-900 leading-tight">{pickup.storeName}</span>
                            <Badge className="bg-green-100 text-green-700 rounded px-2 py-0.5 text-xs font-medium flex-shrink-0 border-0">
                              Order Picked Up
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mb-1 leading-relaxed">{pickup.address}</p>
                          <p className="text-xs text-gray-400 mb-2">{pickup.timestamp}</p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-500">OTP :</span>
                            <Badge className="bg-[#DBEAFE] text-[#1E40AF] hover:bg-[#DBEAFE] rounded px-2 py-0.5 text-xs font-bold border-0">
                              {pickup.otp}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* ── Delivery stops ── */}
                      {rest.map((point, index) => (
                        <div key={point.id} className="flex gap-3">
                          <div className="flex flex-col items-center flex-shrink-0">
                            <div className="w-9 h-9 rounded-full bg-[#6B7280] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                              {index + 1}
                            </div>
                            {index < rest.length - 1 && (
                              <div className="w-px flex-1 bg-gray-200 my-1 min-h-[12px]" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className="text-sm font-bold text-gray-900 leading-tight">{point.storeName}</span>
                              <Badge className={`${statusBadgeClass(point.status)} rounded px-2 py-0.5 text-xs font-medium flex-shrink-0 border-0`}>
                                {point.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 mb-1 leading-relaxed">{point.address}</p>
                            <p className="text-xs text-gray-400 mb-2">{point.timestamp}</p>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-gray-500">OTP :</span>
                              <Badge className="bg-[#DBEAFE] text-[#1E40AF] hover:bg-[#DBEAFE] rounded px-2 py-0.5 text-xs font-bold border-0">
                                {point.otp}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  );
                })()}
              </div>
            </div>

          </div>
        )}

        {/* ── CUSTOMER WISE TAB ── */}
        {activeTab === 'customer-wise' && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-900">Customer Wise Orders</h2>
              <p className="text-sm text-gray-500 mt-0.5">{dropPoints} customer{dropPoints !== 1 ? 's' : ''} in this trip</p>
            </div>
            <div className="divide-y divide-gray-100">
              {deliveryPoints.map((point) => (
                <div key={point.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full ${stopCircleColor(point.status)} text-white flex items-center justify-center font-bold text-xs flex-shrink-0`}>
                        {point.stopNumber}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">{point.storeName}</h3>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <User className="w-3 h-3" />{point.contactPerson}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" />{point.phone}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 flex items-start gap-1">
                          <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />{point.address}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-gray-900">₹ {point.invoiceValue.toFixed(2)}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{point.invoiceNumber}</div>
                      <Badge className={`${statusBadgeClass(point.status)} rounded px-2 py-0.5 text-xs font-medium mt-1`}>
                        {point.status}
                      </Badge>
                      <div className={`text-xs mt-1 px-1.5 py-0.5 rounded font-medium inline-block ${
                        point.paymentMode === 'COD'     ? 'bg-orange-100 text-orange-700' :
                        point.paymentMode === 'Digital' ? 'bg-blue-100 text-blue-700'   :
                                                          'bg-purple-100 text-purple-700'
                      }`}>{point.paymentMode}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Totals row */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{dropPoints} customers · {deliveredPoints.length} delivered</span>
              <div className="flex items-center gap-6 text-sm">
                <span className="text-gray-600">COD: <span className="font-bold text-gray-900">₹ {codTotal.toFixed(2)}</span></span>
                <span className="text-gray-600">Digital: <span className="font-bold text-gray-900">₹ {digitalTotal.toFixed(2)}</span></span>
                <span className="text-gray-600">Total: <span className="font-bold text-gray-900">₹ {totalSaleValue.toFixed(2)}</span></span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ordered-products' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Ordered Products</p>
            <p className="text-sm text-gray-400 mt-1">Product-level breakdown coming soon</p>
          </div>
        )}

        {activeTab === 'return-products' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Return Products</p>
            <p className="text-sm text-gray-400 mt-1">
              {returnedPoints.length > 0
                ? `${returnedPoints.length} customer${returnedPoints.length !== 1 ? 's' : ''} with partial returns`
                : 'No returns for this trip'}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
