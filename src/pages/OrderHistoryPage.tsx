import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  ArrowUpDown, 
  User, 
  Phone, 
  ShoppingBag, 
  ChevronRight,
  PackageOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Progress } from '@/components/ui/progress';
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for current order
const currentOrder = {
  id: 'ORD-4815',
  restaurantName: 'Burger Palace',
  status: 'on-the-way', // 'preparing', 'on-the-way', 'delivered'
  statusProgress: 66, // percentage of progress
  estimatedDelivery: '15-25 minutes',
  orderDate: new Date(),
  items: [
    { name: 'Double Cheeseburger', quantity: 2 },
    { name: 'Fries (Large)', quantity: 1 },
    { name: 'Chocolate Shake', quantity: 1 }
  ],
  total: 24.98,
  driver: {
    name: 'Michael Rodriguez',
    photo: '/placeholder.svg', // Using placeholder image
    phone: '(555) 123-4567'
  }
};

// Mock data for past orders
const pastOrders = [
  {
    id: 'ORD-TEST',
    restaurantName: 'Test Restaurant (Not Rated)',
    restaurantLogo: '/placeholder.svg',
    orderDate: new Date(Date.now() - 86400000), // 1 day ago
    items: [
      { name: 'Test Burger', quantity: 1 },
      { name: 'Test Fries', quantity: 1 }
    ],
    itemCount: 2,
    total: 19.99,
    status: 'completed',
    // This order doesn't have a rating or review
  },
  {
    id: 'ORD-4814',
    restaurantName: 'Pizza Haven',
    restaurantLogo: '/placeholder.svg',
    orderDate: new Date(Date.now() - 86400000 * 2), // 2 days ago
    items: [
      { name: 'Pepperoni Pizza (Large)', quantity: 1 },
      { name: 'Garlic Knots', quantity: 2 }
    ],
    itemCount: 2,
    total: 26.98,
    status: 'completed'
  },
  {
    id: 'ORD-4813',
    restaurantName: 'Thai Delight',
    restaurantLogo: '/placeholder.svg',
    orderDate: new Date(Date.now() - 86400000 * 5), // 5 days ago
    items: [
      { name: 'Pad Thai', quantity: 1 },
      { name: 'Spring Rolls', quantity: 1 },
      { name: 'Tom Yum Soup', quantity: 1 }
    ],
    itemCount: 3,
    total: 35.45,
    status: 'completed'
  },
  {
    id: 'ORD-4812',
    restaurantName: 'Sushi Express',
    restaurantLogo: '/placeholder.svg',
    orderDate: new Date(Date.now() - 86400000 * 12), // 12 days ago
    items: [
      { name: 'California Roll', quantity: 2 },
      { name: 'Miso Soup', quantity: 1 }
    ],
    itemCount: 2,
    total: 28.50,
    status: 'cancelled'
  }
];

const OrderHistoryPage = () => {
  const [filter, setFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('recent');
  const [hasActiveOrder, setHasActiveOrder] = useState<boolean>(true);
  const [filteredOrders, setFilteredOrders] = useState(pastOrders);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Filter orders based on selected filter
    if (filter === 'all') {
      setFilteredOrders(pastOrders);
    } else {
      setFilteredOrders(pastOrders.filter(order => order.status === filter));
    }

    // Sort orders based on selected sort order
    const sortedOrders = [...filteredOrders].sort((a, b) => {
      if (sortOrder === 'recent') {
        return b.orderDate.getTime() - a.orderDate.getTime();
      } else {
        return a.orderDate.getTime() - b.orderDate.getTime();
      }
    });

    setFilteredOrders(sortedOrders);
  }, [filter, sortOrder]);

  // Calculate the order status step
  const getOrderStatusStep = (status: string) => {
    switch (status) {
      case 'preparing':
        return 1;
      case 'on-the-way':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 0;
    }
  };

  // Format the date to a readable string
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Order History</h1>
        
        {/* Current Order Tracking Section */}
        {hasActiveOrder && (
          <div className="bg-white rounded-lg shadow mb-8 p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Current Order</h2>
              <span className="text-sm text-gray-500">{currentOrder.id}</span>
            </div>
            
            {/* Progress Tracker */}
            <div className="mb-6">
              <Progress value={currentOrder.statusProgress} className="h-2 mb-3" />
              <div className="flex justify-between text-sm">
                <div className={`text-center ${getOrderStatusStep(currentOrder.status) >= 1 ? 'text-foodsnap-teal font-medium' : 'text-gray-400'}`}>
                  Preparing
                </div>
                <div className={`text-center ${getOrderStatusStep(currentOrder.status) >= 2 ? 'text-foodsnap-teal font-medium' : 'text-gray-400'}`}>
                  On the way
                </div>
                <div className={`text-center ${getOrderStatusStep(currentOrder.status) >= 3 ? 'text-foodsnap-teal font-medium' : 'text-gray-400'}`}>
                  Delivered
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Order Info */}
              <div className="col-span-1 md:col-span-2">
                <h3 className="font-medium mb-2">{currentOrder.restaurantName}</h3>
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 text-foodsnap-orange mr-2" />
                  <span className="text-sm">Estimated delivery: {currentOrder.estimatedDelivery}</span>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  {currentOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.quantity}× {item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Driver Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Your Driver</h3>
                <div className="flex items-center mb-3">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
                    <img src={currentOrder.driver.photo} alt="Driver" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <div className="font-medium">{currentOrder.driver.name}</div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-3 w-3 mr-1" />
                      {currentOrder.driver.phone}
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full border-foodsnap-teal text-foodsnap-teal hover:bg-foodsnap-teal/10"
                  onClick={() => navigate(`/track-order/${currentOrder.id}`)}
                >
                  View Full Tracking
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Filter and Sort Options */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <ToggleGroup type="single" value={sortOrder} onValueChange={(value) => value && setSortOrder(value)}>
            <ToggleGroupItem value="recent" aria-label="Sort by most recent">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Most Recent
            </ToggleGroupItem>
            <ToggleGroupItem value="oldest" aria-label="Sort by oldest">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Oldest
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        {/* Order List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div className="flex items-center mb-2 md:mb-0">
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                          <img 
                            src={order.restaurantLogo} 
                            alt={order.restaurantName} 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{order.restaurantName}</h3>
                          <div className="text-sm text-gray-500">{formatDate(order.orderDate)}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="text-right mr-4">
                          <div className="font-medium">${order.total.toFixed(2)}</div>
                          <div className="text-sm text-gray-500">{order.itemCount} items</div>
                        </div>
                        
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {order.status === 'completed' ? 'Completed' : 'Cancelled'}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 p-4">
                  <Button 
                    variant="ghost" 
                    className="ml-auto flex items-center text-foodsnap-teal hover:text-foodsnap-teal/80"
                    onClick={() => navigate(`/order/${order.id}`)}
                  >
                    View Details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="mx-auto bg-gray-100 rounded-full h-24 w-24 flex items-center justify-center mb-4">
              <PackageOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">You haven't placed any orders yet</h3>
            <p className="text-gray-500 mb-6">When you place an order, it will appear here.</p>
            <Button 
              className="bg-foodsnap-orange hover:bg-foodsnap-orange/90"
              onClick={() => navigate('/restaurants')}
            >
              Start Browsing
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderHistoryPage;
