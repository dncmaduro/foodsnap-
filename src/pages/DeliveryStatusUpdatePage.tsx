import { useParams, useNavigate } from 'react-router-dom'
import { useApiPatchMutation, useApiQuery } from '@/hooks/useApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, CheckCircle, MapPin, Package, Phone, Truck } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useIsMobile } from '@/hooks/use-mobile'
import { OrderStatusBadge } from '@/components/OrderManagement/OrderStatusBadge'

const DeliveryStatusUpdatePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const { data, isLoading, refetch } = useApiQuery<any>(['order-detail', id], `/order/${id}`)

  const { mutate: updateStatus } = useApiPatchMutation(`/order/${id}/status`, {
    onSuccess: () => {
      toast({ title: 'Cập nhật trạng thái thành công' })
      refetch()
    },
    onError: (err: any) => {
      toast({ title: 'Cập nhật thất bại', description: err.message, variant: 'destructive' })
    },
  })

  const handleUpdateStatus = (newStatus: 'In Transit' | 'Delivered' | 'Canceled By Shipper') => {
    updateStatus({ status: newStatus })
  }

  const order = data

  console.log(data)

  const currentStep = order
    ? order.shipping_status === 'Assigned'
      ? 1
      : order.shipping_status === 'In Transit'
      ? 2
      : order.shipping_status === 'Delivered'
      ? 3
      : 0
    : 0

  const getStepClass = (step: number) =>
    currentStep >= step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'

  return (
    <div className="container mx-auto px-4 py-4 max-w-xl">
      {isLoading ? (
        <p className="text-center py-8">Đang tải đơn hàng...</p>
      ) : order ? (
        <>
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/delivery-orders')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Cập nhật đơn #{order.order_id}</h1>
          </div>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Trạng thái đơn hàng
                <OrderStatusBadge status={order.shipping_status} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <div className="flex flex-col items-center">
                  <div
                    className={`rounded-full ${getStepClass(
                      1,
                    )} h-9 w-9 flex items-center justify-center mb-1`}
                  >
                    <Package className="h-4 w-4" />
                  </div>
                  <span>Nhận đơn</span>
                </div>
                <div className="flex-1 h-1 mx-2 bg-gray-200">
                  {currentStep > 1 && <div className="h-1 bg-green-500 w-full" />}
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className={`rounded-full ${getStepClass(
                      2,
                    )} h-9 w-9 flex items-center justify-center mb-1`}
                  >
                    <Truck className="h-4 w-4" />
                  </div>
                  <span>Đang giao</span>
                </div>
                <div className="flex-1 h-1 mx-2 bg-gray-200">
                  {currentStep === 3 && <div className="h-1 bg-green-500 w-full" />}
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className={`rounded-full ${getStepClass(
                      3,
                    )} h-9 w-9 flex items-center justify-center mb-1`}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span>Hoàn thành</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Chi tiết đơn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-semibold">Nhà hàng:</p>
                <p>{order.order_item[0]?.menuitem.restaurant.name}</p>
                <p className="text-gray-600 flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {order.order_item[0]?.menuitem.restaurant.address}
                </p>
              </div>
              <Separator />
              <div>
                <p className="font-semibold">Danh sách món:</p>
                <ul className="space-y-1">
                  {order.order_item.map((item: any) => (
                    <li key={item.order_item_id} className="flex justify-between">
                      <span>
                        {item.quantity}x {item.menuitem.name}
                      </span>
                      <span>{(item.price * item.quantity).toLocaleString()}đ</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Tổng cộng:</span>
                <span>{order.total_price.toLocaleString()}đ</span>
              </div>
            </CardContent>
          </Card>

          {order.shipping_status === 'Assigned' && (
            <Button onClick={() => handleUpdateStatus('In Transit')} className="w-full">
              Bắt đầu giao hàng
            </Button>
          )}

          {order.shipping_status === 'In Transit' && (
            <div className="space-y-2">
              <Button
                onClick={() => handleUpdateStatus('Delivered')}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Hoàn thành đơn hàng
              </Button>
              <Button
                onClick={() => handleUpdateStatus('Canceled By Shipper')}
                variant="destructive"
                className="w-full"
              >
                Hủy đơn
              </Button>
            </div>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default DeliveryStatusUpdatePage
