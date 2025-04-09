
import { useState } from 'react';
import { Minus, Plus, Trash2, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import EditNoteDialog from '@/components/EditNoteDialog';

// Mock data for promotional codes
const PROMO_CODES = {
  'WELCOME10': { discount: 5.00, type: 'fixed' },
  'FREESHIP': { discount: 2.99, type: 'shipping' }
};

const CartPage = () => {
  const { items: cartItems, updateQuantity, updateNotes, removeFromCart, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<null | { code: string, discount: number }>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Group items by restaurant
  const itemsByRestaurant = cartItems.reduce((acc, item) => {
    const restId = item.restaurantId;
    if (!acc[restId]) {
      acc[restId] = {
        restaurantId: restId,
        restaurantName: item.restaurantName || 'Unknown Restaurant',
        items: []
      };
    }
    acc[restId].items.push(item);
    return acc;
  }, {} as Record<string, { restaurantId: string, restaurantName: string, items: typeof cartItems }>);

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Fixed delivery fee for now
  const deliveryFee = cartItems.length > 0 ? 2.99 : 0;
  
  // Calculate discount
  const discount = appliedPromo ? appliedPromo.discount : 0;
  
  // Calculate total
  const total = subtotal + deliveryFee - discount;

  // Apply promo code
  const applyPromoCode = () => {
    const code = promoCode.toUpperCase();
    if (PROMO_CODES[code as keyof typeof PROMO_CODES]) {
      const promoDetails = PROMO_CODES[code as keyof typeof PROMO_CODES];
      setAppliedPromo({ 
        code, 
        discount: promoDetails.type === 'shipping' ? deliveryFee : promoDetails.discount 
      });
      toast({
        title: "Promo code applied!",
        description: `${code} has been applied to your order.`,
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please check your code and try again.",
        variant: "destructive"
      });
    }
    setPromoCode('');
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    // In a real app, this would navigate to the checkout page
    navigate('/checkout');
  };

  // Handle removing item with confirmation toast
  const handleRemoveItem = (id: string, name: string) => {
    removeFromCart(id);
    toast({
      title: "Item removed",
      description: `${name} has been removed from your cart.`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-6 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          {cartItems.length > 0 ? (
            <div className="flex justify-between items-center mt-2">
              <p className="text-gray-600">
                {Object.keys(itemsByRestaurant).length > 1 
                  ? `Items from ${Object.keys(itemsByRestaurant).length} restaurants` 
                  : `Items from ${Object.values(itemsByRestaurant)[0]?.restaurantName || 'restaurant'}`}
              </p>
              <Button 
                variant="outline" 
                className="text-gray-500 border-gray-300"
                onClick={() => {
                  clearCart();
                  toast({
                    title: "Cart cleared",
                    description: "All items have been removed from your cart.",
                  });
                }}
              >
                Clear Cart
              </Button>
            </div>
          ) : (
            <p className="text-gray-600 mt-2">Your cart is empty</p>
          )}
        </div>
        
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="md:col-span-2">
              {Object.values(itemsByRestaurant).map((restaurant) => (
                <Card key={restaurant.restaurantId} className="mb-6">
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-4">{restaurant.restaurantName}</h3>
                    <div className="space-y-4">
                      {restaurant.items.map(item => (
                        <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 border-b border-gray-100">
                          <div className="flex-grow mb-2 sm:mb-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{item.name}</h3>
                              <EditNoteDialog
                                itemName={item.name}
                                currentNote={item.notes}
                                onSaveNote={(note) => updateNotes(item.id, note)}
                              />
                            </div>
                            {item.notes && <p className="text-sm text-gray-500 mt-1">{item.notes}</p>}
                          </div>
                          
                          <div className="flex items-center space-x-6 w-full sm:w-auto">
                            {/* Quantity Selector */}
                            <div className="flex items-center border rounded-md">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 px-2"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus size={16} />
                              </Button>
                              <span className="px-2">{item.quantity}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 px-2"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus size={16} />
                              </Button>
                            </div>
                            
                            {/* Price */}
                            <div className="w-16 text-right">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            
                            {/* Remove Button */}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-gray-400 hover:text-red-500"
                              onClick={() => handleRemoveItem(item.id, item.name)}
                            >
                              <Trash2 size={18} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Promotions Section */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-3">Promotions</h3>
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="Enter promo code" 
                      value={promoCode} 
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="max-w-xs"
                    />
                    <Button onClick={applyPromoCode} className="flex items-center">
                      <Tag size={16} className="mr-2" />
                      Apply
                    </Button>
                  </div>
                  
                  {appliedPromo && (
                    <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md flex justify-between items-center">
                      <div>
                        <span className="font-medium">{appliedPromo.code}</span>
                        <p className="text-sm">Promo code applied</p>
                      </div>
                      <span className="font-medium">-${appliedPromo.discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="mt-4 text-sm text-gray-500">
                    <p>Available promos: WELCOME10, FREESHIP</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div className="md:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    
                    {appliedPromo && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-${appliedPromo.discount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <Separator className="my-2" />
                    
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-2 py-6 text-base bg-foodsnap-orange hover:bg-foodsnap-orange/90"
                    onClick={proceedToCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Empty cart state
          <div className="text-center py-12">
            <div className="mb-6">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-foodsnap-orange hover:bg-foodsnap-orange/90"
            >
              Browse Restaurants
            </Button>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CartPage;
