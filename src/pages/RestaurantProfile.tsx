
import { useState } from "react";
import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/Footer";
import RestaurantHeader from "@/components/RestaurantHeader";
import RestaurantMenu from "@/components/RestaurantMenu";
import RestaurantInfo from "@/components/RestaurantInfo";
import RestaurantReviews from "@/components/RestaurantReviews";
import { useRestaurantData } from "@/hooks/useRestaurantData";

const RestaurantProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("menu");
  
  const { 
    restaurant, 
    menu, 
    reviews, 
    isFavorite, 
    loading,
    toggleFavorite 
  } = useRestaurantData({ id });

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!restaurant) {
    return <div className="flex justify-center items-center min-h-screen">Restaurant not found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="flex-grow">
        <RestaurantHeader 
          restaurant={restaurant} 
          isFavorite={isFavorite} 
          onToggleFavorite={toggleFavorite} 
        />
        
        <div className="container mx-auto px-4 py-6">
          <Tabs defaultValue="menu" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full sm:w-auto mb-6 bg-white border">
              <TabsTrigger value="menu" className="flex-1 sm:flex-none">Menu</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1 sm:flex-none">Reviews</TabsTrigger>
              <TabsTrigger value="info" className="flex-1 sm:flex-none">Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="menu" className="mt-0">
              <RestaurantMenu 
                menu={menu} 
                restaurantId={id || ''} 
                restaurantName={restaurant.name} 
              />
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-0">
              <RestaurantReviews 
                reviews={reviews} 
                averageRating={restaurant.rating} 
                reviewCount={restaurant.reviewCount} 
              />
            </TabsContent>
            
            <TabsContent value="info" className="mt-0">
              <RestaurantInfo restaurant={restaurant} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RestaurantProfile;
