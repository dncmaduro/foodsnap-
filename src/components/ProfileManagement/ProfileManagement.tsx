import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Save } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { useApiPatchMutation } from '@/hooks/useApi'
import { DetailRestaurant } from '@/types/types'

const formSchema = z.object({
  name: z.string().min(2, 'Tên nhà hàng phải có ít nhất 2 ký tự'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  district: z.string().min(1, 'Vui lòng chọn quận/huyện'),
  address: z.string().min(5, 'Địa chỉ cụ thể phải có ít nhất 5 ký tự'),
  description: z.string().optional(),
  image_url: z.string().optional(),
  open_time: z.string().optional(),
  close_time: z.string().optional(),
})

const districts = ['Hoàn Kiếm', 'Cầu Giấy', 'Đống Đa', 'Ba Đình', 'Thanh Xuân']

interface Props {
  restaurant: DetailRestaurant
  onUpdateSuccess?: () => void
}

const ProfileManagement = ({ restaurant, onUpdateSuccess }: Props) => {
  const [image, setImage] = useState<string | null>(restaurant.image_url || null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: restaurant.name,
      phone: restaurant.phone,
      district: restaurant.district,
      address: restaurant.address,
      description: restaurant.description,
      image_url: restaurant.image_url,
      open_time: restaurant.open_time,
      close_time: restaurant.close_time,
    },
  })

  const updateRestaurantMutation = useApiPatchMutation<any, Partial<z.infer<typeof formSchema>>>(
    `/restaurant/${restaurant.restaurant_id}`,
    {
      onSuccess: () => {
        toast({
          title: 'Lưu thành công',
          description: 'Thông tin nhà hàng đã được cập nhật',
        })
        onUpdateSuccess?.()
      },
      onError: (err: any) => {
        toast({
          title: 'Lưu không thành công',
          description: err?.message || 'Có lỗi xảy ra khi lưu.',
          variant: 'destructive',
        })
      },
    },
  )

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSaving(true)
    updateRestaurantMutation.mutate(
      { ...values, image_url: image || undefined },
      { onSettled: () => setIsSaving(false) },
    )
  }

  // ... (giữ logic upload image, chỉ sửa setImage và toast nếu muốn)

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              {/* Các trường form như cũ, update image, tên, mô tả, ... */}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              {/* Upload image section */}
              {/* ... */}
              <label className="cursor-pointer">
                <Button type="button" variant="outline" className="relative" disabled={isUploading}>
                  {isUploading ? 'Đang tải...' : 'Tải ảnh lên'}
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) setImage(URL.createObjectURL(file))
                    }}
                    accept="image/jpeg,image/png"
                    disabled={isUploading}
                  />
                </Button>
              </label>
            </CardContent>
          </Card>
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              type="submit"
              className="bg-foodsnap-teal hover:bg-foodsnap-teal/90"
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ProfileManagement
