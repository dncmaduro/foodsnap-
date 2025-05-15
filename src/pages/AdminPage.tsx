import { useEffect, useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useApiPatchMutation, useApiQuery } from '@/hooks/useApi'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

type ApplicationStatus = 'pending' | 'approved' | 'rejected'
type ApplicationType = 'restaurant' | 'shipper'

interface RestaurantApplication {
  restaurantapp_id: number
  name: string
  phone: string
  district: string
  address: string
  created_at: string
  status: ApplicationStatus
}

interface ShipperApplication {
  shipperapp_id: number
  phone: string
  fullname: string | null
  created_at: string
  status: ApplicationStatus
}

type ParsedApplication = {
  id: number
  type: ApplicationType
  name: string
  phone: string
  address?: string
  district?: string
  created_at: string
  status: ApplicationStatus
}

export default function AdminPage() {
  const [type, setType] = useState<ApplicationType>('restaurant')
  const [status, setStatus] = useState<'all' | ApplicationStatus>('pending')
  const [searchText, setSearchText] = useState('')

  const queryKey = ['admin-applications', type, status, searchText]

  const { data, refetch } = useApiQuery<RestaurantApplication[] | ShipperApplication[]>(
    queryKey,
    '/admin-applications',
    {
      type,
      status: status !== 'all' ? status : undefined,
      searchText: searchText || undefined,
    },
  )

  useEffect(() => {
    refetch()
  }, [type, status, searchText])

  const parsed: ParsedApplication[] = (data?.data || []).map((app: any): ParsedApplication => {
    if (type === 'restaurant') {
      return {
        id: app.restaurantapp_id,
        type,
        name: app.name,
        phone: app.phone,
        address: app.address,
        district: app.district,
        created_at: app.created_at,
        status: app.status,
      }
    }
    return {
      id: app.shipperapp_id,
      type,
      name: app.fullname ?? '(Không có tên)',
      phone: app.phone,
      created_at: app.created_at,
      status: app.status,
    }
  })

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-6 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">Quản lý đơn đăng ký</h1>

        <Tabs value={type} onValueChange={(val) => setType(val as ApplicationType)}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="restaurant">Nhà hàng</TabsTrigger>
            <TabsTrigger value="shipper">Tài xế</TabsTrigger>
          </TabsList>

          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Tìm kiếm theo tên hoặc số điện thoại"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1"
            />
            <Select value={status} onValueChange={(val) => setStatus(val as any)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="pending">Đang chờ</SelectItem>
                <SelectItem value="approved">Đã duyệt</SelectItem>
                <SelectItem value="rejected">Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="restaurant">
            <ApplicationList applications={parsed} refetch={refetch} />
          </TabsContent>

          <TabsContent value="shipper">
            <ApplicationList applications={parsed} refetch={refetch} />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}

const ApplicationList = ({
  applications,
  refetch,
}: {
  applications: ParsedApplication[]
  refetch: () => void
}) => {
  return applications.length === 0 ? (
    <p className="text-center text-gray-500 py-8">Không có đơn phù hợp.</p>
  ) : (
    <div className="grid grid-cols-1 gap-6">
      {applications.map((app) => (
        <ApplicationCard key={`${app.type}-${app.id}`} app={app} refetch={refetch} />
      ))}
    </div>
  )
}
const ApplicationCard = ({ app, refetch }: { app: ParsedApplication; refetch: () => void }) => {
  const { mutate: updateStatus } = useApiPatchMutation(
    `/admin-applications/${app.type}/${app.id}/status`,
    {
      onSuccess: () => toast({ title: 'Đã cập nhật trạng thái' }),
      onError: () => toast({ title: 'Lỗi cập nhật', variant: 'destructive' }),
      onSettled: () => refetch(),
    },
  )

  const handleUpdate = (newStatus: ApplicationStatus) => {
    updateStatus({ status: newStatus })
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium">{app.name}</h2>
            <p className="text-gray-600 text-sm mt-1">{app.phone}</p>
            {app.address && (
              <p className="text-sm text-gray-600">
                {app.address}, {app.district}
              </p>
            )}
            <p className="text-sm text-gray-500">Trạng thái: {app.status}</p>
            <p className="text-xs text-gray-400 mt-1">
              Nộp lúc: {new Date(app.created_at).toLocaleString()}
            </p>
          </div>
          {app.status === 'pending' && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="text-green-600 border-green-400"
                onClick={() => handleUpdate('approved')}
              >
                Duyệt
              </Button>
              <Button
                variant="outline"
                className="text-red-600 border-red-400"
                onClick={() => handleUpdate('rejected')}
              >
                Từ chối
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
