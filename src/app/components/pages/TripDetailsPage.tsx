import { useState } from 'react';
import { ChevronLeft, Download, Truck, User, Phone, Users, Clock, MapPin, DollarSign, Package, CreditCard, Pencil, IndianRupee } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

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
  const [showResourceDialog, setShowResourceDialog] = useState(false);
  const [showHelperDialog, setShowHelperDialog] = useState(false);
  
  // Editable trip data
  const [vehicle, setVehicle] = useState('MH01AB1234');
  const [driverName, setDriverName] = useState('Hema');
  const [contactNumber, setContactNumber] = useState('9490290265');
  const [helper, setHelper] = useState('Darrin Cruickshank II');
  
  // Temp state for editing
  const [tempVehicle, setTempVehicle] = useState('');
  const [tempDriver, setTempDriver] = useState('');
  const [tempHelper, setTempHelper] = useState('');

  // Mock data - in real app this would come from API
  const tripData: TripDetailsData = {
    tripNumber: 'Q-20260224143505-JZOW',
    provider: 'Qwipo Logistics',
    vehicle: vehicle,
    driverName: driverName,
    contactNumber: contactNumber,
    helper: helper,
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

  // Mock dropdown data
  const vehicles = [
    { id: 'MH01AB1234', name: 'MH01AB1234', capacity: '500 kg' },
    { id: 'MH02CD5678', name: 'MH02CD5678', capacity: '750 kg' },
    { id: 'DL03EF9012', name: 'DL03EF9012', capacity: '1000 kg' },
  ];

  const drivers = [
    { id: '1', name: 'Hema', contact: '9490290265' },
    { id: '2', name: 'Rajesh Kumar', contact: '9876543210' },
    { id: '3', name: 'Priya Singh', contact: '9123456789' },
  ];

  const helpers = [
    { id: '1', name: 'Darrin Cruickshank II' },
    { id: '2', name: 'John Doe' },
    { id: '3', name: 'Jane Smith' },
  ];

  // Get current vehicle capacity
  const currentVehicleCapacity = vehicles.find(v => v.name === vehicle)?.capacity || '500 kg';
  const suggestedVehicle = 'MH01AB1234';
  const suggestedVehicleCapacity = '1200 kgs';

  // Handlers
  const handleEditResource = () => {
    setTempVehicle(vehicle);
    setTempDriver(driverName);
    setShowResourceDialog(true);
  };

  const handleUpdateResource = () => {
    setVehicle(tempVehicle);
    setDriverName(tempDriver);
    // Update contact number based on selected driver
    const selectedDriver = drivers.find(d => d.name === tempDriver);
    if (selectedDriver) {
      setContactNumber(selectedDriver.contact);
    }
    setShowResourceDialog(false);
  };

  const handleEditHelper = () => {
    setTempHelper(helper);
    setShowHelperDialog(true);
  };

  const handleUpdateHelper = () => {
    setHelper(tempHelper);
    setShowHelperDialog(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#F9FAFB]">
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
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {activeTab === 'summary' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Route Overview */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-base font-bold text-gray-900 mb-4">Route Overview</h2>
              <div className="space-y-3">
                {/* Suggested Vehicle Tip */}
                <div className="bg-[#EEF2FF] border-l-4 border-[#2D6EF5] rounded px-3 py-2 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#2D6EF5] flex-shrink-0" />
                  <span className="text-xs text-[#2D6EF5]">
                    <span className="font-semibold">Suggested:</span> {suggestedVehicle} ({suggestedVehicleCapacity})
                  </span>
                </div>

                {/* Grouped Vehicle, Driver, and Contact - Editable */}
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-700 uppercase">Resource Details</span>
                    <button
                      onClick={handleEditResource}
                      className="text-[#2D6EF5] hover:text-[#2557D6] transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-[#2D6EF5]" />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-gray-600">Vehicle</span>
                        <span className="text-sm font-medium text-gray-900">{tripData.vehicle}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-[#2D6EF5]" />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-gray-600">Driver Name</span>
                        <span className="text-sm font-medium text-gray-900">{tripData.driverName}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-[#2D6EF5]" />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-gray-600">Contact Number</span>
                        <span className="text-sm font-medium text-gray-900">{tripData.contactNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Helper - Editable */}
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#2D6EF5]" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Helper</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{tripData.helper}</span>
                      <button
                        onClick={handleEditHelper}
                        className="text-[#2D6EF5] hover:text-[#2557D6] transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
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

      {/* Resource Dialog */}
      <Dialog open={showResourceDialog} onOpenChange={setShowResourceDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
            <DialogDescription>
              Update the vehicle and driver details for this trip.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vehicle">Vehicle</Label>
              <Select
                value={tempVehicle}
                onValueChange={setTempVehicle}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.name}>
                      {vehicle.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="driver">Driver</Label>
              <Select
                value={tempDriver}
                onValueChange={setTempDriver}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a driver" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map(driver => (
                    <SelectItem key={driver.id} value={driver.name}>
                      {driver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowResourceDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpdateResource}
              className="bg-[#2D6EF5] hover:bg-[#2557D6]"
            >
              Update Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Helper Dialog */}
      <Dialog open={showHelperDialog} onOpenChange={setShowHelperDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Helper</DialogTitle>
            <DialogDescription>
              Update the helper details for this trip.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="helper">Helper</Label>
              <Select
                value={tempHelper}
                onValueChange={setTempHelper}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a helper" />
                </SelectTrigger>
                <SelectContent>
                  {helpers.map(helper => (
                    <SelectItem key={helper.id} value={helper.name}>
                      {helper.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowHelperDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpdateHelper}
              className="bg-[#2D6EF5] hover:bg-[#2557D6]"
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}