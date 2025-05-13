
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { OrderStatus } from "./OrderStatusBadge";
import { toast } from "@/components/ui/use-toast";
import { AlertTriangle } from "lucide-react";

interface StatusUpdateDialogProps {
  orderId: string;
  currentStatus: OrderStatus;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void;
}

export function StatusUpdateDialog({
  orderId,
  currentStatus,
  open,
  onOpenChange,
  onStatusUpdate
}: StatusUpdateDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);
  const [showWarning, setShowWarning] = useState(false);

  // Get available status options based on current status
  const getAvailableStatuses = (): OrderStatus[] => {
    // For "new" orders, they can go to any status (processing, canceled)
    if (currentStatus === "new") {
      return ["new", "processing", "canceled"];
    }
    
    // For "processing" orders, they can't go back to "new" 
    // but can go forward or be canceled
    if (currentStatus === "processing") {
      return ["processing", "in_delivery", "canceled"];
    }
    
    // For "in_delivery" orders, they can't go back but can complete or cancel
    if (currentStatus === "in_delivery") {
      return ["in_delivery", "completed", "canceled"];
    }
    
    // For "completed" or "canceled" orders, status can't be changed
    return [currentStatus];
  };
  
  const availableStatuses = getAvailableStatuses();
  
  // Reset selected status when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedStatus(currentStatus);
      setShowWarning(false);
    }
  }, [open, currentStatus]);

  const handleStatusChange = (value: string) => {
    const newStatus = value as OrderStatus;
    setSelectedStatus(newStatus);
    
    // Show warning if skipping steps or going backwards
    if (
      (currentStatus === "new" && newStatus === "in_delivery") ||
      (currentStatus === "new" && newStatus === "completed") ||
      (currentStatus === "processing" && newStatus === "completed") ||
      (currentStatus === "in_delivery" && newStatus === "processing") ||
      (currentStatus === "in_delivery" && newStatus === "new") ||
      (currentStatus === "processing" && newStatus === "new")
    ) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  };

  const handleSubmit = () => {
    if (selectedStatus !== currentStatus) {
      onStatusUpdate(orderId, selectedStatus);
      toast({
        title: "Trạng thái đơn hàng đã được cập nhật",
        description: `Đơn hàng #${orderId} đã được cập nhật trạng thái.`
      });
    }
    onOpenChange(false);
  };

  // Check if status is disabled based on flow rules
  const isStatusDisabled = (status: OrderStatus): boolean => {
    return !availableStatuses.includes(status);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái đơn hàng #{orderId}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup defaultValue={currentStatus} value={selectedStatus} onValueChange={handleStatusChange}>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="new" id="new" disabled={isStatusDisabled("new")} />
              <Label htmlFor="new" className={`font-medium ${isStatusDisabled("new") ? "text-gray-400" : ""}`}>Mới</Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="processing" id="processing" disabled={isStatusDisabled("processing")} />
              <Label htmlFor="processing" className={`font-medium ${isStatusDisabled("processing") ? "text-gray-400" : ""}`}>Đang xử lý</Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="in_delivery" id="in_delivery" disabled={isStatusDisabled("in_delivery")} />
              <Label htmlFor="in_delivery" className={`font-medium ${isStatusDisabled("in_delivery") ? "text-gray-400" : ""}`}>Đang giao</Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="completed" id="completed" disabled={isStatusDisabled("completed")} />
              <Label htmlFor="completed" className={`font-medium ${isStatusDisabled("completed") ? "text-gray-400" : ""}`}>Hoàn thành</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="canceled" id="canceled" disabled={isStatusDisabled("canceled")} />
              <Label htmlFor="canceled" className={`font-medium ${isStatusDisabled("canceled") ? "text-gray-400" : ""}`}>Đã hủy</Label>
            </div>
          </RadioGroup>
          
          {showWarning && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Lưu ý về trạng thái đơn hàng</p>
                <p className="text-sm mt-1">
                  Việc thay đổi trạng thái không theo thứ tự có thể ảnh hưởng tới trải nghiệm của khách hàng.
                </p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Cập nhật
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
