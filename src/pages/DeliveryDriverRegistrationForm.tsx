
import { useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useIsMobile } from "@/hooks/use-mobile";

const formSchema = z.object({
  fullName: z.string().min(1, "Họ tên không được để trống"),
  phoneNumber: z.string().min(1, "Số điện thoại không được để trống")
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, "Số điện thoại không hợp lệ"),
});

const DeliveryDriverRegistrationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [frontLicensePreview, setFrontLicensePreview] = useState<string | null>(null);
  const [backLicensePreview, setBackLicensePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
    },
  });

  const handleFrontLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Lỗi",
        description: "Kích thước ảnh vượt quá 5MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast({
        title: "Lỗi",
        description: "Chỉ hỗ trợ định dạng JPG, PNG",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFrontLicensePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleBackLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Lỗi",
        description: "Kích thước ảnh vượt quá 5MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast({
        title: "Lỗi",
        description: "Chỉ hỗ trợ định dạng JPG, PNG",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setBackLicensePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Validate that both license images are uploaded
    if (!frontLicensePreview || !backLicensePreview) {
      toast({
        title: "Lỗi",
        description: "Vui lòng tải lên ảnh giấy phép lái xe (cả 2 mặt)",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // In a real app, you would send this data to your backend
    console.log({
      ...values,
      frontLicense: frontLicensePreview,
      backLicense: backLicensePreview
    });

    // Save application status in localStorage for demo purposes
    // In a real app, this would be stored in a database
    localStorage.setItem("driverApplicationSubmitted", new Date().toISOString());
    
    // For demo purposes, let's simulate that 30% of applications get immediately approved
    if (Math.random() < 0.3) {
      localStorage.setItem("driverApplicationApproved", "true");
    }

    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Đăng ký thành công",
        description: "Hồ sơ của bạn sẽ được xử lý trong vòng 24 giờ."
      });
      navigate("/delivery-registration");
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center mb-6 -ml-2 text-gray-600 hover:text-gray-900"
            size="sm"
          >
            <ArrowLeft size={18} className="mr-1" />
            Quay lại
          </Button>

          {/* Page Header */}
          <div className="mb-6 space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">Đăng ký tài xế</h1>
            <p className="text-sm text-gray-600">
              Vui lòng điền thông tin để bắt đầu giao hàng.
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Họ tên <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Nguyễn Văn A" {...field} className="h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Số điện thoại <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="0901234567" {...field} className="h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* License Image Uploads */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700">
                    Giấy phép lái xe <span className="text-red-500">*</span>
                  </Label>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Front License Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="frontLicense" className="text-xs text-gray-600">
                        Mặt trước
                      </Label>
                      <div>
                        {frontLicensePreview ? (
                          <div>
                            <div className="relative aspect-[3/2] mb-2 border border-gray-200 rounded-md overflow-hidden">
                              <img
                                src={frontLicensePreview}
                                alt="Mặt trước GPLX"
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 text-xs w-full py-1 h-auto"
                              onClick={() => setFrontLicensePreview(null)}
                            >
                              Xóa ảnh
                            </Button>
                          </div>
                        ) : (
                          <label
                            htmlFor="frontLicense"
                            className="flex flex-col items-center justify-center w-full aspect-[3/2] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                          >
                            <div className="flex flex-col items-center justify-center p-2">
                              <Upload className="w-6 h-6 mb-1 text-gray-400" />
                              <p className="text-xs text-gray-500">
                                Tải lên
                              </p>
                            </div>
                            <input
                              id="frontLicense"
                              type="file"
                              className="hidden"
                              accept="image/jpeg, image/png"
                              onChange={handleFrontLicenseChange}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Back License Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="backLicense" className="text-xs text-gray-600">
                        Mặt sau
                      </Label>
                      <div>
                        {backLicensePreview ? (
                          <div>
                            <div className="relative aspect-[3/2] mb-2 border border-gray-200 rounded-md overflow-hidden">
                              <img
                                src={backLicensePreview}
                                alt="Mặt sau GPLX"
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 text-xs w-full py-1 h-auto"
                              onClick={() => setBackLicensePreview(null)}
                            >
                              Xóa ảnh
                            </Button>
                          </div>
                        ) : (
                          <label
                            htmlFor="backLicense"
                            className="flex flex-col items-center justify-center w-full aspect-[3/2] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                          >
                            <div className="flex flex-col items-center justify-center p-2">
                              <Upload className="w-6 h-6 mb-1 text-gray-400" />
                              <p className="text-xs text-gray-500">
                                Tải lên
                              </p>
                            </div>
                            <input
                              id="backLicense"
                              type="file"
                              className="hidden"
                              accept="image/jpeg, image/png"
                              onChange={handleBackLicenseChange}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG (tối đa 5MB)
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                  <Button 
                    type="submit" 
                    className="w-full bg-foodsnap-teal hover:bg-foodsnap-teal/90 py-2.5 h-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang xử lý..." : "Gửi đăng ký"}
                  </Button>
                  <p className="text-center text-gray-500 text-xs mt-3">
                    Chúng tôi sẽ xác minh thông tin của bạn trong vòng 24 giờ.
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DeliveryDriverRegistrationForm;
