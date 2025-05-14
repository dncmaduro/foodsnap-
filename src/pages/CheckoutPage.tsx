
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, MapPin, Wallet, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from "@/contexts/AuthContext";
import LoginDialog from "@/components/LoginDialog";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items: cartItems, clearCart } = useCart();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [loginDialogOpen, setLoginDialogOpen] = useState(!isAuthenticated);
  
  const [deliveryAddress, setDeliveryAddress] = useState('saved');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [driverNote, setDriverNote] = useState('');
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    address: '',
    district: '',
    notes: ''
  });
  
  const savedAddress = {
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM',
    notes: 'Chuông cửa hỏng, vui lòng gọi khi đến'
  };
  
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = cartItems.length > 0 ? 2.99 : 0;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;
  
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDistrictChange = (value: string) => {
    setAddressForm(prev => ({ ...prev, district: value }));
  };
  
  const handlePlaceOrder = () => {
    toast({
      title: "Đặt hàng thành công!",
      description: "Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.",
    });
    
    const orderDetails = {
      orderId: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      restaurantName: cartItems[0]?.restaurantName || "Nhà hàng",
      estimatedDelivery: "30-45 phút",
      items: cartItems,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      total: total,
      paymentMethod: 'Thanh toán khi nhận hàng',
      deliveryAddress: deliveryAddress === 'saved' ? savedAddress : addressForm,
      driverNote: driverNote
    };
    
    clearCart();
    navigate('/order-confirmation', { state: { orderDetails } });
  };
  
  const handleLoginSuccess = () => {
    setLoginDialogOpen(false);
  };
  
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h1>
            <p className="mb-6">Bạn không thể tiến hành thanh toán khi không có món ăn nào trong giỏ hàng.</p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-foodsnap-orange hover:bg-foodsnap-orange/90"
            >
              Khám phá nhà hàng
            </Button>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Thanh toán</h1>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-gray-500">Giỏ hàng</span>
            <span className="mx-2 text-gray-400">›</span>
            <span className="font-medium text-foodsnap-orange">Thanh toán</span>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-500">Xác nhận</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-foodsnap-orange" />
                  Thông tin giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={deliveryAddress} 
                  onValueChange={setDeliveryAddress}
                  className="space-y-4"
                >
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="saved" id="saved-address" />
                    <div className="grid gap-1">
                      <Label htmlFor="saved-address" className="font-medium">
                        Sử dụng địa chỉ đã lưu
                      </Label>
                      {deliveryAddress === "saved" && (
                        <div className="mt-2 text-sm bg-gray-50 p-3 rounded-md">
                          <p className="font-medium">{savedAddress.name}</p>
                          <p>{savedAddress.phone}</p>
                          <p className="mt-1">{savedAddress.address}</p>
                          {savedAddress.notes && (
                            <p className="mt-1 text-gray-500">
                              <span className="font-medium">Ghi chú:</span> {savedAddress.notes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="new" id="new-address" />
                    <div className="grid gap-1 w-full">
                      <Label htmlFor="new-address" className="font-medium">
                        Thêm địa chỉ mới
                      </Label>
                      {deliveryAddress === "new" && (
                        <div className="mt-2 grid gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Họ tên</Label>
                            <Input 
                              id="name" 
                              name="name" 
                              value={addressForm.name} 
                              onChange={handleAddressChange} 
                              placeholder="Nhập họ tên của bạn"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="phone">Số điện thoại</Label>
                            <Input 
                              id="phone" 
                              name="phone" 
                              value={addressForm.phone} 
                              onChange={handleAddressChange} 
                              placeholder="Nhập số điện thoại của bạn"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="district">Quận</Label>
                            <Select 
                              onValueChange={handleDistrictChange} 
                              value={addressForm.district}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn quận" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cau-giay">Cầu Giấy</SelectItem>
                                <SelectItem value="dong-da">Đống Đa</SelectItem>
                                <SelectItem value="ba-dinh">Ba Đình</SelectItem>
                                <SelectItem value="thanh-xuan">Thanh Xuân</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="address">Địa chỉ chi tiết</Label>
                            <Textarea 
                              id="address" 
                              name="address" 
                              value={addressForm.address} 
                              onChange={handleAddressChange} 
                              placeholder="Nhập số nhà, tên đường, phường..."
                              rows={2}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="notes">Ghi chú giao hàng (Không bắt buộc)</Label>
                            <Textarea 
                              id="notes" 
                              name="notes" 
                              value={addressForm.notes} 
                              onChange={handleAddressChange} 
                              placeholder="Thêm hướng dẫn đặc biệt cho việc giao hàng"
                              rows={2}
                            />
                          </div>
                        </div>
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
                <div className="grid gap-2">
                  <Label htmlFor="driverNote">Thêm hướng dẫn cho tài xế giao hàng</Label>
                  <Textarea 
                    id="driverNote" 
                    placeholder="Ví dụ: 'Vui lòng gọi khi đến nơi thay vì bấm chuông.' hoặc 'Mã cổng chung cư là 1234.'"
                    value={driverNote}
                    onChange={(e) => setDriverNote(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="mr-2 h-5 w-5 text-foodsnap-orange" />
                  Phương thức thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <RadioGroup value="cash" className="hidden">
                    <RadioGroupItem value="cash" id="cash" />
                  </RadioGroup>
                  <Label htmlFor="cash" className="flex items-center">
                    Thanh toán khi nhận hàng
                  </Label>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-start">
                        <span className="font-medium">{item.quantity}×</span>
                        <span className="ml-2">{item.name}</span>
                      </div>
                      <span>{(item.price * item.quantity).toFixed(2)}đ</span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng phụ</span>
                    <span>{subtotal.toFixed(2)}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí giao hàng</span>
                    <span>{deliveryFee.toFixed(2)}đ</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá</span>
                      <span>-{discount.toFixed(2)}đ</span>
                    </div>
                  )}
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng</span>
                    <span>{total.toFixed(2)}đ</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4 py-6 text-base bg-foodsnap-orange hover:bg-foodsnap-orange/90 flex items-center justify-center"
                  onClick={handlePlaceOrder}
                >
                  Đặt hàng
                  <Check className="ml-2 h-5 w-5" />
                </Button>
                
                <p className="mt-4 text-sm text-gray-500 text-center">
                  Khi đặt hàng, bạn đồng ý với 
                  <a href="#" className="text-foodsnap-teal mx-1 hover:underline">Điều khoản dịch vụ</a>
                  và
                  <a href="#" className="text-foodsnap-teal ml-1 hover:underline">Chính sách bảo mật</a>
                </p>
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
  );
};

export default CheckoutPage;
