import { useState } from 'react';
import { Search, ChevronDown, Pencil, Trash2, Users, Hash, Building2, Phone, MapPin, Package, Clock, Tag, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { UpdateCustomerDialog } from '../UpdateCustomerDialog';
import { Pagination } from '../Pagination';
import { useData } from '../../context/DataContext';
import type { Customer } from '../../context/DataContext';

export function CustomersPage() {
  const { customers, deleteCustomer } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All Sources');
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  // Filter customers based on search query and source
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.mobile.includes(searchQuery);
    
    const matchesSource = sourceFilter === 'All Sources' || customer.source === sourceFilter;
    
    return matchesSearch && matchesSource;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowUpdateDialog(true);
  };

  const handleDelete = (customer: Customer) => {
    if (confirm(`Are you sure you want to delete ${customer.businessName}?`)) {
      deleteCustomer(customer.id);
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-5 h-5 text-[#2D6EF5]" />
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        </div>
        <p className="text-sm text-gray-600">Manage customer location data and sync with orders.</p>
      </div>

      {/* Filters */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, mobile, UID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D6EF5] focus:border-transparent"
            />
          </div>

          {/* Source Filter */}
          <div className="relative">
            <button
              className="h-9 px-4 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2D6EF5] focus:border-transparent flex items-center gap-2"
              onClick={() => setShowSourceDropdown(!showSourceDropdown)}
            >
              {sourceFilter}
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showSourceDropdown && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                <button
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  onClick={() => {
                    setSourceFilter('All Sources');
                    setShowSourceDropdown(false);
                  }}
                >
                  All Sources
                </button>
                <button
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  onClick={() => {
                    setSourceFilter('System');
                    setShowSourceDropdown(false);
                  }}
                >
                  System
                </button>
                <button
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  onClick={() => {
                    setSourceFilter('Manual');
                    setShowSourceDropdown(false);
                  }}
                >
                  Manual
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Container - matches OrdersTable structure */}
      <div className="flex-1 min-h-0 px-6 py-4">
        <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col h-full">
          <div className="overflow-x-auto flex-1 min-h-0 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left bg-gray-50">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                      <Hash className="w-4 h-4 text-[#2D6EF5]" />
                      UID
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left bg-gray-50">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                      <Building2 className="w-4 h-4 text-[#2D6EF5]" />
                      Business Name
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left bg-gray-50">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                      <Phone className="w-4 h-4 text-[#2D6EF5]" />
                      Mobile
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left bg-gray-50">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                      <MapPin className="w-4 h-4 text-[#2D6EF5]" />
                      Latitude
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left bg-gray-50">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                      <MapPin className="w-4 h-4 text-[#2D6EF5]" />
                      Longitude
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left bg-gray-50">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                      <Package className="w-4 h-4 text-[#2D6EF5]" />
                      Bulk
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left bg-gray-50">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                      <Clock className="w-4 h-4 text-[#2D6EF5]" />
                      Last Updated
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left bg-gray-50">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                      <Tag className="w-4 h-4 text-[#2D6EF5]" />
                      Source
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left bg-gray-50">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                      <Settings className="w-4 h-4 text-[#2D6EF5]" />
                      Actions
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900">{customer.uid}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{customer.businessName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{customer.mobile}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{customer.latitude}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{customer.longitude}</td>
                    <td className="px-4 py-3">
                      {customer.bulk ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#FEF3C7] text-[#92400E]">
                          Yes
                        </span>
                      ) : (
                        <span className="text-sm text-gray-600">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{customer.lastUpdated}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#DBEAFE] text-[#1E40AF]">
                        {customer.source}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(customer)}
                          className="p-1 text-gray-400 hover:text-[#2D6EF5] transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(customer)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer - Fixed at bottom of table */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredCustomers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(newItemsPerPage) => {
              setItemsPerPage(newItemsPerPage);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Update Customer Dialog */}
      {showUpdateDialog && selectedCustomer && (
        <UpdateCustomerDialog
          customer={selectedCustomer}
          onClose={() => setShowUpdateDialog(false)}
        />
      )}
    </div>
  );
}