
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Store, Truck } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import LoginDialog from '@/components/LoginDialog';
import CustomerSignUpForm from './CustomerSignUpForm';
import RestaurantSignUpForm from './RestaurantSignUpForm';
import DriverSignUpForm from './DriverSignUpForm';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    
    if (type === 'customer') {
      // Don't show the form, we'll navigate to home instead
      setShowCustomerForm(false);
      setShowRestaurantForm(false);
      setShowDriverForm(false);
    } else if (type === 'restaurant') {
      setShowRestaurantForm(true);
      setShowCustomerForm(false);
      setShowDriverForm(false);
    } else if (type === 'driver') {
      setShowDriverForm(true);
      setShowCustomerForm(false);
      setShowRestaurantForm(false);
    }
  };

  const handleCustomerSignUp = () => {
    // Navigate to home page instead of showing the form
    navigate('/');
  };

  const handleRestaurantSignUp = () => {
    // Navigate directly to the restaurant verification page
    navigate('/restaurant-verification');
  };

  const handleLoginClick = () => {
    setLoginDialogOpen(true);
  };

  const handleBackToOptions = () => {
    setShowCustomerForm(false);
    setShowRestaurantForm(false);
    setShowDriverForm(false);
    setSelectedType(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation isSignUpPage={true} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!showCustomerForm && !showRestaurantForm && !showDriverForm ? (
            <>
              <h1 className="text-3xl font-bold text-center mb-2">Join FoodSnap</h1>
              <p className="text-gray-600 text-center mb-8">Choose how you want to use FoodSnap</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Customer Option */}
                <Card className={`border-2 transition-all ${selectedType === 'customer' ? 'border-foodsnap-orange' : 'border-gray-200'}`}>
                  <CardHeader className="text-center">
                    <div className="mx-auto bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                      <User size={28} className="text-foodsnap-orange" />
                    </div>
                    <CardTitle>Customer</CardTitle>
                    <CardDescription>Order food from your favorite restaurants</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Browse and order from restaurants</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Track your orders</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Save favorite restaurants</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-foodsnap-orange hover:bg-foodsnap-orange/90" 
                      onClick={handleCustomerSignUp}
                    >
                      Sign Up as Customer
                    </Button>
                  </CardFooter>
                </Card>

                {/* Restaurant Option */}
                <Card className={`border-2 transition-all ${selectedType === 'restaurant' ? 'border-foodsnap-orange' : 'border-gray-200'}`}>
                  <CardHeader className="text-center">
                    <div className="mx-auto bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                      <Store size={28} className="text-foodsnap-orange" />
                    </div>
                    <CardTitle>Restaurant</CardTitle>
                    <CardDescription>Grow your business with online orders</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Manage your restaurant profile</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Receive and manage orders</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Analytics and insights</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-foodsnap-orange hover:bg-foodsnap-orange/90" 
                      onClick={handleRestaurantSignUp}
                    >
                      Sign Up as Restaurant
                    </Button>
                  </CardFooter>
                </Card>

                {/* Delivery Driver Option */}
                <Card className={`border-2 transition-all ${selectedType === 'driver' ? 'border-foodsnap-orange' : 'border-gray-200'}`}>
                  <CardHeader className="text-center">
                    <div className="mx-auto bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                      <Truck size={28} className="text-foodsnap-orange" />
                    </div>
                    <CardTitle>Delivery Driver</CardTitle>
                    <CardDescription>Earn money delivering food</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Flexible work hours</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Accept delivery requests</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Earn tips and bonuses</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-foodsnap-orange hover:bg-foodsnap-orange/90" 
                      onClick={() => handleTypeSelect('driver')}
                    >
                      Sign Up as Driver
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <p className="text-center mt-8 text-gray-600">
                Already have an account? <span 
                  className="text-foodsnap-orange font-medium cursor-pointer" 
                  onClick={handleLoginClick}
                >
                  Log in
                </span>
              </p>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="mb-4"
                onClick={handleBackToOptions}
              >
                ← Back to options
              </Button>
              {showCustomerForm && <CustomerSignUpForm />}
              {showRestaurantForm && <RestaurantSignUpForm />}
              {showDriverForm && <DriverSignUpForm />}
            </>
          )}
        </div>
      </main>
      
      <Footer />
      
      <LoginDialog 
        isOpen={loginDialogOpen} 
        onClose={() => setLoginDialogOpen(false)} 
      />
    </div>
  );
};

export default SignUpPage;
