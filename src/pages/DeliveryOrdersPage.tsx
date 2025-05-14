
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "@/hooks/use-toast";
import { MapPin } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data for available orders
const MOCK_ORDERS = [
  {
    id: "ORD-1234",
    time: "14:30 - 14/05/2025",
    restaurant: {
      name: "Nhà hàng Phở Hà Nội",
      address: "123 Lê Lợi, Đống Đa, Hà Nội"
    },
    customer: {
      address: "456 Nguyễn Huệ, Cầu Giấy, Hà Nội"
    },
    totalPrice: "185,000đ",
    distance: "1.5km"
  },
  {
    id: "ORD-2345",
    time: "14:45 - 14/05/2025",
    restaurant: {
      name: "Sushi Tokyo",
      address: "56 Lê Thánh Tôn, Ba Đình, Hà Nội"
    },
    customer: {
      address: "78 Đồng Khởi, Thanh Xuân, Hà Nội"
    },
    totalPrice: "320,000đ",
    distance: "2.1km"
  },
  {
    id: "ORD-3456",
    time: "15:00 - 14/05/2025",
    restaurant: {
      name: "Bún Chả Hà Nội",
      address: "34 Lý Tự Trọng, Thanh Xuân, Hà Nội"
    },
    customer: {
      address: "90 Nam Kỳ Khởi Nghĩa, Cầu Giấy, Hà Nội"
    },
    totalPrice: "145,000đ",
    distance: "3.2km"
  },
  {
    id: "ORD-4567",
    time: "15:15 - 14/05/2025",
    restaurant: {
      name: "Pizza Express",
      address: "22 Hai Bà Trưng, Đống Đa, Hà Nội"
    },
    customer: {
      address: "45 Lê Duẩn, Ba Đình, Hà Nội"
    },
    totalPrice: "250,000đ",
    distance: "1.8km"
  },
  {
    id: "ORD-5678",
    time: "15:30 - 14/05/2025",
    restaurant: {
      name: "Bánh Mì Saigon",
      address: "12 Nguyễn Du, Cầu Giấy, Hà Nội"
    },
    customer: {
      address: "67 Pasteur, Đống Đa, Hà Nội"
    },
    totalPrice: "85,000đ",
    distance: "2.5km"
  }
];

// List of available districts
const DISTRICTS = [
  "Tất cả",
  "Cầu Giấy",
  "Đống Đa",
  "Ba Đình",
  "Thanh Xuân"
];

export default function DeliveryOrdersPage() {
  const navigate = useNavigate();
  const [district, setDistrict] = useState<string>("Tất cả");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const isMobile = useIsMobile();
  const ordersPerPage = 10;
  
  // Filter orders based on district
  const filteredOrders = MOCK_ORDERS.filter(order => {
    return district === "Tất cả" || 
      order.restaurant.address.includes(district) || 
      order.customer.address.includes(district);
  });
  
  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  
  // Handle order acceptance
  const handleAcceptOrder = (orderId: string) => {
    // In a real app, this would make an API call to claim the order
    toast({
      title: "Đã nhận đơn hàng",
      description: `Bạn đã nhận đơn hàng ${orderId} thành công.`,
    });
    
    // Navigate to order tracking page where driver can update status
    navigate(`/track-order/${orderId}`);
  };

  return (
    <div className="container mx-auto px-2 py-4 max-w-6xl">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className={`${isMobile ? "text-xl" : "text-3xl"} font-bold`}>Danh sách đơn hàng có thể nhận</h1>
        <p className={`${isMobile ? "text-xs" : "text-sm"} text-muted-foreground mt-1`}>Chọn đơn hàng bạn muốn nhận để bắt đầu giao.</p>
      </div>
      
      {/* Filter Section */}
      <div className="mb-4">
        <Select value={district} onValueChange={setDistrict}>
          <SelectTrigger className={`${isMobile ? "h-8 text-xs" : ""}`}>
            <SelectValue placeholder="Chọn quận" />
          </SelectTrigger>
          <SelectContent>
            {DISTRICTS.map((district) => (
              <SelectItem key={district} value={district} className={isMobile ? "text-xs" : ""}>
                {district}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Order List Section */}
      <div className="space-y-3 mb-4">
        {currentOrders.length === 0 ? (
          <div className="text-center py-8 bg-muted rounded-lg">
            <p className="text-muted-foreground">Không tìm thấy đơn hàng nào phù hợp.</p>
          </div>
        ) : (
          currentOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader className={`${isMobile ? "p-3" : "p-4"}`}>
                <div className="flex justify-between items-start">
                  <CardTitle className={`${isMobile ? "text-sm" : "text-lg"}`}>{order.id}</CardTitle>
                  <div className="text-right">
                    <div className={`font-bold ${isMobile ? "text-sm" : ""}`}>{order.totalPrice}</div>
                    <div className={`${isMobile ? "text-xs" : "text-sm"} text-muted-foreground`}>{order.time}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className={`${isMobile ? "p-3 pt-0 text-xs" : "p-4 pt-0 text-sm"}`}>
                <div className="space-y-2">
                  <div>
                    <h3 className="font-semibold">Nhà hàng:</h3>
                    <div className="flex items-start gap-1">
                      <MapPin className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} mt-0.5`} />
                      <div>
                        <p className={isMobile ? "text-xs" : ""}>{order.restaurant.name}</p>
                        <p className={`${isMobile ? "text-xs" : "text-sm"} text-muted-foreground`}>{order.restaurant.address}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Địa chỉ giao hàng:</h3>
                    <div className="flex items-start gap-1">
                      <MapPin className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} mt-0.5`} />
                      <p className={`${isMobile ? "text-xs" : "text-sm"} text-muted-foreground`}>{order.customer.address}</p>
                    </div>
                  </div>
                  <div className={`${isMobile ? "text-xs" : "text-sm"} text-muted-foreground`}>
                    Khoảng cách: {order.distance}
                  </div>
                </div>
              </CardContent>
              <CardFooter className={`flex justify-end ${isMobile ? "p-3 pt-0" : "p-4 pt-0"}`}>
                <Button 
                  onClick={() => handleAcceptOrder(order.id)} 
                  className={isMobile ? "h-8 text-xs px-2 py-1" : ""}
                >
                  Nhận đơn
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="my-2">
          <PaginationContent className={isMobile ? "gap-0.5" : "gap-1"}>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={`${currentPage === 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${isMobile ? "h-8 text-xs" : ""}`}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index} className={isMobile ? "hidden md:block" : ""}>
                <PaginationLink 
                  isActive={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={isMobile ? "h-8 w-8 p-0 text-xs" : ""}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={`${currentPage === totalPages ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${isMobile ? "h-8 text-xs" : ""}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
      {/* Navigation Links */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <Button 
          variant="outline" 
          onClick={() => navigate("/order-history")}
          className={isMobile ? "h-8 text-xs" : ""}
        >
          Lịch sử giao hàng
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate("/profile")}
          className={isMobile ? "h-8 text-xs" : ""}
        >
          Hồ sơ tài xế
        </Button>
      </div>
    </div>
  );
}
