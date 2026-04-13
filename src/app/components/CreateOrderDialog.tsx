import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface CreateOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateOrder: (order: any) => void;
}

export function CreateOrderDialog({ open, onOpenChange, onCreateOrder }: CreateOrderDialogProps) {
  const [formData, setFormData] = useState({
    retailerName: '',
    mobileNumber: '',
    invoiceNumber: '',
    orderType: 'Sales',
    salesPerson: '',
    beatName: '',
    status: 'Pending',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newOrder = {
      id: Date.now().toString(),
      createdDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).replace(/\//g, '-'),
      orderDate: 'N/A',
      invoiceNumber: formData.invoiceNumber || `INV-${Date.now()}`,
      retailerName: formData.retailerName,
      orderType: formData.orderType,
      salesPerson: formData.salesPerson,
      beatName: formData.beatName,
      mobileNumber: formData.mobileNumber,
      status: formData.status,
      tripNumber: '-',
    };

    onCreateOrder(newOrder);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      retailerName: '',
      mobileNumber: '',
      invoiceNumber: '',
      orderType: 'Sales',
      salesPerson: '',
      beatName: '',
      status: 'Pending',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="retailer">Retailer Name</Label>
              <Input
                id="retailer"
                value={formData.retailerName}
                onChange={(e) => setFormData({ ...formData, retailerName: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="invoice">Invoice Number (Optional)</Label>
              <Input
                id="invoice"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="orderType">Order Type</Label>
              <Select
                value={formData.orderType}
                onValueChange={(value) => setFormData({ ...formData, orderType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Digital">Digital</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="salesPerson">Sales Person</Label>
              <Input
                id="salesPerson"
                value={formData.salesPerson}
                onChange={(e) => setFormData({ ...formData, salesPerson: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="beatName">Beat Name</Label>
              <Input
                id="beatName"
                value={formData.beatName}
                onChange={(e) => setFormData({ ...formData, beatName: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Ready For Planning">Ready For Planning</SelectItem>
                  <SelectItem value="Trip Assigned">Trip Assigned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Order</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}