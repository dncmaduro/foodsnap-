
import { Badge } from "@/components/ui/badge";

type OrderStatus = 
  | "new" 
  | "processing" 
  | "in_delivery" 
  | "completed" 
  | "canceled";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig = {
  new: {
    label: "Mới",
    variant: "default" as const,
    className: "bg-blue-500 hover:bg-blue-600"
  },
  processing: {
    label: "Đang xử lý",
    variant: "default" as const,
    className: "bg-yellow-500 hover:bg-yellow-600"
  },
  in_delivery: {
    label: "Đang giao",
    variant: "default" as const,
    className: "bg-purple-500 hover:bg-purple-600"
  },
  completed: {
    label: "Hoàn thành",
    variant: "default" as const,
    className: "bg-green-500 hover:bg-green-600"
  },
  canceled: {
    label: "Đã hủy",
    variant: "default" as const,
    className: "bg-red-500 hover:bg-red-600"
  }
};

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

export type { OrderStatus };
