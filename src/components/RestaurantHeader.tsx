import { Heart, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RestaurantHeaderProps {
  restaurant: {
    name: string
    address: string
    district: string
    phone: string
    rating: number
    image_url: string
    reviewCount: number
  }
  isFavorite: boolean
  onToggleFavorite: () => void
}

const RestaurantHeader = ({ restaurant, isFavorite, onToggleFavorite }: RestaurantHeaderProps) => {
  return (
    <div className="relative">
      {/* Banner Image */}
      <div
        className="h-48 md:h-64 lg:h-80 w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${restaurant.image_url})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>

      {/* Info Overlay */}
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 -mt-10 md:-mt-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{restaurant.name}</h1>

              <div className="flex items-center mt-2 text-sm text-gray-600 gap-4 flex-wrap">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" /> {restaurant.address}, {restaurant.district}
                </span>
                <span className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" /> {restaurant.phone}
                </span>
              </div>

              <div className="flex items-center mt-3 text-sm text-yellow-500">
                ⭐ {restaurant.rating ? restaurant.rating.toFixed(1) : 0} (
                {restaurant.reviewCount || 0} đánh giá)
              </div>
            </div>

            <div className="mt-4 md:mt-0">
              <Button
                variant="outline"
                className={`flex items-center gap-2 ${
                  isFavorite ? 'text-red-500' : 'text-gray-500'
                }`}
                onClick={onToggleFavorite}
              >
                <Heart className={`${isFavorite ? 'fill-red-500 text-red-500' : ''}`} size={18} />
                {isFavorite ? 'Đã lưu' : 'Lưu'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantHeader
