import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Check, Clock, Truck, Home, FileText, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { useApiQuery } from '@/hooks/useApi'

type OrderItem = {
  name: string
  quantity: number
  price: number
}

type OrderDetails = {
  orderId: number | string
  restaurantName: string
  estimatedDelivery: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  paymentMethod: string
  deliveryAddress: {
    name: string
    phone: string
    address: string
    notes?: string
  }
  driverNote?: string
}

const OrderConfirmationPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)

  const { data, isLoading } = useApiQuery<any>(['order', id], `/order/${id}`)

  useEffect(() => {
    if (!data?.data) return

    const order = data.data

    setOrderDetails({
      orderId: order.order_id,
      restaurantName: order.order_item[0]?.menuitem?.restaurant?.name || 'Không xác định',
      estimatedDelivery: '30-45 phút', // TODO: nếu có field thời gian thì thay vào
      items: order.order_item.map((item: any) => ({
        name: item.menuitem.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: order.subtotal,
      deliveryFee: order.shipping_fee,
      total: order.total_price,
      paymentMethod: 'Thanh toán khi nhận hàng', // TODO: nếu có field thì thay thế
      deliveryAddress: {
        name: 'Người nhận',
        phone: 'Chưa có số',
        address: order.order_item[0]?.menuitem?.restaurant?.address || '',
        notes: order.delivery_note,
      },
      driverNote: order.delivery_note || '',
    })
  }, [data])

  if (isLoading || !orderDetails) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-foodsnap-orange border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-medium">Đang tải thông tin đơn hàng...</h2>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center py-8 mb-6">
          <div className="mx-auto bg-green-100 rounded-full h-24 w-24 flex items-center justify-center mb-4">
            <Check className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đơn hàng của bạn đã được đặt thành công!
          </h1>
          <p className="text-gray-600 mb-2">
            Mã đơn hàng: <span className="font-semibold">{orderDetails.orderId}</span>
          </p>
          <div className="flex items-center justify-center text-gray-600">
            <Clock className="mr-2 h-5 w-5 text-foodsnap-orange" />
            <p>
              Thời gian giao hàng dự kiến:{' '}
              <span className="font-semibold">{orderDetails.estimatedDelivery}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-foodsnap-orange" />
                  Tóm tắt đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg mb-2">{orderDetails.restaurantName}</h3>
                <div className="space-y-3 mb-6">
                  {orderDetails.items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <div>
                        <span className="font-medium">{item.quantity}× </span>
                        <span>{item.name}</span>
                      </div>
                      <span>{(item.price * item.quantity).toFixed(0)}đ</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng phụ</span>
                    <span>{orderDetails.subtotal.toFixed(0)}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí giao hàng</span>
                    <span>{orderDetails.deliveryFee.toFixed(0)}đ</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng</span>
                    <span>{orderDetails.total.toFixed(0)}đ</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-700">
                    <span className="font-medium">Phương thức thanh toán:</span>{' '}
                    {orderDetails.paymentMethod}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2 h-5 w-5 text-foodsnap-orange" />
                  Thông tin giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{orderDetails.deliveryAddress.name}</p>
                  <p>{orderDetails.deliveryAddress.phone}</p>
                  <p className="mt-1">{orderDetails.deliveryAddress.address}</p>
                  {orderDetails.deliveryAddress.notes && (
                    <div className="mt-2 text-gray-600">
                      <span className="font-medium">Ghi chú:</span>{' '}
                      {orderDetails.deliveryAddress.notes}
                    </div>
                  )}
                  {orderDetails.driverNote && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-md">
                      <div className="flex items-start">
                        <MessageSquare className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-700">Ghi chú cho tài xế:</p>
                          <p className="text-blue-600">{orderDetails.driverNote}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Các bước tiếp theo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full py-6 bg-foodsnap-teal hover:bg-foodsnap-teal/90 flex items-center justify-center"
                  onClick={() => navigate(`/track-order/${orderDetails.orderId}`)}
                >
                  <Truck className="mr-2 h-5 w-5" />
                  Theo dõi đơn hàng
                </Button>

                <Button
                  variant="outline"
                  className="w-full py-6 border-foodsnap-orange text-foodsnap-orange hover:bg-foodsnap-orange/10 flex items-center justify-center"
                  onClick={() => navigate('/')}
                >
                  <Home className="mr-2 h-5 w-5" />
                  Trở về trang chủ
                </Button>

                <div className="p-4 bg-blue-50 rounded-md mt-4">
                  <h4 className="font-semibold text-blue-800 mb-1">Cần trợ giúp?</h4>
                  <p className="text-sm text-blue-700 mb-2">
                    Nếu bạn có bất kỳ thắc mắc nào về đơn hàng, vui lòng liên hệ với bộ phận hỗ trợ
                    khách hàng.
                  </p>
                  <a
                    href="#"
                    className="text-sm font-medium text-blue-700 underline hover:text-blue-900"
                  >
                    Liên hệ hỗ trợ
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default OrderConfirmationPage
