import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PenLine, Plus, Check, Lock } from 'lucide-react'
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
import { useApiQuery, useApiPatchMutation, useApiMutation } from '@/hooks/useApi'
import { AddressItem } from '@/components/AddressItem'
import { Profile } from '@/types/types'

type Address = {
  address_id: number
  label: string
  district: string
  address: string
  is_default: boolean
}

const DISTRICTS = ['Cầu Giấy', 'Đống Đa', 'Ba Đình', 'Thanh Xuân']

const ProfilePage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  // Lấy profile từ API
  const {
    data: profileRes,
    isLoading: isLoadingProfile,
    refetch: refetchProfile,
  } = useApiQuery<Profile>(['profile'], '/user/profile')
  const profile = profileRes

  // Lấy địa chỉ đã lưu
  const {
    data: addressesRes,
    isLoading: isLoadingAddresses,
    refetch: refetchAddresses,
  } = useApiQuery<Address[]>(['address'], '/address')
  const addresses = addressesRes || []

  // State cho form edit profile
  const [isEditing, setIsEditing] = useState(false)
  const [editFullname, setEditFullname] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editEmail, setEditEmail] = useState('')

  // State cho sheet thêm địa chỉ
  const [newAddressLabel, setNewAddressLabel] = useState('')
  const [newAddressDistrict, setNewAddressDistrict] = useState('')
  const [newAddress, setNewAddress] = useState('')

  // State cho đổi mật khẩu
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // PATCH update profile
  const updateProfileMutation = useApiPatchMutation<
    { fullname: string; phonenumber: string; email: string },
    any
  >('/user/profile', {
    onSuccess: (res) => {
      toast({ title: 'Cập nhật thành công', description: 'Thông tin cá nhân đã được lưu.' })
      setIsEditing(false)
      refetchProfile()
    },
    onError: (err: any) => {
      toast({
        title: 'Lỗi',
        description: err.message || 'Không cập nhật được thông tin.',
        variant: 'destructive',
      })
    },
  })

  // PATCH đổi mật khẩu
  const changePasswordMutation = useApiPatchMutation<
    { oldPassword: string; newPassword: string },
    any
  >('/user/change-password', {
    onSuccess: () => {
      toast({ title: 'Đổi mật khẩu thành công', description: 'Bạn đã đổi mật khẩu mới.' })
      setShowChangePassword(false)
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    },
    onError: (err: any) => {
      toast({
        title: 'Lỗi',
        description: err.message || 'Không đổi được mật khẩu.',
        variant: 'destructive',
      })
    },
  })

  // Thêm địa chỉ
  const { mutate: createAddress } = useApiMutation<
    any,
    { label: string; district: string; address: string }
  >('/address', {
    onSuccess: () => {
      toast({ title: 'Đã thêm địa chỉ' })
      refetchAddresses()
      setNewAddress('')
      setNewAddressLabel('')
      setNewAddressDistrict('')
    },
    onError: () => {
      toast({ title: 'Thêm thất bại', variant: 'destructive' })
    },
  })

  // Handle lưu thay đổi profile
  const handleSaveProfile = () => {
    updateProfileMutation.mutate({
      fullname: editFullname,
      phonenumber: editPhone,
      email: editEmail,
    })
  }

  // Khi ấn chỉnh sửa, fill lại form
  const handleEditClick = () => {
    setEditFullname(profile?.fullname || '')
    setEditPhone(profile?.phonenumber || '')
    setEditEmail(profile?.email || '')
    setIsEditing(true)
  }

  // Handle mở form đổi mật khẩu
  const openChangePassword = () => {
    setShowChangePassword(true)
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  // Handle đổi mật khẩu
  const handleChangePassword = () => {
    if (!oldPassword || !newPassword) {
      toast({ title: 'Lỗi', description: 'Vui lòng nhập đầy đủ thông tin', variant: 'destructive' })
      return
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'Lỗi', description: 'Mật khẩu mới không khớp', variant: 'destructive' })
      return
    }
    setIsChangingPassword(true)
    changePasswordMutation.mutate(
      { oldPassword, newPassword },
      { onSettled: () => setIsChangingPassword(false) },
    )
  }

  // Thêm địa chỉ
  const handleAddAddress = () => {
    if (!newAddressLabel.trim() || !newAddressDistrict.trim() || !newAddress.trim()) return
    createAddress({
      label: newAddressLabel,
      district: newAddressDistrict,
      address: newAddress,
    })
  }

  // Nếu chưa login hoặc chưa fetch xong thì chặn vào trang
  if (isLoadingProfile && !profile) return <div>Đang tải thông tin...</div>
  if (!profile) {
    navigate('/')
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tài khoản của tôi</h1>

        {/* Profile info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Thông tin cá nhân</span>
              {!isEditing ? (
                <Button variant="outline" onClick={handleEditClick}>
                  <PenLine size={16} className="mr-2" />
                  Chỉnh sửa
                </Button>
              ) : (
                <Button onClick={handleSaveProfile} disabled={updateProfileMutation.isPending}>
                  <Check size={16} className="mr-2" />
                  {updateProfileMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Họ tên</Label>
                {isEditing ? (
                  <Input value={editFullname} onChange={(e) => setEditFullname(e.target.value)} />
                ) : (
                  <div className="text-lg mt-1">{profile?.fullname || 'Chưa có tên'}</div>
                )}
              </div>
              <div>
                <Label>Số điện thoại</Label>
                {isEditing ? (
                  <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
                ) : (
                  <div className="text-lg mt-1">{profile?.phonenumber || 'Chưa có số'}</div>
                )}
              </div>
              <div>
                <Label>Email</Label>
                {isEditing ? (
                  <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                ) : (
                  <div className="text-lg mt-1">{profile?.email || 'Chưa có email'}</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Đổi mật khẩu */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Đổi mật khẩu</span>
              {!showChangePassword ? (
                <Button variant="outline" onClick={openChangePassword}>
                  <Lock size={16} className="mr-2" />
                  Đổi mật khẩu
                </Button>
              ) : null}
            </CardTitle>
          </CardHeader>
          {showChangePassword && (
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Mật khẩu cũ</Label>
                  <Input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Mật khẩu mới</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Nhập lại mật khẩu mới</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleChangePassword}
                    disabled={isChangingPassword}
                    className="bg-foodsnap-teal hover:bg-foodsnap-teal/90"
                  >
                    {isChangingPassword ? 'Đang đổi...' : 'Lưu mật khẩu'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowChangePassword(false)}>
                    Hủy
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Danh sách địa chỉ */}
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
            {isLoadingAddresses ? (
              <div>Đang tải địa chỉ...</div>
            ) : addresses.length > 0 ? (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <AddressItem
                    key={address.address_id}
                    address={address}
                    refetch={refetchAddresses}
                  />
                ))}
              </div>
            ) : (
              <div className="text-gray-500">Chưa có địa chỉ nào</div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

export default ProfilePage
