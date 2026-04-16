import { useState } from 'react';
import { ChevronLeft, Truck, User, Phone, Users, Clock, MapPin, Package, CreditCard, IndianRupee, CheckCircle2, AlertCircle, ShoppingCart, ArrowUpRight, LayoutGrid } from 'lucide-react';
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

// ─── Mock product pool for customer order detail ────────────────────────────
interface OrderProduct {
  name: string;
  hsnCode: string;
  cases: number;
  upc: number;
  pcs: number;
  mrp: number;
  packaging: string;
  orderedQty: number;
  returnQty: number;
  netQty: number;
  unitWeight: string;
  taxable: number;
}

const MOCK_PRODUCTS: OrderProduct[] = [
  { name: 'SF MOMS MAGIC CA GRN 28+4G_FBIMMCA28TB',          hsnCode: '0', cases: 0, upc: 180, pcs: 24,  mrp: 5.00,   packaging: 'box', orderedQty: 24, returnQty: 0, netQty: 24, unitWeight: '0.04 Kgs', taxable: 108.66 },
  { name: 'SF MOMS MAGIC CA GRN 28+4G_FBIMMCA28TB',          hsnCode: '0', cases: 0, upc: 180, pcs: 12,  mrp: 5.00,   packaging: 'box', orderedQty: 12, returnQty: 0, netQty: 12, unitWeight: '0.04 Kgs', taxable: 54.33  },
  { name: 'YIPPEE MAGICMSLNODLES72.6GSPRINKPR_FN1215TG',     hsnCode: '0', cases: 0, upc: 96,  pcs: 12,  mrp: 15.00,  packaging: 'box', orderedQty: 12, returnQty: 0, netQty: 12, unitWeight: '0.09 Kgs', taxable: 165.35 },
  { name: 'SF MOMS MAGIC SHINESBUTTER 44G_FB4513010T',       hsnCode: '0', cases: 0, upc: 96,  pcs: 24,  mrp: 9.00,   packaging: 'box', orderedQty: 24, returnQty: 0, netQty: 24, unitWeight: '0.07 Kgs', taxable: 192.62 },
  { name: 'SUNFEASTFANTASTIK CHOCOMELTZ RS200_FCH51122A',    hsnCode: '0', cases: 0, upc: 24,  pcs: 1,   mrp: 200.00, packaging: 'box', orderedQty: 1,  returnQty: 0, netQty: 1,  unitWeight: '0.47 Kgs', taxable: 176.36 },
  { name: 'DARK FANTASYCKRSWISSROLLCHOCO21.6G_FBIDFSR23',    hsnCode: '0', cases: 0, upc: 288, pcs: 48,  mrp: 10.00,  packaging: 'box', orderedQty: 48, returnQty: 0, netQty: 48, unitWeight: '0.07 Kgs', taxable: 428.57 },
  { name: 'DARK FANTASY CHOCO FILLS 20G MF PR_FB101005MF',  hsnCode: '0', cases: 0, upc: 200, pcs: 40,  mrp: 10.00,  packaging: 'box', orderedQty: 40, returnQty: 0, netQty: 40, unitWeight: '0.04 Kgs', taxable: 363.64 },
  { name: 'HIDE & SEEK CHOCO CHIPS CLASSIC 100G',           hsnCode: '0', cases: 0, upc: 120, pcs: 20,  mrp: 30.00,  packaging: 'box', orderedQty: 20, returnQty: 0, netQty: 20, unitWeight: '0.10 Kgs', taxable: 254.24 },
  { name: 'BRITANNIA GOOD DAY CASHEW 150G',                 hsnCode: '0', cases: 0, upc: 96,  pcs: 16,  mrp: 25.00,  packaging: 'box', orderedQty: 16, returnQty: 0, netQty: 16, unitWeight: '0.15 Kgs', taxable: 338.98 },
  { name: 'PARLE G GOLD GLUCOSE BISCUITS 250G',             hsnCode: '0', cases: 0, upc: 200, pcs: 50,  mrp: 20.00,  packaging: 'box', orderedQty: 50, returnQty: 0, netQty: 50, unitWeight: '0.25 Kgs', taxable: 847.46 },
];

function generateProductsForCustomer(seed: number): OrderProduct[] {
  const count = 5 + (seed % 5); // 5-9 products
  const result: OrderProduct[] = [];
  for (let i = 0; i < count; i++) {
    result.push(MOCK_PRODUCTS[(seed + i * 3) % MOCK_PRODUCTS.length]);
  }
  return result;
}

