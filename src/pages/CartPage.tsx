import { useState } from 'react'
import { Minus, Plus, Trash2, LogIn } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { useCart } from '@/contexts/CartContext'
import { useAuthStore } from '@/store/authStore'
import EditNoteDialog from '@/components/EditNoteDialog'
import LoginDialog from '@/components/LoginDialog'
import { useApiDeleteMutation, useApiQuery } from '@/hooks/useApi'
import CartItem from '@/components/CartItem'
import { useCheckoutStore } from '@/store/checkoutStore'

interface ServerCartItem {
  cart_item_id: number
  quantity: number
  note: string
  menuitem: {
    menuitem_id: number
    name: string
    price: number
    description: string
    image_url: string
    restaurant: {
      restaurant_id: number
      name: string
    }
  }
}

const CartPage = () => {
  const { isAuthenticated } = useAuthStore()
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const { setCheckoutInfo } = useCheckoutStore()

  const proceedToCheckout = () => {
    if (isAuthenticated) {
      const restaurantId = Number(Object.keys(itemsByRestaurant)[0]) // lấy restaurant đầu tiên
      const items = Object.values(itemsByRestaurant)[0].items.map((item) => ({
        menuitem_id: Number(item.id),
        quantity: item.quantity,
        price: item.price,
        note: item.notes,
      }))
      setCheckoutInfo(restaurantId, items)
      navigate('/checkout')
    } else {
      setLoginDialogOpen(true)
    }
  }

  const { data: cartData, isLoading, refetch } = useApiQuery<ServerCartItem[]>(['cart'], '/cart')
  const { mutate: clearCart, isPending } = useApiDeleteMutation('/cart', {
    onSuccess: () => {
      toast({ title: 'Đã xóa giỏ hàng' })
      refetch()
    },
    onError: () => {
      toast({ title: 'Xóa thất bại', variant: 'destructive' })
    },
  })

  const itemsByRestaurant = (cartData ?? []).reduce(
    (acc, item) => {
      const r = item.menuitem.restaurant
      const key = r.restaurant_id

      if (!acc[key]) {
        acc[key] = {
          restaurantId: key,
          restaurantName: r.name,
          items: [],
        }
      }

      acc[key].items.push({
        id: item.cart_item_id.toString(),
        name: item.menuitem.name,
        quantity: item.quantity,
        price: item.menuitem.price,
        notes: item.note,
      })

      return acc
    },
    {} as Record<
      number,
      {
        restaurantId: number
        restaurantName: string
        items: {
          id: string
          name: string
          quantity: number
          price: number
          notes: string
        }[]
      }
    >,
  )

  const flatItems = Object.values(itemsByRestaurant).flatMap((r) => r.items)
  const subtotal = flatItems.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const deliveryFee = flatItems.length > 0 ? 20000 : 0
  const total = subtotal + deliveryFee

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <main className="flex-grow container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Giỏ hàng của bạn</h1>

          {isLoading ? (
            <p className="mt-2 text-gray-600">Đang tải giỏ hàng...</p>
          ) : flatItems.length > 0 ? (
            <div className="flex justify-between items-center mt-2">
              <p className="text-gray-600">
                {Object.keys(itemsByRestaurant).length > 1
                  ? `Món ăn từ ${Object.keys(itemsByRestaurant).length} nhà hàng`
                  : `Món ăn từ ${
                      Object.values(itemsByRestaurant)[0]?.restaurantName || 'nhà hàng'
                    }`}
              </p>
              <Button
                variant="outline"
                className="text-gray-500 border-gray-300"
                onClick={() => clearCart()}
              >
                Xóa giỏ hàng
              </Button>
            </div>
          ) : (
            <p className="text-gray-600 mt-2">Giỏ hàng của bạn đang trống</p>
          )}
        </div>

        {flatItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {Object.values(itemsByRestaurant).map((restaurant) => (
                <Card key={restaurant.restaurantId} className="mb-6">
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-4">{restaurant.restaurantName}</h3>
                    <div className="space-y-4">
                      {restaurant.items.map((item) => (
                        <CartItem item={item} key={item.id} refetch={() => refetch()} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="md:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Tóm tắt đơn hàng</h3>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng phụ</span>
                      <span>{subtotal.toFixed(0)}đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí giao hàng</span>
                      <span>{deliveryFee.toFixed(0)}đ</span>
                    </div>

                    <Separator className="my-2" />

                    <div className="flex justify-between font-bold text-lg">
                      <span>Tổng cộng</span>
                      <span>{total.toFixed(0)}đ</span>
                    </div>
                  </div>

                  <Button
                    className={`w-full mt-2 py-6 text-base flex items-center justify-center ${
                      isAuthenticated
                        ? 'bg-foodsnap-orange hover:bg-foodsnap-orange/90'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={proceedToCheckout}
                  >
                    {isAuthenticated ? (
                      'Tiến hành thanh toán'
                    ) : (
                      <>
                        <LogIn className="mr-2 h-5 w-5" />
                        Đăng nhập để thanh toán
                      </>
                    )}
                  </Button>

                  {!isAuthenticated && (
                    <p className="mt-3 text-sm text-gray-500 text-center">
                      Bạn cần đăng nhập để hoàn tất đơn hàng
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <LoginDialog
        isOpen={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        // onSuccess={handleLoginSuccess}
      />
    </div>
  )
}

export default CartPage
