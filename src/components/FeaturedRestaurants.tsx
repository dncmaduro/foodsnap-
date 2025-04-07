
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Restaurant data
const restaurants = [
  {
    id: 1,
    name: "Burger Heaven",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    cuisine: "American",
    rating: 4.7,
    deliveryTime: "15-25",
    minOrder: 10,
    featured: true
  },
  {
    id: 2,
    name: "Pasta Palace",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    cuisine: "Italian",
    rating: 4.5,
    deliveryTime: "20-30",
    minOrder: 15,
    featured: true
  },
  {
    id: 3,
    name: "Sushi Express",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    cuisine: "Japanese",
    rating: 4.8,
    deliveryTime: "25-35",
    minOrder: 20,
    featured: true
  },
  {
    id: 4,
    name: "Taco Fiesta",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80",
    cuisine: "Mexican",
    rating: 4.6,
    deliveryTime: "15-25",
    minOrder: 12,
    featured: true
  },
  {
    id: 5,
    name: "Curry House",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1136&q=80",
    cuisine: "Indian",
    rating: 4.4,
    deliveryTime: "30-40",
    minOrder: 18,
    featured: true
  },
  {
    id: 6,
    name: "Thai Delight",
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1158&q=80",
    cuisine: "Thai",
    rating: 4.3,
    deliveryTime: "25-35",
    minOrder: 15,
    featured: true
  }
];

const FeaturedRestaurants = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Featured Restaurants</h2>
          <p className="text-foodsnap-lightText">Discover the best restaurants in your area</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white rounded-lg overflow-hidden shadow-md hover-scale card-shadow">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-foodsnap-orange text-white font-medium">{restaurant.cuisine}</Badge>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                  <div className="flex items-center bg-foodsnap-orange/10 text-foodsnap-orange rounded-full px-2 py-1">
                    <Star size={16} className="fill-foodsnap-orange" />
                    <span className="ml-1 text-sm font-medium">{restaurant.rating}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-4">
                  <span className="flex items-center">
                    <span className="font-medium mr-1">Delivery:</span> {restaurant.deliveryTime} min
                  </span>
                  <span className="flex items-center">
                    <span className="font-medium mr-1">Min order:</span> ${restaurant.minOrder}
                  </span>
                </div>
                
                <Button className="w-full bg-white text-foodsnap-teal border border-foodsnap-teal hover:bg-foodsnap-teal hover:text-white transition-colors">
                  View Menu
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Button variant="outline" className="text-foodsnap-orange border-foodsnap-orange hover:bg-foodsnap-orange hover:text-white">
            View All Restaurants
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRestaurants;
