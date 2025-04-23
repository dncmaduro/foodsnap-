
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2 } from "lucide-react";

interface DishCardProps {
  dish: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    isAvailable: boolean;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string, isAvailable: boolean) => void;
}

const DishCard = ({ dish, onEdit, onDelete, onToggleAvailability }: DishCardProps) => {
  const [isAvailable, setIsAvailable] = useState(dish.isAvailable);

  const handleToggleAvailability = () => {
    const newAvailability = !isAvailable;
    setIsAvailable(newAvailability);
    onToggleAvailability(dish.id, newAvailability);
  };

  return (
    <Card className="h-full overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          {dish.image ? (
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg truncate">{dish.name}</h3>
            <span className="font-medium text-green-600">${dish.price.toFixed(2)}</span>
          </div>
          
          {dish.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {dish.description}
            </p>
          )}
          
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">
                {isAvailable ? "Available" : "Unavailable"}
              </span>
              <Switch
                checked={isAvailable}
                onCheckedChange={handleToggleAvailability}
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onEdit(dish.id)}
            >
              <Edit size={16} className="mr-1" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
              onClick={() => onDelete(dish.id)}
            >
              <Trash2 size={16} className="mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DishCard;
