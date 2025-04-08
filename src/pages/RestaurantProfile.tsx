
import { useState, useEffect } from "react";
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

// Mock restaurants data corresponding to the ones in the search results
const mockRestaurantsData = {
  "1": {
    id: "1",
    name: "Burger Palace",
    cuisines: ["American", "Burgers"],
    rating: 4.7,
    reviewCount: 156,
    deliveryTime: "20-30 min",
    deliveryFee: "$1.49",
    promos: ["15% Off First Order", "Free Delivery on $25+"],
    isFavorite: false,
    bannerImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2000&h=600",
    address: "456 Burger Ave, Foodville, FD 12345",
    phone: "(555) 456-7890",
    email: "info@burgerpalace.com",
    hours: {
      monday: "10:00 AM - 10:00 PM",
      tuesday: "10:00 AM - 10:00 PM",
      wednesday: "10:00 AM - 10:00 PM",
      thursday: "10:00 AM - 10:00 PM",
      friday: "10:00 AM - 11:00 PM",
      saturday: "10:00 AM - 11:00 PM",
      sunday: "11:00 AM - 9:00 PM",
    },
    location: {
      lat: 40.7129,
      lng: -74.0061,
    },
    about: "Burger Palace serves the juiciest burgers in town, using locally sourced ingredients and fresh-baked buns daily.",
    social: {
      facebook: "burgerpalace",
      instagram: "burgerpalace",
      twitter: "burgerpalace",
    },
  },
  "2": {
    id: "2",
    name: "Pizza Heaven",
    cuisines: ["Italian", "Pizza"],
    rating: 4.5,
    reviewCount: 203,
    deliveryTime: "25-35 min",
    deliveryFee: "$1.99",
    promos: ["Free Garlic Bread on Orders Over $30"],
    isFavorite: false,
    bannerImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2000&h=600",
    address: "789 Pizza Lane, Foodville, FD 12345",
    phone: "(555) 789-0123",
    email: "info@pizzaheaven.com",
    hours: {
      monday: "11:00 AM - 10:00 PM",
      tuesday: "11:00 AM - 10:00 PM",
      wednesday: "11:00 AM - 10:00 PM",
      thursday: "11:00 AM - 10:00 PM",
      friday: "11:00 AM - 11:00 PM",
      saturday: "11:00 AM - 11:00 PM",
      sunday: "12:00 PM - 9:00 PM",
    },
    location: {
      lat: 40.7127,
      lng: -74.0059,
    },
    about: "Pizza Heaven crafts authentic Italian pizzas using traditional recipes and imported ingredients.",
    social: {
      facebook: "pizzaheaven",
      instagram: "pizzaheaven",
      twitter: "pizzaheaven",
    },
  },
  "3": {
    id: "3",
    name: "Sushi World",
    cuisines: ["Japanese", "Sushi"],
    rating: 4.8,
    reviewCount: 178,
    deliveryTime: "30-40 min",
    deliveryFee: "$2.99",
    promos: ["20% Off First Order", "Free Miso Soup with Orders Over $40"],
    isFavorite: false,
    bannerImage: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2000&h=600",
    address: "123 Sushi St, Foodville, FD 12345",
    phone: "(555) 123-4567",
    email: "info@sushiworld.com",
    hours: {
      monday: "11:30 AM - 10:00 PM",
      tuesday: "11:30 AM - 10:00 PM",
      wednesday: "11:30 AM - 10:00 PM",
      thursday: "11:30 AM - 10:00 PM",
      friday: "11:30 AM - 11:00 PM",
      saturday: "12:00 PM - 11:00 PM",
      sunday: "12:00 PM - 9:00 PM",
    },
    location: {
      lat: 40.7126,
      lng: -74.0058,
    },
    about: "Sushi World brings the finest Japanese cuisine to your table with fresh fish delivered daily and master sushi chefs.",
    social: {
      facebook: "sushiworld",
      instagram: "sushiworld",
      twitter: "sushiworld",
    },
  },
  "4": {
    id: "4",
    name: "Taco Fiesta",
    cuisines: ["Mexican", "Tacos"],
    rating: 4.3,
    reviewCount: 142,
    deliveryTime: "15-25 min",
    deliveryFee: "$0.99",
    promos: ["Free Guacamole on Orders Over $20"],
    isFavorite: false,
    bannerImage: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=2000&h=600",
    address: "456 Taco Blvd, Foodville, FD 12345",
    phone: "(555) 456-7890",
    email: "info@tacofiesta.com",
    hours: {
      monday: "10:00 AM - 9:00 PM",
      tuesday: "10:00 AM - 9:00 PM",
      wednesday: "10:00 AM - 9:00 PM",
      thursday: "10:00 AM - 9:00 PM",
      friday: "10:00 AM - 10:00 PM",
      saturday: "10:00 AM - 10:00 PM",
      sunday: "11:00 AM - 8:00 PM",
    },
    location: {
      lat: 40.7125,
      lng: -74.0057,
    },
    about: "Taco Fiesta serves authentic Mexican street food with recipes passed down through generations.",
    social: {
      facebook: "tacofiesta",
      instagram: "tacofiesta",
      twitter: "tacofiesta",
    },
  },
  "5": {
    id: "5",
    name: "Noodle House",
    cuisines: ["Asian", "Noodles"],
    rating: 4.6,
    reviewCount: 167,
    deliveryTime: "20-30 min",
    deliveryFee: "$1.49",
    promos: ["10% Off Orders Over $25"],
    isFavorite: false,
    bannerImage: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=2000&h=600",
    address: "789 Noodle Ln, Foodville, FD 12345",
    phone: "(555) 789-0123",
    email: "info@noodlehouse.com",
    hours: {
      monday: "11:00 AM - 9:30 PM",
      tuesday: "11:00 AM - 9:30 PM",
      wednesday: "11:00 AM - 9:30 PM",
      thursday: "11:00 AM - 9:30 PM",
      friday: "11:00 AM - 10:30 PM",
      saturday: "11:00 AM - 10:30 PM",
      sunday: "12:00 PM - 9:00 PM",
    },
    location: {
      lat: 40.7124,
      lng: -74.0056,
    },
    about: "Noodle House specializes in a variety of Asian noodle dishes, from ramen to pho to pad thai.",
    social: {
      facebook: "noodlehouse",
      instagram: "noodlehouse",
      twitter: "noodlehouse",
    },
  },
  "6": {
    id: "6",
    name: "Mediterranean Delight",
    cuisines: ["Mediterranean"],
    rating: 4.4,
    reviewCount: 132,
    deliveryTime: "30-45 min",
    deliveryFee: "$1.99",
    promos: ["Free Baklava on Orders Over $35"],
    isFavorite: false,
    bannerImage: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2000&h=600",
    address: "123 Mediterranean Ave, Foodville, FD 12345",
    phone: "(555) 123-4567",
    email: "info@meddelight.com",
    hours: {
      monday: "11:00 AM - 9:00 PM",
      tuesday: "11:00 AM - 9:00 PM",
      wednesday: "11:00 AM - 9:00 PM",
      thursday: "11:00 AM - 9:00 PM",
      friday: "11:00 AM - 10:00 PM",
      saturday: "11:00 AM - 10:00 PM",
      sunday: "12:00 PM - 8:00 PM",
    },
    location: {
      lat: 40.7123,
      lng: -74.0055,
    },
    about: "Mediterranean Delight offers authentic Mediterranean cuisine featuring fresh ingredients and traditional recipes.",
    social: {
      facebook: "meddelight",
      instagram: "meddelight",
      twitter: "meddelight",
    },
  }
};

