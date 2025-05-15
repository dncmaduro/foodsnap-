import { useNavigate, useParams } from 'react-router-dom'
import { useApiPatchMutation, useApiQuery } from '@/hooks/useApi'
import { Button } from '@/components/ui/button'
import { toast, useToast } from '@/hooks/use-toast'
import Navigation from '@/components/Navigation'
import LoginDialog from '@/components/LoginDialog'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'
import Footer from '@/components/Footer'

const OrderTrackingPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { isAuthenticated } = useAuthStore()
  const [loginDialogOpen, setLoginDialogOpen] = useState(!isAuthenticated)

  const handleLoginSuccess = () => {
    setLoginDialogOpen(false)
  }

  const { data: orderData, isLoading, refetch } = useApiQuery<any>(['order', id], `/order/${id}`)

  const { mutate: cancelOrder, isPending: isCancelling } = useApiPatchMutation(
    `/order/${id}/cancel`,
    {
      onSuccess: () => {
        toast({
          title: 'Đã huỷ đơn hàng',
          description: 'Đơn hàng đã được huỷ thành công.',
        })
        refetch()
      },
      onError: () => {
        toast({
          title: 'Không thể huỷ đơn hàng',
          description: 'Chỉ đơn hàng đang chờ xử lý mới có thể huỷ.',
          variant: 'destructive',
        })
      },
    },
  )

  if (isLoading || !orderData?.data) {
    return <p className="p-4">Đang tải đơn hàng...</p>
  }

  const order = orderData.data
  const canCancel = order.shipping_status === 'Pending'

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-6 max-w-4xl">
        <div className="max-w-3xl mx-auto p-4 space-y-6">
          <h1 className="text-2xl font-bold">Theo dõi đơn hàng #{order.order_id}</h1>

          <div className="bg-white rounded-lg border p-4 space-y-2 shadow-sm">
            <p>
              <strong>Nhà hàng:</strong> {order.order_item[0]?.menuitem?.restaurant?.name}
            </p>
            <p>
              <strong>Trạng thái:</strong> {order.shipping_status}
            </p>
            <p>
              <strong>Ngày đặt:</strong> {new Date(order.order_at).toLocaleString('vi-VN')}
            </p>
            <p>
              <strong>Tổng thanh toán:</strong> {order.total_price.toLocaleString()}đ
            </p>

            <div className="mt-4">
              <h2 className="font-semibold mb-2">Danh sách món:</h2>
              <ul className="list-disc pl-5 text-sm">
                {order.order_item.map((item: any) => (
                  <li key={item.order_item_id}>
                    {item.quantity}× {item.menuitem?.name} ({item.price.toLocaleString()}đ) –
                    {item.note && <em> ghi chú: {item.note}</em>}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {canCancel && (
            <Button
              variant="destructive"
              disabled={isCancelling}
              onClick={() => cancelOrder({})}
              className="w-full sm:w-auto"
            >
              {isCancelling ? 'Đang huỷ...' : 'Huỷ đơn hàng'}
            </Button>
          )}
        </div>
      </main>

      <Footer />

      <LoginDialog
        isOpen={loginDialogOpen}
        onClose={() => navigate('/cart')}
        onSuccess={handleLoginSuccess}
      />
    </div>
  )
}

export default OrderTrackingPage
