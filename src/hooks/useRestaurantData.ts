import { useApiQuery } from '@/hooks/useApi'
import { DetailRestaurant } from '@/types/types'

export function useRestaurantData(id?: string) {
  const { data, isLoading } = useApiQuery<DetailRestaurant>(
    ['restaurant', id],
    `/restaurant/${id}`,
    undefined,
    { enabled: !!id },
  )

  return {
    restaurant: data,
    menu: data?.menuItems?.length
      ? [
          {
            category: 'Tất cả món',
            items: data.menuItems.map((m) => ({
              id: m.menuitem_id.toString(),
              name: m.name,
              description: m.description,
              price: m.price,
              image: m.image_url,
            })),
          },
        ]
      : [],
    reviews:
      data?.reviews?.map((r) => ({
        id: r.review_id.toString(),
        userName: `Người dùng #${r.user_id}`,
        rating: r.rating,
        comment: r.comment,
        date: r.created_at,
      })) || [],
    loading: isLoading,
    reviewCount: data?.reviews?.length ?? 0,
    isFavorite: false, // nếu có logic favorite sau này
    toggleFavorite: () => {}, // placeholder
  }
}
