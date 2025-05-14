import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import AddToCartDialog from './AddToCartDialog'
import { toast } from '@/hooks/use-toast'
import { useApiMutation } from '@/hooks/useApi'

interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  image: string | null
}

interface MenuCategory {
  category: string
  items: MenuItem[]
}

interface RestaurantMenuProps {
  menu: MenuCategory[]
  restaurantId: string
  restaurantName: string
}

const RestaurantMenu = ({ menu, restaurantId, restaurantName }: RestaurantMenuProps) => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleOpenAddToCartDialog = (item: MenuItem) => {
    setSelectedItem(item)
    setDialogOpen(true)
  }

  const { mutate: addToCart, isPending: adding } = useApiMutation<
    unknown,
    {
      menuitem_id: number
      quantity: number
      note?: string
    }
  >('/cart', {
    onSuccess: () => {
      toast({
        title: 'Đã thêm vào giỏ hàng',
        description: selectedItem?.name,
      })
      setDialogOpen(false)
    },
    onError: () => {
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm vào giỏ hàng',
        variant: 'destructive',
      })
    },
  })

  const handleConfirmAddToCart = (quantity: number, note?: string) => {
    if (!selectedItem) return
    addToCart({
      menuitem_id: Number(selectedItem.id),
      quantity,
      note,
    })
  }

  return (
    <div className="space-y-8">
      {menu.map((category, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
            {category.category}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="flex-1 p-4">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <span className="font-medium text-foodsnap-orange">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>

                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-foodsnap-teal hover:text-foodsnap-teal/80 hover:bg-foodsnap-teal/10 p-0 h-auto"
                        onClick={() => handleOpenAddToCartDialog(item)}
                      >
                        <PlusCircle size={16} className="mr-1" /> Add to cart
                      </Button>
                    </div>

                    {item.image && (
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {selectedItem && (
        <AddToCartDialog
          item={selectedItem}
          restaurantId={restaurantId}
          restaurantName={restaurantName}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onConfirm={handleConfirmAddToCart}
        />
      )}
    </div>
  )
}

export default RestaurantMenu
