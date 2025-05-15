import { useState } from 'react'
import { useApiQuery } from '@/hooks/useApi'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { toast } from '@/components/ui/use-toast'
import { OrderDetailResponse } from '@/types/types'

interface OrderManagementProps {
  restaurantId: number
}

const OrderManagement = ({ restaurantId }: OrderManagementProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { data, isLoading, error } = useApiQuery<OrderDetailResponse[]>(
    ['restaurant-orders', String(restaurantId)],
    `/restaurant/${restaurantId}/orders`,
    undefined,
    { enabled: !!restaurantId },
  )

  // PHẢI truy cập data?.data
  const orders = data ?? []
  const totalPages = Math.ceil(orders.length / itemsPerPage)
  const currentOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (isLoading) return <div>Đang tải đơn hàng...</div>
  if (error) return <div>Lỗi tải đơn hàng: {error.message}</div>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h2>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Mã đơn</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Khách</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.map((order) => (
              <TableRow key={order.order_id}>
                <TableCell className="font-medium">{order.order_id}</TableCell>
                <TableCell>{new Date(order.order_at).toLocaleString('vi-VN')}</TableCell>
                <TableCell>{order.user_id}</TableCell>
                <TableCell>{order.total_price?.toLocaleString()}đ</TableCell>
                <TableCell>{order.shipping_status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

export default OrderManagement
