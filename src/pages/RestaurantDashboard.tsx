
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DashboardStats from "@/components/restaurant/DashboardStats";
import DashboardActions from "@/components/restaurant/DashboardActions";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const RestaurantDashboard = () => {
  const { isAuthenticated, isRestaurant } = useAuth();

  // Redirect if not authenticated or not a restaurant
  if (!isAuthenticated || !isRestaurant) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Restaurant Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your restaurant operations and track performance
          </p>
        </div>

        <DashboardStats />
        <DashboardActions />
      </main>

      <Footer />
    </div>
  );
};

export default RestaurantDashboard;
