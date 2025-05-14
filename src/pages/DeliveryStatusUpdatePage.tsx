
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { MapPin, Phone, Package, Truck, CheckCircle, ArrowLeft } from "lucide-react";
import { OrderStatus, OrderStatusBadge } from "@/components/OrderManagement/OrderStatusBadge";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock order with more detailed information
type DeliveryOrder = {
  id: string;
  time: string;
  restaurant: {
    name: string;
    address: string;
    phone: string;
  };
  customer: {
    name: string;
    address: string;
    phone: string;
    notes?: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: string;
  numericPrice: number;
  status: OrderStatus;
};

// We'll use this to simulate fetching an order by ID
const getMockOrder = (id: string): DeliveryOrder => {
  return {
    id,
    time: "14:30 - 14/05/2025",
    restaurant: {
      name: "Nhà hàng Phở Hà Nội",
      address: "123 Lê Lợi, Đống Đa, Hà Nội",
      phone: "0912 345 678"
    },
    customer: {
      name: "Nguyễn Văn A",
      address: "456 Nguyễn Huệ, Cầu Giấy, Hà Nội",
      phone: "0987 654 321",
      notes: "Gọi điện trước khi giao hàng 5 phút."
    },
    items: [
      { name: "Phở bò tái", quantity: 2, price: 75000 },
      { name: "Nem rán", quantity: 1, price: 35000 }
    ],
    totalPrice: "185,000đ",
    numericPrice: 185000,
    status: "new"
  };
};

const DeliveryStatusUpdatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (id) {
      // In a real app, this would be an API call
      const fetchedOrder = getMockOrder(id);
      // Set initial status to "processing" to simulate "Đã nhận đơn"
      fetchedOrder.status = "processing";
      setOrder(fetchedOrder);
      setLoading(false);
    }
  }, [id]);

  const updateOrderStatus = (newStatus: OrderStatus) => {
    if (!order) return;
    
    // In a real app, this would be an API call
    setOrder({
      ...order,
      status: newStatus
    });
    
    const statusMessages = {
      "in_delivery": "Đã lấy đơn và đang giao hàng",
      "completed": "Đơn hàng đã hoàn thành thành công"
    };
    
    toast({
      title: "Cập nhật trạng thái",
      description: statusMessages[newStatus as "in_delivery" | "completed"],
    });
    
    // If order is completed, navigate back to available orders after a short delay
    if (newStatus === "completed") {
      setTimeout(() => {
        navigate("/delivery-orders");
      }, 1500);
    }
  };
  
  const getStatusActionButton = () => {
    if (!order) return null;
    
    switch (order.status) {
      case "processing": // Đã nhận đơn
        return (
          <Button 
            onClick={() => updateOrderStatus("in_delivery")} 
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
          >
            <Package className="mr-2 h-4 w-4" />
            Đã lấy đơn
          </Button>
        );
      case "in_delivery": // Đang giao
        return (
          <Button 
            onClick={() => updateOrderStatus("completed")} 
            className="w-full mt-4 bg-green-500 hover:bg-green-600"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Hoàn thành đơn
          </Button>
        );
      case "completed": // Đã hoàn thành
        return (
          <Button 
            onClick={() => navigate("/delivery-orders")} 
            className="w-full mt-4"
          >
            Quay lại danh sách đơn hàng
          </Button>
        );
      default:
        return null;
    }
  };
  
  if (loading || !order) {
    return (
      <div className="container mx-auto px-4 py-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
          <p className="mt-2">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }
  
  const getStatusStepClass = (step: number) => {
    const currentStep = 
      order.status === "processing" ? 1 :
      order.status === "in_delivery" ? 2 :
      order.status === "completed" ? 3 : 0;
    
    return currentStep >= step 
      ? "bg-green-500 text-white" 
      : "bg-gray-200 text-gray-400";
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-md">
      <div className={`mb-4 flex items-center ${isMobile ? "gap-2" : "gap-3"}`}>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/delivery-orders")}
          className={isMobile ? "h-8 w-8" : ""}
        >
          <ArrowLeft className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} />
        </Button>
        <h1 className={`${isMobile ? "text-lg" : "text-2xl"} font-bold`}>
          Cập nhật đơn #{order.id}
        </h1>
      </div>
      
      {/* Status Indicator */}
      <Card className="mb-4">
        <CardHeader className={`${isMobile ? "px-3 py-2" : "px-6 py-4"}`}>
          <div className="flex justify-between items-center">
            <CardTitle className={isMobile ? "text-sm" : "text-base"}>
              Trạng thái đơn hàng
            </CardTitle>
            <OrderStatusBadge status={order.status} />
          </div>
        </CardHeader>
        <CardContent className={`${isMobile ? "px-3 pb-3" : "px-6 pb-6"}`}>
          <div className="flex justify-between items-center mb-2">
            <div className="w-full">
              <div className="flex items-center justify-between mb-1">
                <div className={`flex flex-col items-center ${isMobile ? "text-xs" : "text-sm"}`}>
                  <div className={`rounded-full ${getStatusStepClass(1)} ${isMobile ? "h-7 w-7" : "h-9 w-9"} flex items-center justify-center mb-1`}>
                    <Package className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                  </div>
                  <span>Nhận đơn</span>
                </div>
                <div className="flex-1 mx-2 h-1 bg-gray-200 relative">
                  <div 
                    className={`absolute top-0 left-0 h-full bg-green-500`} 
                    style={{ 
                      width: order.status === "processing" ? "0%" : 
                             order.status === "in_delivery" ? "100%" : 
                             order.status === "completed" ? "100%" : "0%" 
                    }}
                  ></div>
                </div>
                <div className={`flex flex-col items-center ${isMobile ? "text-xs" : "text-sm"}`}>
                  <div className={`rounded-full ${getStatusStepClass(2)} ${isMobile ? "h-7 w-7" : "h-9 w-9"} flex items-center justify-center mb-1`}>
                    <Truck className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                  </div>
                  <span>Đang giao</span>
                </div>
                <div className="flex-1 mx-2 h-1 bg-gray-200 relative">
                  <div 
                    className={`absolute top-0 left-0 h-full bg-green-500`} 
                    style={{ 
                      width: order.status === "completed" ? "100%" : "0%" 
                    }}
                  ></div>
                </div>
                <div className={`flex flex-col items-center ${isMobile ? "text-xs" : "text-sm"}`}>
                  <div className={`rounded-full ${getStatusStepClass(3)} ${isMobile ? "h-7 w-7" : "h-9 w-9"} flex items-center justify-center mb-1`}>
                    <CheckCircle className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                  </div>
                  <span>Hoàn thành</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Order Details */}
      <Card className="mb-4">
        <CardHeader className={`${isMobile ? "px-3 py-2" : "px-6 py-4"}`}>
          <CardTitle className={isMobile ? "text-sm" : "text-base"}>
            Chi tiết đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent className={`space-y-3 ${isMobile ? "px-3 pb-3 text-xs" : "px-6 pb-6"}`}>
          {/* Restaurant Information */}
          <div className="space-y-1">
            <h3 className="font-semibold flex items-center gap-1">
              <MapPin className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
              Địa chỉ lấy hàng
            </h3>
            <div className={`pl-5 ${isMobile ? "space-y-0.5" : "space-y-1"}`}>
              <p className="font-medium">{order.restaurant.name}</p>
              <p className="text-gray-700">{order.restaurant.address}</p>
              <p className="flex items-center gap-1">
                <Phone className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                <a href={`tel:${order.restaurant.phone}`} className="text-blue-500">{order.restaurant.phone}</a>
              </p>
            </div>
          </div>
          
          <Separator />
          
          {/* Customer Information */}
          <div className="space-y-1">
            <h3 className="font-semibold flex items-center gap-1">
              <MapPin className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
              Địa chỉ giao hàng
            </h3>
            <div className={`pl-5 ${isMobile ? "space-y-0.5" : "space-y-1"}`}>
              <p className="font-medium">{order.customer.name}</p>
              <p className="text-gray-700">{order.customer.address}</p>
              <p className="flex items-center gap-1">
                <Phone className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                <a href={`tel:${order.customer.phone}`} className="text-blue-500">{order.customer.phone}</a>
              </p>
              {order.customer.notes && (
                <p className="text-gray-600 italic">
                  <span className="font-medium">Ghi chú:</span> {order.customer.notes}
                </p>
              )}
            </div>
          </div>
          
          <Separator />
          
          {/* Order Items */}
          <div className="space-y-2">
            <h3 className="font-semibold">Danh sách món</h3>
            <div className={`${isMobile ? "text-xs" : "text-sm"} space-y-1`}>
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.quantity}x {item.name}</span>
                  <span>{item.price.toLocaleString()}đ</span>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Payment Information */}
          <div className="pt-2">
            <div className="flex justify-between font-bold">
              <span>Tổng tiền thu:</span>
              <span>{order.totalPrice}</span>
            </div>
            <p className="text-red-500 text-center mt-2">
              *Vui lòng thu tiền từ khách hàng khi giao hàng
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Action Button */}
      {getStatusActionButton()}
    </div>
  );
};

export default DeliveryStatusUpdatePage;
