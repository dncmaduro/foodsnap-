import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { MapPin, ChevronLeft, Star } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useApiMutation, useApiQuery } from '@/hooks/useApi'
import { OrderDetailResponse, ReviewResponse } from '@/types/types'
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'

export default function DeliveryOrdersPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const { data, isLoading } = useApiQuery<OrderDetailResponse>(['orders', 'detail'], `/order/${id}`)
  const { data: reviewsData } = useApiQuery<ReviewResponse[]>(
    ['reviews', 'by-order', id],
    `/review/${id}`,
  )

  const { mutate: submitReview } = useApiMutation('/review', {
    onSuccess: () => toast({ title: 'Đánh giá thành công' }),
    onError: () => toast({ title: 'Lỗi khi đánh giá', variant: 'destructive' }),
  })

  const order = data?.data
  const review = reviewsData?.data?.[0]
  const [form, setForm] = useState<{ rating: number; comment: string }>({ rating: 0, comment: '' })

  const handleAcceptOrder = (orderId: number) => {
    toast({
      title: 'Đã nhận đơn hàng',
      description: `Bạn đã nhận đơn hàng ${orderId} thành công.`,
    })
    navigate(`/delivery-status/${orderId}`)
  }

  const handleChange = (field: 'rating' | 'comment', value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === 'rating' ? Number(value) : value,
    }))
  }

  const handleSubmitReview = () => {
    if (!form.rating) {
      toast({ title: 'Vui lòng chọn số sao', variant: 'destructive' })
      return
    }

    submitReview({
      order_id: Number(id),
      rating: form.rating,
      comment: form.comment || '',
    })
  }

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
              <div className="text-sm mt-1">
                Trạng thái:{' '}
                <span className="font-medium text-blue-600">{order.shipping_status}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-sm space-y-2">
          <div>
            <h3 className="font-semibold">Giao tới:</h3>
            <div className="flex items-start gap-1">
              <MapPin className="h-4 w-4 mt-0.5" />
              <p className="text-muted-foreground text-sm">{deliveryAddress}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end p-4 pt-0">
          {order.shipping_status === 'Pending' && (
            <Button onClick={() => handleAcceptOrder(order.order_id)}>Nhận đơn</Button>
          )}
        </CardFooter>
      </Card>

      {order.shipping_status === 'Delivered' && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Đánh giá nhà hàng</h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{restaurant.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{restaurant.address}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {review ? (
                <div className="text-sm text-gray-700">
                  <div className="flex items-center mb-1">
                    <Star className="text-yellow-500 h-4 w-4 mr-1" />
                    <span>Đã đánh giá: {review.rating} sao</span>
                  </div>
                  <p className="italic">{review.comment || 'Không có bình luận'}</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        variant={form.rating === star ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => handleChange('rating', `${star}`)}
                      >
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      </Button>
                    ))}
                  </div>
                  <Textarea
                    placeholder="Viết bình luận của bạn (tùy chọn)"
                    value={form.comment}
                    onChange={(e) => handleChange('comment', e.target.value)}
                  />
                  <Button
                    onClick={handleSubmitReview}
                    className="bg-foodsnap-orange hover:bg-foodsnap-orange/90"
                  >
                    Gửi đánh giá
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

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
