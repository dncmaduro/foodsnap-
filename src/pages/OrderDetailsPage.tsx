
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Package, 
  Calendar, 
  CreditCard, 
  MapPin, 
  Phone, 
  MessageSquare, 
  User, 
  Clock, 
  ChevronLeft, 
  Star, 
  ExternalLink,
  Truck
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { format } from 'date-fns';

// Types for the order details
type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type OrderStatus = 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

type OrderDetails = {
  orderId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  orderDate: string;
  status: OrderStatus;
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
  driver?: {
    name: string;
    photo?: string;
    phone: string;
    deliveryTime?: string;
  };
  userRating?: {
    rating: number;
    comment?: string;
    date: string;
  };
};

const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRatingDialog, setShowRatingDialog] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call to fetch order details
    // For now, we're using mock data
    setLoading(true);
    
    setTimeout(() => {
      // Mock order data
      const mockOrder: OrderDetails = {
        orderId: id || 'ORD-1234',
        restaurantId: 'rest-1',
        restaurantName: 'Burger Palace',
        restaurantAddress: '123 Main St, Anytown, USA',
        orderDate: '2025-04-14T18:30:00',
        status: 'delivered',
        items: [
          { id: '1', name: 'Cheeseburger', quantity: 2, price: 9.99 },
          { id: '2', name: 'French Fries', quantity: 1, price: 4.99 },
          { id: '3', name: 'Chocolate Shake', quantity: 1, price: 5.99 },
        ],
        subtotal: 30.96,
        deliveryFee: 3.99,
        total: 34.95,
        paymentMethod: 'Credit Card (•••• 4242)',
        deliveryAddress: {
          name: 'John Doe',
          phone: '(555) 123-4567',
          address: '456 Oak Lane, Apt 3B, Anytown, USA',
          notes: 'Please leave at the door.',
        },
        driver: {
          name: 'Michael Rodriguez',
          photo: 'https://randomuser.me/api/portraits/men/75.jpg',
          phone: '(555) 987-6543',
          deliveryTime: '2025-04-14T19:15:00',
        },
        userRating: {
          rating: 4,
          comment: 'Food was delicious and arrived hot. Driver was very friendly.',
          date: '2025-04-14T20:00:00',
        },
      };
      
      setOrderDetails(mockOrder);
      setLoading(false);
    }, 500);
  }, [id]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'preparing':
        return <Badge className="bg-blue-500">Preparing</Badge>;
      case 'out_for_delivery':
        return <Badge className="bg-amber-500">Out for Delivery</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500">Delivered</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP p');
  };

  if (loading) {
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

  if (!orderDetails) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium">Order not found</h2>
            <Button 
              className="mt-4 bg-foodsnap-orange hover:bg-foodsnap-orange/90"
              onClick={() => navigate('/order-history')}
            >
              Back to Order History
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const RatingStars = ({ rating }: { rating: number }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4 px-0 text-gray-600 hover:text-foodsnap-orange hover:bg-transparent"
            onClick={() => navigate('/order-history')}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Order History
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <div className="flex items-center">
              <span className="mr-2">Status:</span>
              {getStatusBadge(orderDetails.status)}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Order Summary Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-foodsnap-orange" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium">{orderDetails.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">{formatDate(orderDetails.orderDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium flex items-center">
                    <CreditCard className="h-4 w-4 mr-1 text-gray-400" />
                    {orderDetails.paymentMethod}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium text-foodsnap-orange">${orderDetails.total.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Restaurant Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Restaurant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="font-medium text-lg">{orderDetails.restaurantName}</h3>
                <p className="text-gray-600 text-sm">{orderDetails.restaurantAddress}</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full justify-start text-foodsnap-teal border-foodsnap-teal hover:bg-foodsnap-teal/10"
                onClick={() => navigate(`/restaurant/${orderDetails.restaurantId}`)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Restaurant Profile
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Items Ordered Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-foodsnap-orange" />
              Items Ordered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderDetails.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${orderDetails.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>${orderDetails.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span>${orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Delivery Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-foodsnap-orange" />
                Delivery Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{orderDetails.deliveryAddress.name}</p>
                <p className="text-gray-600 flex items-center">
                  <Phone className="h-4 w-4 mr-1 text-gray-400" />
                  {orderDetails.deliveryAddress.phone}
                </p>
                <p className="text-gray-600 mt-2">{orderDetails.deliveryAddress.address}</p>
              </div>
              
              {orderDetails.deliveryAddress.notes && (
                <div className="bg-gray-50 p-3 rounded-md mt-3">
                  <p className="text-sm flex items-start">
                    <MessageSquare className="h-4 w-4 mr-1 text-gray-400 mt-0.5" />
                    <span><span className="font-medium">Delivery Instructions:</span> {orderDetails.deliveryAddress.notes}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Driver Information */}
          {orderDetails.driver && orderDetails.status === 'delivered' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-foodsnap-orange" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
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
                
                {orderDetails.driver.deliveryTime && (
                  <div className="text-sm text-gray-600 flex items-center mt-2">
                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                    <span>Delivered at {formatDate(orderDetails.driver.deliveryTime)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Rating & Review Block */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-foodsnap-orange" />
              Your Rating & Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orderDetails.userRating ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RatingStars rating={orderDetails.userRating.rating} />
                  <span className="text-sm text-gray-500">
                    Submitted on {formatDate(orderDetails.userRating.date)}
                  </span>
                </div>
                
                {orderDetails.userRating.comment && (
                  <div className="bg-gray-50 p-4 rounded-md mt-3">
                    <p className="italic text-gray-700">{orderDetails.userRating.comment}</p>
                  </div>
                )}
                
                <div className="mt-3">
                  <Button variant="outline" size="sm">
                    Edit Review
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-4">You haven't rated this order yet.</p>
                <Button 
                  className="bg-foodsnap-teal hover:bg-foodsnap-teal/90"
                  onClick={() => setShowRatingDialog(true)}
                >
                  <Star className="h-4 w-4 mr-1" />
                  Rate This Order
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Reorder Section */}
        <div className="text-center mb-6">
          <Button 
            className="px-8 py-6 bg-foodsnap-orange hover:bg-foodsnap-orange/90"
            onClick={() => navigate(`/restaurant/${orderDetails.restaurantId}`)}
          >
            Order Again from {orderDetails.restaurantName}
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderDetailsPage;
