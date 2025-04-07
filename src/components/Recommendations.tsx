
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Recommendation data
const recommendedRestaurants = [
  {
    id: 101,
    name: "Green Garden",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    cuisine: "Vegetarian",
    rating: 4.6,
    distance: "0.8 mi"
  },
  {
    id: 102,
    name: "Fresh Catch",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    cuisine: "Seafood",
    rating: 4.7,
    distance: "1.2 mi"
  },
  {
    id: 103,
    name: "Pho Express",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    cuisine: "Vietnamese",
    rating: 4.5,
    distance: "1.5 mi"
  },
  {
    id: 104,
    name: "Sweet Treats",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    cuisine: "Dessert",
    rating: 4.8,
    distance: "0.7 mi"
  }
];

const recommendedDishes = [
  {
    id: 201,
    name: "Chicken Caesar Salad",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    restaurant: "Green Garden",
    price: 11.99
  },
  {
    id: 202,
    name: "Seafood Paella",
    image: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    restaurant: "Fresh Catch",
    price: 16.99
  },
  {
    id: 203,
    name: "Beef Pho",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    restaurant: "Pho Express",
    price: 12.99
  },
  {
    id: 204,
    name: "Chocolate Lava Cake",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    restaurant: "Sweet Treats",
    price: 7.99
  }
];

const Recommendations = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Recommendations For You</h2>
          <p className="text-foodsnap-lightText">Based on your previous orders</p>
        </div>
        
        <Tabs defaultValue="restaurants" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
            <TabsTrigger value="dishes">Dishes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="restaurants" className="mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="bg-white rounded-lg overflow-hidden shadow-md hover-scale card-shadow">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={restaurant.image} 
                      alt={restaurant.name} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold truncate">{restaurant.name}</h3>
                      <div className="flex items-center bg-gray-100 rounded-full px-1.5 py-0.5">
                        <span className="text-xs font-medium text-gray-700">★ {restaurant.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600 mb-3">
                      <span>{restaurant.cuisine}</span>
                      <span>{restaurant.distance}</span>
                    </div>
                    
                    <Button className="w-full text-foodsnap-teal border border-foodsnap-teal bg-white hover:bg-foodsnap-teal hover:text-white">
                      Order Again
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="dishes" className="mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedDishes.map((dish) => (
                <div key={dish.id} className="bg-white rounded-lg overflow-hidden shadow-md hover-scale card-shadow">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={dish.image} 
                      alt={dish.name} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 truncate">{dish.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{dish.restaurant}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foodsnap-darkText">${dish.price.toFixed(2)}</span>
                      <Button size="sm" className="bg-foodsnap-orange hover:bg-foodsnap-orange/90 text-white">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Recommendations;
