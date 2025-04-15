
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, MapPin, Wallet, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from "@/contexts/AuthContext";
import LoginDialog from "@/components/LoginDialog";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items: cartItems, clearCart } = useCart();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [loginDialogOpen, setLoginDialogOpen] = useState(!isAuthenticated);
  
  // State for form data
  const [deliveryAddress, setDeliveryAddress] = useState('saved');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [driverNote, setDriverNote] = useState('');
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  
  // Mock saved address
  const savedAddress = {
    name: 'John Doe',
    phone: '(123) 456-7890',
    address: '123 Main Street, Apt 4B, New York, NY 10001',
    notes: 'Doorbell not working, please call when arriving'
  };
  
  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = cartItems.length > 0 ? 2.99 : 0;
  const discount = 0; // Implement promo code logic if needed
  const total = subtotal + deliveryFee - discount;
  
  // Handle form input changes
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle place order
  const handlePlaceOrder = () => {
    // Show toast notification
    toast({
      title: "Order placed successfully!",
      description: "Your order has been received and is being processed.",
    });
    
    // Prepare order details to pass to confirmation page
    const orderDetails = {
      orderId: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      restaurantName: cartItems[0]?.restaurantName || "Restaurant",
      estimatedDelivery: "30-45 minutes",
      items: cartItems,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      total: total,
      paymentMethod: 'Cash on Delivery',
      deliveryAddress: deliveryAddress === 'saved' ? savedAddress : addressForm,
      driverNote: driverNote
    };
    
    // Clear cart
    clearCart();
    
    // Navigate to confirmation page with order details
    navigate('/order-confirmation', { state: { orderDetails } });
  };
  
  // If user is not authenticated, redirect to login dialog
  const handleLoginSuccess = () => {
    // Continue with checkout after successful login
    setLoginDialogOpen(false);
  };
  
  // If cart is empty, redirect to cart page
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="mb-6">You cannot proceed to checkout without any items in your cart.</p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-foodsnap-orange hover:bg-foodsnap-orange/90"
            >
              Browse Restaurants
            </Button>
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-gray-500">Cart</span>
            <span className="mx-2 text-gray-400">›</span>
            <span className="font-medium text-foodsnap-orange">Checkout</span>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-500">Confirmation</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Delivery and Payment Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Delivery Information Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-foodsnap-orange" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={deliveryAddress} 
                  onValueChange={setDeliveryAddress}
                  className="space-y-4"
                >
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="saved" id="saved-address" />
                    <div className="grid gap-1">
                      <Label htmlFor="saved-address" className="font-medium">
                        Use saved address
                      </Label>
                      {deliveryAddress === "saved" && (
                        <div className="mt-2 text-sm bg-gray-50 p-3 rounded-md">
                          <p className="font-medium">{savedAddress.name}</p>
                          <p>{savedAddress.phone}</p>
                          <p className="mt-1">{savedAddress.address}</p>
                          {savedAddress.notes && (
                            <p className="mt-1 text-gray-500">
                              <span className="font-medium">Notes:</span> {savedAddress.notes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="new" id="new-address" />
                    <div className="grid gap-1 w-full">
                      <Label htmlFor="new-address" className="font-medium">
                        Add new address
                      </Label>
                      {deliveryAddress === "new" && (
                        <div className="mt-2 grid gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                              id="name" 
                              name="name" 
                              value={addressForm.name} 
                              onChange={handleAddressChange} 
                              placeholder="Enter your full name"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input 
                              id="phone" 
                              name="phone" 
                              value={addressForm.phone} 
                              onChange={handleAddressChange} 
                              placeholder="Enter your phone number"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea 
                              id="address" 
                              name="address" 
                              value={addressForm.address} 
                              onChange={handleAddressChange} 
                              placeholder="Enter your full address"
                              rows={2}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                            <Textarea 
                              id="notes" 
                              name="notes" 
                              value={addressForm.notes} 
                              onChange={handleAddressChange} 
                              placeholder="Add any special instructions for delivery"
                              rows={2}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            
            {/* Delivery Note Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-foodsnap-orange" />
                  Note for Driver
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Label htmlFor="driverNote">Add instructions for the delivery driver</Label>
                  <Textarea 
                    id="driverNote" 
                    placeholder="E.g., 'Please knock on the door instead of ringing the bell.' or 'The gate code is 1234.'"
                    value={driverNote}
                    onChange={(e) => setDriverNote(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Payment Method Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="mr-2 h-5 w-5 text-foodsnap-orange" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" checked readOnly />
                  <Label htmlFor="cash" className="flex items-center">
                    Cash on Delivery
                  </Label>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  You will pay with cash upon delivery of your order.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Items List */}
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-start">
                        <span className="font-medium">{item.quantity}×</span>
                        <span className="ml-2">{item.name}</span>
                      </div>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                {/* Totals */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Place Order Button */}
                <Button 
                  className="w-full mt-4 py-6 text-base bg-foodsnap-orange hover:bg-foodsnap-orange/90 flex items-center justify-center"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                  <Check className="ml-2 h-5 w-5" />
                </Button>
                
                <p className="mt-4 text-sm text-gray-500 text-center">
                  By placing your order, you agree to our 
                  <a href="#" className="text-foodsnap-teal mx-1 hover:underline">Terms of Service</a>
                  and
                  <a href="#" className="text-foodsnap-teal ml-1 hover:underline">Privacy Policy</a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Login Dialog */}
      <LoginDialog 
        isOpen={loginDialogOpen} 
        onClose={() => navigate('/cart')} 
        onSuccess={handleLoginSuccess} 
      />
    </div>
  );
};

export default CheckoutPage;
