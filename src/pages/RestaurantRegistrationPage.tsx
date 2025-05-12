import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import { 
  Form,
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  restaurantName: z.string().min(1, "Vui lòng nhập tên nhà hàng"),
  restaurantAddress: z.string().min(1, "Vui lòng nhập địa chỉ nhà hàng"),
  ownerIdNumber: z.string().length(12, "Số CCCD phải có 12 chữ số").regex(/^\d+$/, "Số CCCD chỉ được chứa chữ số"),
  frontIdImage: z.instanceof(File, { message: "Vui lòng tải lên ảnh mặt trước CCCD" }).optional(),
  backIdImage: z.instanceof(File, { message: "Vui lòng tải lên ảnh mặt sau CCCD" }).optional(),
  bankAccountName: z.string().min(1, "Vui lòng nhập tên hưởng thụ tài khoản"),
  bankName: z.string().min(1, "Vui lòng nhập tên ngân hàng"),
  bankAccountNumber: z.string().min(1, "Vui lòng nhập số tài khoản"),
  termsAgreed: z.boolean().refine(val => val === true, {
    message: "Bạn phải đồng ý với điều khoản dịch vụ",
  })
});

type FormValues = z.infer<typeof formSchema>;

const RestaurantRegistrationPage = () => {
  const navigate = useNavigate();
  const [frontIdPreview, setFrontIdPreview] = useState<string | null>(null);
  const [backIdPreview, setBackIdPreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurantName: "",
      restaurantAddress: "",
      ownerIdNumber: "",
      bankAccountName: "",
      bankName: "",
      bankAccountNumber: "",
      termsAgreed: false
    }
  });

  const handleFrontIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("frontIdImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFrontIdPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("backIdImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackIdPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted with data:", data);
    // Here you would typically send the data to your backend
    toast.success("Đã gửi thông tin đăng ký nhà hàng thành công!");
    navigate("/restaurant-management");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-white border-b border-gray-200 py-3 px-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/restaurant-management")} 
          className="text-gray-700 hover:text-foodsnap-teal flex items-center"
        >
          <ArrowLeft size={18} className="mr-2" />
          <span>Quay lại quản lý nhà hàng</span>
        </Button>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Đăng ký nhà hàng mới</h1>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Restaurant Information Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold border-b pb-2">1. Thông tin nhà hàng</h2>
                  
                  <FormField
                    control={form.control}
                    name="restaurantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên nhà hàng</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên nhà hàng" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="restaurantAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ nhà hàng</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập địa chỉ đầy đủ của nhà hàng" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Owner Verification Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold border-b pb-2">2. Xác minh chủ sở hữu</h2>
                  
                  <FormField
                    control={form.control}
                    name="ownerIdNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Căn Cước Công Dân của chủ nhà hàng</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Nhập 12 số CCCD" 
                            maxLength={12} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <Label htmlFor="frontIdImage">Hình ảnh mặt trước Căn Cước Công Dân</Label>
                    <div className="flex items-center gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full h-32 border-dashed flex flex-col items-center justify-center"
                        onClick={() => document.getElementById('frontIdImage')?.click()}
                      >
                        {frontIdPreview ? (
                          <img 
                            src={frontIdPreview} 
                            alt="ID Front Preview" 
                            className="max-h-28 object-contain" 
                          />
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">Tải lên ảnh mặt trước</span>
                          </>
                        )}
                      </Button>
                      <input
                        id="frontIdImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFrontIdChange}
                      />
                    </div>
                    {form.formState.errors.frontIdImage && (
                      <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.frontIdImage.message as string}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backIdImage">Hình ảnh mặt sau Căn Cước Công Dân</Label>
                    <div className="flex items-center gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full h-32 border-dashed flex flex-col items-center justify-center"
                        onClick={() => document.getElementById('backIdImage')?.click()}
                      >
                        {backIdPreview ? (
                          <img 
                            src={backIdPreview} 
                            alt="ID Back Preview" 
                            className="max-h-28 object-contain" 
                          />
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">Tải lên ảnh mặt sau</span>
                          </>
                        )}
                      </Button>
                      <input
                        id="backIdImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleBackIdChange}
                      />
                    </div>
                    {form.formState.errors.backIdImage && (
                      <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.backIdImage.message as string}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Bank Information Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold border-b pb-2">3. Thông tin ngân hàng</h2>
                  
                  <FormField
                    control={form.control}
                    name="bankAccountName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên hưởng thụ tài khoản ngân hàng</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên chủ tài khoản" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên ngân hàng</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên ngân hàng" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bankAccountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số tài khoản</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập số tài khoản" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Terms & Verification */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold border-b pb-2">4. Điều khoản & Xác nhận</h2>
                  
                  <FormField
                    control={form.control}
                    name="termsAgreed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Tôi xác nhận rằng thông tin trên là chính xác và tôi đồng ý với{" "}
                            <a href="/terms" className="text-foodsnap-teal hover:underline">Điều khoản dịch vụ</a>
                            {" "}và{" "}
                            <a href="/privacy" className="text-foodsnap-teal hover:underline">Chính sách bảo mật</a>.
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full py-6 text-lg"
                >
                  Đăng ký
                </Button>
              </form>
            </Form>
          </div>
          
          {/* Verification message text */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">Chúng tôi sẽ xác minh thông tin của bạn trong vòng 24-48 giờ làm việc.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RestaurantRegistrationPage;
