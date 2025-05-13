
import { useState } from "react";
import { format } from "date-fns";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderStatusBadge, OrderStatus } from "./OrderStatusBadge";
import { OrderType } from "./OrderManagement"; 
import { MessageSquare, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface OrderDetailDialogProps {
  order: OrderType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void;
}

export function OrderDetailDialog({
  order,
  open,
  onOpenChange,
  onStatusUpdate
}: OrderDetailDialogProps) {
  if (!order) return null;

  // Calculate subtotal
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  // Calculate total
  const total = subtotal + order.deliveryFee;
  
  // Get next logical status based on current status
  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case "new": return "processing";
      case "processing": return "in_delivery";
      case "in_delivery": return "completed";
      default: return null; // No next status for completed or canceled
    }
  };
  
  // Handle direct status update to next logical status
  const handleNextStatus = () => {
    const nextStatus = getNextStatus(order.status);
    if (nextStatus) {
      onStatusUpdate(order.id, nextStatus);
      toast({
        title: "Trạng thái đơn hàng đã được cập nhật",
        description: `Đơn hàng #${order.id} đã được chuyển sang trạng thái ${getStatusLabel(nextStatus)}.`
      });
      // Close the dialog automatically
      onOpenChange(false);
    }
  };
  
  // Handle cancel order
  const handleCancelOrder = () => {
    if (order.status === "new") {
      onStatusUpdate(order.id, "canceled");
      toast({
        title: "Đơn hàng đã bị hủy",
        description: `Đơn hàng #${order.id} đã được hủy.`
      });
      // Close the dialog automatically
      onOpenChange(false);
    }
  };
  
  // Get status label
  const getStatusLabel = (status: OrderStatus): string => {
    switch (status) {
      case 'new': return 'Tiếp nhận';
      case 'processing': return 'Chuẩn bị món';
      case 'in_delivery': return 'Giao hàng';
      case 'completed': return 'Hoàn thành';
      case 'canceled': return 'Hủy đơn';
      default: return '';
    }
  };
  
  // Get next status button info
  const getNextStatusButton = () => {
    const nextStatus = getNextStatus(order.status);
    
    if (!nextStatus) {
      return null; // No next status button for completed or canceled orders
    }
    
    // For new orders, we show a different button style
    if (order.status === "new") {
      return (
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={handleNextStatus}
        >
          {getStatusLabel(nextStatus)}
        </Button>
      );
    }
    
    return (
      <Button onClick={handleNextStatus}>
        Chuyển sang {getStatusLabel(nextStatus)}
      </Button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Chi tiết đơn hàng #{order.id}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* General Info Block */}
            <div className="bg-muted/50 p-4 rounded-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <h3 className="font-medium">Đơn hàng #{order.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(order.orderTime), "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <OrderStatusBadge status={order.status} />
                  
                  {/* Show appropriate action buttons based on status */}
                  {order.status !== "completed" && order.status !== "canceled" && (
                    <div className="flex gap-2">
                      {getNextStatusButton()}
                      
                      {order.status === "new" && (
                        <Button 
                          variant="destructive" 
                          onClick={handleCancelOrder}
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Hủy đơn
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Customer Info Block */}
            <div>
              <h3 className="font-semibold mb-3">Thông tin khách hàng</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tên khách hàng</p>
                  <p className="font-medium">{order.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số điện thoại</p>
                  <p className="font-medium">{order.customer.phone}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-muted-foreground">Địa chỉ giao hàng</p>
                  <p className="font-medium">{order.customer.address}</p>
                </div>
                {order.customer.notes && (
                  <div className="sm:col-span-2">
                    <p className="text-sm text-muted-foreground">Ghi chú</p>
                    <p className="font-medium">{order.customer.notes}</p>
                  </div>
                )}
              </div>
            </div>
            
            <Separator />
            
            {/* Order Items Block */}
            <div>
              <h3 className="font-semibold mb-3">Chi tiết món ăn</h3>
              <div className="space-y-4">
                {/* Table header */}
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground py-2 border-b">
                  <div className="col-span-5">Món ăn</div>
                  <div className="col-span-1 text-center">SL</div>
                  <div className="col-span-3">Ghi chú</div>
                  <div className="col-span-1 text-right">Đơn giá</div>
                  <div className="col-span-2 text-right">Thành tiền</div>
                </div>
                
                {/* Table body */}
                {order.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 py-2 border-b text-sm">
                    <div className="col-span-5 font-medium">{item.name}</div>
                    <div className="col-span-1 text-center">{item.quantity}</div>
                    <div className="col-span-3">
                      {item.note ? (
                        <div className="flex items-start">
                          <MessageSquare className="h-4 w-4 mr-1 mt-0.5 text-gray-400 flex-shrink-0" />
                          <span className="text-muted-foreground text-xs line-clamp-2">
                            {item.note}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                    <div className="col-span-1 text-right">
                      {(item.unitPrice / 1000).toFixed(0)}K
                    </div>
                    <div className="col-span-2 text-right font-medium">
                      {((item.quantity * item.unitPrice) / 1000).toFixed(0)}K
                    </div>
                  </div>
                ))}
                
                {/* Summary */}
                <div className="pt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tổng tiền món ăn</span>
                    <span>{(subtotal / 1000).toFixed(0)}K đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phí giao hàng</span>
                    <span>{(order.deliveryFee / 1000).toFixed(0)}K đ</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng</span>
                    <span className="text-foodsnap-orange">
                      {(total / 1000).toFixed(0)}K đ
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phương thức thanh toán</span>
                    <span className="font-medium">{order.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Status History Timeline */}
            <div>
              <h3 className="font-semibold mb-3">Lịch sử trạng thái</h3>
              <div className="space-y-4">
                {order.statusHistory.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1 w-3 h-3 rounded-full bg-primary flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <p className="font-medium">{item.status}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(item.timestamp), "dd/MM/yyyy HH:mm")}
                        </p>
                      </div>
                      {item.note && (
                        <p className="text-sm text-muted-foreground mt-1">{item.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
