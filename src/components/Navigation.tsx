import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Menu as MenuIcon, ShoppingCart, Info, Search, User, Menu, X, LogOut, UserPlus, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import LoginDialog from './LoginDialog';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const { user, isAuthenticated, isRestaurant, logout } = useAuth();

  const isProfilePage = location.pathname === '/profile';
  const isRestaurantManagement = location.pathname.includes('/restaurant-');

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
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

  const handleLogout = () => {
    logout();
  };

  const restaurantNavItems = [
    {
      title: "Dashboard",
      path: "/restaurant-dashboard",
      icon: LayoutDashboard
    },
    {
      title: "Menu",
      path: "/restaurant-menu",
      icon: MenuIcon
    },
    {
      title: "Orders",
      path: "/restaurant-orders",
      icon: ShoppingCart
    },
    {
      title: "Information",
      path: "/restaurant-info",
      icon: Info
    }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <a href="#" onClick={handleLogoClick} className="flex items-center">
              <span className="text-2xl font-bold text-foodsnap-orange">Food<span className="text-foodsnap-teal">Snap</span></span>
            </a>
          </div>

          {isRestaurant && isRestaurantManagement && (
            <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
              {restaurantNavItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.path}
                  className={`flex items-center space-x-2 text-gray-700 hover:text-foodsnap-orange transition-colors ${
                    location.pathname === item.path ? 'text-foodsnap-orange' : ''
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          )}

          {!isRestaurant || (!isRestaurantManagement && !isProfilePage) && (
            <>
              <div className="hidden md:flex items-center space-x-6">
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
              </div>
            </>
          )}

          <div className="hidden md:flex items-center space-x-2">
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
                <Button 
                  variant="outline" 
                  className="flex items-center space-x-1 text-foodsnap-orange border-foodsnap-orange hover:bg-foodsnap-orange hover:text-white"
                  onClick={() => navigate('/signup')}
                >
                  <UserPlus size={18} />
                  <span className="hidden lg:inline">Sign Up</span>
                </Button>
              </div>
            )}
          </div>

          <div className="flex md:hidden">
            <Button variant="ghost" onClick={toggleMenu} aria-label="Menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {!isRestaurant || (!isRestaurantManagement && !isProfilePage) ? (
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
        ) : null}

        {isMenuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-gray-200">
            <div className="flex flex-col space-y-3 pt-3">
              {isRestaurant && isRestaurantManagement && (
                <>
                  {restaurantNavItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.path}
                      className={`flex items-center space-x-2 text-gray-700 hover:text-foodsnap-orange transition-colors ${
                        location.pathname === item.path ? 'text-foodsnap-orange' : ''
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon size={20} />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </>
              )}

              {(!isRestaurant || !isRestaurantManagement) && !isProfilePage && (
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
                  <Button 
                    variant="ghost" 
                    className="text-gray-700 hover:text-foodsnap-orange transition-colors flex items-center justify-start p-0"
                    onClick={() => { navigate('/signup'); setIsMenuOpen(false); }}
                  >
                    <UserPlus size={20} className="mr-2" />
                    <span>Sign Up</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      <LoginDialog 
        isOpen={loginDialogOpen} 
        onClose={() => setLoginDialogOpen(false)} 
      />
    </nav>
  );
};

export default Navigation;