// Mock menu data mapped by restaurant ID
const mockMenusData = {
  "1": [
    {
      category: "Burgers",
      items: [
        {
          id: "b1",
          name: "Classic Cheeseburger",
          description: "Juicy beef patty with melted cheese, lettuce, tomato, and special sauce",
          price: 9.99,
          image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&h=150",
        },
        {
          id: "b2",
          name: "Bacon Deluxe",
          description: "Beef patty topped with crispy bacon, cheddar cheese, caramelized onions, and BBQ sauce",
          price: 12.99,
          image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=200&h=150",
        },
      ],
    },
    {
      category: "Sides",
      items: [
        {
          id: "s1",
          name: "French Fries",
          description: "Crispy golden fries seasoned with sea salt",
          price: 4.99,
          image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=200&h=150",
        },
        {
          id: "s2",
          name: "Onion Rings",
          description: "Thick-cut onion rings in a crunchy batter",
          price: 5.99,
          image: "https://images.unsplash.com/photo-1639744090228-29e9e18de154?q=80&w=200&h=150",
        },
      ],
    },
  ],
  "2": [
    {
      category: "Pizzas",
      items: [
        {
          id: "p1",
          name: "Margherita Pizza",
          description: "Traditional pizza with tomato sauce, fresh mozzarella, and basil",
          price: 12.99,
          image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200&h=150",
        },
        {
          id: "p2",
          name: "Pepperoni Feast",
          description: "Classic pepperoni pizza with extra cheese",
          price: 14.99,
          image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=200&h=150",
        },
      ],
    },
    {
      category: "Pastas",
      items: [
        {
          id: "pa1",
          name: "Spaghetti Bolognese",
          description: "Spaghetti with rich meat sauce and parmesan",
          price: 13.99,
          image: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?q=80&w=200&h=150",
        },
      ],
    },
  ],
  "3": [
    {
      category: "Sushi Rolls",
      items: [
        {
          id: "sr1",
          name: "California Roll",
          description: "Crab, avocado, and cucumber wrapped in seaweed and rice",
          price: 7.99,
          image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=200&h=150",
        },
        {
          id: "sr2",
          name: "Spicy Tuna Roll",
          description: "Fresh tuna with spicy mayo and cucumber",
          price: 9.99,
          image: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=200&h=150",
        },
      ],
    },
    {
      category: "Sashimi",
      items: [
        {
          id: "sa1",
          name: "Salmon Sashimi",
          description: "Five pieces of fresh salmon sashimi",
          price: 12.99,
          image: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?q=80&w=200&h=150",
        },
      ],
    },
  ],
  "4": [
    {
      category: "Tacos",
      items: [
        {
          id: "t1",
          name: "Street Taco Trio",
          description: "Three street-style tacos with your choice of protein, topped with onions and cilantro",
          price: 8.99,
          image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=200&h=150",
        },
        {
          id: "t2",
          name: "Fish Tacos",
          description: "Crispy fish tacos with slaw and lime crema",
          price: 10.99,
          image: "https://images.unsplash.com/photo-1512838243191-e81e8f66f1fd?q=80&w=200&h=150",
        },
      ],
    },
    {
      category: "Burritos",
      items: [
        {
          id: "b1",
          name: "Carne Asada Burrito",
          description: "Grilled steak with rice, beans, cheese, and pico de gallo",
          price: 12.99,
          image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=200&h=150",
        },
      ],
    },
  ],
  "5": [
    {
      category: "Noodle Soups",
      items: [
        {
          id: "ns1",
          name: "Beef Pho",
          description: "Vietnamese rice noodle soup with beef and herbs",
          price: 11.99,
          image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=200&h=150",
        },
        {
          id: "ns2",
          name: "Spicy Ramen",
          description: "Japanese ramen with pork, egg, and vegetables in spicy broth",
          price: 13.99,
          image: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?q=80&w=200&h=150",
        },
      ],
    },
    {
      category: "Stir Fry",
      items: [
        {
          id: "sf1",
          name: "Pad Thai",
          description: "Thai stir-fried noodles with tofu, shrimp, peanuts, and bean sprouts",
          price: 12.99,
          image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=200&h=150",
        },
      ],
    },
  ],
  "6": [
    {
      category: "Appetizers",
      items: [
        {
          id: "a1",
          name: "Hummus & Pita",
          description: "Creamy hummus served with warm pita bread",
          price: 6.99,
          image: "https://images.unsplash.com/photo-1644672766644-6d8a16b41f9f?q=80&w=200&h=150",
        },
        {
          id: "a2",
          name: "Falafel Plate",
          description: "Crispy falafel balls served with tahini sauce",
          price: 7.99,
          image: "https://images.unsplash.com/photo-1593001872095-7d5b3868dd20?q=80&w=200&h=150",
        },
      ],
    },
    {
      category: "Main Dishes",
      items: [
        {
          id: "md1",
          name: "Shawarma Wrap",
          description: "Marinated chicken or beef in a warm pita with vegetables and sauce",
          price: 11.99,
          image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=200&h=150",
        },
      ],
    },
  ],
};

