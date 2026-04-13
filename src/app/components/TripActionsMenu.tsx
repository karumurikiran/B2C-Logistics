import { useState, useRef, useEffect } from 'react';
import { MoreVertical, X, MapPin, Eye, Download, FileText, ChevronRight } from 'lucide-react';

interface TripActionsMenuProps {
  onCancel: () => void;
  onMapView: () => void;
  onViewDetails: () => void;
  tripStatus: string;
}

export function TripActionsMenu({ onCancel, onMapView, onViewDetails, tripStatus }: TripActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsDownloadOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleDownload = (type: string) => {
    console.log(`Downloading ${type}`);
    setIsOpen(false);
    setIsDownloadOpen(false);
  };

  const isCancelled = tripStatus === 'Cancelled';

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={buttonRef}
        onClick={() => {
          setIsOpen(!isOpen);
          setIsDownloadOpen(false);
        }}
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        aria-label="More actions"
      >
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {/* Cancel */}
          <button
            onClick={() => {
              if (!isCancelled) {
                onCancel();
                setIsOpen(false);
              }
            }}
            disabled={isCancelled}
            className={`w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors ${
              isCancelled
                ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
            }`}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              isCancelled ? 'bg-gray-300' : 'bg-red-500'
            }`}>
              <X className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm">Cancel</span>
          </button>

          {/* Map view */}
          <button
            onClick={() => {
              onMapView();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2.5 flex items-center gap-3 text-left text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <MapPin className="w-5 h-5 text-[#2D6EF5] fill-[#2D6EF5]" />
            <span className="text-sm">Map view</span>
          </button>

          {/* View details */}
          <button
            onClick={() => {
              onViewDetails();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2.5 flex items-center gap-3 text-left text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <Eye className="w-5 h-5 text-[#2D6EF5]" />
            <span className="text-sm">View details</span>
          </button>

          {/* Download with submenu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDownloadOpen(!isDownloadOpen);
              }}
              className="w-full px-4 py-2.5 flex items-center gap-3 text-left text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <Download className="w-5 h-5 text-green-600" />
              <span className="text-sm flex-1">Download</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${isDownloadOpen ? 'rotate-90' : ''}`} />
            </button>

            {/* Download Submenu - positioned to the left */}
            {isDownloadOpen && (
              <div className="absolute right-full top-0 mr-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                <button
                  onClick={() => handleDownload('Consolidated Loading Sheet')}
                  className="w-full px-4 py-2.5 flex items-center gap-3 text-left text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Consolidated Loading Sheet</span>
                </button>

                <button
                  onClick={() => handleDownload('Pickup List')}
                  className="w-full px-4 py-2.5 flex items-center gap-3 text-left text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Pickup List</span>
                </button>

                <button
                  onClick={() => handleDownload('Beatwise Loading Sheet')}
                  className="w-full px-4 py-2.5 flex items-center gap-3 text-left text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Beatwise Loading Sheet</span>
                </button>

                <button
                  onClick={() => handleDownload('Customer Wise Pickup List')}
                  className="w-full px-4 py-2.5 flex items-center gap-3 text-left text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Customer Wise Pickup List</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}