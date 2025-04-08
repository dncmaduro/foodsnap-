
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RestaurantHeaderProps {
  restaurant: {
    name: string;
    cuisines: string[];
    rating: number;
    reviewCount: number;
    deliveryTime: string;
    deliveryFee: string;
    promos: string[];
    bannerImage: string;
  };
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const RestaurantHeader = ({ restaurant, isFavorite, onToggleFavorite }: RestaurantHeaderProps) => {
  return (
    <div className="relative">
      {/* Banner Image */}
      <div 
        className="h-48 md:h-64 lg:h-80 w-full bg-cover bg-center relative" 
        style={{ backgroundImage: `url(${restaurant.bannerImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      
      {/* Restaurant Info Overlay */}
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 -mt-10 md:-mt-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{restaurant.name}</h1>
              
              <div className="flex flex-wrap items-center mt-2 text-sm text-gray-600">
                <span>{restaurant.cuisines.join(", ")}</span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  {restaurant.rating} ({restaurant.reviewCount} reviews)
                </span>
              </div>
              
              <div className="flex flex-wrap items-center mt-3 text-sm">
                <div className="flex items-center mr-4 text-gray-700">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {restaurant.deliveryTime}
                </div>
                
                <div className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Delivery: {restaurant.deliveryFee}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {restaurant.promos.map((promo, index) => (
                  <Badge key={index} variant="secondary" className="bg-foodsnap-orange/10 text-foodsnap-orange border-foodsnap-orange">
                    {promo}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Button 
                variant="outline" 
                className={`flex items-center gap-2 ${isFavorite ? 'text-red-500' : 'text-gray-500'}`}
                onClick={onToggleFavorite}
              >
                <Heart className={`${isFavorite ? 'fill-red-500 text-red-500' : ''}`} size={18} />
                {isFavorite ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantHeader;
