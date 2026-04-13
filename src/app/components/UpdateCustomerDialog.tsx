import { useState } from 'react';
import { X, ChevronDown, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { useData } from '../context/DataContext';
import type { Customer } from '../context/DataContext';
import { toast } from 'sonner';

interface UpdateCustomerDialogProps {
  customer: Customer;
  onClose: () => void;
}

export function UpdateCustomerDialog({ customer, onClose }: UpdateCustomerDialogProps) {
  const { updateCustomer } = useData();
  const [latitude, setLatitude] = useState(customer.latitude.toString());
  const [longitude, setLongitude] = useState(customer.longitude.toString());
  const [address, setAddress] = useState(customer.address || '');
  const [isBulk, setIsBulk] = useState(customer.bulk ? 'Yes' : 'No');
  const [showBulkDropdown, setShowBulkDropdown] = useState(false);

  const handleSave = () => {
    // Validate inputs
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      toast.error('Please enter valid latitude and longitude values');
      return;
    }

    updateCustomer(customer.id, {
      latitude: lat,
      longitude: lng,
      address,
      bulk: isBulk === 'Yes',
      lastUpdated: new Date().toLocaleDateString('en-GB').replace(/\//g, '/').slice(0, 8),
    });

    toast.success('Customer location updated successfully');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <MapPin className="w-5 h-5 text-[#2D6EF5]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Update Customer Location</h2>
              <div className="mt-1 text-sm text-gray-600">
                <div className="font-medium">{customer.businessName}</div>
                <div className="text-gray-500">UID: {customer.uid}</div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Latitude and Longitude */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D6EF5] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D6EF5] focus:border-transparent"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D6EF5] focus:border-transparent"
            />
          </div>

          {/* Bulk Order Customer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bulk Order Customer
            </label>
            <div className="relative">
              <button
                onClick={() => setShowBulkDropdown(!showBulkDropdown)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2D6EF5] focus:border-transparent flex items-center justify-between"
              >
                <span className="text-gray-900">{isBulk}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {showBulkDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  <button
                    onClick={() => {
                      setIsBulk('No');
                      setShowBulkDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors"
                  >
                    No
                  </button>
                  <button
                    onClick={() => {
                      setIsBulk('Yes');
                      setShowBulkDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors border-t border-gray-100"
                  >
                    Yes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-lg">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#2D6EF5] hover:bg-[#2D6EF5]/90 text-white"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}