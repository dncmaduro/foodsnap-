
import { ArrowLeft, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const DeliveryDriverRegistrationLinks = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    navigate("/");
    toast({
      title: "Đã đăng xuất",
      description: "Bạn đã đăng xuất thành công khỏi tài khoản."
    });
  };

  const handleRegistration = () => {
    navigate("/delivery-registration/form");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Navigation buttons */}
          <div className="flex justify-between mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate("/profile")}
              className="flex items-center"
            >
              <ArrowLeft size={16} className="mr-2" />
              Quay lại
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} className="mr-2" />
              Đăng xuất
            </Button>
          </div>
          
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3">Đăng ký làm tài xế giao hàng</h1>
            <p className="text-gray-600">
              Trở thành đối tác giao hàng của FoodSnap để bắt đầu kiếm thu nhập ngay hôm nay.
            </p>
          </div>
          
          {/* Call-to-Action Section */}
          <div className="text-center mb-12">
            <Button 
              onClick={handleRegistration}
              size="lg" 
              className="bg-foodsnap-teal hover:bg-foodsnap-teal/90 text-lg py-6 px-8"
            >
              Đăng ký làm tài xế giao hàng
            </Button>
          </div>
          
          {/* Benefits Section */}
          <div className="bg-gray-50 p-6 rounded-lg mb-12">
            <h2 className="text-xl font-semibold mb-4">Lợi ích khi trở thành tài xế FoodSnap</h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="bg-foodsnap-teal rounded-full text-white font-bold h-6 w-6 flex items-center justify-center mr-2 mt-1">✓</span>
                <span>Thu nhập hấp dẫn và linh hoạt</span>
              </li>
              <li className="flex items-start">
                <span className="bg-foodsnap-teal rounded-full text-white font-bold h-6 w-6 flex items-center justify-center mr-2 mt-1">✓</span>
                <span>Thời gian làm việc tự do - bạn là người làm chủ thời gian của mình</span>
              </li>
              <li className="flex items-start">
                <span className="bg-foodsnap-teal rounded-full text-white font-bold h-6 w-6 flex items-center justify-center mr-2 mt-1">✓</span>
                <span>Thanh toán nhanh chóng, minh bạch</span>
              </li>
              <li className="flex items-start">
                <span className="bg-foodsnap-teal rounded-full text-white font-bold h-6 w-6 flex items-center justify-center mr-2 mt-1">✓</span>
                <span>Hỗ trợ kỹ thuật 24/7</span>
              </li>
            </ul>
          </div>
          
          {/* Requirements Section - Updated */}
          <div className="bg-gray-50 p-6 rounded-lg mb-10">
            <h2 className="text-xl font-semibold mb-4">Yêu cầu đối với tài xế</h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Trên 18 tuổi, có bằng lái xe</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Có điện thoại thông minh để sử dụng ứng dụng</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DeliveryDriverRegistrationLinks;
