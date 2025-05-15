import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import Footer from '@/components/Footer'
import OrderManagement from '@/components/OrderManagement/OrderManagement'
import ProfileManagement from '@/components/ProfileManagement/ProfileManagement'
import { useApiQuery } from '@/hooks/useApi'
import { toast } from '@/components/ui/use-toast'
import { DetailRestaurant } from '@/types/types'
import MenuManagement from '@/components/MenuManagement/MenuManagement'

const Loading = () => (
  <div className="flex flex-col min-h-screen">
    <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-foodsnap-teal border-t-transparent rounded-full mx-auto mb-4"></div>
        <h2 className="text-xl font-medium">Đang tải thông tin...</h2>
      </div>
    </main>
    <Footer />
  </div>
)

const RestaurantDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('menu')

  const { data, isLoading, error, refetch } = useApiQuery<DetailRestaurant>(
    ['restaurant-detail', id],
    `/restaurant/${id}`,
    undefined,
    { enabled: !!id },
  )

  const restaurant = data

  useEffect(() => {
    if (!isLoading && restaurant && !restaurant.approved_at) {
      toast({
        title: 'Không có quyền truy cập',
        description: 'Nhà hàng chưa được phê duyệt không thể truy cập trang quản lý.',
        variant: 'destructive',
      })
      navigate('/my-restaurants')
    }
  }, [isLoading, restaurant, navigate])

  if (isLoading) return <Loading />
  if (error) return <div>Lỗi khi tải dữ liệu: {error.message}</div>
  if (!restaurant) return null
  if (!restaurant.approved_at) return null

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6 text-gray-700 hover:text-foodsnap-teal">
          <Link to="/my-restaurants">
            <ArrowLeft size={18} className="mr-2" />
            <span>Quay lại</span>
          </Link>
        </Button>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center md:text-left">{restaurant.name}</h1>
          <p className="text-gray-600 mt-2 text-center md:text-left">
            Quản lý thực đơn, đơn hàng và thông tin nhà hàng
          </p>
        </div>
        <Tabs defaultValue="menu" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-8">
            <TabsTrigger value="menu">Thực đơn</TabsTrigger>
            <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
            <TabsTrigger value="profile">Thông tin nhà hàng</TabsTrigger>
          </TabsList>
          <TabsContent value="menu" className="mt-0">
            <MenuManagement
              menuItems={restaurant.menuItems}
              restaurantId={restaurant.restaurant_id}
              refetchRestaurant={refetch}
            />
          </TabsContent>
          <TabsContent value="orders" className="mt-0">
            <OrderManagement restaurantId={restaurant.restaurant_id} />
          </TabsContent>
          <TabsContent value="profile" className="mt-0">
            <ProfileManagement restaurant={restaurant} onUpdateSuccess={refetch} />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}

export default RestaurantDetailsPage
