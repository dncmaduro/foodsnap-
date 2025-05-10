
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Clock, LogOut, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import LoginDialog from './LoginDialog';

interface NavigationProps {
  isSignUpPage?: boolean;
}

const Navigation = ({ isSignUpPage = false }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const { user, isAuthenticated, isRestaurant, logout } = useAuth();

  const isProfilePage = location.pathname === '/profile';

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSignUpPage) {
      // Do nothing if on signup page
      return;
    }
    
    if (isRestaurant) {
      navigate('/profile');
    } else {
      navigate('/');
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLoginClick = () => {
    setLoginDialogOpen(true);
  };

  const handleSignUpClick = () => {
    navigate('/signup/customer');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" onClick={handleLogoClick} className={`flex items-center ${isSignUpPage ? 'pointer-events-none' : ''}`}>
              <span className="text-2xl font-bold text-foodsnap-orange">Food<span className="text-foodsnap-teal">Snap</span></span>
            </a>
          </div>

          {/* Search Bar - Hide on profile page for restaurant users or on signup page */}
          {(!isRestaurant || !isProfilePage) && !isSignUpPage && (
            <div className="hidden md:flex items-center justify-center flex-1 max-w-md mx-4">
              <form onSubmit={handleSearch} className="relative w-full">
                <Input 
                  type="text" 
                  placeholder="Search for restaurants or dishes" 
                  className="pr-10 border-gray-300 focus:border-foodsnap-teal"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-foodsnap-orange">
                  <Search size={18} />
                </button>
              </form>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Show different links based on user type and page */}
            {!isProfilePage && !isRestaurant && !isSignUpPage && (
              <>
                <Link to="/" className="text-gray-700 hover:text-foodsnap-orange transition-colors">Home</Link>
                <Link to="/restaurants" className="text-gray-700 hover:text-foodsnap-orange transition-colors">Browse Restaurants</Link>
                <Link to="/order-history" className="text-gray-700 hover:text-foodsnap-orange transition-colors flex items-center">
                  <Clock size={18} className="mr-1" />
                  Order History
                </Link>
                <div className="relative">
                  <Link to="/cart" className="text-gray-700 hover:text-foodsnap-orange transition-colors">
                    <ShoppingCart size={22} />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-foodsnap-orange text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                </div>
              </>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-foodsnap-orange"
                  onClick={() => navigate('/profile')}
                >
                  <User size={22} />
                  <span className="hidden lg:inline">{user?.name}</span>
                  {isRestaurant && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded ml-1">Restaurant</span>
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout} 
                  className="text-gray-700 hover:text-red-500"
                >
                  <LogOut size={20} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-foodsnap-orange"
                  onClick={handleLoginClick}
                >
                  <User size={22} />
                  <span className="hidden lg:inline">Login</span>
                </Button>
                {!isSignUpPage && (
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-1 text-foodsnap-orange border-foodsnap-orange hover:bg-foodsnap-orange hover:text-white"
                    onClick={handleSignUpClick}
                  >
                    <UserPlus size={18} />
                    <span className="hidden lg:inline">Sign Up</span>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <Button variant="ghost" onClick={toggleMenu} aria-label="Menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Search - Hide on profile page for restaurant users or on signup page */}
        {(!isRestaurant || !isProfilePage) && !isSignUpPage && (
          <div className="mt-3 flex md:hidden">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input 
                type="text" 
                placeholder="Search for food or restaurants" 
                className="pr-10 border-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-foodsnap-orange">
                <Search size={18} />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-gray-200">
            <div className="flex flex-col space-y-3 pt-3">
              {!isProfilePage && !isRestaurant && !isSignUpPage && (
                <>
                  <Link to="/" className="text-gray-700 hover:text-foodsnap-orange transition-colors">Home</Link>
                  <Link to="/restaurants" className="text-gray-700 hover:text-foodsnap-orange transition-colors">Browse Restaurants</Link>
                  <Link to="/order-history" className="text-gray-700 hover:text-foodsnap-orange transition-colors flex items-center">
                    <Clock size={20} className="mr-2" />
                    <span>Order History</span>
                  </Link>
                  <Link to="/cart" className="text-gray-700 hover:text-foodsnap-orange transition-colors flex items-center">
                    <ShoppingCart size={20} className="mr-2" />
                    <span>Cart {totalItems > 0 && `(${totalItems})`}</span>
                  </Link>
                </>
              )}
              
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="text-gray-700 hover:text-foodsnap-orange transition-colors flex items-center">
                    <User size={20} className="mr-2" />
                    <span>{user?.name}</span>
                    {isRestaurant && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded ml-1">Restaurant</span>
                    )}
                  </Link>
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout} 
                    className="text-gray-700 hover:text-red-500 flex items-center justify-start p-0"
                  >
                    <LogOut size={20} className="mr-2" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    className="text-gray-700 hover:text-foodsnap-orange transition-colors flex items-center justify-start p-0"
                    onClick={handleLoginClick}
                  >
                    <User size={20} className="mr-2" />
                    <span>Login</span>
                  </Button>
                  {!isSignUpPage && (
                    <Button 
                      variant="ghost" 
                      className="text-gray-700 hover:text-foodsnap-orange transition-colors flex items-center justify-start p-0"
                      onClick={() => { navigate('/signup/customer'); setIsMenuOpen(false); }}
                    >
                      <UserPlus size={20} className="mr-2" />
                      <span>Sign Up</span>
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      <LoginDialog 
        isOpen={loginDialogOpen} 
        onClose={() => setLoginDialogOpen(false)} 
        onSuccess={() => navigate('/signup')}
      />
    </nav>
  );
};

export default Navigation;
