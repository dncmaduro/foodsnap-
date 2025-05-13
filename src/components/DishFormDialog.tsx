
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
import { Image, X, Upload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [previewImage, setPreviewImage] = useState<string | null>(initialValues?.image || null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({...errors, image: "Kích thước ảnh vượt quá 5MB"});
      return;
    }

    // Check file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setErrors({...errors, image: "Chỉ hỗ trợ định dạng JPG, PNG"});
      return;
    }

    setIsUploading(true);

    // In a real app, this would be an API call to upload the image
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewImage(result);
      setValues({ ...values, image: result });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
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
      <DialogContent className="sm:max-w-[450px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Thêm món mới' : 'Chỉnh sửa món ăn'}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="grid gap-4 py-2">
            {/* Image Preview */}
            <div className="mb-4">
              <Label htmlFor="image" className="mb-2 block">Hình ảnh</Label>
              <div className="w-full max-w-xs mx-auto">
                <AspectRatio ratio={4/3} className="bg-muted mb-2 overflow-hidden rounded-md">
                  <div className="w-full h-full relative">
                    <img
                      src={previewImage || DEFAULT_IMAGE}
                      alt="Dish preview"
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_IMAGE;
                      }}
                    />
                  </div>
                </AspectRatio>
              </div>
              <div className="flex flex-col gap-2 items-center mt-2">
                <label className="cursor-pointer w-full">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="relative w-full flex items-center justify-center"
                    disabled={isUploading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploading ? "Đang tải..." : "Tải ảnh từ máy"}
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImageUpload}
                      accept="image/jpeg,image/png"
                      disabled={isUploading}
                    />
                  </Button>
                </label>
                {previewImage && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPreviewImage(null);
                      setValues({ ...values, image: "" });
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} className="mr-1" /> Xóa ảnh
                  </Button>
                )}
              </div>
              {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
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
        </ScrollArea>
        
        <DialogFooter className="mt-6">
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
