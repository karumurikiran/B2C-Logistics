import { useState, useRef } from 'react';
import { ArrowLeft, Upload, FileSpreadsheet, FileText, Grid3x3 } from 'lucide-react';
import { Button } from '../ui/button';

interface CreateOrderPageProps {
  onBack: () => void;
}

type FileType = 'excel' | 'pdf' | 'manual';

export function CreateOrderPage({ onBack }: CreateOrderPageProps) {
  const [selectedFileType, setSelectedFileType] = useState<FileType>('excel');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSave = () => {
    if (selectedFileType === 'excel' || selectedFileType === 'pdf') {
      if (uploadedFile) {
        console.log('Uploading file:', uploadedFile);
        // Handle file upload logic here
        alert(`File "${uploadedFile.name}" uploaded successfully!`);
        onBack();
      } else {
        alert('Please upload a file first');
      }
    } else {
      // Manual entry - navigate to manual entry form
      alert('Manual entry form would open here');
    }
  };

  const handleDownloadExcelSample = () => {
    // Create a sample CSV file
    const csvContent = "Order Date,Invoice Number,Retailer Name,Order Type,Sales Person,Beat Name,Mobile Number,Status\n" +
      "20-02-2026,INV001,Sample Store,Sales,John Doe,Beat 1,9876543210,Pending\n";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'order_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadCSVSample = () => {
    handleDownloadExcelSample();
  };

  const handleDownloadPDFSample = () => {
    alert('PDF sample download would start here');
  };

  const handleManualEntry = () => {
    alert('Manual entry form would open here');
  };

  return (
    <div className="px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create Order</h1>
      </div>

      {/* Select File Type */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Select File Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Excel/CSV Option */}
          <div
            onClick={() => setSelectedFileType('excel')}
            className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedFileType === 'excel'
                ? 'border-[#2D6EF5] bg-[#EFF6FF]'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {selectedFileType === 'excel' && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-[#2D6EF5] rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#2D6EF5] rounded flex items-center justify-center flex-shrink-0">
                <FileSpreadsheet className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Excel Sheet / CSV</h3>
                <p className="text-sm text-gray-600 mb-3">Upload orders in .xlsx or .csv format</p>
                <div className="space-y-1">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadExcelSample();
                    }}
                    className="flex items-center gap-1 text-sm text-[#2D6EF5] hover:underline cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Download Excel Sample
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadCSVSample();
                    }}
                    className="flex items-center gap-1 text-sm text-[#2D6EF5] hover:underline cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    Download CSV Sample
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PDF Option */}
          <div
            onClick={() => setSelectedFileType('pdf')}
            className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedFileType === 'pdf'
                ? 'border-[#2D6EF5] bg-[#EFF6FF]'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {selectedFileType === 'pdf' && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-[#2D6EF5] rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-400 rounded flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">PDF Document</h3>
                <p className="text-sm text-gray-600 mb-3">Upload orders in PDF format</p>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadPDFSample();
                  }}
                  className="flex items-center gap-1 text-sm text-[#2D6EF5] hover:underline cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  Download Sample
                </div>
              </div>
            </div>
          </div>

          {/* Manual Entry Option */}
          <div
            onClick={() => setSelectedFileType('manual')}
            className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedFileType === 'manual'
                ? 'border-[#2D6EF5] bg-[#EFF6FF]'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {selectedFileType === 'manual' && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-[#2D6EF5] rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-400 rounded flex items-center justify-center flex-shrink-0">
                <Grid3x3 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Manual Entry</h3>
                <p className="text-sm text-gray-600 mb-3">Contact support team to enable this option</p>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleManualEntry();
                  }}
                  className="flex items-center gap-1 text-sm text-[#2D6EF5] hover:underline cursor-pointer"
                >
                  <Grid3x3 className="w-4 h-4" />
                  Add order manually
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload File Section */}
      {(selectedFileType === 'excel' || selectedFileType === 'pdf') && (
        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Upload File</h2>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 transition-colors ${
              isDragging
                ? 'border-[#2D6EF5] bg-[#EFF6FF]'
                : 'border-gray-300 bg-white'
            }`}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Drag & Drop</h3>
              <p className="text-sm text-gray-600 mb-4">or</p>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInputChange}
                accept={selectedFileType === 'excel' ? '.xlsx,.xls,.csv' : '.pdf'}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleBrowseClick}
                className="mb-4"
              >
                Browse Files
              </Button>
              {uploadedFile && (
                <p className="text-sm text-green-600 mt-2">
                  Selected: {uploadedFile.name}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onBack}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-[#2D6EF5] hover:bg-[#2557D6]">
          Save
        </Button>
      </div>
    </div>
  );
}