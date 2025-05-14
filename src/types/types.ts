export interface Restaurant {
  restaurant_id: string
  user_id: string
  restaurantapp_id: string
  name: string
  description: string
  district: string
  address: string
  phone: string
  rating: number
  open_time: string
  close_time: string
  approved_at: Date
  image_url: string
}

export interface Menuitem {
  menuitem_id: string
  restaurant_id: string
  name: string
  description: string
  price: number
  image_url: string
  created_at: Date
  active: boolean
}

export interface SearchResponse {
  restaurants: Restaurant[]
  menuItems: Menuitem[]
}

export interface MenuItem {
  menuitem_id: number
  restaurant_id: number
  name: string
  description: string
  price: number
  image_url: string
  created_at: string
  active: boolean
}

export interface Review {
  review_id: number
  user_id: number
  restaurant_id: number
  order_id: number
  rating: number
  comment: string
  created_at: string
}

export interface DetailRestaurant {
  restaurant_id: number
  user_id: number
  restaurantapp_id: number
  name: string
  description: string
  district: string
  address: string
  phone: string
  rating: number
  open_time: string
  close_time: string
  approved_at: string
  image_url: string
  reviewCount: number
  menuItems: MenuItem[]
  reviews: Review[]
}

export interface ServerCartItem {
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
