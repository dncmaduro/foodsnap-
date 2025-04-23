import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

type Restaurant = {
  id: string;
  name: string;
  address: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
};

// Mock data - replace with actual API call
const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Test Restaurant",
    address: "123 Test St, Test City, TS 12345",
    submittedDate: "2024-04-20",
    status: "pending"
  }
];

const getStatusColor = (status: Restaurant['status']) => {
  switch (status) {
    case 'approved':
      return 'bg-green-500';
    case 'rejected':
      return 'bg-red-500';
    default:
      return 'bg-yellow-500';
  }
};

const RestaurantVerificationPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [restaurants] = useState<Restaurant[]>(mockRestaurants);

  useEffect(() => {
    if (!isAuthenticated || user?.type !== 'restaurant') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleViewDetails = (restaurantId: string) => {
    if (restaurants.find(r => r.id === restaurantId)?.status === 'approved') {
      navigate(`/restaurant-dashboard`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-foodsnap-orange">
              Food<span className="text-foodsnap-teal">Snap</span>
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-gray-600 hover:text-foodsnap-orange transition-colors">
              Home
            </Link>
            <Button 
              variant="ghost"
              onClick={handleLogout}
              className="text-gray-600 hover:text-foodsnap-orange transition-colors"
            >
              Logout
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8">Your Restaurants</h1>

        <div className="grid gap-4">
          {restaurants.map((restaurant) => (
            <Card 
              key={restaurant.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-2">
                <CardTitle>{restaurant.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p>{restaurant.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Submitted Date</p>
                    <p>{new Date(restaurant.submittedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge className={`${getStatusColor(restaurant.status)} capitalize`}>
                      {restaurant.status}
                    </Badge>
                    {restaurant.status === 'approved' && (
                      <Button 
                        onClick={() => handleViewDetails(restaurant.id)}
                        className="ml-4 bg-foodsnap-teal hover:bg-foodsnap-teal/90"
                      >
                        View Dashboard
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>
            Verification typically takes 24–48 hours. You'll be notified once the process is complete.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <div className="flex gap-4">
              <a href="#" className="hover:text-foodsnap-orange transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-foodsnap-orange transition-colors">Privacy Policy</a>
            </div>
            <div>
              <p>Contact: support@foodsnap.com</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RestaurantVerificationPage;
