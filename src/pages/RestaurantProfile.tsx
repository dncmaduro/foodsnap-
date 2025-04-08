
import { useState } from "react";
import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/Footer";
import RestaurantHeader from "@/components/RestaurantHeader";
import RestaurantMenu from "@/components/RestaurantMenu";
import RestaurantInfo from "@/components/RestaurantInfo";
import RestaurantReviews from "@/components/RestaurantReviews";

// Mock restaurant data - in a real app, this would come from an API
const mockRestaurant = {
  id: "1",
  name: "Saigon Delights",
  cuisines: ["Vietnamese", "Asian Fusion"],
  rating: 4.7,
  reviewCount: 238,
  deliveryTime: "25-35 min",
  deliveryFee: "$1.99",
  promos: ["20% Off First Order", "Free Delivery on $30+"],
  isFavorite: false,
  bannerImage: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&q=80&w=2000&h=600",
  address: "123 Food Street, Foodville, FD 12345",
  phone: "(555) 123-4567",
  email: "info@saigondelights.com",
  hours: {
    monday: "11:00 AM - 10:00 PM",
    tuesday: "11:00 AM - 10:00 PM",
    wednesday: "11:00 AM - 10:00 PM",
    thursday: "11:00 AM - 10:00 PM",
    friday: "11:00 AM - 11:00 PM",
    saturday: "10:00 AM - 11:00 PM",
    sunday: "10:00 AM - 9:00 PM",
  },
  location: {
    lat: 40.7128,
    lng: -74.0060,
  },
  about: "Saigon Delights brings the authentic flavors of Vietnam to your doorstep. Our recipes have been passed down through generations, offering you a true taste of Vietnamese cuisine.",
  social: {
    facebook: "saigondelights",
    instagram: "saigondelights",
    twitter: "saigondelights",
  },
};

// Mock menu data
const mockMenu = [
  {
    category: "Appetizers",
    items: [
      {
        id: "a1",
        name: "Spring Rolls",
        description: "Fresh vegetables and herbs wrapped in rice paper with a side of peanut sauce",
        price: 7.99,
        image: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?auto=format&fit=crop&q=80&w=200&h=150",
      },
      {
        id: "a2",
        name: "Fried Wontons",
        description: "Crispy wontons filled with seasoned ground pork and served with sweet chili sauce",
        price: 6.99,
        image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=200&h=150",
      },
    ],
  },
  {
    category: "Main Dishes",
    items: [
      {
        id: "m1",
        name: "Pho Beef Noodle Soup",
        description: "Traditional Vietnamese soup with rice noodles, beef, and herbs in a flavorful broth",
        price: 13.99,
        image: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&q=80&w=200&h=150",
      },
      {
        id: "m2",
        name: "Banh Mi Sandwich",
        description: "Vietnamese sandwich with your choice of meat, pickled vegetables, and herbs on a fresh baguette",
        price: 10.99,
        image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&q=80&w=200&h=150",
      },
      {
        id: "m3",
        name: "Lemongrass Chicken",
        description: "Grilled chicken marinated in lemongrass, served with rice and vegetables",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&q=80&w=200&h=150",
      },
    ],
  },
  {
    category: "Beverages",
    items: [
      {
        id: "b1",
        name: "Vietnamese Coffee",
        description: "Strong coffee served with condensed milk, hot or iced",
        price: 4.99,
        image: null,
      },
      {
        id: "b2",
        name: "Fresh Coconut Water",
        description: "Refreshing coconut water served in the shell",
        price: 5.99,
        image: null,
      },
    ],
  },
];

// Mock reviews data
const mockReviews = [
  {
    id: "r1",
    userName: "John D.",
    rating: 5,
    comment: "The Pho is amazing! Best Vietnamese food in the area.",
    date: "2023-11-01",
  },
  {
    id: "r2",
    userName: "Sarah M.",
    rating: 4,
    comment: "Delicious food and fast delivery. The spring rolls were a bit small though.",
    date: "2023-10-25",
  },
  {
    id: "r3",
    userName: "Mike T.",
    rating: 5,
    comment: "Absolutely love the banh mi here. Authentic flavors and great portion sizes.",
    date: "2023-10-18",
  },
];

const RestaurantProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("menu");
  const [isFavorite, setIsFavorite] = useState(mockRestaurant.isFavorite);

  // In a real app, you would fetch the restaurant data based on the ID
  const restaurant = mockRestaurant;
  const menu = mockMenu;
  const reviews = mockReviews;

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

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
              <RestaurantMenu menu={menu} />
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-0">
              <RestaurantReviews reviews={reviews} averageRating={restaurant.rating} reviewCount={restaurant.reviewCount} />
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
