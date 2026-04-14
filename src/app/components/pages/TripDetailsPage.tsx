import { useState } from 'react';
import { ChevronLeft, Download, Truck, User, Phone, Users, Clock, MapPin, Package, CreditCard, IndianRupee } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface DeliveryPoint {
  id: string;
  storeName: string;
  address: string;
  otp: string;
  status: string;
  timestamp: string;
}

interface TripDetailsData {
  tripNumber: string;
  provider: string;
  vehicle: string;
  driverName: string;
  contactNumber: string;
  helper: string;
  startTime: string;
  estimatedCompletion: string;
  pickupOTP: string;
  returnOTP: string;
  totalSaleValue: number;
  totalDeliveredValue: number;
  totalReturnValue: number;
  totalDeliveryPoints: number;
  codCollection: number;
  digitalCollection: number;
  netCollection: number;
  deliveryPoints: DeliveryPoint[];
}

interface TripDetailsPageProps {
  tripId: string;
  onBack: () => void;
}

export function TripDetailsPage({ tripId, onBack }: TripDetailsPageProps) {
  const [activeTab, setActiveTab] = useState('summary');

  // Static trip data
  const vehicle = 'MH01AB1234';
  const driverName = 'Hema';
  const contactNumber = '9490290265';
  const helper = 'Darrin Cruickshank II';

  const tripData: TripDetailsData = {
    tripNumber: 'Q-20260224143505-JZOW',
    provider: 'Qwipo Logistics',
    vehicle,
    driverName,
    contactNumber,
    helper,
    startTime: '2026-02-24 02:38 PM',
    estimatedCompletion: '2026-02-24 03:56 PM',
    pickupOTP: '9445',
    returnOTP: '6088',
    totalSaleValue: 3268.69,
    totalDeliveredValue: 3197.26,
    totalReturnValue: 71.43,
    totalDeliveryPoints: 1,
    codCollection: 0,
    digitalCollection: 0,
    netCollection: 0,
    deliveryPoints: [
      {
        id: '1',
        storeName: 'Sree Venkateswara Traders',
        address: 'Store, 676 Prosacco Divide, Hyderabad, Telangana, 676 Prosacco Divide',
        otp: '9445',
        status: 'Order Picked Up',
        timestamp: '2026-02-24 02:47 PM',
      },
      {
        id: '2',
        storeName: 'ROHIT DEPARTMENTAL STORE',
        address: 'WAZIRABAD NEAR SEC-52 GURUGRAM HARYANA, WAZIRABAD NEAR SEC-52 GURUGRAM HARYANA, WAZIRABAD NEAR SEC-52 GURUGRAM HARYANA, WAZIRABAD NEAR SEC-52 GURUGRAM HARYANA, 500081',
        otp: '3472',
        status: 'Partially Returned',
        timestamp: '2026-02-24 03:00 PM',
      },
    ],
  };

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'customer-wise', label: 'Customer Wise Orders' },
    { id: 'ordered-products', label: 'Ordered Products' },
    { id: 'return-products', label: 'Return Products' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Order Picked Up':
        return 'bg-[#D1FAE5] text-[#059669]';
      case 'Partially Returned':
        return 'bg-[#FECACA] text-[#DC2626]';
      case 'Delivered':
        return 'bg-[#DBEAFE] text-[#1E40AF]';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{tripData.tripNumber}</h1>
              <p className="text-sm text-gray-600">Provider: {tripData.provider}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-[#2D6EF5] hover:bg-[#2557D6] text-white gap-2">
              <Download className="w-4 h-4" />
              Download Order Details
            </Button>
            <Button className="bg-[#2D6EF5] hover:bg-[#2557D6] text-white gap-2">
              <Download className="w-4 h-4" />
              Download Return Report
            </Button>
            <Button className="bg-[#2D6EF5] hover:bg-[#2557D6] text-white gap-2">
              <Download className="w-4 h-4" />
              Download Pickup List
            </Button>
          </div>
        </div>

        {/* Tabs */}
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

      {/* Content */}
      <div className="px-6 py-6">
        {activeTab === 'summary' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Route Overview */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-base font-bold text-gray-900 mb-4">Route Overview</h2>
              <div className="space-y-3">
                {/* Vehicle */}
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-[#2D6EF5]" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Vehicle</span>
                    <span className="text-sm font-medium text-gray-900">{tripData.vehicle}</span>
                  </div>
                </div>

                {/* Driver Name */}
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-[#2D6EF5]" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Driver Name</span>
                    <span className="text-sm font-medium text-gray-900">{tripData.driverName}</span>
                  </div>
                </div>

                {/* Contact Number */}
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#2D6EF5]" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Contact Number</span>
                    <span className="text-sm font-medium text-gray-900">{tripData.contactNumber}</span>
                  </div>
                </div>

                {/* Helper */}
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#2D6EF5]" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Helper</span>
                    <span className="text-sm font-medium text-gray-900">{tripData.helper}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#2D6EF5]" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Start Time</span>
                    <span className="text-sm font-medium text-gray-900">{tripData.startTime}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#2D6EF5]" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Estimated Completion</span>
                    <span className="text-sm font-medium text-gray-900">{tripData.estimatedCompletion}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-[#2D6EF5]" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pickup OTP</span>
                    <span className="text-sm font-bold text-gray-900">{tripData.pickupOTP}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-[#2D6EF5]" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Return OTP</span>
                    <span className="text-sm font-bold text-gray-900">{tripData.returnOTP}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trip Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-base font-bold text-gray-900 mb-4">Trip Summary</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <IndianRupee className="w-5 h-5 text-[#2D6EF5]" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Sale Value</span>
                    <span className="text-sm font-medium text-gray-900">₹ {tripData.totalSaleValue.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <IndianRupee className="w-5 h-5 text-[#2D6EF5]" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Delivered Value</span>
                    <span className="text-sm font-medium text-gray-900">₹ {tripData.totalDeliveredValue.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <IndianRupee className="w-5 h-5 text-[#2D6EF5]" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Return Value</span>
                    <span className="text-sm font-medium text-gray-900">₹ {tripData.totalReturnValue.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#2D6EF5]" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Delivery Points</span>
                    <span className="text-sm font-medium text-gray-900">{tripData.totalDeliveryPoints}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-[#2D6EF5]" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-gray-600">COD Collection</span>
                    <span className="text-sm font-medium text-gray-900">₹ {tripData.codCollection}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-[#2D6EF5]" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Digital Collection</span>
                    <span className="text-sm font-medium text-gray-900">₹ {tripData.digitalCollection}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-[#2D6EF5]" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Net Collection</span>
                    <span className="text-sm font-medium text-gray-900">₹ {tripData.netCollection}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Progress */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-base font-bold text-gray-900 mb-4">Delivery Progress</h2>
              <div className="space-y-4">
                {tripData.deliveryPoints.map((point, index) => (
                  <div key={point.id} className="relative">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-[#FFA500] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        {index < tripData.deliveryPoints.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-300 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <h3 className="text-sm font-bold text-gray-900 mb-1">{point.storeName}</h3>
                        <p className="text-xs text-gray-600 mb-2">{point.address}</p>
                        <p className="text-xs text-gray-500 mb-2">{point.timestamp}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-gray-600">OTP:</span>
                          <Badge className="bg-[#DBEAFE] text-[#1E40AF] hover:bg-[#DBEAFE] rounded px-2 py-0.5 text-xs font-bold">
                            {point.otp}
                          </Badge>
                        </div>
                        <Badge className={`${getStatusColor(point.status)} rounded px-2 py-0.5 text-xs font-medium`}>
                          {point.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customer-wise' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500">Customer Wise Orders content will be displayed here</p>
          </div>
        )}

        {activeTab === 'ordered-products' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500">Ordered Products content will be displayed here</p>
          </div>
        )}

        {activeTab === 'return-products' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500">Return Products content will be displayed here</p>
          </div>
        )}
      </div>
    </div>
  );
}
