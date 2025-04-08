
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-foodsnap-orange">Food<span className="text-foodsnap-teal">Snap</span></span>
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
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

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-foodsnap-orange transition-colors">Home</Link>
            <Link to="/restaurants" className="text-gray-700 hover:text-foodsnap-orange transition-colors">Browse Restaurants</Link>
            <Link to="/promotions" className="text-gray-700 hover:text-foodsnap-orange transition-colors">Promotions</Link>
            
            {/* Cart */}
            <div className="relative">
              <Link to="/cart" className="text-gray-700 hover:text-foodsnap-orange transition-colors">
                <ShoppingCart size={22} />
                {cartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-foodsnap-orange text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems}
                  </span>
                )}
              </Link>
            </div>
            
            {/* Profile/Login */}
            <Button variant="ghost" className="flex items-center space-x-1 text-gray-700 hover:text-foodsnap-orange">
              <User size={22} />
              <span className="hidden lg:inline">Login</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <Button variant="ghost" onClick={toggleMenu} aria-label="Menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-gray-200">
            <div className="flex flex-col space-y-3 pt-3">
              <Link to="/" className="text-gray-700 hover:text-foodsnap-orange transition-colors">Home</Link>
              <Link to="/restaurants" className="text-gray-700 hover:text-foodsnap-orange transition-colors">Browse Restaurants</Link>
              <Link to="/promotions" className="text-gray-700 hover:text-foodsnap-orange transition-colors">Promotions</Link>
              <Link to="/cart" className="text-gray-700 hover:text-foodsnap-orange transition-colors flex items-center">
                <ShoppingCart size={20} className="mr-2" />
                <span>Cart {cartItems > 0 && `(${cartItems})`}</span>
              </Link>
              <Link to="/login" className="text-gray-700 hover:text-foodsnap-orange transition-colors flex items-center">
                <User size={20} className="mr-2" />
                <span>Login / Profile</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
