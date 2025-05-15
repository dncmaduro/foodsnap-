import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import Footer from '@/components/Footer'
import { toast } from 'sonner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useApiMutation } from '@/hooks/useApi'

const formSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên nhà hàng'),
  phone: z.string().min(1, 'Vui lòng nhập số điện thoại'),
  address: z.string().min(1, 'Vui lòng nhập địa chỉ nhà hàng'),
  district: z.string().min(1, 'Vui lòng chọn quận'),
  cccd: z
    .string()
    .length(12, 'Số CCCD phải có 12 chữ số')
    .regex(/^\d+$/, 'Số CCCD chỉ được chứa chữ số'),
  frontIdImage: z.instanceof(File, { message: 'Thiếu ảnh mặt trước CCCD' }),
  backIdImage: z.instanceof(File, { message: 'Thiếu ảnh mặt sau CCCD' }),
  termsAgreed: z.literal(true, {
    errorMap: () => ({ message: 'Bạn phải đồng ý với điều khoản dịch vụ' }),
  }),
})

type FormValues = z.infer<typeof formSchema>

const RestaurantRegistrationPage = () => {
  const navigate = useNavigate()
  const [frontIdPreview, setFrontIdPreview] = useState<string | null>(null)
  const [backIdPreview, setBackIdPreview] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      district: '',
      cccd: '',
      termsAgreed: true,
    },
  })

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: 'frontIdImage' | 'backIdImage',
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      form.setValue(field, file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const { mutate: submitApplication, isPending } = useApiMutation<unknown, FormData>(
    '/restaurant-application',
    {
      onSuccess: () => {
        toast.success('Đăng ký thành công!')
        navigate('/restaurant-management')
      },
      onError: (err) => {
        toast.error(`Lỗi đăng ký: ${err.message}`)
      },
    },
  )

  const onSubmit = (data: FormValues) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('phone', data.phone)
    formData.append('district', data.district)
    formData.append('address', data.address)
    formData.append('cccd', data.cccd)
    formData.append('files', data.frontIdImage)
    formData.append('files', data.backIdImage)

    console.log(formData, data)

    submitApplication(formData)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-white border-b border-gray-200 py-3 px-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/restaurant-management')}
          className="text-gray-700 hover:text-foodsnap-teal flex items-center"
        >
          <ArrowLeft size={18} className="mr-2" />
          <span>Quay lại</span>
        </Button>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Đăng ký nhà hàng</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên nhà hàng</FormLabel>
                    <FormControl>
                      <Input placeholder="Tên nhà hàng" {...field} />
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
                      <Input placeholder="0888..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <Input placeholder="Địa chỉ cụ thể" {...field} />
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
                      <FormLabel>Quận</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn quận" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cầu Giấy">Cầu Giấy</SelectItem>
                          <SelectItem value="Đống Đa">Đống Đa</SelectItem>
                          <SelectItem value="Ba Đình">Ba Đình</SelectItem>
                          <SelectItem value="Thanh Xuân">Thanh Xuân</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="cccd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số CCCD</FormLabel>
                    <FormControl>
                      <Input placeholder="12 số CCCD" maxLength={12} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Ảnh mặt trước CCCD</Label>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-32"
                    onClick={() => document.getElementById('frontIdImage')?.click()}
                  >
                    {frontIdPreview ? (
                      <img src={frontIdPreview} alt="Front" className="h-full object-contain" />
                    ) : (
                      <Upload className="h-6 w-6 text-gray-400" />
                    )}
                  </Button>
                  <input
                    type="file"
                    id="frontIdImage"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, 'frontIdImage', setFrontIdPreview)}
                  />
                  {form.formState.errors.frontIdImage && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.frontIdImage.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Ảnh mặt sau CCCD</Label>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-32"
                    onClick={() => document.getElementById('backIdImage')?.click()}
                  >
                    {backIdPreview ? (
                      <img src={backIdPreview} alt="Back" className="h-full object-contain" />
                    ) : (
                      <Upload className="h-6 w-6 text-gray-400" />
                    )}
                  </Button>
                  <input
                    type="file"
                    id="backIdImage"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, 'backIdImage', setBackIdPreview)}
                  />
                  {form.formState.errors.backIdImage && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.backIdImage.message}
                    </p>
                  )}
                </div>
              </div>

              <FormField
                control={form.control}
                name="termsAgreed"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-3">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div>
                      <FormLabel>
                        Tôi đồng ý với{' '}
                        <a href="/terms" className="text-foodsnap-teal hover:underline">
                          Điều khoản dịch vụ
                        </a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full py-6 text-lg" disabled={isPending}>
                {isPending ? 'Đang gửi...' : 'Đăng ký'}
              </Button>
            </form>
          </Form>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default RestaurantRegistrationPage
