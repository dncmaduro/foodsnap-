import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, ArrowUpDown, ChevronRight, PackageOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Progress } from '@/components/ui/progress'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { useAuthStore } from '@/store/authStore'
import { useApiQuery } from '@/hooks/useApi'

const OrderHistoryPage = () => {
  const [sortOrder, setSortOrder] = useState<string>('recent')
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  const { data, isLoading } = useApiQuery<any[]>(['orders'], '/order')

  const orders = data || []

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getProgress = (status: string) => {
    switch (status) {
      case 'Preparing':
        return 33
      case 'On-the-way':
        return 66
      case 'Delivered':
        return 100
      default:
        return 10
    }
  }

  const currentOrders = orders.filter(
    (order) => order.shipping_status !== 'Delivered' && order.shipping_status !== 'Canceled',
  )

  const pastOrders = useMemo(() => {
    const completed = orders.filter((order) =>
      ['Delivered', 'Canceled'].includes(order.shipping_status),
    )

    return [...completed].sort((a, b) => {
      const dateA = new Date(a.order_at).getTime()
      const dateB = new Date(b.order_at).getTime()
      return sortOrder === 'recent' ? dateB - dateA : dateA - dateB
    })
  }, [orders, sortOrder])

  if (!isAuthenticated) {
    navigate('/')
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Lịch Sử Đơn Hàng</h1>

        {/* Đơn hiện tại */}
        {currentOrders.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-8 p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Đơn Hàng Hiện Tại</h2>
              <span className="text-sm text-gray-500">#{currentOrders[0].order_id}</span>
            </div>

            <div className="mb-6">
              <Progress
                value={getProgress(currentOrders[0].shipping_status)}
                className="h-2 mb-3"
              />
              <div className="flex justify-between text-sm">
                <div
                  className={`text-center ${
                    getProgress(currentOrders[0].shipping_status) >= 33
                      ? 'text-foodsnap-teal font-medium'
                      : 'text-gray-400'
                  }`}
                >
                  Đang chuẩn bị
                </div>
                <div
                  className={`text-center ${
                    getProgress(currentOrders[0].shipping_status) >= 66
                      ? 'text-foodsnap-teal font-medium'
                      : 'text-gray-400'
                  }`}
                >
                  Đang giao hàng
                </div>
                <div
                  className={`text-center ${
                    getProgress(currentOrders[0].shipping_status) === 100
                      ? 'text-foodsnap-teal font-medium'
                      : 'text-gray-400'
                  }`}
                >
                  Đã giao hàng
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1">
              <div>
                <h3 className="font-medium mb-2">
                  {currentOrders[0].order_item[0]?.menuitem?.restaurant?.name || 'Nhà hàng'}
                </h3>
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 text-foodsnap-orange mr-2" />
                  <span className="text-sm">Trạng thái: {currentOrders[0].shipping_status}</span>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  {currentOrders[0].order_item.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between">
                      <span>
                        {item.quantity}× {item.menuitem?.name}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full border-foodsnap-teal text-foodsnap-teal hover:bg-foodsnap-teal/10"
                  onClick={() => navigate(`/order/${currentOrders[0].order_id}`)}
                >
                  Xem Chi Tiết Theo Dõi
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Bộ lọc */}
        <div className="flex justify-end gap-4 mb-6">
          <ToggleGroup
            type="single"
            value={sortOrder}
            onValueChange={(value) => value && setSortOrder(value)}
          >
            <ToggleGroupItem value="recent" aria-label="Mới nhất">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Mới Nhất
            </ToggleGroupItem>
            <ToggleGroupItem value="oldest" aria-label="Cũ nhất">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Cũ Nhất
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Danh sách đơn cũ */}
        {pastOrders.length > 0 ? (
          <div className="space-y-4">
            {pastOrders.map((order) => {
              const itemCount = order.order_item.reduce((sum, i) => sum + i.quantity, 0)
              const restaurant = order.order_item[0]?.menuitem?.restaurant

              return (
                <Card key={order.order_id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div className="flex items-center mb-2 md:mb-0">
                          <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                            <img
                              src={restaurant?.image_url || '/placeholder.svg'}
                              alt={restaurant?.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{restaurant?.name}</h3>
                            <div className="text-sm text-gray-500">
                              {formatDate(order.order_at)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="text-right mr-4">
                            <div className="font-medium">{order.total_price.toFixed(0)}đ</div>
                            <div className="text-sm text-gray-500">{itemCount} món</div>
                          </div>

                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.shipping_status === 'Delivered'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {order.shipping_status === 'Delivered' ? 'Hoàn thành' : 'Đã hủy'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 p-4">
                    <Button
                      variant="ghost"
                      className="ml-auto flex items-center text-foodsnap-teal hover:text-foodsnap-teal/80"
                      onClick={() => navigate(`/order/${order.order_id}`)}
                    >
                      Xem Chi Tiết
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        ) : !isLoading ? (
          <div className="text-center py-16">
            <div className="mx-auto bg-gray-100 rounded-full h-24 w-24 flex items-center justify-center mb-4">
              <PackageOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Bạn chưa đặt đơn hàng nào</h3>
            <p className="text-gray-500 mb-6">Khi bạn đặt đơn hàng, đơn hàng sẽ hiển thị ở đây.</p>
            <Button
              className="bg-foodsnap-orange hover:bg-foodsnap-orange/90"
              onClick={() => navigate('/restaurants')}
            >
              Bắt Đầu Duyệt Nhà Hàng
            </Button>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  )
}

export default OrderHistoryPage
