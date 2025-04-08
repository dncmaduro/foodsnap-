
import { useState, useEffect } from "react";
import { mockRestaurant, mockRestaurantsData } from "@/data/mockRestaurants";
import { mockMenusData, defaultMenu } from "@/data/mockMenus";
import { mockReviewsData, defaultReviews } from "@/data/mockReviews";

interface UseRestaurantDataProps {
  id: string | undefined;
}

interface Restaurant {
  id: string;
  name: string;
  cuisines: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: string;
  promos: string[];
  isFavorite: boolean;
  bannerImage: string;
  address: string;
  phone: string;
  email: string;
  hours: {
    [key: string]: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  about: string;
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
}

interface MenuCategory {
  category: string;
  items: MenuItem[];
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface RestaurantData {
  restaurant: Restaurant | null;
  menu: MenuCategory[];
  reviews: Review[];
  isFavorite: boolean;
  loading: boolean;
  toggleFavorite: () => void;
}

export const useRestaurantData = ({ id }: UseRestaurantDataProps): RestaurantData => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we're using our mock data
    if (id) {
      // Simulate API delay
      setLoading(true);
      
      setTimeout(() => {
        // Get restaurant data
        const restaurantData = mockRestaurantsData[id as keyof typeof mockRestaurantsData] || mockRestaurant;
        setRestaurant(restaurantData);
        setIsFavorite(restaurantData.isFavorite);
        
        // Get menu data
        const menuData = mockMenusData[id as keyof typeof mockMenusData] || defaultMenu;
        setMenu(menuData);
        
        // Get reviews data
        const reviewsData = mockReviewsData[id as keyof typeof mockReviewsData] || defaultReviews;
        setReviews(reviewsData);
        
        setLoading(false);
      }, 300); // Simulate network delay
    }
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return {
    restaurant,
    menu,
    reviews,
    isFavorite,
    loading,
    toggleFavorite
  };
};
