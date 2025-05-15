import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, MapPin, Wallet, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { useAuthStore } from '@/store/authStore'
import LoginDialog from '@/components/LoginDialog'
import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { useCheckoutStore } from '@/store/checkoutStore'

interface Address {
  address_id: number
  label: string
  address: string
  district: string
  is_default: boolean
}

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { isAuthenticated } = useAuthStore()
  const [loginDialogOpen, setLoginDialogOpen] = useState(!isAuthenticated)

  const { restaurant_id, items, clearCheckoutInfo } = useCheckoutStore()

  const [deliveryAddress, setDeliveryAddress] = useState('saved')
  const [driverNote, setDriverNote] = useState('')
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)

  const [addressForm, setAddressForm] = useState({
    label: '',
    district: '',
    address: '',
  })

  const { data: addressData, refetch: refetchAddresses } = useApiQuery<Address[]>(
    ['addresses'],
    '/address',
  )

  const { mutate: createAddress } = useApiMutation<
    unknown,
    { label: string; district: string; address: string }
  >('/address', {
    onSuccess: () => {
      toast({ title: 'Đã thêm địa chỉ' })
      refetchAddresses()
      setDeliveryAddress('saved')
    },
    onError: () => {
      toast({ title: 'Lỗi', description: 'Không thể thêm địa chỉ', variant: 'destructive' })
    },
  })

  const { mutate: createOrder } = useApiMutation<
    { order_id: number },
    {
      address_id: number
      restaurant_id: number
      delivery_note: string
      subtotal: number
      shipping_fee: number
      total_price: number
      items: {
        menuitem_id: number
        quantity: number
        price: number
        note: string
      }[]
    }
  >('/order', {
    onSuccess: (response) => {
      toast({ title: 'Đặt hàng thành công!' })
      clearCheckoutInfo()
      navigate(`/order-confirmation/${response.data.order_id}`)
    },
    onError: () => {
      toast({ title: 'Lỗi khi đặt hàng', variant: 'destructive' })
    },
  })

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAddressForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleDistrictChange = (value: string) => {
    setAddressForm((prev) => ({ ...prev, district: value }))
  }

  const handleCreateAddress = () => {
    if (!addressForm.label || !addressForm.address || !addressForm.district) {
      toast({ title: 'Vui lòng điền đầy đủ thông tin', variant: 'destructive' })
      return
    }
    createAddress(addressForm)
  }

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const deliveryFee = items.length > 0 ? 2.99 : 0
  const total = subtotal + deliveryFee

  const handlePlaceOrder = () => {
    if (!selectedAddressId || !restaurant_id || items.length === 0) {
      toast({ title: 'Thiếu thông tin đặt hàng', variant: 'destructive' })
      return
    }

    createOrder({
      address_id: selectedAddressId,
      restaurant_id,
      delivery_note: driverNote,
      subtotal,
      shipping_fee: deliveryFee,
      total_price: total,
      items,
    })
  }

  const handleLoginSuccess = () => {
    setLoginDialogOpen(false)
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h1>
            <p className="mb-6">
              Bạn không thể tiến hành thanh toán khi không có món ăn nào trong giỏ hàng.
            </p>
            <Button onClick={() => navigate('/')} className="bg-foodsnap-orange">
              Khám phá nhà hàng
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Thanh toán</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-foodsnap-orange" />
                  Chọn địa chỉ giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={deliveryAddress}
                  onValueChange={setDeliveryAddress}
                  className="gap-4"
                >
                  {addressData?.data.map((addr) => (
                    <div key={addr.address_id} className="flex items-start gap-2">
                      <RadioGroupItem
                        value={`address-${addr.address_id}`}
                        id={`address-${addr.address_id}`}
                        onClick={() => setSelectedAddressId(addr.address_id)}
                      />
                      <Label htmlFor={`address-${addr.address_id}`}>
                        <div>
                          <p className="font-medium">{addr.label}</p>
                          <p className="text-sm text-gray-600">{addr.address}</p>
                          <p className="text-sm text-gray-500 italic">Quận: {addr.district}</p>
                        </div>
                      </Label>
                    </div>
                  ))}

                  <div className="mt-4 flex items-start space-x-2">
                    <RadioGroupItem value="new" id="new-address" />
                    <div className="grid gap-2 w-full">
                      <Label htmlFor="new-address">Thêm địa chỉ mới</Label>
                      {deliveryAddress === 'new' && (
                        <>
                          <Input
                            name="label"
                            placeholder="Tên địa chỉ (ví dụ: Nhà, Công ty...)"
                            value={addressForm.label}
                            onChange={handleAddressChange}
                          />
                          <Input
                            name="address"
                            placeholder="Địa chỉ chi tiết"
                            value={addressForm.address}
                            onChange={handleAddressChange}
                          />
                          <Select onValueChange={handleDistrictChange} value={addressForm.district}>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn quận" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Cầu Giấy">Cầu Giấy</SelectItem>
                              <SelectItem value="Đống Đa">Đống Đa</SelectItem>
                              <SelectItem value="Ba Đình">Ba Đình</SelectItem>
                              <SelectItem value="Thanh Xuân">Thanh Xuân</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button onClick={handleCreateAddress} className="w-fit">
                            Lưu địa chỉ
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-foodsnap-orange" />
                  Ghi chú cho tài xế
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={driverNote}
                  onChange={(e) => setDriverNote(e.target.value)}
                  placeholder="Ví dụ: Gọi trước khi đến, không bấm chuông..."
                />
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>
                      {item.quantity} × Món #{item.menuitem_id}
                    </span>
                    <span>{(item.price * item.quantity).toFixed(0)}đ</span>
                  </div>
                ))}

                <Separator className="my-4" />

                <div className="flex justify-between text-sm">
                  <span>Phí giao hàng</span>
                  <span>{deliveryFee.toFixed(0)}đ</span>
                </div>

                <div className="flex justify-between text-lg font-bold mt-2">
                  <span>Tổng cộng</span>
                  <span>{total.toFixed(0)}đ</span>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  className="mt-4 w-full bg-foodsnap-orange hover:bg-foodsnap-orange/90"
                >
                  Đặt hàng <Check className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />

      <LoginDialog
        isOpen={loginDialogOpen}
        onClose={() => navigate('/cart')}
        onSuccess={handleLoginSuccess}
      />
    </div>
  )
}

export default CheckoutPage
