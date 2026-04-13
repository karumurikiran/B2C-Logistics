import { useState } from 'react';
import { Settings as SettingsIcon, User, Truck, List, CreditCard, Users, Clock, CalendarX, Plus, Trash2 } from 'lucide-react';
import { Input } from '../ui/input';

const warehouseAddresses = [
  {
    id: 1,
    name: 'Big C Mobiles',
    address: 'Madhapur Rd, opp Petrol Bunk, Megha Hills, Sri Sai Nagar, Madhapur, Serilingampalle, Hyderabad, Telangana, Hyderabad - 500081',
    isDefault: true,
  },
  {
    id: 2,
    name: '676 Prosacco Divide',
    address: 'Apt. 848, Hyderabad - 500032',
    isDefault: false,
  },
  {
    id: 3,
    name: 'hyd',
    address: 'hyd, hyd - 500072',
    isDefault: false,
  },
  {
    id: 4,
    name: 'PS 2 BLR Handpickd',
    address: 'XPM6+MC4, NCPR Industrial Layout, Doddanakundi Industrial Area 2, Seetharampalya, Hoodi, Bengaluru - 560048',
    isDefault: false,
  },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [addresses, setAddresses] = useState(warehouseAddresses);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'delivery', label: 'Delivery', icon: Truck },
    { id: 'category', label: 'Category Sequence', icon: List },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'users', label: 'Users & Permissions', icon: Users },
  ];

  const handleSetDefault = (id: number) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const handleDelete = (id: number) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-2 mb-1">
          <SettingsIcon className="w-5 h-5 text-[#2D6EF5]" />
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
        <p className="text-sm text-gray-600">
          Customize your preferences, manage account details, and configure app options.
        </p>
      </div>

      {/* Page Content */}
      <div className="px-6 py-4">
          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex gap-6 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap text-sm ${
                      isActive
                        ? 'border-[#2D6EF5] text-[#2D6EF5]'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Two-column layout: left = Business Details + Warehouse Locations, right = Store Timings */}
              <div className="grid grid-cols-2 gap-6 items-start">
                {/* Left column */}
                <div className="space-y-6">
                  {/* Business Details */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Business Details</h2>
                    <p className="text-sm text-gray-500 mb-6">Manage your personal and business information</p>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1.5">Name</label>
                        <Input type="text" defaultValue="Sree Venkateswara" className="w-full" disabled />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1.5">Email Address</label>
                        <Input type="email" defaultValue="deekshith017@gmail.com" className="w-full" disabled />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1.5">Business Name</label>
                        <Input type="text" defaultValue="Sree Venkateswara Traders" className="w-full" disabled />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1.5">Phone Number</label>
                        <Input type="tel" defaultValue="9182399613" className="w-full" disabled />
                      </div>
                    </div>
                  </div>

                  {/* Warehouse Locations */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Warehouse Locations</h2>
                        <p className="text-sm text-gray-500">Manage your warehouse and pickup addresses</p>
                      </div>
                      <button className="flex items-center gap-1.5 px-4 py-2 bg-[#2D6EF5] text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                        <Plus className="w-4 h-4" />
                        Add Address
                      </button>
                    </div>

                    <div className="mt-5 space-y-3">
                      {addresses.map((addr) => (
                        <div key={addr.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900">{addr.name}</p>
                              <p className="text-sm text-gray-500 mt-0.5">{addr.address}</p>
                              {addr.isDefault ? (
                                <span className="inline-block mt-2 px-2.5 py-0.5 bg-blue-50 text-[#2D6EF5] text-xs rounded-full border border-blue-100">
                                  Default Address
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleSetDefault(addr.id)}
                                  className="mt-2 text-sm text-[#2D6EF5] hover:underline"
                                >
                                  Set as Default
                                </button>
                              )}
                            </div>
                            {!addr.isDefault && (
                              <button
                                onClick={() => handleDelete(addr.id)}
                                className="ml-4 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right column: Store Timings */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Store Timings</h2>
                  <p className="text-sm text-gray-500 mb-6">Configure your business operating hours and non-operating days</p>

                  <div className="space-y-4">
                    {/* Business Hours */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-[#2D6EF5]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Business Hours</p>
                          <p className="text-xs text-gray-500">Configure your business operating hours and open days</p>
                        </div>
                      </div>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit
                      </button>
                    </div>

                    {/* Non-Operating Days */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                          <CalendarX className="w-4 h-4 text-red-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Non-Operating Days</p>
                          <p className="text-xs text-gray-500">Manage holidays and other non-operating days</p>
                        </div>
                      </div>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {activeTab !== 'profile' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="text-sm text-gray-600">
                Configure your {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} preferences
              </p>
            </div>
          )}
        </div>
    </div>
  );
}
