import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Clock, Package, MapPin, Truck, Check, MessageCircle, HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { format } from 'date-fns';

// Trạng thái đơn hàng mẫu - trong ứng dụng thực tế, dữ liệu này sẽ đến từ API
type OrderStatus = 'received' | 'preparing' | 'out_for_delivery' | 'delivered';

type OrderStatusInfo = {
  status: OrderStatus;
  timestamp: string | null;
  completed: boolean;
};

type OrderDetails = {
  orderId: string;
  restaurantName: string;
  restaurantPhone: string;
  timeOrdered: string;
  estimatedDelivery: string;
  status: OrderStatus;
  items: { id: string; name: string; quantity: number }[];
  total: number;
  paymentMethod: string;
  deliveryAddress: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
  };
  driver?: {
    name: string;
    phone: string;
    photo?: string;
  };
};

const OrderTrackingPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [orderStatuses, setOrderStatuses] = useState<OrderStatusInfo[]>([
    { status: 'received', timestamp: null, completed: false },
    { status: 'preparing', timestamp: null, completed: false },
    { status: 'out_for_delivery', timestamp: null, completed: false },
    { status: 'delivered', timestamp: null, completed: false },
  ]);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    const stateOrderDetails = location.state?.orderDetails;
    
    if (stateOrderDetails) {
      setOrderDetails(stateOrderDetails);
    } else {
      const mockOrder: OrderDetails = {
        orderId: id || `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
        restaurantName: "Nhà Hàng Ngon",
        restaurantPhone: "0901234567",
        timeOrdered: "Hôm nay lúc 14:30",
        estimatedDelivery: "15:15 - 15:45",
        status: 'preparing',
        items: [
          { id: "1", name: "Hamburger Phô Mai", quantity: 2 },
          { id: "2", name: "Khoai Tây Chiên", quantity: 1 },
          { id: "3", name: "Gà Nuggets", quantity: 1 },
          { id: "4", name: "Coca Diet", quantity: 2 }
        ],
        total: 36.93,
        paymentMethod: "Thanh toán khi nhận hàng",
        deliveryAddress: {
          name: "Nguyễn Văn A",
          phone: "0901234567",
          address: "123 Đường Lê Lợi, P. Bến Nghé, Q.1, TP.HCM",
          notes: "Vui lòng bấm chuông hai lần."
        },
        driver: {
          name: "Trần Văn B",
          phone: "0909876543",
          photo: "https://randomuser.me/api/portraits/men/32.jpg"
        }
      };
      setOrderDetails(mockOrder);
    }
  }, [id, location]);

  useEffect(() => {
    if (orderDetails) {
      const now = new Date();
      const statusMap: Record<OrderStatus, number> = {
        'received': 25,
        'preparing': 50,
        'out_for_delivery': 75,
        'delivered': 100
      };
      
      setProgressValue(statusMap[orderDetails.status]);
      
      const updatedStatuses = [...orderStatuses];
      let allCompleted = true;
      
      const timeOffsets = {
        received: 0,
        preparing: 15,
        out_for_delivery: 30,
        delivered: 45
      };
      
      for (let i = 0; i < updatedStatuses.length; i++) {
        const status = updatedStatuses[i];
        const statusKey = status.status;
        
        if (
          (statusKey === 'received') ||
          (statusKey === 'preparing' && ['preparing', 'out_for_delivery', 'delivered'].includes(orderDetails.status)) ||
          (statusKey === 'out_for_delivery' && ['out_for_delivery', 'delivered'].includes(orderDetails.status)) ||
          (statusKey === 'delivered' && orderDetails.status === 'delivered')
        ) {
          const statusTime = new Date(now.getTime() - timeOffsets[statusKey] * 60000);
          
          updatedStatuses[i] = {
            ...status,
            timestamp: format(statusTime, 'h:mm a'),
            completed: true
          };
        } else {
          allCompleted = false;
        }
      }
      
      setOrderStatuses(updatedStatuses);
    }
  }, [orderDetails]);

  if (!orderDetails) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-foodsnap-orange border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-medium">Đang tải thông tin đơn hàng...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const StatusIcon = ({ status }: { status: OrderStatus }) => {
    switch (status) {
      case 'received':
        return <Package className="h-6 w-6" />;
      case 'preparing':
        return <Clock className="h-6 w-6" />;
      case 'out_for_delivery':
        return <Truck className="h-6 w-6" />;
      case 'delivered':
        return <Check className="h-6 w-6" />;
      default:
        return <Package className="h-6 w-6" />;
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'received':
        return 'Đã nhận đơn';
      case 'preparing':
        return 'Đang chuẩn bị';
      case 'out_for_delivery':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      default:
        return status;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Theo dõi đơn hàng</h1>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <div>
              <p className="text-gray-600">Mã đơn: <span className="font-semibold">{orderDetails?.orderId}</span></p>
              <p className="text-gray-600">Đặt lúc: <span className="font-semibold">{orderDetails?.timeOrdered}</span></p>
            </div>
            <div>
              <p className="text-gray-600">
                <Clock className="inline-block mr-1 h-4 w-4 text-foodsnap-orange" />
                Giao hàng dự kiến: <span className="font-semibold">{orderDetails?.estimatedDelivery}</span>
              </p>
            </div>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-foodsnap-orange" />
              Trạng thái đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Progress value={progressValue} className="h-3 bg-gray-100" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              {orderStatuses.map((status, index) => (
                <div 
                  key={status.status} 
                  className={`flex flex-col items-center p-3 rounded-lg ${
                    status.completed 
                      ? 'text-green-700 bg-green-50' 
                      : 'text-gray-400 bg-gray-50'
                  }`}
                >
                  <div className={`p-3 rounded-full ${
                    status.completed ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <StatusIcon status={status.status} />
                  </div>
                  <span className="font-medium mt-2">{getStatusLabel(status.status)}</span>
                  {status.timestamp && (
                    <span className="text-sm mt-1">{status.timestamp}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-foodsnap-orange" />
                  Chi tiết đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg mb-2">{orderDetails?.restaurantName}</h3>
                
                <div className="space-y-2 mb-6">
                  {orderDetails?.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        <span className="font-medium">{item.quantity}× </span>
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between font-medium">
                    <span>Tổng thanh toán</span>
                    <span>{orderDetails?.total.toFixed(2)}đ</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="mt-4">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-foodsnap-orange" />
                    Địa chỉ giao hàng
                  </h4>
                  <div className="text-gray-700">
                    <p className="font-medium">{orderDetails?.deliveryAddress.name}</p>
                    <p>{orderDetails?.deliveryAddress.phone}</p>
                    <p className="mt-1">{orderDetails?.deliveryAddress.address}</p>
                    {orderDetails?.deliveryAddress.notes && (
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Ghi chú:</span> {orderDetails?.deliveryAddress.notes}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-foodsnap-orange" />
                  Liên hệ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Nhà hàng</h4>
                  <p className="text-gray-700">{orderDetails?.restaurantName}</p>
                  <p className="text-gray-700">{orderDetails?.restaurantPhone}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 text-foodsnap-orange border-foodsnap-orange hover:bg-foodsnap-orange/10 gap-1"
                  >
                    <Clock className="h-4 w-4" />
                    Gọi nhà hàng
                  </Button>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Cần trợ giúp?</h4>
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-foodsnap-teal hover:bg-foodsnap-teal/90 gap-1"
                      size="sm"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat với hỗ trợ
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full gap-1"
                      size="sm"
                    >
                      <HelpCircle className="h-4 w-4" />
                      Trung tâm trợ giúp
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">
                    <strong>Vấn đề giao hàng?</strong> Liên hệ đội hỗ trợ 
                    để được trợ giúp ngay với đơn hàng của bạn.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderTrackingPage;
