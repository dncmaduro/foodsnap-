import { Badge } from '@/components/ui/badge'

export type OrderStatus =
  | 'Pending'
  | 'Assigned'
  | 'In Transit'
  | 'Delivered'
  | 'Canceled By Shipper'

interface OrderStatusBadgeProps {
  status: OrderStatus
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  Pending: {
    label: 'Chờ nhận',
    className: 'bg-gray-400 text-white',
  },
  Assigned: {
    label: 'Đã nhận',
    className: 'bg-yellow-500 text-white',
  },
  'In Transit': {
    label: 'Đang giao',
    className: 'bg-blue-500 text-white',
  },
  Delivered: {
    label: 'Hoàn thành',
    className: 'bg-green-500 text-white',
  },
  'Canceled By Shipper': {
    label: 'Shipper hủy',
    className: 'bg-red-500 text-white',
  },
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const config = statusConfig[status]

  return <Badge className={config.className}>{config.label}</Badge>
}
