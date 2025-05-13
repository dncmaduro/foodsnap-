
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Image, X } from "lucide-react";

interface DishFormValues {
  id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available?: boolean;
}

interface DishFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: DishFormValues) => void;
  initialValues?: DishFormValues;
  mode: 'add' | 'edit';
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop";

const DishFormDialog = ({ 
  open, 
  onOpenChange, 
  onSave, 
  initialValues,
  mode 
}: DishFormDialogProps) => {
  const [values, setValues] = useState<DishFormValues>(
    initialValues || {
      name: "",
      description: "",
      price: 0,
      image: DEFAULT_IMAGE,
      available: true
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setValues({ ...values, [name]: parseFloat(value) || 0 });
    } else {
      setValues({ ...values, [name]: value });
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!values.name.trim()) {
      newErrors.name = "Tên món ăn không được để trống";
    }
    
    if (values.price <= 0) {
      newErrors.price = "Giá phải lớn hơn 0";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Convert price string to number and ensure it's not NaN
      const formattedValues = {
        ...values,
        price: parseFloat(values.price.toString()) || 0
      };
      
      onSave(formattedValues);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Thêm món mới' : 'Chỉnh sửa món ăn'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Image Preview */}
          <div className="mb-4">
            <Label htmlFor="image" className="mb-2 block">Hình ảnh</Label>
            <div className="w-full">
              <AspectRatio ratio={4/3} className="bg-muted mb-2 overflow-hidden rounded-md">
                <div className="w-full h-full relative">
                  <img
                    src={values.image || DEFAULT_IMAGE}
                    alt="Dish preview"
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_IMAGE;
                    }}
                  />
                </div>
              </AspectRatio>
            </div>
            <div className="flex gap-2 items-center mt-2">
              <Input
                id="image"
                name="image"
                type="url"
                placeholder="URL hình ảnh"
                value={values.image}
                onChange={handleChange}
                className="flex-1"
              />
              {values.image && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setValues({ ...values, image: "" })}
                >
                  <X size={18} />
                </Button>
              )}
            </div>
          </div>
          
          {/* Name */}
          <div>
            <Label htmlFor="name" className="mb-2 block">Tên món ăn <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Nhập tên món ăn"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          {/* Description */}
          <div>
            <Label htmlFor="description" className="mb-2 block">Mô tả</Label>
            <Input
              id="description"
              name="description"
              value={values.description}
              onChange={handleChange}
              placeholder="Mô tả ngắn về món ăn"
            />
          </div>
          
          {/* Price */}
          <div>
            <Label htmlFor="price" className="mb-2 block">Giá tiền (VND) <span className="text-red-500">*</span></Label>
            <div className="flex items-center">
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="1000"
                value={values.price}
                onChange={handleChange}
                placeholder="0"
              />
              <span className="ml-2">VND</span>
            </div>
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>
            {mode === 'add' ? 'Thêm món' : 'Lưu thay đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DishFormDialog;
