
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, Search, ArrowUpDown } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { OrderStatusBadge, OrderStatus } from "./OrderStatusBadge";
import { OrderDetailDialog } from "./OrderDetailDialog";
import { OrderDateFilter } from "./OrderDateFilter";
import { OrderSortDropdown } from "./OrderSortDropdown";
import { toast } from "@/components/ui/use-toast";

// Types for our order data
export interface OrderItemType {
  name: string;
  quantity: number;
  unitPrice: number;
  note?: string;
}

export interface CustomerType {
  name: string;
  phone: string;
  address: string;
  notes?: string;
}

export interface StatusHistoryItem {
  status: string;
  timestamp: string;
  note?: string;
}

export interface OrderType {
  id: string;
  restaurantId: string;
  orderTime: string;
  customer: CustomerType;
  items: OrderItemType[];
  deliveryFee: number;
  status: OrderStatus;
  paymentMethod: string;
  statusHistory: StatusHistoryItem[];
}

// Reduced mock data for orders - only 3-4 per category
const generateReducedMockOrders = (): OrderType[] => {
  const orders: OrderType[] = [];
  const now = new Date();
  
  // Helper to create status history based on current status
  const createStatusHistory = (status: OrderStatus, orderTime: Date): StatusHistoryItem[] => {
    const history: StatusHistoryItem[] = [];
    
    // Always add order creation
    history.push({
      status: "Đơn hàng được tạo",
      timestamp: new Date(orderTime).toISOString(),
    });
    
    // Add progression based on status
    if (status === "processing" || status === "in_delivery" || status === "completed") {
      const confirmDate = new Date(orderTime);
      confirmDate.setMinutes(confirmDate.getMinutes() + 5);
      history.push({
        status: "Nhà hàng xác nhận",
        timestamp: confirmDate.toISOString(),
      });
    }
    
    if (status === "in_delivery" || status === "completed") {
      const processDate = new Date(orderTime);
      processDate.setMinutes(processDate.getMinutes() + 15);
      history.push({
        status: "Đang chuẩn bị món",
        timestamp: processDate.toISOString(),
      });
      
      const deliveryDate = new Date(orderTime);
      deliveryDate.setMinutes(deliveryDate.getMinutes() + 30);
      history.push({
        status: "Đang giao hàng",
        timestamp: deliveryDate.toISOString(),
        note: "Shipper: Nguyễn Văn A - 090xxx"
      });
    }
    
    if (status === "completed") {
      const completeDate = new Date(orderTime);
      completeDate.setMinutes(completeDate.getMinutes() + 45);
      history.push({
        status: "Giao hàng thành công",
        timestamp: completeDate.toISOString(),
      });
    }
    
    if (status === "canceled") {
      const cancelDate = new Date(orderTime);
      cancelDate.setMinutes(cancelDate.getMinutes() + 10);
      history.push({
        status: "Đơn hàng bị hủy",
        timestamp: cancelDate.toISOString(),
        note: "Nhà hàng hết nguyên liệu"
      });
    }
    
    return history;
  };
  
  // Common dishes with notes for demonstration
  const commonDishes = [
    { name: "Phở bò", unitPrice: 75000, notes: ["Không hành", "Ít ớt", "Thêm giá", "Không dùng hành ngò"] },
    { name: "Bún chả", unitPrice: 65000, notes: ["Nước chấm riêng", "Không mỡ", "Nhiều rau", "Ít nước mắm"] },
    { name: "Bánh mì thịt", unitPrice: 35000, notes: ["Không đồ chua", "Ít ớt", "Thêm pate", "Không rau răm"] },
    { name: "Cơm tấm sườn", unitPrice: 55000, notes: ["Không hành", "Thêm trứng", "Không mỡ hành", "Ít nước mắm"] },
    { name: "Bún bò Huế", unitPrice: 80000, notes: ["Không giò", "Nhiều thịt", "Ít ớt", "Không huyết"] }
  ];
  
  // Helper to generate random dishes with notes
  const generateOrderItems = (count: number): OrderItemType[] => {
    const items: OrderItemType[] = [];
    
    for (let i = 0; i < count; i++) {
      const randomDish = commonDishes[Math.floor(Math.random() * commonDishes.length)];
      const quantity = Math.floor(Math.random() * 2) + 1; // 1 or 2 items
      const shouldHaveNote = Math.random() > 0.3; // 70% chance of having a note
      
      items.push({
        name: randomDish.name,
        quantity,
        unitPrice: randomDish.unitPrice,
        note: shouldHaveNote ? randomDish.notes[Math.floor(Math.random() * randomDish.notes.length)] : undefined
      });
    }
    
    return items;
  };
  
  // Helper to create an order with specific status
  const createOrder = (id: number, status: OrderStatus, daysAgo: number): OrderType => {
    const orderDate = new Date(now);
    orderDate.setDate(orderDate.getDate() - daysAgo);
    orderDate.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 50)); // Between 8am-8pm
    
    const items = generateOrderItems(Math.floor(Math.random() * 2) + 2); // 2-3 items per order
    const deliveryFee = 15000 + (Math.floor(Math.random() * 3) * 5000); // 15k, 20k, or 25k
    
    return {
      id: `ORD${100000 + id}`,
      restaurantId: "1", // Fixed for the example
      orderTime: orderDate.toISOString(),
      customer: {
        name: `Khách hàng ${id}`,
        phone: `09${Math.floor(Math.random() * 90000000 + 10000000)}`,
        address: `${Math.floor(Math.random() * 100) + 1} Đường ${Math.floor(Math.random() * 20) + 1}, Quận ${Math.floor(Math.random() * 12) + 1}, TP.HCM`,
        notes: Math.random() > 0.5 ? "Gọi trước khi giao 10 phút" : undefined
      },
      items,
      deliveryFee,
      status,
      paymentMethod: Math.random() > 0.5 ? "Tiền mặt khi nhận hàng" : "Thanh toán online",
      statusHistory: createStatusHistory(status, orderDate),
    };
  };
  
  // Generate 3-4 orders for each status category
  let idCounter = 1;
  
  // New orders - 3 orders
  for (let i = 0; i < 3; i++) {
    orders.push(createOrder(idCounter++, "new", i));
  }
  
  // Processing orders - 3 orders
  for (let i = 0; i < 3; i++) {
    orders.push(createOrder(idCounter++, "processing", i + 1));
  }
  
  // In delivery orders - 4 orders
  for (let i = 0; i < 4; i++) {
    orders.push(createOrder(idCounter++, "in_delivery", i + 2));
  }
  
  // Completed orders - 4 orders
  for (let i = 0; i < 4; i++) {
    orders.push(createOrder(idCounter++, "completed", i + 3));
  }
  
  // Canceled orders - 3 orders
  for (let i = 0; i < 3; i++) {
    orders.push(createOrder(idCounter++, "canceled", i + 2));
  }
  
  // Sort by most recent first
  return orders.sort((a, b) => 
    new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime()
  );
};

// Use the reduced mock orders
const mockOrders = generateReducedMockOrders();

// Main component
const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<OrderType[]>(mockOrders);
  
  const itemsPerPage = 10;

  // Get the next logical status based on current status
  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case "new": return "processing";
      case "processing": return "in_delivery";
      case "in_delivery": return "completed";
      default: return null; // No next status for completed or canceled
    }
  };

  // Filter orders based on active tab
  const getFilteredOrders = () => {
    let filtered = [...orders];
    
    // Filter by tab (status)
    if (activeTab !== "all") {
      filtered = filtered.filter(order => order.status === activeTab);
    }
    
    // Filter by search term (Order ID or Customer Name)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        order => 
          order.id.toLowerCase().includes(term) || 
          order.customer.name.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };
  
  const filteredOrders = getFilteredOrders();
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  const handleViewDetails = (order: OrderType) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };
  
  const handleDateFilterChange = (filterType: string, dateRange?: any) => {
    // In a real application, this would filter the orders from the backend
    // For now, we'll just show a toast
    toast({
      title: "Bộ lọc thời gian đã được áp dụng",
      description: `Lọc theo: ${filterType}`
    });
  };
  
  const handleSortChange = (sortOption: string) => {
    let sortedOrders = [...orders];
    
    switch (sortOption) {
      case 'time_newest':
        sortedOrders.sort((a, b) => 
          new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime()
        );
        break;
      case 'time_oldest':
        sortedOrders.sort((a, b) => 
          new Date(a.orderTime).getTime() - new Date(b.orderTime).getTime()
        );
        break;
      case 'amount_high':
        sortedOrders.sort((a, b) => {
          const totalA = a.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) + a.deliveryFee;
          const totalB = b.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) + b.deliveryFee;
          return totalB - totalA;
        });
        break;
      case 'amount_low':
        sortedOrders.sort((a, b) => {
          const totalA = a.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) + a.deliveryFee;
          const totalB = b.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) + b.deliveryFee;
          return totalA - totalB;
        });
        break;
    }
    
    setOrders(sortedOrders);
  };
  
  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        // Update status
        const updatedOrder = { ...order, status: newStatus };
        
        // Add to status history
        updatedOrder.statusHistory.push({
          status: getStatusLabel(newStatus),
          timestamp: new Date().toISOString()
        });
        
        return updatedOrder;
      }
      return order;
    });
    
    setOrders(updatedOrders);
    
    // Update selected order if it's open
    if (selectedOrder && selectedOrder.id === orderId) {
      const updatedSelectedOrder = updatedOrders.find(order => order.id === orderId);
      if (updatedSelectedOrder) {
        setSelectedOrder(updatedSelectedOrder);
      }
    }
  };
  
  // Helper function to get status label
  const getStatusLabel = (status: OrderStatus): string => {
    switch (status) {
      case 'new': return 'Đơn hàng mới';
      case 'processing': return 'Đang xử lý';
      case 'in_delivery': return 'Đang giao hàng';
      case 'completed': return 'Giao hàng thành công';
      case 'canceled': return 'Đơn hàng bị hủy';
      default: return '';
    }
  };
  
  // Calculate order total
  const calculateOrderTotal = (order: OrderType): number => {
    const itemsTotal = order.items.reduce(
      (sum, item) => sum + (item.quantity * item.unitPrice), 
      0
    );
    return itemsTotal + order.deliveryFee;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h2>
        
        {/* Status Tabs */}
        <Tabs 
          defaultValue="all" 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value)}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-3 sm:grid-cols-6 mb-6">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="new">Mới</TabsTrigger>
            <TabsTrigger value="processing">Đang xử lý</TabsTrigger>
            <TabsTrigger value="in_delivery">Đang giao</TabsTrigger>
            <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
            <TabsTrigger value="canceled">Đã hủy</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {/* Filters & Search Section */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                <Input
                  placeholder="Tìm kiếm theo mã đơn hàng hoặc tên khách hàng"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <OrderDateFilter onDateFilterChange={handleDateFilterChange} />
              <OrderSortDropdown onSortChange={handleSortChange} />
            </div>
            
            {/* Orders Count */}
            <div className="text-sm text-muted-foreground mb-4">
              Hiển thị {Math.min(filteredOrders.length, 1 + (currentPage - 1) * itemsPerPage)}-
              {Math.min(currentPage * itemsPerPage, filteredOrders.length)} 
              {" "}trong tổng số {filteredOrders.length} đơn hàng
            </div>
            
            {/* Orders Table */}
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Mã đơn hàng</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead className="text-right">Tổng tiền</TableHead>
                    <TableHead>Thanh toán</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrders.length > 0 ? (
                    currentOrders.map((order) => {
                      const orderTotal = calculateOrderTotal(order);
                      const nextStatus = getNextStatus(order.status);
                      
                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>
                            {new Date(order.orderTime).toLocaleString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </TableCell>
                          <TableCell>{order.customer.name}</TableCell>
                          <TableCell className="text-right font-medium">
                            {(orderTotal / 1000).toFixed(0)}K đ
                          </TableCell>
                          <TableCell>
                            <span className="whitespace-nowrap">
                              {order.paymentMethod === "Tiền mặt khi nhận hàng" 
                                ? "Tiền mặt" 
                                : "Online"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <OrderStatusBadge status={order.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewDetails(order)}
                            >
                              <Eye size={16} className="mr-1" />
                              Chi tiết
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Không tìm thấy đơn hàng nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {/* Render at most 5 page links */}
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    let pageNumber;
                    
                    // Calculate which page numbers to show
                    if (totalPages <= 5) {
                      // Show all pages if 5 or fewer
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      // Near start
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      // Near end
                      pageNumber = totalPages - 4 + i;
                    } else {
                      // Middle
                      pageNumber = currentPage - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          onClick={() => setCurrentPage(pageNumber)} 
                          isActive={currentPage === pageNumber}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Order Detail Dialog */}
        <OrderDetailDialog
          order={selectedOrder}
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </div>
  );
};

export default OrderManagement;
