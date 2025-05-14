import { MapPin, Clock, Phone } from 'lucide-react'

interface RestaurantInfoProps {
  restaurant: {
    name: string
    address: string
    district: string
    phone: string
    description: string
    open_time: string
    close_time: string
  }
}

const RestaurantInfo = ({ restaurant }: RestaurantInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Info */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Giới thiệu</h2>
        <p className="text-gray-600 mb-6">{restaurant.description}</p>

        <h2 className="text-xl font-bold mb-4 text-gray-800">Giờ hoạt động</h2>
        <div className="bg-white rounded-lg border p-4 mb-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-foodsnap-teal" />
            <span>
              Mở cửa từ <strong>{restaurant.open_time}</strong> đến{' '}
              <strong>{restaurant.close_time}</strong> mỗi ngày
            </span>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4 text-gray-800">Liên hệ</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin size={18} className="mr-2 text-foodsnap-teal" />
            {restaurant.address}, {restaurant.district}
          </div>
          <div className="flex items-center">
            <Phone size={18} className="mr-2 text-foodsnap-teal" />
            <a href={`tel:${restaurant.phone}`} className="hover:text-foodsnap-orange">
              {restaurant.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Vị trí</h2>
        <div className="h-96 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center text-gray-500">
          <div className="text-center">
            <MapPin size={48} className="mx-auto mb-2 text-gray-400" />
            <p>Chưa tích hợp bản đồ</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantInfo
