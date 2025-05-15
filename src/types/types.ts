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

export interface OrderItem {
  note: string
  price: number
  quantity: number
  menuitem: {
    name: string
    price: number
    active: boolean
    image_url: string
    created_at: string
    description: string
    menuitem_id: number
    restaurant_id: number
    restaurant: {
      name: string
      phone: string
      rating: number
      address: string
      user_id: number
      district: string
      image_url: string
      open_time: string
      close_time: string
      approved_at: string
      description: string
      restaurant_id: number
      restaurantapp_id: number
    }
  }
  order_id: number
  menuitem_id: number
  order_item_id: number
}

export interface OrderDetailResponse {
  order_id: number
  user_id: number
  address_id: number
  restaurant_id: number
  shipper_id: number | null
  delivery_note: string
  order_at: string
  delivered_at: string | null
  subtotal: number
  shipping_fee: number
  total_price: number
  shipping_status: 'Pending' | 'Preparing' | 'Delivering' | 'Delivered' | 'Canceled'
  order_item: OrderItem[]
}

export interface ReviewResponse {
  review_id: number
  rating: number
  comment: string
  created_at: string
  restaurant_id: number
  restaurant: {
    name: string
    address: string
    image_url: string
  }
}
