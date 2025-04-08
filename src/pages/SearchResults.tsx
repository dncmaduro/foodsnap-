import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, Clock, DollarSign } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// Mock data for restaurants
const mockRestaurants = [
  {
    id: 1,
    name: 'Burger Palace',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500',
    rating: 4.7,
    cuisine: 'American, Burgers',
    deliveryTime: '20-30 min',
    priceRange: '$$'
  },
  {
    id: 2,
    name: 'Pizza Heaven',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500',
    rating: 4.5,
    cuisine: 'Italian, Pizza',
    deliveryTime: '25-35 min',
    priceRange: '$$'
  },
  {
    id: 3,
    name: 'Sushi World',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=500',
    rating: 4.8,
    cuisine: 'Japanese, Sushi',
    deliveryTime: '30-40 min',
    priceRange: '$$$'
  },
  {
    id: 4,
    name: 'Taco Fiesta',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=500',
    rating: 4.3,
    cuisine: 'Mexican, Tacos',
    deliveryTime: '15-25 min',
    priceRange: '$'
  },
  {
    id: 5,
    name: 'Noodle House',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=500',
    rating: 4.6,
    cuisine: 'Asian, Noodles',
    deliveryTime: '20-30 min',
    priceRange: '$$'
  },
  {
    id: 6,
    name: 'Mediterranean Delight',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=500',
    rating: 4.4,
    cuisine: 'Mediterranean',
    deliveryTime: '30-45 min',
    priceRange: '$$'
  }
];

// Mock data for dishes
const mockDishes = [
  {
    id: 1,
    name: 'Classic Cheeseburger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500',
    price: 9.99,
    restaurant: 'Burger Palace',
    description: 'Juicy beef patty with melted cheese, lettuce, tomato, and special sauce'
  },
  {
    id: 2,
    name: 'Margherita Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500',
    price: 12.99,
    restaurant: 'Pizza Heaven',
    description: 'Traditional pizza with tomato sauce, fresh mozzarella, and basil'
  },
  {
    id: 3,
    name: 'California Roll',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=500',
    price: 7.99,
    restaurant: 'Sushi World',
    description: 'Crab, avocado, and cucumber wrapped in seaweed and rice'
  },
  {
    id: 4,
    name: 'Street Taco Trio',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=500',
    price: 8.99,
    restaurant: 'Taco Fiesta',
    description: 'Three street-style tacos with your choice of protein, topped with onions and cilantro'
  }
];

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  
  const [query, setQuery] = useState(searchQuery);
  const [sortOption, setSortOption] = useState('relevance');
  const [filteredRestaurants, setFilteredRestaurants] = useState(mockRestaurants);
  const [filteredDishes, setFilteredDishes] = useState(mockDishes);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Filter results based on search query
  useEffect(() => {
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      
      const matchedRestaurants = mockRestaurants.filter(
        restaurant => 
          restaurant.name.toLowerCase().includes(lowercaseQuery) ||
          restaurant.cuisine.toLowerCase().includes(lowercaseQuery)
      );
      
      const matchedDishes = mockDishes.filter(
        dish => 
          dish.name.toLowerCase().includes(lowercaseQuery) ||
          dish.description.toLowerCase().includes(lowercaseQuery) ||
          dish.restaurant.toLowerCase().includes(lowercaseQuery)
      );
      
      setFilteredRestaurants(matchedRestaurants);
      setFilteredDishes(matchedDishes);
    } else {
      setFilteredRestaurants(mockRestaurants);
      setFilteredDishes(mockDishes);
    }
  }, [searchQuery]);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortOption(value);
    
    // Sort restaurants
    let sortedRestaurants = [...filteredRestaurants];
    let sortedDishes = [...filteredDishes];
    
    switch (value) {
      case 'rating':
        sortedRestaurants.sort((a, b) => b.rating - a.rating);
        break;
      case 'delivery':
        sortedRestaurants.sort((a, b) => {
          const timeA = parseInt(a.deliveryTime.split('-')[0]);
          const timeB = parseInt(b.deliveryTime.split('-')[0]);
          return timeA - timeB;
        });
        break;
      case 'price':
        sortedRestaurants.sort((a, b) => {
          return a.priceRange.length - b.priceRange.length;
        });
        sortedDishes.sort((a, b) => a.price - b.price);
        break;
      default:
        // Relevance - keep the order from filtering
        break;
    }
    
    setFilteredRestaurants(sortedRestaurants);
    setFilteredDishes(sortedDishes);
  };

  // Total number of pages for pagination
  const totalPages = Math.ceil(
    (filteredRestaurants.length + filteredDishes.length) / itemsPerPage
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Search Summary Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">
            Search results for '{searchQuery}'
          </h1>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search for food or restaurants"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="max-w-md"
            />
            <Button type="submit">
              <Search className="mr-2" size={18} />
              Search
            </Button>
          </form>
        </div>
        
        {/* Sort Options Bar */}
        <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">
            {filteredRestaurants.length} restaurants, {filteredDishes.length} dishes found
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <Select
              value={sortOption}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="delivery">Delivery Time</SelectItem>
                <SelectItem value="price">Price</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Results Display */}
        {filteredRestaurants.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Restaurants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.slice(0, itemsPerPage).map((restaurant) => (
                <Card key={restaurant.id} className="overflow-hidden hover-scale card-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={restaurant.image} 
                      alt={restaurant.name} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-sm font-medium text-foodsnap-orange">
                      {restaurant.priceRange}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-bold">{restaurant.name}</h3>
                      <div className="flex items-center">
                        <Star size={16} className="text-yellow-400 mr-1" fill="currentColor" />
                        <span>{restaurant.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{restaurant.cuisine}</p>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <Clock size={14} className="mr-1" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                      <Button size="sm" variant="outline" className="text-foodsnap-teal">
                        View Menu
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {filteredDishes.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Dishes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredDishes.slice(0, itemsPerPage).map((dish) => (
                <Card key={dish.id} className="overflow-hidden hover-scale card-shadow">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={dish.image} 
                      alt={dish.name} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-1">{dish.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">From {dish.restaurant}</p>
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-foodsnap-orange flex items-center">
                        <DollarSign size={14} className="mr-0.5" />
                        {dish.price.toFixed(2)}
                      </div>
                      <Button size="sm">
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* No Results Message */}
        {filteredRestaurants.length === 0 && filteredDishes.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-gray-600 mb-4">
              We couldn't find any restaurants or dishes matching '{searchQuery}'.
            </p>
            <p className="text-gray-600">
              Try adjusting your search term or browse our popular categories.
            </p>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="my-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(index + 1);
                    }}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchResults;
