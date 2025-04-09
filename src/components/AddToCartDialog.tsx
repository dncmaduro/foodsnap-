
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus } from 'lucide-react';
import { useCart, CartItem } from '@/contexts/CartContext';
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image: string | null;
}

interface AddToCartDialogProps {
  item: MenuItem;
  restaurantId: string;
  restaurantName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddToCartDialog = ({ item, restaurantId, restaurantName, open, onOpenChange }: AddToCartDialogProps) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const { addToCart, getCartRestaurantId, clearCart } = useCart();
  const { toast } = useToast();
  const [showClearCartConfirmation, setShowClearCartConfirmation] = useState(false);

  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    const cartRestaurantId = getCartRestaurantId();
    
    // Check if adding from a different restaurant
    if (cartRestaurantId && cartRestaurantId !== restaurantId) {
      // Show confirmation dialog instead of error
      setShowClearCartConfirmation(true);
      return;
    }
    
    addItemToCart();
  };

  const addItemToCart = () => {
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity,
      notes,
      restaurantId,
      restaurantName
    };
    
    const success = addToCart(cartItem);
    
    if (success) {
      toast({
        title: "Added to cart!",
        description: `${quantity} × ${item.name} added to your cart.`,
      });
      
      // Reset and close
      resetAndClose();
    }
  };

  const handleClearCartAndAdd = () => {
    clearCart();
    addItemToCart();
    setShowClearCartConfirmation(false);
  };

  const handleCancelClearCart = () => {
    setShowClearCartConfirmation(false);
  };

  const resetAndClose = () => {
    // Reset state when dialog is closed
    setQuantity(1);
    setNotes('');
    onOpenChange(false);
  };

  const handleClose = () => {
    resetAndClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{item.name}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {item.description && (
              <p className="text-sm text-gray-600 mb-4">{item.description}</p>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <div className="flex items-center border rounded-md w-fit">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-9 px-3"
                  onClick={() => handleQuantityChange(-1)}
                >
                  <Minus size={16} />
                </Button>
                <span className="px-4">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-9 px-3"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Special instructions
              </label>
              <Textarea
                id="notes"
                placeholder="E.g., No onions, extra spicy, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex justify-between items-center font-medium">
              <span>Total</span>
              <span className="text-foodsnap-orange">${(item.price * quantity).toFixed(2)}</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              onClick={handleAddToCart}
              className="w-full bg-foodsnap-orange hover:bg-foodsnap-orange/90"
            >
              Add to cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear cart confirmation dialog */}
      <AlertDialog open={showClearCartConfirmation} onOpenChange={setShowClearCartConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Your cart has items from another restaurant</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to clear your current cart and add this item instead?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelClearCart}>Keep current cart</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClearCartAndAdd}
              className="bg-foodsnap-orange hover:bg-foodsnap-orange/90"
            >
              Clear cart & add new item
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AddToCartDialog;
