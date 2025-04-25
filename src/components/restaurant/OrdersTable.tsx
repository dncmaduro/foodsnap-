
import React from "react";
import { Order, OrderStatus } from "@/pages/RestaurantOrders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface OrdersTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
}

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

export const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onViewDetails }) => {
  return (
    <div className="w-full">
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="font-medium text-left">
                <th className="p-4">Order ID</th>
                <th className="p-4">Order Time</th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium">{order.orderId}</td>
                    <td className="p-4">{formatDate(order.orderTime)}</td>
                    <td className="p-4">{order.customerName}</td>
                    <td className="p-4">${order.totalAmount.toFixed(2)}</td>
                    <td className="p-4">{order.paymentMethod}</td>
                    <td className="p-4">
                      <Badge variant={statusConfig[order.status].variant}>
                        {statusConfig[order.status].label}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onViewDetails(order)}
                        className="flex items-center gap-1"
                      >
                        <Eye size={16} />
                        Details
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-muted-foreground">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
