
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "@/hooks/use-toast";
import { MapPin } from "lucide-react";

// Mock data for available orders
const MOCK_ORDERS = [
  {
    id: "ORD-1234",
    time: "14:30 - 14/05/2025",
    restaurant: {
      name: "Nhà hàng Phở Hà Nội",
      address: "123 Lê Lợi, Quận 1, TP. Hồ Chí Minh"
    },
    customer: {
      address: "456 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh"
    },
    totalPrice: "185,000đ",
    distance: "1.5km"
  },
  {
    id: "ORD-2345",
    time: "14:45 - 14/05/2025",
    restaurant: {
      name: "Sushi Tokyo",
      address: "56 Lê Thánh Tôn, Quận 1, TP. Hồ Chí Minh"
    },
    customer: {
      address: "78 Đồng Khởi, Quận 1, TP. Hồ Chí Minh"
    },
    totalPrice: "320,000đ",
    distance: "2.1km"
  },
  {
    id: "ORD-3456",
    time: "15:00 - 14/05/2025",
    restaurant: {
      name: "Bún Chả Hà Nội",
      address: "34 Lý Tự Trọng, Quận 1, TP. Hồ Chí Minh"
    },
    customer: {
      address: "90 Nam Kỳ Khởi Nghĩa, Quận 3, TP. Hồ Chí Minh"
    },
    totalPrice: "145,000đ",
    distance: "3.2km"
  },
  {
    id: "ORD-4567",
    time: "15:15 - 14/05/2025",
    restaurant: {
      name: "Pizza Express",
      address: "22 Hai Bà Trưng, Quận 1, TP. Hồ Chí Minh"
    },
    customer: {
      address: "45 Lê Duẩn, Quận 1, TP. Hồ Chí Minh"
    },
    totalPrice: "250,000đ",
    distance: "1.8km"
  },
  {
    id: "ORD-5678",
    time: "15:30 - 14/05/2025",
    restaurant: {
      name: "Bánh Mì Saigon",
      address: "12 Nguyễn Du, Quận 1, TP. Hồ Chí Minh"
    },
    customer: {
      address: "67 Pasteur, Quận 3, TP. Hồ Chí Minh"
    },
    totalPrice: "85,000đ",
    distance: "2.5km"
  }
];

// List of districts in Ho Chi Minh City
const DISTRICTS = [
  "Tất cả",
  "Quận 1",
  "Quận 2",
  "Quận 3",
  "Quận 4",
  "Quận 5",
  "Quận 6",
  "Quận 7",
  "Quận 8",
  "Quận 9",
  "Quận 10",
  "Quận 11",
  "Quận 12",
  "Quận Bình Tân",
  "Quận Bình Thạnh",
  "Quận Gò Vấp",
  "Quận Phú Nhuận",
  "Quận Tân Bình",
  "Quận Tân Phú",
  "Quận Thủ Đức",
  "Huyện Bình Chánh",
  "Huyện Cần Giờ",
  "Huyện Củ Chi",
  "Huyện Hóc Môn",
  "Huyện Nhà Bè"
];

export default function DeliveryOrdersPage() {
  const navigate = useNavigate();
  const [district, setDistrict] = useState<string>("Tất cả");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ordersPerPage = 10;
  
  // Filter orders based on district and search query
  const filteredOrders = MOCK_ORDERS.filter(order => {
    const matchesDistrict = district === "Tất cả" || 
      order.restaurant.address.includes(district);
    
    const matchesSearch = searchQuery === "" || 
      order.restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesDistrict && matchesSearch;
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Danh sách đơn hàng có thể nhận</h1>
        <p className="text-muted-foreground mt-2">Chọn đơn hàng bạn muốn nhận để bắt đầu giao.</p>
      </div>
      
      {/* Filter and Search Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="w-full md:w-1/3">
          <Select value={district} onValueChange={setDistrict}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn quận" />
            </SelectTrigger>
            <SelectContent>
              {DISTRICTS.map((district) => (
                <SelectItem key={district} value={district}>{district}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Tìm kiếm theo tên nhà hàng hoặc mã đơn hàng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Order List Section */}
      <div className="space-y-6 mb-8">
        {currentOrders.length === 0 ? (
          <div className="text-center py-12 bg-muted rounded-lg">
            <p className="text-muted-foreground">Không tìm thấy đơn hàng nào phù hợp.</p>
          </div>
        ) : (
          currentOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{order.id}</CardTitle>
                  <div className="text-right">
                    <div className="font-bold">{order.totalPrice}</div>
                    <div className="text-sm text-muted-foreground">{order.time}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Nhà hàng:</h3>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-1" />
                      <div>
                        <p>{order.restaurant.name}</p>
                        <p className="text-sm text-muted-foreground">{order.restaurant.address}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Địa chỉ giao hàng:</h3>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-1" />
                      <p className="text-muted-foreground">{order.customer.address}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Khoảng cách: {order.distance}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => handleAcceptOrder(order.id)}>Nhận đơn</Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink 
                  isActive={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
      {/* Navigation Links */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" onClick={() => navigate("/order-history")}>
          Lịch sử giao hàng
        </Button>
        <Button variant="outline" onClick={() => navigate("/profile")}>
          Hồ sơ tài xế
        </Button>
      </div>
    </div>
  );
}
