import { create } from 'zustand'

interface CheckoutItem {
  menuitem_id: number
  quantity: number
  price: number
  note: string
}

interface CheckoutStore {
  restaurant_id: number | null
  items: CheckoutItem[]
  setCheckoutInfo: (restaurant_id: number, items: CheckoutItem[]) => void
  clearCheckoutInfo: () => void
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  restaurant_id: null,
  items: [],
  setCheckoutInfo: (restaurant_id, items) => set({ restaurant_id, items }),
  clearCheckoutInfo: () => set({ restaurant_id: null, items: [] }),
}))
