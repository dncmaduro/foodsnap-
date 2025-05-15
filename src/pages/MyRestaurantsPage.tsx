import React, { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Store } from 'lucide-react'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useApiQuery } from '@/hooks/useApi'
import { RestaurantApplication } from '@/types/types'
import { toast } from '@/hooks/use-toast'

const MyRestaurantsPage = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const restaurantsPerPage = 10

  const { data: res, isLoading } = useApiQuery<RestaurantApplication[]>(
    ['restaurant-applications', 'mine'],
    '/restaurant-application/mine',
  )

  const allApplications = res || []
  const approvedRestaurants = allApplications.filter((r) => r.status === 'approved')
  const pendingRestaurants = allApplications.filter((r) => r.status === 'pending')

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/restaurant-management')}
          className="mb-6 text-gray-700 hover:text-foodsnap-teal"
        >
          <ArrowLeft size={18} className="mr-2" />
          <span>Quay lại</span>
        </Button>

        <h1 className="text-3xl font-bold mb-8 text-center md:text-left">
          Danh sách nhà hàng đã đăng ký
        </h1>

        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">Đang tải dữ liệu...</p>
        ) : (
          <Tabs defaultValue="approved" className="mb-8">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="approved">Nhà hàng đã được phê duyệt</TabsTrigger>
              <TabsTrigger value="pending">Đang chờ phê duyệt</TabsTrigger>
            </TabsList>

            <TabsContent value="approved">
              <div className="grid grid-cols-1 gap-6">
                {approvedRestaurants.length > 0 ? (
                  approvedRestaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.restaurantapp_id} restaurant={restaurant} />
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    Bạn chưa có nhà hàng nào đã được phê duyệt.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="pending">
              <div className="grid grid-cols-1 gap-6">
                {pendingRestaurants.length > 0 ? (
                  pendingRestaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.restaurantapp_id} restaurant={restaurant} />
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    Bạn không có nhà hàng nào đang chờ phê duyệt.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}

        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </main>

      <Footer />
    </div>
  )
}

interface RestaurantCardProps {
  restaurant: RestaurantApplication
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const navigate = useNavigate()
  // Chỉ query khi được yêu cầu, tránh gọi thừa
  const [shouldFetch, setShouldFetch] = React.useState(false)

  // Query lấy restaurant theo application id
  const {
    data: restaurantDetailRes,
    isLoading: isFetching,
    isError,
    error,
  } = useApiQuery<any>(
    ['restaurant-by-app', String(restaurant.restaurantapp_id)],
    `/restaurant/app/${restaurant.restaurantapp_id}`,
    undefined,
    {
      // keepPreviousData: true,
    },
  )

  const handleViewDetail = useCallback(() => {
    if (restaurantDetailRes?.data?.restaurant_id) {
      navigate(`/restaurant-details/${restaurantDetailRes.data.restaurant_id}`)
    } else {
      setShouldFetch(true)
    }
  }, [navigate, restaurantDetailRes?.data?.restaurant_id, restaurant.restaurantapp_id])

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-2">
              <Store className="h-5 w-5 text-foodsnap-teal" />
              <h3 className="text-xl font-medium">{restaurant.name}</h3>
              <Badge
                variant={restaurant.status === 'approved' ? 'default' : 'secondary'}
                className={restaurant.status === 'approved' ? 'bg-green-500' : 'bg-amber-500'}
              >
                {restaurant.status === 'approved' ? 'Đã phê duyệt' : 'Đang chờ phê duyệt'}
              </Badge>
            </div>
            <div className="flex items-start gap-2 text-gray-600 mb-1">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{restaurant.address}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                Đăng ký: {new Date(restaurant.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          {restaurant.status === 'approved' && (
            <Button
              variant="outline"
              className="mt-4 md:mt-0 w-full md:w-auto"
              disabled={isFetching}
              onClick={handleViewDetail}
            >
              {isFetching ? 'Đang kiểm tra...' : 'Xem chi tiết'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default MyRestaurantsPage
