import { useState } from 'react';
import { FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function ReportsPage() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleClearFilters = () => {
    setFromDate('');
    setToDate('');
  };

  const handleDownload = () => {
    // Download functionality would go here
    console.log('Downloading report from', fromDate, 'to', toDate);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-5 h-5 text-[#2D6EF5]" />
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        </div>
        <p className="text-sm text-gray-600">
          Generate and download performance reports for your logistics operations.
        </p>
      </div>

      {/* Page Content */}
      <div className="flex-1 min-h-0 px-6 py-4">
        {/* Performance Report Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Performance Report</h2>
          <p className="text-sm text-gray-600 mb-6">Select a date range to generate your report</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>
              <Input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                placeholder="dd/mm/yyyy"
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </label>
              <Input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                placeholder="dd/mm/yyyy"
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleClearFilters}
              className="px-6"
            >
              Clear Filters
            </Button>
            <Button 
              onClick={handleDownload}
              className="px-6 bg-[#2D6EF5] hover:bg-[#2557D6]"
            >
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}