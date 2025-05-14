import { Minus, Plus, Trash2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { useApiDeleteMutation, useApiMutation, useApiPatchMutation } from '@/hooks/useApi'

interface Props {
  item: {
    id: string
    name: string
    quantity: number
    price: number
    notes: string
  }
  refetch: () => void
}

const CartItem = ({ item, refetch }: Props) => {
  const { mutate: updateQuantity, isPending: updating } = useApiPatchMutation<
    unknown,
    { quantity: number }
  >(`/cart/${item.id}`, {
    onSuccess: () => {
      toast({ title: 'Đã cập nhật' })
      refetch()
    },
    onError: () => {
      toast({ title: 'Cập nhật thất bại', variant: 'destructive' })
    },
  })

  const { mutate: deleteItem, isPending: deleting } = useApiDeleteMutation<unknown>(
    `/cart/${item.id}`,
    {
      onSuccess: () => {
        toast({ title: 'Đã xóa món' })
        refetch()
      },
      onError: () => {
        toast({ title: 'Xóa thất bại', variant: 'destructive' })
      },
    },
  )

  const handleChangeQuantity = (diff: number) => {
    const newQty = item.quantity + diff
    if (newQty <= 0) {
      deleteItem()
    } else {
      updateQuantity({ quantity: newQty })
    }
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 border-b border-gray-100">
      <div className="flex-grow mb-2 sm:mb-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{item.name}</h3>
          {item.notes && <p className="text-sm text-gray-500">{item.notes}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-6 w-full sm:w-auto">
        {/* Quantity Selector */}
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            disabled={updating || deleting}
            onClick={() => handleChangeQuantity(-1)}
          >
            <Minus size={16} />
          </Button>
          <span className="px-2">{item.quantity}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            disabled={updating || deleting}
            onClick={() => handleChangeQuantity(1)}
          >
            <Plus size={16} />
          </Button>
        </div>

        {/* Price */}
        <div className="w-16 text-right font-medium">
          {(item.price * item.quantity).toFixed(0)}đ
        </div>

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-red-500"
          disabled={deleting}
          onClick={() => deleteItem()}
        >
          <Trash2 size={18} />
        </Button>
      </div>
    </div>
  )
}

export default CartItem
