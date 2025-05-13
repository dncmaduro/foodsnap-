
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Building, Phone, MapPin, Text, Image, Save, X, Info, ToggleLeft, ToggleRight } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Toggle } from "@/components/ui/toggle";

// Define the form schema with validation - description is now optional
const formSchema = z.object({
  name: z.string().min(2, "Tên nhà hàng phải có ít nhất 2 ký tự"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  district: z.string().min(1, "Vui lòng chọn quận/huyện"),
  address: z.string().min(5, "Địa chỉ cụ thể phải có ít nhất 5 ký tự"),
  description: z.string().optional(), // Description is now optional
});

// Mock data for initial form values
const mockRestaurantData = {
  id: "1",
  name: "Phở Hà Nội",
  phone: "0987654321",
  district: "Cầu Giấy",
  address: "123 Xuân Thủy, Cầu Giấy",
  description: "Nhà hàng chuyên phục vụ các món ăn truyền thống Hà Nội với hương vị đậm đà, thơm ngon. Không gian rộng rãi, thoáng mát phù hợp cho gia đình và nhóm bạn.",
  image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
  isOpen: true, // New field to track restaurant open/closed status
};

// List of districts in Hanoi
const districts = ["Cầu Giấy", "Đống Đa", "Ba Đình", "Thanh Xuân"];

const ProfileManagement = () => {
  const [image, setImage] = useState<string | null>(mockRestaurantData.image);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(mockRestaurantData.isOpen);

  // Initialize the form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: mockRestaurantData.name,
      phone: mockRestaurantData.phone,
      district: mockRestaurantData.district,
      address: mockRestaurantData.address,
      description: mockRestaurantData.description,
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSaving(true);
    
    try {
      // In a real app, this would be an API call to save the restaurant data
      console.log("Saving restaurant data:", values);
      console.log("Restaurant status:", isOpen ? "Open" : "Closed");
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Lưu thành công",
        description: "Thông tin nhà hàng đã được cập nhật",
      });
    } catch (error) {
      console.error("Error saving restaurant data:", error);
      toast({
        title: "Lưu không thành công",
        description: "Đã xảy ra lỗi khi lưu thông tin, vui lòng thử lại",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Lỗi tải ảnh lên",
        description: "Kích thước ảnh vượt quá 5MB, vui lòng chọn ảnh nhỏ hơn",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast({
        title: "Lỗi tải ảnh lên",
        description: "Chỉ hỗ trợ định dạng JPG, PNG",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // In a real app, this would be an API call to upload the image
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setIsUploading(false);
      
      toast({
        title: "Tải ảnh thành công",
        description: "Ảnh nhà hàng đã được cập nhật",
      });
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    form.reset({
      name: mockRestaurantData.name,
      phone: mockRestaurantData.phone,
      district: mockRestaurantData.district,
      address: mockRestaurantData.address,
      description: mockRestaurantData.description,
    });
    setImage(mockRestaurantData.image);
    setIsOpen(mockRestaurantData.isOpen);
    
    toast({
      title: "Đã hủy thay đổi",
      description: "Các thay đổi đã được hoàn tác",
    });
  };

  const toggleRestaurantStatus = () => {
    setIsOpen(!isOpen);
    
    toast({
      title: !isOpen ? "Nhà hàng đã mở cửa" : "Nhà hàng đã đóng cửa",
      description: !isOpen 
        ? "Khách hàng có thể đặt món từ nhà hàng của bạn" 
        : "Nhà hàng sẽ không nhận đơn đặt hàng mới",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">Hồ sơ nhà hàng</h2>
        <p className="text-gray-600">
          Cập nhật thông tin nhà hàng của bạn để hiển thị chính xác cho khách hàng.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              {/* Restaurant Open/Close Status Toggle */}
              <div className="mb-6 flex justify-between items-center p-3 border border-gray-200 rounded-md">
                <div>
                  <h3 className="font-medium">Trạng thái nhà hàng</h3>
                  <p className="text-sm text-gray-600">
                    {isOpen 
                      ? "Nhà hàng đang mở cửa và sẵn sàng nhận đơn" 
                      : "Nhà hàng đang đóng cửa và không nhận đơn mới"
                    }
                  </p>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={toggleRestaurantStatus}
                  className={`flex items-center gap-2 ${isOpen ? 'text-green-600' : 'text-gray-500'}`}
                >
                  {isOpen ? (
                    <>
                      <ToggleRight className="h-5 w-5" />
                      Đang mở cửa
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="h-5 w-5" />
                      Đang đóng cửa
                    </>
                  )}
                </Button>
              </div>

              {/* Restaurant Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel className="flex items-center">
                      <Building className="mr-2 h-4 w-4" />
                      Tên nhà hàng
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên nhà hàng" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      Số điện thoại liên hệ
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address - District & Specific */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        Quận/Huyện
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn quận/huyện" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ cụ thể</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập địa chỉ cụ thể" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Restaurant Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel className="flex items-center">
                      <Text className="mr-2 h-4 w-4" />
                      Mô tả nhà hàng (tùy chọn)
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Mô tả ngắn về nhà hàng: món ăn đặc trưng, không gian, điểm nổi bật..." 
                        className="min-h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Restaurant Image Upload Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Image className="mr-2 h-4 w-4" />
                  Hình ảnh nhà hàng
                </h3>
                
                {image ? (
                  <div className="w-full max-w-md mx-auto">
                    <AspectRatio ratio={16 / 9}>
                      <img 
                        src={image} 
                        alt="Restaurant" 
                        className="rounded-md object-cover w-full h-full"
                      />
                    </AspectRatio>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
                    <Image className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Chưa có hình ảnh</p>
                  </div>
                )}
                
                <div className="flex items-center justify-center">
                  <label className="cursor-pointer">
                    <Button 
                      type="button" 
                      variant="outline"
                      className="relative"
                      disabled={isUploading}
                    >
                      {isUploading ? "Đang tải..." : "Tải ảnh lên"}
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleImageUpload}
                        accept="image/jpeg,image/png"
                        disabled={isUploading}
                      />
                    </Button>
                  </label>
                </div>
                
                <p className="text-sm text-gray-500 flex items-center">
                  <Info className="mr-2 h-4 w-4" />
                  Hỗ trợ định dạng JPG, PNG. Kích thước tối đa 5MB.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={resetForm}
            >
              <X className="mr-2 h-4 w-4" />
              Hủy bỏ
            </Button>
            <Button 
              type="submit" 
              className="bg-foodsnap-teal hover:bg-foodsnap-teal/90"
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileManagement;
