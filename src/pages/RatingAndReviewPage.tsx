import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star, ArrowLeft, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type OrderDetails = {
  orderId: string;
  restaurantId: string;
  restaurantName: string;
  orderDate: string;
  items: OrderItem[];
  total: number;
  userRating?: {
    rating: number;
    comment?: string;
    date: string;
  };
};

const RatingAndReviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyRated, setAlreadyRated] = useState(false);

  useEffect(() => {
    setLoading(true);
    
    const stateOrderDetails = location.state?.orderDetails;
    
    if (stateOrderDetails) {
      setOrderDetails(stateOrderDetails);
      if (stateOrderDetails.userRating) {
        setAlreadyRated(true);
        toast({
          title: "Already Rated",
          description: "This order has already been rated and reviewed.",
          variant: "destructive",
        });
        setTimeout(() => {
          navigate(`/order/${id}`);
        }, 2000);
      }
      setLoading(false);
    } else if (id) {
      setTimeout(() => {
        const mockOrder: OrderDetails = {
          orderId: id,
          restaurantId: 'rest-1',
          restaurantName: 'Burger Palace',
          orderDate: '2025-04-14T18:30:00',
          items: [
            { id: '1', name: 'Cheeseburger', quantity: 2, price: 9.99 },
            { id: '2', name: 'French Fries', quantity: 1, price: 4.99 },
            { id: '3', name: 'Chocolate Shake', quantity: 1, price: 5.99 },
          ],
          total: 34.95,
        };

        setOrderDetails(mockOrder);
        setLoading(false);
      }, 500);
    }
  }, [id, location.state, navigate, toast]);

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = () => {
    if (alreadyRated) {
      toast({
        title: "Cannot Submit",
        description: "This order has already been rated and reviewed.",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Review Submitted!",
      description: "Thank you for your feedback.",
    });
    
    setTimeout(() => {
      navigate(`/order/${id}`);
    }, 1500);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (alreadyRated) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-amber-500">
                <Lock className="h-6 w-6" />
                Already Rated
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p>This order has already been rated and reviewed.</p>
              <p>You cannot submit multiple reviews for the same order.</p>
              
              <Button 
                className="mt-4 bg-foodsnap-orange hover:bg-foodsnap-orange/90"
                onClick={() => navigate(`/order/${id}`)}
              >
                Return to Order Details
              </Button>
            </CardContent>
          </Card>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-6 max-w-2xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4 px-0 text-gray-600 hover:text-foodsnap-orange hover:bg-transparent"
            onClick={() => navigate(`/order/${id}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Order Details
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">Rate Your Order</h1>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-medium text-lg">{orderDetails.restaurantName}</h3>
              <p className="text-gray-600 text-sm">Order ID: {orderDetails.orderId}</p>
              <p className="text-gray-600 text-sm">Ordered on {formatDate(orderDetails.orderDate)}</p>
            </div>
            
            <Separator className="my-3" />
            
            <div className="space-y-2">
              <p className="font-medium">Items:</p>
              {orderDetails.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.quantity}× {item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Rate your experience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none p-1"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-gray-600">
              {rating === 0
                ? "Click to rate"
                : rating === 1
                ? "Poor"
                : rating === 2
                ? "Fair"
                : rating === 3
                ? "Good"
                : rating === 4
                ? "Very Good"
                : "Excellent"}
            </p>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Write a review (optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Share details of your experience at this restaurant..."
              className="min-h-32"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </CardContent>
        </Card>
        
        <div className="text-center mb-6">
          <Button 
            className="px-8 py-6 bg-foodsnap-teal hover:bg-foodsnap-teal/90"
            onClick={handleSubmit}
          >
            Submit Review
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RatingAndReviewPage;
