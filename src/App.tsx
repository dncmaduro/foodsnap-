import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from '@/contexts/CartContext'
import Index from './pages/Index'
import SearchResults from './pages/SearchResults'
import RestaurantProfile from './pages/RestaurantProfile'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import OrderTrackingPage from './pages/OrderTrackingPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import OrderDetailsPage from './pages/OrderDetailsPage'
import RatingAndReviewPage from './pages/RatingAndReviewPage'
import SignUpPage from './pages/SignUpPage'
import ProfilePage from './pages/ProfilePage'
import RestaurantManagementPage from './pages/RestaurantManagementPage'
import RestaurantRegistrationPage from './pages/RestaurantRegistrationPage'
import MyRestaurantsPage from './pages/MyRestaurantsPage'
import RestaurantDetailsPage from './pages/RestaurantDetailsPage'
import DeliveryDriverRegistrationLinks from './pages/DeliveryDriverRegistrationLinks'
import DeliveryDriverRegistrationForm from './pages/DeliveryDriverRegistrationForm'
import DeliveryOrdersPage from './pages/DeliveryOrdersPage'
import DeliveryStatusUpdatePage from './pages/DeliveryStatusUpdatePage'
import DeliveryHistoryPage from './pages/DeliveryHistoryPage'
import DriverProfilePage from './pages/DriverProfilePage'
import NotFound from './pages/NotFound'

// Create a new QueryClient instance
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          {/* Use only one toaster to avoid conflicts */}
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/restaurant/:id" element={<RestaurantProfile />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
              <Route path="/track-order/:id?" element={<OrderTrackingPage />} />
              <Route path="/order-history" element={<OrderHistoryPage />} />
              <Route path="/order/:id" element={<OrderDetailsPage />} />
              <Route path="/rate-order/:id" element={<RatingAndReviewPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/delivery-registration" element={<DeliveryDriverRegistrationLinks />} />
              <Route
                path="/delivery-registration/form"
                element={<DeliveryDriverRegistrationForm />}
              />
              <Route path="/delivery-orders" element={<DeliveryOrdersPage />} />
              <Route path="/delivery-status/:id" element={<DeliveryStatusUpdatePage />} />
              <Route path="/delivery-history" element={<DeliveryHistoryPage />} />
              <Route path="/driver-profile" element={<DriverProfilePage />} />
              <Route path="/restaurant-management" element={<RestaurantManagementPage />} />
              <Route path="/restaurant-registration" element={<RestaurantRegistrationPage />} />
              <Route path="/my-restaurants" element={<MyRestaurantsPage />} />
              <Route path="/restaurant-details/:id" element={<RestaurantDetailsPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  )
}

export default App
