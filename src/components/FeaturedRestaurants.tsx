import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { Link } from 'react-router-dom'

type Restaurant = {
  restaurant_id: number
  name: string
  image_url: string
  rating?: number
  description?: string
}

const FeaturedRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/restaurant/greet/random`, {
          headers: {
            accept: '*/*',
            // Nếu cần Auth, set lại Bearer token ở đây
            Authorization: `Bearer ${localStorage.getItem('acme-token') || ''}`,
          },
        })
        if (!res.ok) throw new Error(await res.text())
        const data = await res.json()
        setRestaurants(data)
      } catch (e: any) {
        setError(e.message || 'Lỗi không xác định')
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [])

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Nhà Hàng Nổi Bật</h2>
          <p className="text-foodsnap-lightText">
            Khám phá các nhà hàng tốt nhất trong khu vực của bạn
          </p>
        </div>

        {loading && (
          <div className="text-center text-gray-500 py-12">Đang tải nhà hàng nổi bật...</div>
        )}
        {error && <div className="text-center text-red-500 py-12">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant.restaurant_id}
              to={`/restaurant-details/${restaurant.restaurant_id}`}
              className="bg-white rounded-lg overflow-hidden shadow-md hover-scale card-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={restaurant.image_url}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                  <div className="flex items-center bg-foodsnap-orange/10 text-foodsnap-orange rounded-full px-2 py-1">
                    <Star size={16} className="fill-foodsnap-orange" />
                    <span className="ml-1 text-sm font-medium">
                      {restaurant.rating?.toFixed(1) ?? '--'}
                    </span>
                  </div>
                </div>
                <div className="w-full text-center mt-4">
                  <span className="inline-block w-full py-2 text-foodsnap-teal border border-foodsnap-teal hover:bg-foodsnap-teal hover:text-white transition-colors rounded">
                    Xem Thực Đơn
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedRestaurants
