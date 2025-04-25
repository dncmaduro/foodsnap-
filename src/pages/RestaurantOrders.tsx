
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RestaurantSidebar } from "@/components/restaurant/RestaurantSidebar";
import { OrdersTable } from "@/components/restaurant/OrdersTable";
import { OrderFilters } from "@/components/restaurant/OrderFilters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderDetailsModal } from "@/components/restaurant/OrderDetailsModal";

// Order status types
export type OrderStatus = "new" | "processing" | "in-delivery" | "completed" | "canceled";

// Order item type
export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  note?: string;
};

// Order type
export type Order = {
  id: string;
  orderId: string;
  orderTime: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  totalAmount: number;
  paymentMethod: "Cash" | "Credit Card" | "Online Payment";
  status: OrderStatus;
  items: OrderItem[];
  specialNotes?: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
  }[];
};

// Mock data for orders
const mockOrders: Order[] = [
  {
    id: "1",
    orderId: "ORD-2025-001",
    orderTime: "2025-04-25T10:30:00",
    customerName: "John Smith",
    customerPhone: "555-123-4567",
    deliveryAddress: "123 Main St, Anytown, CA",
    totalAmount: 32.50,
    paymentMethod: "Credit Card",
    status: "new",
    items: [
      { id: "i1", name: "Margherita Pizza", quantity: 1, unitPrice: 16.99, note: "Extra cheese" },
      { id: "i2", name: "Garlic Bread", quantity: 1, unitPrice: 5.99 },
      { id: "i3", name: "Coke", quantity: 2, unitPrice: 2.99 }
    ],
    specialNotes: "Please ring the doorbell",
    statusHistory: [
      { status: "new", timestamp: "2025-04-25T10:30:00" }
    ]
  },
  {
    id: "2",
    orderId: "ORD-2025-002",
    orderTime: "2025-04-25T11:15:00",
    customerName: "Emma Johnson",
    customerPhone: "555-234-5678",
    deliveryAddress: "456 Oak Ave, Sometown, CA",
    totalAmount: 47.75,
    paymentMethod: "Cash",
    status: "processing",
    items: [
      { id: "i4", name: "Family Size Pizza", quantity: 1, unitPrice: 24.99 },
      { id: "i5", name: "Buffalo Wings", quantity: 1, unitPrice: 12.99 },
      { id: "i6", name: "Sprite", quantity: 2, unitPrice: 2.99 }
    ],
    statusHistory: [
      { status: "new", timestamp: "2025-04-25T11:15:00" },
      { status: "processing", timestamp: "2025-04-25T11:20:00" }
    ]
  },
  {
    id: "3",
    orderId: "ORD-2025-003",
    orderTime: "2025-04-25T09:45:00",
    customerName: "Michael Brown",
    customerPhone: "555-345-6789",
    deliveryAddress: "789 Pine St, Othertown, CA",
    totalAmount: 23.99,
    paymentMethod: "Online Payment",
    status: "in-delivery",
    items: [
      { id: "i7", name: "Vegetarian Pizza", quantity: 1, unitPrice: 18.99 },
      { id: "i8", name: "Garden Salad", quantity: 1, unitPrice: 4.99 }
    ],
    statusHistory: [
      { status: "new", timestamp: "2025-04-25T09:45:00" },
      { status: "processing", timestamp: "2025-04-25T09:50:00" },
      { status: "in-delivery", timestamp: "2025-04-25T10:15:00" }
    ]
  },
  {
    id: "4",
    orderId: "ORD-2025-004",
    orderTime: "2025-04-24T18:30:00",
    customerName: "Sarah Wilson",
    customerPhone: "555-456-7890",
    deliveryAddress: "101 Maple Rd, Anycity, CA",
    totalAmount: 52.47,
    paymentMethod: "Credit Card",
    status: "completed",
    items: [
      { id: "i9", name: "Meat Lover's Pizza", quantity: 1, unitPrice: 22.99 },
      { id: "i10", name: "Cheese Sticks", quantity: 1, unitPrice: 8.99 },
      { id: "i11", name: "Caesar Salad", quantity: 1, unitPrice: 9.99 },
      { id: "i12", name: "Bottled Water", quantity: 2, unitPrice: 1.99 }
    ],
    statusHistory: [
      { status: "new", timestamp: "2025-04-24T18:30:00" },
      { status: "processing", timestamp: "2025-04-24T18:35:00" },
      { status: "in-delivery", timestamp: "2025-04-24T19:00:00" },
      { status: "completed", timestamp: "2025-04-24T19:30:00" }
    ]
  },
  {
    id: "5",
    orderId: "ORD-2025-005",
    orderTime: "2025-04-24T20:15:00",
    customerName: "David Lee",
    customerPhone: "555-567-8901",
    deliveryAddress: "202 Elm St, Somewhere, CA",
    totalAmount: 19.99,
    paymentMethod: "Cash",
    status: "canceled",
    items: [
      { id: "i13", name: "Pepperoni Pizza", quantity: 1, unitPrice: 19.99 }
    ],
    specialNotes: "Customer canceled due to long wait time",
    statusHistory: [
      { status: "new", timestamp: "2025-04-24T20:15:00" },
      { status: "canceled", timestamp: "2025-04-24T20:45:00" }
    ]
  }
];

