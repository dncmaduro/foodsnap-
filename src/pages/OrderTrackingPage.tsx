
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Clock, Package, MapPin, Truck, Check, Phone, MessageCircle, HelpCircle, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

// Mock order status - in a real app, this would come from an API
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

  // In a real app, this would fetch the order details from an API
  useEffect(() => {
    // Check if we have order details in the location state
    const stateOrderDetails = location.state?.orderDetails;
    
    if (stateOrderDetails) {
      setOrderDetails(stateOrderDetails);
    } else {
      // Mock data as fallback
      const mockOrder: OrderDetails = {
        orderId: id || `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
        restaurantName: "Delicious Restaurant",
        restaurantPhone: "(123) 456-7890",
        timeOrdered: "Today at 2:30 PM",
        estimatedDelivery: "3:15 PM - 3:45 PM",
        status: 'preparing',
        items: [
          { id: "1", name: "Cheeseburger", quantity: 2 },
          { id: "2", name: "French Fries", quantity: 1 },
          { id: "3", name: "Chicken Nuggets", quantity: 1 },
          { id: "4", name: "Diet Coke", quantity: 2 }
        ],
        total: 36.93,
        paymentMethod: "Cash on Delivery",
        deliveryAddress: {
          name: "John Doe",
          phone: "(123) 456-7890",
          address: "123 Main St, Apt 4B, New York, NY 10001",
          notes: "Please ring the doorbell twice."
        },
        // Added driver information for orders that are out for delivery
        driver: {
          name: "Michael Johnson",
          phone: "(555) 123-4567",
          photo: "https://randomuser.me/api/portraits/men/32.jpg"
        }
      };
      setOrderDetails(mockOrder);
    }
  }, [id, location]);

  // Update status timeline based on current status
  useEffect(() => {
    if (orderDetails) {
      const now = new Date();
      const statusMap: Record<OrderStatus, number> = {
        'received': 25,
        'preparing': 50,
        'out_for_delivery': 75,
        'delivered': 100
      };
      
      // Set progress value based on current status
      setProgressValue(statusMap[orderDetails.status]);
      
      // Update timestamps for completed statuses
      const updatedStatuses = [...orderStatuses];
      let allCompleted = true;
      
      for (let i = 0; i < updatedStatuses.length; i++) {
        const status = updatedStatuses[i];
        const statusKey = status.status;
        
        // If this status is before or equal to the current order status, mark as completed
        if (
          (statusKey === 'received') ||
          (statusKey === 'preparing' && ['preparing', 'out_for_delivery', 'delivered'].includes(orderDetails.status)) ||
          (statusKey === 'out_for_delivery' && ['out_for_delivery', 'delivered'].includes(orderDetails.status)) ||
          (statusKey === 'delivered' && orderDetails.status === 'delivered')
        ) {
          // Set a timestamp for completed steps (in a real app, this would come from the server)
          const timeOffset = i * 15; // mock time differences between steps
          const statusTime = new Date(now.getTime() - timeOffset * 60000);
          
          updatedStatuses[i] = {
            ...status,
            timestamp: statusTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
            <h2 className="text-xl font-medium">Loading order details...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Status icon mapping
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

  // Status label mapping
  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'received':
        return 'Order Received';
      case 'preparing':
        return 'Preparing';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-6 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <div>
              <p className="text-gray-600">Order #: <span className="font-semibold">{orderDetails.orderId}</span></p>
              <p className="text-gray-600">Placed: <span className="font-semibold">{orderDetails.timeOrdered}</span></p>
            </div>
            <div>
              <p className="text-gray-600">
                <Clock className="inline-block mr-1 h-4 w-4 text-foodsnap-orange" />
                Estimated Delivery: <span className="font-semibold">{orderDetails.estimatedDelivery}</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Order Status Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-foodsnap-orange" />
              Order Status
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
          {/* Order Details Section */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-foodsnap-orange" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg mb-2">{orderDetails.restaurantName}</h3>
                
                {/* Items Ordered */}
                <div className="space-y-2 mb-6">
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        <span className="font-medium">{item.quantity}× </span>
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                {/* Payment Details */}
                <div className="space-y-2">
                  <div className="flex justify-between font-medium">
                    <span>Total Paid</span>
                    <span>${orderDetails.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Payment Method</span>
                    <span>{orderDetails.paymentMethod}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                {/* Delivery Address */}
                <div className="mt-4">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-foodsnap-orange" />
                    Delivery Address
                  </h4>
                  <div className="text-gray-700">
                    <p className="font-medium">{orderDetails.deliveryAddress.name}</p>
                    <p>{orderDetails.deliveryAddress.phone}</p>
                    <p className="mt-1">{orderDetails.deliveryAddress.address}</p>
                    {orderDetails.deliveryAddress.notes && (
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Notes:</span> {orderDetails.deliveryAddress.notes}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Contact Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-foodsnap-orange" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Restaurant</h4>
                  <p className="text-gray-700">{orderDetails.restaurantName}</p>
                  <p className="text-gray-700">{orderDetails.restaurantPhone}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 text-foodsnap-orange border-foodsnap-orange hover:bg-foodsnap-orange/10 gap-1"
                  >
                    <Phone className="h-4 w-4" />
                    Call Restaurant
                  </Button>
                </div>
                
                <Separator />
                
                {/* Driver contact info section */}
                {orderDetails.driver && (
                  <div>
                    <h4 className="font-medium mb-2">Your Delivery Driver</h4>
                    <div className="flex items-center space-x-3 mb-3">
                      {orderDetails.driver.photo ? (
                        <div className="h-12 w-12 rounded-full overflow-hidden">
                          <img 
                            src={orderDetails.driver.photo} 
                            alt={orderDetails.driver.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{orderDetails.driver.name}</p>
                        <p className="text-sm text-gray-600">{orderDetails.driver.phone}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-foodsnap-teal border-foodsnap-teal hover:bg-foodsnap-teal/10 gap-1"
                    >
                      <Phone className="h-4 w-4" />
                      Call Driver
                    </Button>
                  </div>
                )}
                
                {orderDetails.driver && <Separator />}
                
                <div>
                  <h4 className="font-medium mb-2">Need Help?</h4>
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-foodsnap-teal hover:bg-foodsnap-teal/90 gap-1"
                      size="sm"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat with Support
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full gap-1"
                      size="sm"
                    >
                      <HelpCircle className="h-4 w-4" />
                      Help Center
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">
                    <strong>Delivery Issues?</strong> Contact our support team 
                    for immediate assistance with your order.
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

