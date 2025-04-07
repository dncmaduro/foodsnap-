
import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Dish data
const dishes = [
  {
    id: 1,
    name: "Classic Cheeseburger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    price: 9.99,
    restaurant: "Burger Heaven",
    category: "American"
  },
  {
    id: 2,
    name: "Margherita Pizza",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    price: 12.99,
    restaurant: "Pizza Place",
    category: "Italian"
  },
  {
    id: 3,
    name: "Spicy Tuna Roll",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    price: 15.99,
    restaurant: "Sushi Express",
    category: "Japanese"
  },
  {
    id: 4,
    name: "Chicken Pad Thai",
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    price: 13.99,
    restaurant: "Thai Delight",
    category: "Thai"
  },
  {
    id: 5,
    name: "Beef Tacos",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    price: 10.99,
    restaurant: "Taco Fiesta",
    category: "Mexican"
  },
  {
    id: 6,
    name: "Butter Chicken",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356c36?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    price: 14.99,
    restaurant: "Curry House",
    category: "Indian"
  },
  {
    id: 7,
    name: "Fettuccine Alfredo",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    price: 13.99,
    restaurant: "Pasta Palace",
    category: "Italian"
  },
  {
    id: 8,
    name: "BBQ Ribs",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    price: 17.99,
    restaurant: "Grill Master",
    category: "American"
  }
];

const PopularDishes = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { current } = carouselRef;
      const scrollAmount = direction === 'left' 
        ? current.scrollLeft - current.offsetWidth / 1.5
        : current.scrollLeft + current.offsetWidth / 1.5;
      
      current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Popular Dishes</h2>
            <p className="text-foodsnap-lightText">Explore our most ordered items</p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full border-gray-300"
              onClick={() => scroll('left')}
            >
              <ChevronLeft size={20} />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full border-gray-300"
              onClick={() => scroll('right')}
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
        
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto gap-4 pb-6 scrollbar-none snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {dishes.map((dish) => (
            <div 
              key={dish.id} 
              className="flex-none w-[280px] bg-white rounded-lg overflow-hidden shadow-md hover-scale card-shadow snap-start"
            >
              <div className="h-40 overflow-hidden">
                <img 
                  src={dish.image} 
                  alt={dish.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-lg mb-1 truncate">{dish.name}</h3>
                <p className="text-foodsnap-lightText text-sm mb-3">{dish.restaurant} • {dish.category}</p>
                
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foodsnap-darkText">${dish.price.toFixed(2)}</span>
                  <Button variant="ghost" className="text-foodsnap-teal hover:text-white hover:bg-foodsnap-teal p-2 h-auto">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDishes;