const RestaurantOrders = () => {
  const { isAuthenticated, isRestaurant } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isAuthenticated || !isRestaurant) {
    return <Navigate to="/" replace />;
  }

  // Filter orders based on the selected tab
  const getFilteredOrders = () => {
    if (currentTab === "all") return mockOrders;
    return mockOrders.filter(order => order.status === currentTab);
  };

  // Handle view order details
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <SidebarProvider>
        <div className="flex-1 flex w-full">
          <RestaurantSidebar />
          <main className="flex-1 p-8 overflow-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Order Management</h1>
              <p className="text-muted-foreground">
                View and manage all your restaurant orders
              </p>
            </div>

            {/* Tabs Navigation */}
            <Tabs
              defaultValue="all"
              value={currentTab}
              onValueChange={setCurrentTab}
              className="w-full mb-6"
            >
              <TabsList className="mb-2 w-full grid grid-cols-3 md:grid-cols-6 gap-1">
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="new">New Orders</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="in-delivery">In Delivery</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="canceled">Canceled</TabsTrigger>
              </TabsList>

              {/* Filter Section */}
              <OrderFilters />

              {/* All Tabs Content - Using the same table but with filtered data */}
              <TabsContent value="all" className="mt-0">
                <OrdersTable orders={getFilteredOrders()} onViewDetails={handleViewOrder} />
              </TabsContent>
              <TabsContent value="new" className="mt-0">
                <OrdersTable orders={getFilteredOrders()} onViewDetails={handleViewOrder} />
              </TabsContent>
              <TabsContent value="processing" className="mt-0">
                <OrdersTable orders={getFilteredOrders()} onViewDetails={handleViewOrder} />
              </TabsContent>
              <TabsContent value="in-delivery" className="mt-0">
                <OrdersTable orders={getFilteredOrders()} onViewDetails={handleViewOrder} />
              </TabsContent>
              <TabsContent value="completed" className="mt-0">
                <OrdersTable orders={getFilteredOrders()} onViewDetails={handleViewOrder} />
              </TabsContent>
              <TabsContent value="canceled" className="mt-0">
                <OrdersTable orders={getFilteredOrders()} onViewDetails={handleViewOrder} />
              </TabsContent>
            </Tabs>
            
            {/* Order Details Modal */}
            {selectedOrder && (
              <OrderDetailsModal 
                order={selectedOrder} 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
              />
            )}
          </main>
        </div>
      </SidebarProvider>

      <Footer />
    </div>
  );
};

export default RestaurantOrders;
