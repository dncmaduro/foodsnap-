
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Clock, Truck, Home, FileText, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

// Mô hình chi tiết đơn hàng - trong ứng dụng thực tế, dữ liệu này sẽ đến từ API hoặc context
type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type OrderDetails = {
  orderId: string;
  restaurantName: string;
  estimatedDelivery: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  deliveryAddress: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
  };
  driverNote?: string;
};

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  
  // Trong ứng dụng thực tế, chúng ta sẽ lấy chi tiết đơn hàng từ API
  // Hiện tại chúng ta sẽ sử dụng dữ liệu mẫu hoặc từ location state
  useEffect(() => {
    // Kiểm tra xem có chi tiết đơn hàng trong location state không
    const stateOrderDetails = location.state?.orderDetails;
    
    if (stateOrderDetails) {
      setOrderDetails(stateOrderDetails);
    } else {
      // Dữ liệu mẫu để hiển thị khi không có thông tin đơn hàng
      setOrderDetails({
        orderId: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
        restaurantName: "Nhà Hàng Ngon",
        estimatedDelivery: "30-45 phút",
        items: [
          { id: "1", name: "Hamburger Phô Mai", quantity: 2, price: 9.99 },
          { id: "2", name: "Khoai Tây Chiên", quantity: 1, price: 3.99 },
          { id: "3", name: "Gà Nuggets", quantity: 1, price: 5.99 },
          { id: "4", name: "Coca Diet", quantity: 2, price: 1.99 }
        ],
        subtotal: 33.94,
        deliveryFee: 2.99,
        total: 36.93,
        paymentMethod: "Thanh toán khi nhận hàng",
        deliveryAddress: {
          name: "Nguyễn Văn A",
          phone: "(123) 456-7890",
          address: "123 Đường Lê Lợi, P. Bến Nghé, Q.1, TP.HCM",
          notes: "Vui lòng bấm chuông hai lần."
        },
        driverNote: "Vui lòng gọi điện khi đến cổng."
      });
    }
  }, [location]);

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

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-6 max-w-4xl">
        {/* Phần thông báo xác nhận */}
        <div className="text-center py-8 mb-6">
          <div className="mx-auto bg-green-100 rounded-full h-24 w-24 flex items-center justify-center mb-4">
            <Check className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đơn hàng của bạn đã được đặt thành công!</h1>
          <p className="text-gray-600 mb-2">Mã đơn hàng: <span className="font-semibold">{orderDetails.orderId}</span></p>
          <div className="flex items-center justify-center text-gray-600">
            <Clock className="mr-2 h-5 w-5 text-foodsnap-orange" />
            <p>Thời gian giao hàng dự kiến: <span className="font-semibold">{orderDetails.estimatedDelivery}</span></p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phần tóm tắt đơn hàng */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-foodsnap-orange" />
                  Tóm tắt đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg mb-2">{orderDetails.restaurantName}</h3>
                
                {/* Các món đã đặt */}
                <div className="space-y-3 mb-6">
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <span className="font-medium">{item.quantity}× </span>
                        <span>{item.name}</span>
                      </div>
                      <span>{(item.price * item.quantity).toFixed(2)}đ</span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                {/* Chi tiết thanh toán */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng phụ</span>
                    <span>{orderDetails.subtotal.toFixed(2)}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí giao hàng</span>
                    <span>{orderDetails.deliveryFee.toFixed(2)}đ</span>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng</span>
                    <span>{orderDetails.total.toFixed(2)}đ</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-700">
                    <span className="font-medium">Phương thức thanh toán:</span> {orderDetails.paymentMethod}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Phần thông tin giao hàng */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2 h-5 w-5 text-foodsnap-orange" />
                  Thông tin giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{orderDetails.deliveryAddress.name}</p>
                  <p>{orderDetails.deliveryAddress.phone}</p>
                  <p className="mt-1">{orderDetails.deliveryAddress.address}</p>
                  {orderDetails.deliveryAddress.notes && (
                    <div className="mt-2 text-gray-600">
                      <span className="font-medium">Ghi chú:</span> {orderDetails.deliveryAddress.notes}
                    </div>
                  )}

                  {/* Phần ghi chú cho tài xế */}
                  {orderDetails.driverNote && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-md">
                      <div className="flex items-start">
                        <MessageSquare className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-700">Ghi chú cho tài xế:</p>
                          <p className="text-blue-600">{orderDetails.driverNote}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Phần các hành động tiếp theo */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Các bước tiếp theo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full py-6 bg-foodsnap-teal hover:bg-foodsnap-teal/90 flex items-center justify-center"
                  onClick={() => navigate(`/track-order/${orderDetails.orderId}`, { state: { orderDetails } })}
                >
                  <Truck className="mr-2 h-5 w-5" />
                  Theo dõi đơn hàng
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full py-6 border-foodsnap-orange text-foodsnap-orange hover:bg-foodsnap-orange/10 flex items-center justify-center"
                  onClick={() => navigate('/')}
                >
                  <Home className="mr-2 h-5 w-5" />
                  Trở về trang chủ
                </Button>
                
                <div className="p-4 bg-blue-50 rounded-md mt-4">
                  <h4 className="font-semibold text-blue-800 mb-1">Cần trợ giúp?</h4>
                  <p className="text-sm text-blue-700 mb-2">
                    Nếu bạn có bất kỳ thắc mắc nào về đơn hàng, vui lòng liên hệ với bộ phận hỗ trợ khách hàng.
                  </p>
                  <a 
                    href="#" 
                    className="text-sm font-medium text-blue-700 underline hover:text-blue-900"
                  >
                    Liên hệ hỗ trợ
                  </a>
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

export default OrderConfirmationPage;
