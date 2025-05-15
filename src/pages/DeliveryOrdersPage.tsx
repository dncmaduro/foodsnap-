import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useApiQuery, useApiPatchMutation } from '@/hooks/useApi'
import { toast } from '@/hooks/use-toast'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin } from 'lucide-react'

interface PendingOrder {
  order_id: number
  restaurant_id: number
  shipper_id?: number
  user_id: number
  delivery_note: string
  order_at: string
  delivered_at?: string
  subtotal: number
  shipping_fee: number
  total_price: number
  shipping_status: string
  order_item: any[]
}

const DISTRICTS = ['Tất cả', 'Cầu Giấy', 'Đống Đa', 'Ba Đình', 'Thanh Xuân']

export default function DeliveryOrdersPage() {
  const navigate = useNavigate()
  const [district, setDistrict] = useState<string>('Tất cả')
  const isMobile = useIsMobile()

  const { data, isLoading, refetch } = useApiQuery<PendingOrder[]>(
    ['orders', 'pending', district],
    '/order/pending/list',
    district === 'Tất cả' ? undefined : { district },
  )

  const orders = data ?? []

  return (
    <div className="container mx-auto px-2 py-4 max-w-6xl">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/delivery-registration')}
        className="mb-2 -ml-2 gap-1"
      >
        <ChevronLeft className="h-4 w-4" /> Quay lại
      </Button>

      <div className="mb-4">
        <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold`}>
          Danh sách đơn hàng có thể nhận
        </h1>
        <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mt-1`}>
          Chọn đơn hàng bạn muốn nhận để bắt đầu giao.
        </p>
      </div>

      <div className="mb-4">
        <Select value={district} onValueChange={setDistrict}>
          <SelectTrigger className={`${isMobile ? 'h-8 text-xs' : ''}`}>
            <SelectValue placeholder="Chọn quận" />
          </SelectTrigger>
          <SelectContent>
            {DISTRICTS.map((d) => (
              <SelectItem key={d} value={d} className={isMobile ? 'text-xs' : ''}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <p className="text-muted-foreground text-center py-4">Đang tải đơn hàng...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 bg-muted rounded-lg">
            <p className="text-muted-foreground">Không tìm thấy đơn hàng nào phù hợp.</p>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.order_id}
              order={order}
              isMobile={isMobile}
              onAccepted={refetch}
            />
          ))
        )}
      </div>
    </div>
  )
}

function OrderCard({
  order,
  isMobile,
  onAccepted,
}: {
  order: PendingOrder
  isMobile: boolean
  onAccepted: () => void
}) {
  const navigate = useNavigate()

  const { mutate: assignOrder, isPending } = useApiPatchMutation<unknown, void>(
    `/order/${order.order_id}/assign`,
    {
      onSuccess: () => {
        toast({ title: 'Đã nhận đơn hàng' })
        navigate(`/delivery-status/${order.order_id}`)
        onAccepted()
      },
      onError: (err) => {
        toast({ title: 'Lỗi khi nhận đơn', description: err.message, variant: 'destructive' })
      },
    },
  )

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className={`${isMobile ? 'p-3' : 'p-4'}`}>
        <div className="flex justify-between items-start">
          <CardTitle className={`${isMobile ? 'text-sm' : 'text-lg'}`}>
            Đơn #{order.order_id}
          </CardTitle>
          <div className="text-right">
            <div className={`font-bold ${isMobile ? 'text-sm' : ''}`}>
              {order.total_price.toLocaleString()}đ
            </div>
            <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
              {new Date(order.order_at).toLocaleString()}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-3 pt-0 text-xs' : 'p-4 pt-0 text-sm'}`}>
        {/* THÔNG TIN NHÀ HÀNG */}
        {order.order_item?.[0]?.menuitem?.restaurant && (
          <div className="mb-4 flex gap-3 items-center border rounded-md p-2 bg-gray-50">
            <img
              src={order.order_item[0].menuitem.restaurant.image_url}
              alt={order.order_item[0].menuitem.restaurant.name}
              className="w-14 h-14 object-cover rounded-md flex-shrink-0"
            />
            <div className="flex-1 space-y-1">
              <div className="font-semibold text-base">
                {order.order_item[0].menuitem.restaurant.name}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <MapPin size={14} className="inline" />
                <span>
                  {order.order_item[0].menuitem.restaurant.address} -{' '}
                  {order.order_item[0].menuitem.restaurant.district}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                <span>Điện thoại: {order.order_item[0].menuitem.restaurant.phone}</span>
                {order.order_item[0].menuitem.restaurant.rating && (
                  <span className="ml-3">⭐ {order.order_item[0].menuitem.restaurant.rating}</span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                <span>
                  Giờ mở cửa: {order.order_item[0].menuitem.restaurant.open_time} -{' '}
                  {order.order_item[0].menuitem.restaurant.close_time}
                </span>
              </div>
            </div>
          </div>
        )}
        <div className="space-y-4">
          {/* Món ăn */}
          <div>
            <h3 className="font-semibold mb-2">Danh sách món ăn:</h3>
            <div className="space-y-2">
              {order.order_item.map((item) => (
                <div
                  key={item.order_item_id}
                  className="flex gap-3 items-start border rounded-md p-2"
                >
                  <img
                    src={item.menuitem.image_url}
                    alt={item.menuitem.name}
                    className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{item.menuitem.name}</p>
                    <p className="text-muted-foreground text-sm">{item.menuitem.description}</p>
                    <p className="text-xs">
                      <strong>Số lượng:</strong> {item.quantity} | <strong>Giá:</strong>{' '}
                      {item.price.toLocaleString()}đ
                    </p>
                    {item.note && (
                      <p className="text-xs text-muted-foreground italic">Ghi chú: {item.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ghi chú giao hàng */}
          <div>
            <h3 className="font-semibold">Ghi chú giao hàng:</h3>
            <p className="text-muted-foreground">{order.delivery_note || '(Không có)'}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className={`flex justify-end ${isMobile ? 'p-3 pt-0' : 'p-4 pt-0'}`}>
        <Button
          disabled={isPending}
          onClick={() => assignOrder()}
          className={isMobile ? 'h-8 text-xs px-2 py-1' : ''}
        >
          Nhận đơn
        </Button>
      </CardFooter>
    </Card>
  )
}
