
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Image, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DishFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dish: DishFormData) => void;
  initialData?: DishFormData;
}

export interface DishFormData {
  id?: string;
  name: string;
  description: string;
  price: string;
  image: string;
  isAvailable: boolean;
}

const initialFormData: DishFormData = {
  name: "",
  description: "",
  price: "",
  image: "",
  isAvailable: true,
};

const DishFormDialog = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}: DishFormDialogProps) => {
  const [formData, setFormData] = useState<DishFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isAvailable: checked }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {initialData?.id ? "Edit Dish" : "Add New Dish"}
            </DialogTitle>
            <DialogDescription>
              Fill out the form below to {initialData?.id ? "update" : "add"} a dish to your menu.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Dish Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">
                Price ($) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                name="price"
                type="text"
                value={formData.price}
                onChange={handleChange}
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isAvailable"
                checked={formData.isAvailable}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isAvailable">Available</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Dish</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DishFormDialog;
