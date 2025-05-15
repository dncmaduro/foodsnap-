import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useIsMobile } from '@/hooks/use-mobile'
import { ChevronLeft } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useApiPutMutation, useApiQuery } from '@/hooks/useApi'

type ShipperInfo = {
  fullname: string
  phonenumber: string
  bankName?: string
  accountNumber?: string
  accountHolder?: string
}

export default function DriverProfilePage() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const { data, isLoading } = useApiQuery<ShipperInfo>(['shipper-info', 'me'], '/shipper-info/me')

  const { mutate: updateProfile, isPending } = useApiPutMutation<ShipperInfo, ShipperInfo>(
    '/shipper-info/me',
    {
      onSuccess: () => {
        toast({
          title: 'Cập nhật thành công',
          description: 'Thông tin tài xế đã được cập nhật.',
        })
        setIsEditing(false)
      },
      onError: () => {
        toast({
          title: 'Lỗi',
          description: 'Không thể cập nhật thông tin',
          variant: 'destructive',
        })
      },
    },
  )

  const [formData, setFormData] = useState<ShipperInfo>({
    fullname: '',
    phonenumber: '',
    bankName: '',
    accountNumber: '',
    accountHolder: '',
  })

  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (data) {
      const { fullname, phonenumber, bankName, accountNumber, accountHolder } = data
      setFormData({
        fullname,
        phonenumber,
        bankName: bankName || '',
        accountNumber: accountNumber || '',
        accountHolder: accountHolder || '',
      })
    }
  }, [data])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile(formData)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <p className="text-center text-muted-foreground">Đang tải thông tin tài xế...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-2 py-4 max-w-2xl">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-2 -ml-2 gap-1">
        <ChevronLeft className="h-4 w-4" /> Quay lại
      </Button>

      <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-4`}>Hồ sơ tài xế</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className={isMobile ? 'text-base' : 'text-lg'}>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullname">Họ và tên</Label>
              <Input
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                readOnly={!isEditing}
                className={!isEditing ? 'bg-muted cursor-default' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phonenumber">Số điện thoại liên hệ</Label>
              <Input
                id="phonenumber"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleChange}
                readOnly={!isEditing}
                className={!isEditing ? 'bg-muted cursor-default' : ''}
              />
            </div>

            <div className="pt-2 border-t">
              <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-medium mb-3`}>
                Thông tin tài khoản ngân hàng
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Tên ngân hàng</Label>
                  <Input
                    id="bankName"
                    name="bankName"
                    value={formData.bankName || ''}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={!isEditing ? 'bg-muted cursor-default' : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Số tài khoản</Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber || ''}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={!isEditing ? 'bg-muted cursor-default' : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountHolder">Tên chủ tài khoản</Label>
                  <Input
                    id="accountHolder"
                    name="accountHolder"
                    value={formData.accountHolder || ''}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={!isEditing ? 'bg-muted cursor-default' : ''}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false)
                      if (data) {
                        const { fullname, phonenumber, bankName, accountNumber, accountHolder } =
                          data
                        setFormData({
                          fullname,
                          phonenumber,
                          bankName: bankName || '',
                          accountNumber: accountNumber || '',
                          accountHolder: accountHolder || '',
                        })
                      }
                    }}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Chỉnh sửa
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button variant="outline" onClick={() => navigate('/delivery-orders')}>
          Quay lại danh sách đơn hàng
        </Button>
      </div>
    </div>
  )
}
