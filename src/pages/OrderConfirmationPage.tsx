
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Clock, Truck, Home, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

// Mock order details - in a real app, this would come from an API or context
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
};

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  
  // In a real app, this would fetch the order details from an API
  // For this demo, we'll use mock data or try to get it from location state
  useEffect(() => {
    // Check if we have order details in the location state
    const stateOrderDetails = location.state?.orderDetails;
    
    if (stateOrderDetails) {
      setOrderDetails(stateOrderDetails);
    } else {
      // Mock data as fallback
      setOrderDetails({
        orderId: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
        restaurantName: "Delicious Restaurant",
        estimatedDelivery: "30-45 minutes",
        items: [
          { id: "1", name: "Cheeseburger", quantity: 2, price: 9.99 },
          { id: "2", name: "French Fries", quantity: 1, price: 3.99 },
          { id: "3", name: "Chicken Nuggets", quantity: 1, price: 5.99 },
          { id: "4", name: "Diet Coke", quantity: 2, price: 1.99 }
        ],
        subtotal: 33.94,
        deliveryFee: 2.99,
        total: 36.93,
        paymentMethod: "Cash on Delivery",
        deliveryAddress: {
          name: "John Doe",
          phone: "(123) 456-7890",
          address: "123 Main St, Apt 4B, New York, NY 10001",
          notes: "Please ring the doorbell twice."
        }
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
            <h2 className="text-xl font-medium">Loading order details...</h2>
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
        {/* Confirmation Message Section */}
        <div className="text-center py-8 mb-6">
          <div className="mx-auto bg-green-100 rounded-full h-24 w-24 flex items-center justify-center mb-4">
            <Check className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your order has been placed successfully!</h1>
          <p className="text-gray-600 mb-2">Order Number: <span className="font-semibold">{orderDetails.orderId}</span></p>
          <div className="flex items-center justify-center text-gray-600">
            <Clock className="mr-2 h-5 w-5 text-foodsnap-orange" />
            <p>Estimated Delivery Time: <span className="font-semibold">{orderDetails.estimatedDelivery}</span></p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Summary Section */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-foodsnap-orange" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg mb-2">{orderDetails.restaurantName}</h3>
                
                {/* Ordered Items */}
                <div className="space-y-3 mb-6">
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <span className="font-medium">{item.quantity}× </span>
                        <span>{item.name}</span>
                      </div>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                {/* Cost Breakdown */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${orderDetails.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>${orderDetails.deliveryFee.toFixed(2)}</span>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${orderDetails.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-700">
                    <span className="font-medium">Payment Method:</span> {orderDetails.paymentMethod}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Delivery Information Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2 h-5 w-5 text-foodsnap-orange" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{orderDetails.deliveryAddress.name}</p>
                  <p>{orderDetails.deliveryAddress.phone}</p>
                  <p className="mt-1">{orderDetails.deliveryAddress.address}</p>
                  {orderDetails.deliveryAddress.notes && (
                    <div className="mt-2 text-gray-600">
                      <span className="font-medium">Notes:</span> {orderDetails.deliveryAddress.notes}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Next Actions Section */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full py-6 bg-foodsnap-teal hover:bg-foodsnap-teal/90 flex items-center justify-center"
                  onClick={() => navigate(`/track-order/${orderDetails.orderId}`, { state: { orderDetails } })}
                >
                  <Truck className="mr-2 h-5 w-5" />
                  Track Order
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full py-6 border-foodsnap-orange text-foodsnap-orange hover:bg-foodsnap-orange/10 flex items-center justify-center"
                  onClick={() => navigate('/')}
                >
                  <Home className="mr-2 h-5 w-5" />
                  Back to Home
                </Button>
                
                <div className="p-4 bg-blue-50 rounded-md mt-4">
                  <h4 className="font-semibold text-blue-800 mb-1">Need Help?</h4>
                  <p className="text-sm text-blue-700 mb-2">
                    If you have any questions about your order, please contact our customer support.
                  </p>
                  <a 
                    href="#" 
                    className="text-sm font-medium text-blue-700 underline hover:text-blue-900"
                  >
                    Contact Support
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
