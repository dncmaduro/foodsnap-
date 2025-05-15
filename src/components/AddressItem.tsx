import { Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { useApiDeleteMutation } from '@/hooks/useApi'
import { toast } from '@/hooks/use-toast'

interface Props {
  address: {
    address_id: number
    label: string
    district: string
    address: string
    is_default: boolean
  }
  refetch: () => void
}

export const AddressItem = ({ address, refetch }: Props) => {
  const { mutate: deleteAddress } = useApiDeleteMutation<unknown>(
    `/address/${address.address_id}`,
    {
      onSuccess: () => {
        toast({ title: 'Đã xoá địa chỉ' })
        refetch()
      },
      onError: () => {
        toast({ title: 'Xoá thất bại', variant: 'destructive' })
      },
    },
  )

  return (
    <div
      key={address.address_id}
      className={`p-4 border rounded-md ${
        address.is_default ? 'border-foodsnap-teal bg-teal-50' : 'border-gray-200'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium">{address.label}</div>
          <div className="text-gray-600 mt-1">
            <div>{address.district}</div>
            <div>{address.address}</div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => deleteAddress()}>
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  )
}
