
import { useState, useEffect } from "react";
import { mockMenusData } from "@/data/mockMenus";
import { useToast } from "@/hooks/use-toast";

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  category: string;
  isAvailable: boolean;
}

interface UseRestaurantMenuReturn {
  dishes: MenuItem[];
  filteredDishes: MenuItem[];
  isLoading: boolean;
  addDish: (dish: Omit<MenuItem, "id">) => void;
  updateDish: (dish: MenuItem) => void;
  deleteDish: (id: string) => void;
  toggleAvailability: (id: string, isAvailable: boolean) => void;
  searchDishes: (query: string) => void;
}

export const useRestaurantMenu = (restaurantId: string = "1"): UseRestaurantMenuReturn => {
  const [dishes, setDishes] = useState<MenuItem[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we're using mock data
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const menuData = mockMenusData[restaurantId as keyof typeof mockMenusData] || [];
      
      // Flatten the menu structure
      const allDishes: MenuItem[] = menuData.flatMap(category => 
        category.items.map(item => ({
          ...item,
          category: category.category,
          isAvailable: true // Default all items to available
        }))
      );
      
      setDishes(allDishes);
      setFilteredDishes(allDishes);
      setIsLoading(false);
    }, 500);
  }, [restaurantId]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = dishes.filter(dish => 
        dish.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDishes(filtered);
    } else {
      setFilteredDishes(dishes);
    }
  }, [dishes, searchQuery]);

  const addDish = (newDish: Omit<MenuItem, "id">) => {
    const dish: MenuItem = {
      ...newDish,
      id: `new-${Date.now()}`, // Generate a temporary ID
    };
    
    setDishes(prev => [...prev, dish]);
    toast({
      title: "Dish added",
      description: `${dish.name} has been added to your menu.`,
    });
  };

  const updateDish = (updatedDish: MenuItem) => {
    setDishes(prev => 
      prev.map(dish => (dish.id === updatedDish.id ? updatedDish : dish))
    );
    toast({
      title: "Dish updated",
      description: `${updatedDish.name} has been updated.`,
    });
  };

  const deleteDish = (id: string) => {
    const dishToDelete = dishes.find(dish => dish.id === id);
    if (!dishToDelete) return;
    
    setDishes(prev => prev.filter(dish => dish.id !== id));
    toast({
      title: "Dish deleted",
      description: `${dishToDelete.name} has been removed from your menu.`,
    });
  };

  const toggleAvailability = (id: string, isAvailable: boolean) => {
    setDishes(prev => 
      prev.map(dish => {
        if (dish.id === id) {
          return { ...dish, isAvailable };
        }
        return dish;
      })
    );
    
    const dish = dishes.find(d => d.id === id);
    if (dish) {
      toast({
        title: isAvailable ? "Dish available" : "Dish unavailable",
        description: `${dish.name} is now ${isAvailable ? "available" : "unavailable"}.`,
      });
    }
  };

  const searchDishes = (query: string) => {
    setSearchQuery(query);
  };

  return {
    dishes,
    filteredDishes,
    isLoading,
    addDish,
    updateDish,
    deleteDish,
    toggleAvailability,
    searchDishes,
  };
};
