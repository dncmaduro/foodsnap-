
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import SearchResults from "./pages/SearchResults";
import RestaurantProfile from "./pages/RestaurantProfile";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import RatingAndReviewPage from "./pages/RatingAndReviewPage";
import SignUpPage from "./pages/SignUpPage";
import RestaurantSignUpForm from "./pages/RestaurantSignUpForm";
import ProfilePage from "./pages/ProfilePage";
import RestaurantDetailsForm from "./pages/RestaurantDetailsForm";
import NotFound from "./pages/NotFound";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import RestaurantMenu from "./pages/RestaurantMenu";

const queryClient = new QueryClient();

// The key fix is moving BrowserRouter to wrap everything, including TooltipProvider
const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/restaurant/:id" element={<RestaurantProfile />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/track-order/:id?" element={<OrderTrackingPage />} />
              <Route path="/order-history" element={<OrderHistoryPage />} />
              <Route path="/order/:id" element={<OrderDetailsPage />} />
              <Route path="/rate-order/:id" element={<RatingAndReviewPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/signup/restaurant" element={<RestaurantSignUpForm />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/restaurant-details" element={<RestaurantDetailsForm />} />
              <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
              <Route path="/restaurant-menu" element={<RestaurantMenu />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
