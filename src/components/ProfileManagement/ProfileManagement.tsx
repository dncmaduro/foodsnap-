import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Save, Upload } from 'lucide-react'
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
  open_time: z.string().optional(),
  close_time: z.string().optional(),
})

const districts = ['Hoàn Kiếm', 'Cầu Giấy', 'Đống Đa', 'Ba Đình', 'Thanh Xuân']

interface Props {
  restaurant: DetailRestaurant
  onUpdateSuccess?: () => void
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop'

const ProfileManagement = ({ restaurant, onUpdateSuccess }: Props) => {
  const [imagePreview, setImagePreview] = useState<string>(restaurant.image_url || DEFAULT_IMAGE)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const inputFileRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: restaurant.name || '',
      phone: restaurant.phone || '',
      district: restaurant.district || '',
      address: restaurant.address || '',
      description: restaurant.description || '',
      open_time: restaurant.open_time || '',
      close_time: restaurant.close_time || '',
    },
  })

  const updateRestaurantMutation = useApiPatchMutation<any, any>(
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

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Ảnh quá lớn', description: 'Tối đa 5MB', variant: 'destructive' })
      return
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast({ title: 'Sai định dạng', description: 'Chỉ nhận JPG/PNG', variant: 'destructive' })
      return
    }
    setImagePreview(URL.createObjectURL(file))
    setSelectedFile(file)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSaving(true)
    if (selectedFile) {
      // Gửi form-data nếu có ảnh mới
      const formData = new FormData()
      Object.entries(values).forEach(([k, v]) => v && formData.append(k, v as string))
      formData.append('file', selectedFile)
      updateRestaurantMutation.mutate(formData as any)
    } else {
      // Không đổi ảnh, gửi JSON bình thường
      updateRestaurantMutation.mutate(values, {
        onSettled: () => setIsSaving(false),
      })
    }
  }

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col items-center gap-3 mb-6">
                <img
                  src={imagePreview}
                  alt="Ảnh nhà hàng"
                  className="w-32 h-32 rounded object-cover border"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="relative"
                  onClick={() => inputFileRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Đổi ảnh
                  <input
                    ref={inputFileRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImage}
                  />
                </Button>
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên nhà hàng</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quận/Huyện</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn quận/huyện" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {districts.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="open_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giờ mở cửa</FormLabel>
                    <FormControl>
                      <Input {...field} type="time" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="close_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giờ đóng cửa</FormLabel>
                    <FormControl>
                      <Input {...field} type="time" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row justify-end">
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
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfileManagement
