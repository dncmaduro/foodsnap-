
import React from "react";
import { Order, OrderStatus } from "@/pages/RestaurantOrders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface OrderDetailsModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "processing", label: "Processing" },
  { value: "in-delivery", label: "In Delivery" },
  { value: "completed", label: "Completed" },
  { value: "canceled", label: "Canceled" },
];

// Status badge configuration
const statusConfig: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  "new": { label: "New", variant: "default" },
  "processing": { label: "Processing", variant: "secondary" },
  "in-delivery": { label: "In Delivery", variant: "outline" },
  "completed": { label: "Completed", variant: "default" },
  "canceled": { label: "Canceled", variant: "destructive" },
};

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const handleStatusUpdate = (newStatus: OrderStatus) => {
    // Implement status update logic
    console.log(`Updating order ${order.id} status to ${newStatus}`);
  };

  // Calculate order subtotal (without delivery fee)
  const subtotal = order.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  
  // Assume delivery fee is the difference between total and subtotal
  const deliveryFee = order.totalAmount - subtotal;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Order Details</DialogTitle>
        </DialogHeader>

        {/* General Info Block */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-medium">{order.orderId}</p>
            <p className="text-sm text-gray-500 mt-2">Ordered at</p>
            <p>{formatDate(order.orderTime)}</p>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Status:</p>
              <Badge variant={statusConfig[order.status].variant}>
                {statusConfig[order.status].label}
              </Badge>
            </div>
            
            <select
              className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              value={order.status}
              onChange={(e) => handleStatusUpdate(e.target.value as OrderStatus)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Customer Info Block */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p>{order.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p>{order.customerPhone}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Delivery Address</p>
              <p>{order.deliveryAddress}</p>
            </div>
            
            {order.specialNotes && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Special Notes</p>
                <p className="bg-gray-50 p-2 rounded-md">{order.specialNotes}</p>
              </div>
            )}
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Order Items Block */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Order Items</h3>
          <div className="rounded-md border overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Item</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.note && (
                          <p className="text-xs text-gray-500">{item.note}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-right">${item.unitPrice.toFixed(2)}</td>
                    <td className="p-3 text-right">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Order Summary */}
          <div className="flex flex-col items-end gap-2 text-sm">
            <div className="flex w-full max-w-[300px] justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex w-full max-w-[300px] justify-between">
              <span>Delivery Fee:</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex w-full max-w-[300px] justify-between font-bold pt-2 border-t">
              <span>Total:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex w-full max-w-[300px] justify-between text-xs text-gray-500">
              <span>Payment Method:</span>
              <span>{order.paymentMethod}</span>
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Status History Timeline */}
        <div>
          <h3 className="text-lg font-medium mb-3">Status History</h3>
          <div className="space-y-4">
            {order.statusHistory.map((history, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                <div>
                  <p className="font-medium">
                    Status changed to <span className="capitalize">{history.status.replace('-', ' ')}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(history.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            Update Status
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
