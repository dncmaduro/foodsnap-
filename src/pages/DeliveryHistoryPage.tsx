import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { OrderStatusBadge } from '@/components/OrderManagement/OrderStatusBadge'
import { useIsMobile } from '@/hooks/use-mobile'
import { MapPin, Clock, Wallet } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useApiQuery } from '@/hooks/useApi'
import { format } from 'date-fns'
import { OrderDetailResponse } from '@/types/types'

export default function DeliveryHistoryPage() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const isMobile = useIsMobile()
  const ordersPerPage = 10

  const { data: response } = useApiQuery<OrderDetailResponse[]>(
    ['delivery-history'],
    '/order/history/delivered',
  )

  const deliveries = response ?? []

  // Sort by delivered_at desc
  const sortedDeliveries = [...deliveries].sort(
    (a, b) => new Date(b.delivered_at).getTime() - new Date(a.delivered_at).getTime(),
  )

  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = sortedDeliveries.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(sortedDeliveries.length / ordersPerPage)

  return (
    <div className="container mx-auto px-2 py-4 max-w-6xl">
      <div className="mb-4">
        <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold`}>Lịch sử giao hàng</h1>
        <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mt-1`}>
          Danh sách các đơn hàng bạn đã giao thành công
        </p>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-3 mb-4 pr-2">
          {currentOrders.length === 0 ? (
            <div className="text-center py-8 bg-muted rounded-lg">
              <p className="text-muted-foreground">Bạn chưa có đơn giao hàng nào.</p>
            </div>
          ) : (
            currentOrders.map((order) => (
              <Card key={order.order_id} className="hover:shadow-md transition-shadow">
                <CardHeader className={`${isMobile ? 'p-3' : 'p-4'} border-b`}>
                  <div className="flex justify-between items-center">
                    <CardTitle className={`${isMobile ? 'text-sm' : 'text-base'}`}>
                      #{order.order_id}
                    </CardTitle>
                    <OrderStatusBadge status="Delivered" />
                  </div>
                </CardHeader>
                <CardContent className={`${isMobile ? 'p-3 text-xs' : 'p-4 text-sm'} space-y-2`}>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      {order.delivered_at
                        ? format(new Date(order.delivered_at), 'HH:mm - dd/MM/yyyy')
                        : 'Chưa cập nhật'}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">
                        {order.order_item?.[0]?.menuitem?.restaurant?.name || 'Không rõ'}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {order.order_item?.[0]?.menuitem?.restaurant?.address || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm">Địa chỉ giao hàng:</p>
                      <p className="text-muted-foreground text-xs">{order?.address_id || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Wallet className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="flex justify-between w-full">
                      <span>Tổng tiền thu:</span>
                      <span className="font-medium">{order.total_price.toLocaleString()}đ</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      {totalPages > 1 && (
        <Pagination className="my-2">
          <PaginationContent className={isMobile ? 'gap-0.5' : 'gap-1'}>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={`${
                  currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                } ${isMobile ? 'h-8 text-xs' : ''}`}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index} className={isMobile ? 'hidden md:block' : ''}>
                <PaginationLink
                  isActive={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={isMobile ? 'h-8 w-8 p-0 text-xs' : ''}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className={`${
                  currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                } ${isMobile ? 'h-8 text-xs' : ''}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <div className="mt-6 flex justify-center">
        <Button
          variant="outline"
          onClick={() => navigate('/delivery-orders')}
          className={isMobile ? 'h-8 text-xs' : ''}
        >
          Quay lại danh sách đơn
        </Button>
      </div>
    </div>
  )
}