// Mock reviews data mapped by restaurant ID
const mockReviewsData = {
  "1": [
    {
      id: "r1",
      userName: "John D.",
      rating: 5,
      comment: "Best burgers in town! Quick delivery too.",
      date: "2023-11-05",
    },
    {
      id: "r2",
      userName: "Sarah M.",
      rating: 4,
      comment: "Really good food, but the fries were a bit cold.",
      date: "2023-10-28",
    },
  ],
  "2": [
    {
      id: "r1",
      userName: "Mike P.",
      rating: 5,
      comment: "Authentic Italian pizza, just like in Naples!",
      date: "2023-11-02",
    },
    {
      id: "r2",
      userName: "Lisa T.",
      rating: 4,
      comment: "Great pizza, but a bit pricey compared to others.",
      date: "2023-10-20",
    },
  ],
  "3": [
    {
      id: "r1",
      userName: "David K.",
      rating: 5,
      comment: "The freshest sushi I've had from delivery! Amazing quality.",
      date: "2023-11-01",
    },
    {
      id: "r2",
      userName: "Emily R.",
      rating: 5,
      comment: "Excellent sushi, beautifully presented even for delivery.",
      date: "2023-10-25",
    },
  ],
  "4": [
    {
      id: "r1",
      userName: "Carlos M.",
      rating: 4,
      comment: "Authentic Mexican flavors, reminds me of home.",
      date: "2023-10-30",
    },
    {
      id: "r2",
      userName: "Hannah B.",
      rating: 3,
      comment: "Tacos were good but arrived a bit messy.",
      date: "2023-10-22",
    },
  ],
  "5": [
    {
      id: "r1",
      userName: "Jason L.",
      rating: 5,
      comment: "The ramen was perfect - rich broth and tender noodles!",
      date: "2023-11-03",
    },
    {
      id: "r2",
      userName: "Sophia W.",
      rating: 4,
      comment: "Really flavorful dishes, generous portions too.",
      date: "2023-10-27",
    },
  ],
  "6": [
    {
      id: "r1",
      userName: "Alex T.",
      rating: 4,
      comment: "Delicious Mediterranean food with authentic flavors.",
      date: "2023-10-31",
    },
    {
      id: "r2",
      userName: "Nina K.",
      rating: 5,
      comment: "The shawarma wrap was amazing! Will definitely order again.",
      date: "2023-10-24",
    },
  ],
};

const RestaurantProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("menu");
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menu, setMenu] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we're using our mock data
    if (id) {
      // Get restaurant data
      const restaurantData = mockRestaurantsData[id as keyof typeof mockRestaurantsData] || mockRestaurant;
      setRestaurant(restaurantData);
      setIsFavorite(restaurantData.isFavorite);
      
      // Get menu data
      const menuData = mockMenusData[id as keyof typeof mockMenusData] || mockMenu;
      setMenu(menuData);
      
      // Get reviews data
      const reviewsData = mockReviewsData[id as keyof typeof mockReviewsData] || mockReviews;
      setReviews(reviewsData);
      
      setLoading(false);
    }
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
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
