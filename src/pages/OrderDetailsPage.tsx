import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { MapPin, ChevronLeft } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useApiQuery } from '@/hooks/useApi'
import { OrderDetailResponse } from '@/types/types'

export default function DeliveryOrdersPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const { data, isLoading } = useApiQuery<OrderDetailResponse>(['orders', 'detail'], `/order/${id}`)

  const handleAcceptOrder = (orderId: number) => {
    toast({
      title: 'Đã nhận đơn hàng',
      description: `Bạn đã nhận đơn hàng ${orderId} thành công.`,
    })
    navigate(`/delivery-status/${orderId}`)
  }

  const order = data?.data

  if (isLoading) {
    return (
      <div className="container mx-auto px-2 py-4 max-w-3xl">
        <p className="text-muted-foreground text-center py-8">Đang tải đơn hàng...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-2 py-4 max-w-3xl">
        <p className="text-muted-foreground text-center py-8">Không tìm thấy đơn hàng.</p>
      </div>
    )
  }

  const restaurant = order.order_item[0].menuitem.restaurant
  const deliveryAddress = order.delivery_note || 'Không có ghi chú'

  return (
    <div className="container mx-auto px-2 py-4 max-w-3xl">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/delivery-registration')}
        className="mb-4 -ml-2 gap-1"
      >
        <ChevronLeft className="h-4 w-4" /> Quay lại
      </Button>

      <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold mb-6`}>Chi tiết đơn hàng</h1>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="p-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold">Đơn #{order.order_id}</CardTitle>
            <div className="text-right">
              <div className="font-bold">{Number(order.total_price).toLocaleString()}đ</div>
              <div className="text-sm text-muted-foreground">
                {new Date(order.order_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                - {new Date(order.order_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-sm space-y-2">
          <div>
            <h3 className="font-semibold">Nhà hàng:</h3>
            <div className="flex items-start gap-1">
              <MapPin className="h-4 w-4 mt-0.5" />
              <div>
                <p>{restaurant.name}</p>
                <p className="text-muted-foreground text-sm">{restaurant.address}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Giao tới:</h3>
            <div className="flex items-start gap-1">
              <MapPin className="h-4 w-4 mt-0.5" />
              <p className="text-muted-foreground text-sm">{deliveryAddress}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end p-4 pt-0">
          <Button onClick={() => handleAcceptOrder(order.order_id)}>Nhận đơn</Button>
        </CardFooter>
      </Card>

      <div className="mt-10 flex justify-center gap-4">
        <Button variant="outline" onClick={() => navigate('/delivery-history')}>
          Lịch sử giao hàng
        </Button>
        <Button variant="outline" onClick={() => navigate('/driver-profile')}>
          Hồ sơ tài xế
        </Button>
      </div>
    </div>
  )
}