// ─── Customer Order Detail sub-view ─────────────────────────────────────────
function CustomerOrderDetail({ point, onBack }: { point: DeliveryPoint; onBack: () => void }) {
  const seed = point.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const products = generateProductsForCustomer(seed);
  const totalTaxable = products.reduce((s, p) => s + p.taxable, 0);
  const totalNetQty  = products.reduce((s, p) => s + p.netQty, 0);
  const orderId      = `${seed.toString(16).padStart(8,'0').toUpperCase().slice(0,8)}-${point.id.replace(/[^a-z0-9]/gi,'').slice(0,4).toUpperCase()}`;
  const refInvoice   = point.invoiceNumber;
  const coordinates  = `17.${(42000000 + seed * 137) % 100000000}, 78.${(42000000 + seed * 251) % 100000000}`;
  const orderTime    = point.timestamp.replace(' ', ', ');

  return (
    <div className="h-full overflow-y-auto bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-gray-600 hover:text-gray-900 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Customer Order Details</h1>
              <p className="text-sm text-gray-500">Customer: {point.storeName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
              <p className="text-xs text-blue-500 flex items-center gap-1 mt-0.5">
                <span className="w-3 h-3 inline-block">📅</span> Customer Orders
              </p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
              <IndianRupee className="w-6 h-6 text-teal-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">₹ {point.invoiceValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              <p className="text-xs text-blue-500 flex items-center gap-1 mt-0.5">
                <ArrowUpRight className="w-3 h-3" /> Order Value
              </p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
              <LayoutGrid className="w-6 h-6 text-cyan-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              <p className="text-xs text-blue-500 flex items-center gap-1 mt-0.5">
                <LayoutGrid className="w-3 h-3" /> Product Count
              </p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" /> Customer Information
          </h2>
          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Customer Business Name</p>
              <p className="text-sm font-medium text-gray-900">{point.storeName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Address</p>
              <p className="text-sm font-medium text-gray-900">{point.address}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Mobile Number</p>
              <p className="text-sm font-medium text-gray-900">{point.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Coordinates</p>
              <p className="text-sm font-medium text-gray-900">{coordinates}</p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-blue-500" /> Order Details
            </h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {[
                  { icon: '#', label: 'ORDER ID' },
                  { icon: '📄', label: 'REFERENCE INVOICE' },
                  { icon: 'ℹ', label: 'STATUS' },
                  { icon: '⏰', label: 'TIME' },
                  { icon: '₹', label: 'ORDER TOTAL' },
                  { icon: '💬', label: 'RETURN REASON' },
                ].map(col => (
                  <th key={col.label} className="px-4 py-3 text-left text-xs font-bold text-blue-500 uppercase tracking-wide">
                    <span className="mr-1 opacity-70">{col.icon}</span>{col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 text-xs text-gray-700 font-mono">{orderId}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{refInvoice}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${statusBadgeClass(point.status)}`}>
                    {point.status === 'Pending' ? 'Ready for Planning' : point.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{orderTime}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">₹ {point.invoiceValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-3 text-sm text-gray-400">-</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Order Products */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" /> Order Products
            </h2>
          </div>
          {/* Sub-header for the order */}
          <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
            <span className="text-sm font-bold text-gray-800">Order #{refInvoice}</span>
            <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium ${statusBadgeClass(point.status)}`}>
              {point.status === 'Pending' ? 'Ready for Planning' : point.status}
            </span>
            <span className="text-sm text-gray-500">{orderTime}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {[
                    { icon: '📦', label: 'PRODUCT' },
                    { icon: '#',  label: 'HSN CODE' },
                    { icon: '#',  label: 'CASES' },
                    { icon: '#',  label: 'UPC' },
                    { icon: '#',  label: 'PCS' },
                    { icon: '#',  label: 'MRP' },
                    { icon: '📦', label: 'PACKAGING' },
                    { icon: '🛒', label: 'ORDERED QTY' },
                    { icon: '↩',  label: 'RETURN QTY' },
                    { icon: '⚖',  label: 'NET QTY' },
                    { icon: '⚖',  label: 'UNIT WEIGHT' },
                    { icon: '🏷',  label: 'TAXABLE' },
                  ].map(col => (
                    <th key={col.label} className="px-3 py-3 text-left font-bold text-blue-500 uppercase tracking-wide whitespace-nowrap">
                      <span className="mr-1 text-blue-400 text-[10px]">{col.icon}</span>{col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-3 py-3 text-gray-800 font-medium max-w-[180px]">{p.name}</td>
                    <td className="px-3 py-3 text-gray-600 text-center">{p.hsnCode}</td>
                    <td className="px-3 py-3 text-gray-600 text-center">{p.cases}</td>
                    <td className="px-3 py-3 text-gray-600 text-center">{p.upc}</td>
                    <td className="px-3 py-3 text-gray-600 text-center">{p.pcs}</td>
                    <td className="px-3 py-3 text-gray-700">₹ {p.mrp.toFixed(2)}</td>
                    <td className="px-3 py-3 text-gray-600">{p.packaging}</td>
                    <td className="px-3 py-3 text-gray-600 text-center">{p.orderedQty}</td>
                    <td className="px-3 py-3 text-gray-600 text-center">{p.returnQty}</td>
                    <td className="px-3 py-3 text-gray-600 text-center">{p.netQty}</td>
                    <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{p.unitWeight}</td>
                    <td className="px-3 py-3 text-gray-700 font-medium">{p.taxable.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-200 bg-gray-50">
                  <td colSpan={9} className="px-3 py-3 text-sm font-bold text-gray-900">Total:</td>
                  <td className="px-3 py-3 text-sm font-bold text-gray-900 text-center">{totalNetQty}</td>
                  <td className="px-3 py-3"></td>
                  <td className="px-3 py-3 text-sm font-bold text-gray-900">{totalTaxable.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
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
  const [selectedCustomer, setSelectedCustomer] = useState<DeliveryPoint | null>(null);

  const dropPoints = trip?.dropPoints ?? 2;

  // Show customer order detail sub-view when eye icon clicked
  if (selectedCustomer) {
    return <CustomerOrderDetail point={selectedCustomer} onBack={() => setSelectedCustomer(null)} />;
  }
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
    insuranceProvider:   'HDFC ERGO General Insurance',
    transactionId:       `TXN-${tripId.slice(-8).toUpperCase()}`,
    premiumAmount:       '₹ 320.00',
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
            </div>
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
                  { icon: Package,     label: 'Insurance Provider',    value: tripData.insuranceProvider },
                  { icon: CreditCard,  label: 'Transaction ID',        value: tripData.transactionId },
                  { icon: IndianRupee, label: 'Premium Amount',        value: tripData.premiumAmount },
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
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left">
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-bold text-gray-500">#</span>
                      <span className="text-xs font-bold text-gray-500">STOP NO.</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Customer Business Name</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Address</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">OTP</span>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center gap-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold flex-shrink-0">i</span>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Status</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Delivered Time</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Orders/Amount</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deliveryPoints.map((point) => (
                  <tr key={point.id} className="hover:bg-gray-50 transition-colors">
                    {/* Stop No */}
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 w-12 text-center">
                      {point.stopNumber}
                    </td>
                    {/* Customer Business Name */}
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-900">{point.storeName}</span>
                    </td>
                    {/* Address */}
                    <td className="px-4 py-3 max-w-[220px]">
                      <span className="text-sm text-gray-600 leading-relaxed">{point.address}</span>
                    </td>
                    {/* OTP */}
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-900">{point.otp}</span>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${statusBadgeClass(point.status)}`}>
                        {point.status}
                      </span>
                    </td>
                    {/* Delivered Time */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500">
                        {point.status === 'Delivered' || point.status === 'Partially Returned'
                          ? point.timestamp
                          : 'N/A'}
                      </span>
                    </td>
                    {/* Orders / Amount */}
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-900">
                        1/₹ {point.invoiceValue.toFixed(2)}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedCustomer(point)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-blue-200 text-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Totals footer */}
              <tfoot>
                <tr className="bg-gray-50 border-t border-gray-200">
                  <td colSpan={6} className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-700">{dropPoints} customers · {deliveredPoints.length} delivered</span>
                  </td>
                  <td className="px-4 py-3" colSpan={2}>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">COD: <span className="font-bold text-gray-900">₹ {codTotal.toFixed(2)}</span></span>
                      <span className="text-gray-600">Total: <span className="font-bold text-gray-900">₹ {totalSaleValue.toFixed(2)}</span></span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {activeTab === 'ordered-products' && (() => {
          // Aggregate all products across all delivery points for this trip
          const seed = tripId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
          const allProducts = generateProductsForCustomer(seed);

          // Build table rows with UOM, delivered, pending, total qty, amount
          const rows = allProducts.map((p, i) => {
            const delivered = i % 3 === 0 ? p.netQty : 0;
            const pending   = p.netQty - delivered;
            const amount    = p.netQty * p.mrp;
            return { ...p, uom: i % 3 === 0 ? 'KG' : i % 3 === 1 ? 'Box' : 'Pcs', delivered, pending, amount };
          });

          const totalQty    = rows.reduce((s, r) => s + r.netQty, 0);
          const totalAmount = rows.reduce((s, r) => s + r.amount, 0);

          const colHeaders = [
            { icon: '📦', label: 'PRODUCT NAME' },
            { icon: '✏️', label: 'UOM' },
            { icon: '▦',  label: 'UPC' },
            { icon: '📦', label: 'CASES' },
            { icon: '👤', label: 'PCS' },
            { icon: '🏷', label: 'MRP' },
            { icon: '✅', label: 'DELIVERED' },
            { icon: '🕐', label: 'PENDING' },
            { icon: '📊', label: 'TOTAL QTY' },
            { icon: '₹',  label: 'AMOUNT' },
          ];

          return (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-white">
                    {colHeaders.map(col => (
                      <th key={col.label} className="px-4 py-3 text-left whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span className="text-blue-500 text-xs">{col.icon}</span>
                          <span className="text-xs font-bold text-blue-500 uppercase tracking-wide">{col.label}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-800 font-medium max-w-[220px]">{row.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{row.uom}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-center">{row.upc}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-center">{row.cases}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-center">{row.pcs}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">₹ {row.mrp.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-center">{row.delivered}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-center">{row.pending}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 text-center">{row.netQty}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">₹ {row.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-200 bg-gray-50">
                    <td colSpan={8} className="px-4 py-3 text-sm font-bold text-gray-900 text-right">Total:</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 text-center">{totalQty}</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900">₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          );
        })()}

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
