import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';

interface SelfLogisticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SelfLogisticsDialog({
  open,
  onOpenChange,
}: SelfLogisticsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-6">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-[28px] font-semibold text-left">
            Contact Customer Service
          </DialogTitle>
          <DialogDescription className="text-base text-gray-700 text-left">
            Please contact our customer service team for support with self-logistics functionality.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end pt-6">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-[#2D6EF5] hover:bg-[#2557D6] px-8 h-10 text-white font-medium"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}