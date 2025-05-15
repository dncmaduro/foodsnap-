import { useState } from 'react'
import { ArrowLeft, Upload } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Footer from '@/components/Footer'
import { useToast } from '@/hooks/use-toast'
import { useApiMutation } from '@/hooks/useApi'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  phone: z
    .string()
    .min(1, 'Số điện thoại không được để trống')
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ'),
})

type FormValues = z.infer<typeof formSchema>

export default function DeliveryDriverRegistrationForm() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [frontFile, setFrontFile] = useState<File | null>(null)
  const [backFile, setBackFile] = useState<File | null>(null)
  const [frontPreview, setFrontPreview] = useState<string | null>(null)
  const [backPreview, setBackPreview] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: '',
    },
  })

  const { mutate: submitApplication, isPending } = useApiMutation('/shipper-application', {
    onSuccess: () => {
      toast({ title: 'Đăng ký thành công', description: 'Hồ sơ đang được xét duyệt' })
      navigate('/delivery-registration')
    },
    onError: (err) => {
      toast({ title: 'Lỗi', description: err.message, variant: 'destructive' })
    },
  })

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Lỗi', description: 'Ảnh quá lớn (tối đa 5MB)', variant: 'destructive' })
      return
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast({ title: 'Lỗi', description: 'Chỉ chấp nhận JPG/PNG', variant: 'destructive' })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (type === 'front') {
        setFrontPreview(reader.result as string)
        setFrontFile(file)
      } else {
        setBackPreview(reader.result as string)
        setBackFile(file)
      }
    }
    reader.readAsDataURL(file)
  }

  const onSubmit = (values: FormValues) => {
    if (!frontFile || !backFile) {
      toast({ title: 'Thiếu ảnh', description: 'Vui lòng tải đủ 2 mặt giấy phép' })
      return
    }

    const formData = new FormData()
    formData.append('phone', values.phone)
    formData.append('files', frontFile)
    formData.append('files', backFile)

    submitApplication(formData as any)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow px-4 py-6">
        <div className="max-w-md mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center mb-6 -ml-2 text-gray-600 hover:text-gray-900"
            size="sm"
          >
            <ArrowLeft size={18} className="mr-1" />
            Quay lại
          </Button>

          <h1 className="text-2xl font-bold mb-4 text-gray-900">Đăng ký tài xế</h1>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 bg-white p-4 rounded-lg border shadow-sm"
            >
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="0912345678" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Label>Ảnh giấy phép lái xe (2 mặt)</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {['front', 'back'].map((type) => {
                    const preview = type === 'front' ? frontPreview : backPreview
                    const id = `${type}License`

                    return (
                      <div key={type} className="space-y-1">
                        <Label className="text-xs text-gray-600">
                          {type === 'front' ? 'Mặt trước' : 'Mặt sau'}
                        </Label>
                        {preview ? (
                          <img
                            src={preview}
                            alt={id}
                            className="aspect-[3/2] object-cover rounded-md border"
                          />
                        ) : (
                          <label
                            htmlFor={id}
                            className="flex items-center justify-center aspect-[3/2] border-2 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100"
                          >
                            <Upload className="text-gray-400 w-5 h-5" />
                          </label>
                        )}
                        <input
                          id={id}
                          type="file"
                          accept="image/jpeg,image/png"
                          className="hidden"
                          onChange={(e) => handleFile(e, type as 'front' | 'back')}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-foodsnap-teal hover:bg-foodsnap-teal/90"
                disabled={isPending}
              >
                {isPending ? 'Đang gửi...' : 'Gửi đăng ký'}
              </Button>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
