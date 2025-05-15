import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PenLine, Plus, Trash2, Check } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useToast } from '@/hooks/use-toast'
import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { AddressItem } from '@/components/AddressItem'

type Address = {
  address_id: number
  label: string
  district: string
  address: string
  is_default: boolean
}

const DISTRICTS = ['Cầu Giấy', 'Đống Đa', 'Ba Đình', 'Thanh Xuân']

const ProfilePage = () => {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.fullname || '')
  const [phone, setPhone] = useState(user?.phonenumber || '')
  const [currentRole, setCurrentRole] = useState('user')

  const [newAddressLabel, setNewAddressLabel] = useState('')
  const [newAddressDistrict, setNewAddressDistrict] = useState('')
  const [newAddress, setNewAddress] = useState('')

  const { data: addresses, isLoading, refetch } = useApiQuery<Address[]>(['address'], '/address')

  const { mutate: createAddress } = useApiMutation<
    unknown,
    { label: string; district: string; address: string }
  >('/address', {
    onSuccess: () => {
      toast({ title: 'Đã thêm địa chỉ' })
      refetch()
      setNewAddress('')
      setNewAddressLabel('')
      setNewAddressDistrict('')
    },
    onError: () => {
      toast({ title: 'Thêm thất bại', variant: 'destructive' })
    },
  })

  if (!isAuthenticated) {
    navigate('/')
    return null
  }

  const handleSaveChanges = () => {
    toast({ title: 'Profile Updated', description: 'Thông tin đã được cập nhật.' })
    setIsEditing(false)
  }

  const handleAddAddress = () => {
    if (!newAddressLabel.trim() || !newAddressDistrict.trim() || !newAddress.trim()) return

    createAddress({
      label: newAddressLabel,
      district: newAddressDistrict,
      address: newAddress,
    })
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    toast({ title: 'Đăng xuất thành công' })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Thông tin cá nhân</span>
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <PenLine size={16} className="mr-2" />
                  Chỉnh sửa
                </Button>
              ) : (
                <Button onClick={handleSaveChanges}>
                  <Check size={16} className="mr-2" />
                  Lưu thay đổi
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Họ tên</Label>
                {isEditing ? (
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                ) : (
                  <div className="text-lg mt-1">{name || 'Chưa có tên'}</div>
                )}
              </div>
              <div>
                <Label>Số điện thoại</Label>
                {isEditing ? (
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                ) : (
                  <div className="text-lg mt-1">{phone || 'Chưa có số'}</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Địa chỉ đã lưu</span>
              <Sheet>
                <SheetTrigger asChild>
                  <Button>
                    <Plus size={16} className="mr-2" />
                    Thêm địa chỉ
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Thêm địa chỉ mới</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-4 mt-6">
                    <div>
                      <Label>Tên địa chỉ</Label>
                      <Input
                        placeholder="Nhà riêng, công ty..."
                        value={newAddressLabel}
                        onChange={(e) => setNewAddressLabel(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Quận</Label>
                      <Select value={newAddressDistrict} onValueChange={setNewAddressDistrict}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn quận" />
                        </SelectTrigger>
                        <SelectContent>
                          {DISTRICTS.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Địa chỉ chi tiết</Label>
                      <Input
                        placeholder="Số nhà, tên đường..."
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={handleAddAddress}
                      className="w-full mt-4"
                      disabled={!newAddressLabel || !newAddressDistrict || !newAddress}
                    >
                      Lưu địa chỉ
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div>Đang tải địa chỉ...</div>
            ) : addresses.data.length > 0 ? (
              <div className="space-y-4">
                {addresses.data.map((address) => (
                  <AddressItem key={address.address_id} address={address} refetch={refetch} />
                ))}
              </div>
            ) : (
              <div className="text-gray-500">Chưa có địa chỉ nào</div>
            )}
          </CardContent>
        </Card>

        <Button onClick={handleLogout} variant="destructive" className="w-full mb-8">
          Đăng xuất
        </Button>
      </main>

      <Footer />
    </div>
  )
}

export default ProfilePage
