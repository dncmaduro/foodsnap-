
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { OrderStatus } from "./OrderStatusBadge";
import { toast } from "@/components/ui/use-toast";

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

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value as OrderStatus);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái đơn hàng #{orderId}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup defaultValue={currentStatus} onValueChange={handleStatusChange}>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="new" id="new" />
              <Label htmlFor="new" className="font-medium">Mới</Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="processing" id="processing" />
              <Label htmlFor="processing" className="font-medium">Đang xử lý</Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="in_delivery" id="in_delivery" />
              <Label htmlFor="in_delivery" className="font-medium">Đang giao</Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="completed" id="completed" />
              <Label htmlFor="completed" className="font-medium">Hoàn thành</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="canceled" id="canceled" />
              <Label htmlFor="canceled" className="font-medium">Đã hủy</Label>
            </div>
          </RadioGroup>
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
