
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RestaurantSidebar } from "@/components/restaurant/RestaurantSidebar";

const RestaurantOrders = () => {
  const { isAuthenticated, isRestaurant } = useAuth();

  if (!isAuthenticated || !isRestaurant) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <SidebarProvider>
        <div className="flex-1 flex w-full">
          <RestaurantSidebar />
          <main className="flex-1 p-8 overflow-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Restaurant Orders</h1>
              <p className="text-muted-foreground">
                View and manage your restaurant orders
              </p>
            </div>

            {/* Orders content will be implemented later */}
            <div className="text-center py-12">
              <p className="text-gray-500">Orders management coming soon</p>
            </div>
          </main>
        </div>
      </SidebarProvider>

      <Footer />
    </div>
  );
};

export default RestaurantOrders;
