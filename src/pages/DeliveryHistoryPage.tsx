
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { OrderStatusBadge } from "@/components/OrderManagement/OrderStatusBadge";
import { useIsMobile } from "@/hooks/use-mobile";
import { MapPin, Calendar, Clock, Wallet } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for completed delivery orders
const MOCK_COMPLETED_DELIVERIES = [
  {
    id: "ORD-7890",
    deliveryDate: "14/05/2025",
    deliveryTime: "16:30",
    restaurant: {
      name: "Nhà hàng Phở Hà Nội",
      address: "123 Lê Lợi, Đống Đa, Hà Nội"
    },
    customer: {
      address: "456 Nguyễn Huệ, Cầu Giấy, Hà Nội",
      phone: "0901234567"
    },
    totalAmount: "185,000đ",
    status: "completed" as const
  },
  {
    id: "ORD-6789",
    deliveryDate: "14/05/2025",
    deliveryTime: "15:45",
    restaurant: {
      name: "Sushi Tokyo",
      address: "56 Lê Thánh Tôn, Ba Đình, Hà Nội"
    },
    customer: {
      address: "78 Đồng Khởi, Thanh Xuân, Hà Nội",
      phone: "0909876543"
    },
    totalAmount: "320,000đ",
    status: "completed" as const
  },
  {
    id: "ORD-5678",
    deliveryDate: "13/05/2025",
    deliveryTime: "18:15",
    restaurant: {
      name: "Bún Chả Hà Nội",
      address: "34 Lý Tự Trọng, Thanh Xuân, Hà Nội"
    },
    customer: {
      address: "90 Nam Kỳ Khởi Nghĩa, Cầu Giấy, Hà Nội",
      phone: "0912345678"
    },
    totalAmount: "145,000đ",
    status: "completed" as const
  },
  {
    id: "ORD-4567",
    deliveryDate: "13/05/2025",
    deliveryTime: "12:30",
    restaurant: {
      name: "Pizza Express",
      address: "22 Hai Bà Trưng, Đống Đa, Hà Nội"
    },
    customer: {
      address: "45 Lê Duẩn, Ba Đình, Hà Nội",
      phone: "0987654321"
    },
    totalAmount: "250,000đ",
    status: "completed" as const
  },
  {
    id: "ORD-3456",
    deliveryDate: "12/05/2025",
    deliveryTime: "19:00",
    restaurant: {
      name: "Bánh Mì Saigon",
      address: "12 Nguyễn Du, Cầu Giấy, Hà Nội"
    },
    customer: {
      address: "67 Pasteur, Đống Đa, Hà Nội",
      phone: "0923456789"
    },
    totalAmount: "85,000đ",
    status: "completed" as const
  }
];

export default function DeliveryHistoryPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const isMobile = useIsMobile();
  const ordersPerPage = 10;
  
  // Sort orders by delivery date and time (most recent first)
  const sortedDeliveries = [...MOCK_COMPLETED_DELIVERIES].sort((a, b) => {
    // Compare dates first
    const dateComparison = new Date(b.deliveryDate.split('/').reverse().join('-')).getTime() - 
                          new Date(a.deliveryDate.split('/').reverse().join('-')).getTime();
    
    // If same date, compare times
    if (dateComparison === 0) {
      return b.deliveryTime.localeCompare(a.deliveryTime);
    }
    
    return dateComparison;
  });
  
  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedDeliveries.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(sortedDeliveries.length / ordersPerPage);
  
  // Format date and time for display
  const formatDateTime = (date: string, time: string) => {
    return `${time} - ${date}`;
  };

  return (
    <div className="container mx-auto px-2 py-4 max-w-6xl">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className={`${isMobile ? "text-xl" : "text-3xl"} font-bold`}>Lịch sử giao hàng</h1>
        <p className={`${isMobile ? "text-xs" : "text-sm"} text-muted-foreground mt-1`}>
          Danh sách các đơn hàng bạn đã giao thành công
        </p>
      </div>
      
      {/* Order History List */}
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-3 mb-4 pr-2">
          {currentOrders.length === 0 ? (
            <div className="text-center py-8 bg-muted rounded-lg">
              <p className="text-muted-foreground">Bạn chưa có đơn giao hàng nào.</p>
            </div>
          ) : (
            currentOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader className={`${isMobile ? "p-3" : "p-4"} border-b`}>
                  <div className="flex justify-between items-center">
                    <CardTitle className={`${isMobile ? "text-sm" : "text-base"}`}>{order.id}</CardTitle>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </CardHeader>
                <CardContent className={`${isMobile ? "p-3 text-xs" : "p-4 text-sm"} space-y-2`}>
                  <div className="flex items-start gap-2">
                    <Clock className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} mt-0.5 text-muted-foreground flex-shrink-0`} />
                    <span className="text-muted-foreground">
                      {formatDateTime(order.deliveryDate, order.deliveryTime)}
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} mt-0.5 text-muted-foreground flex-shrink-0`} />
                    <div>
                      <p className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}>{order.restaurant.name}</p>
                      <p className="text-muted-foreground text-xs">{order.restaurant.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} mt-0.5 text-muted-foreground flex-shrink-0`} />
                    <div>
                      <p className={`${isMobile ? "text-xs" : "text-sm"}`}>Địa chỉ giao hàng:</p>
                      <p className="text-muted-foreground text-xs">{order.customer.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Wallet className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} mt-0.5 text-muted-foreground flex-shrink-0`} />
                    <div className="flex justify-between w-full">
                      <span>Tổng tiền thu:</span>
                      <span className="font-medium">{order.totalAmount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
      
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
      
      {/* Back Button */}
      <div className="mt-6 flex justify-center">
        <Button 
          variant="outline" 
          onClick={() => navigate("/delivery-orders")}
          className={isMobile ? "h-8 text-xs" : ""}
        >
          Quay lại danh sách đơn
        </Button>
      </div>
    </div>
  );
}
