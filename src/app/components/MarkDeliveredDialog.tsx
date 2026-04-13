import { CheckCircle, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

interface Order {
  id: string;
  invoiceNumber: string;
  retailerName: string;
}

interface MarkDeliveredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkDelivered: () => void;
  order: Order | null;
}

export function MarkDeliveredDialog({ open, onOpenChange, onMarkDelivered, order }: MarkDeliveredDialogProps) {
  const handleConfirm = () => {
    onMarkDelivered();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 bg-white">
        <DialogTitle className="sr-only">Mark Order as Delivered</DialogTitle>
        <DialogDescription className="sr-only">Confirm marking this order as delivered</DialogDescription>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D1FAE5] flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[#10B981]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Mark as Delivered</h2>
              <p className="text-sm text-gray-500">Confirm delivery completion</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to mark this order as delivered?
          </p>
          
          {order && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-600">Invoice Number:</span>
                <span className="text-sm font-medium text-gray-900">{order.invoiceNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-600">Retailer Name:</span>
                <span className="text-sm font-medium text-gray-900">{order.retailerName}</span>
              </div>
            </div>
          )}

          <p className="text-sm text-gray-500 mt-4">
            This action will update the order status to "Delivered" and cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white"
          >
            Confirm Delivery
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}