
import { ArrowLeft, LogOut, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

// Define driver status types
type DriverStatus = "pending" | "approved" | "not_applied";

const DeliveryDriverRegistrationLinks = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();
  const [driverStatus, setDriverStatus] = useState<DriverStatus>("not_applied");
  const [isStartingDelivery, setIsStartingDelivery] = useState(false);

  // Simulate fetching driver status from API
  useEffect(() => {
    // In a real app, this would be an API call to get the current driver status
    // For demo purposes, we'll check localStorage for a registration timestamp
    const hasApplied = localStorage.getItem("driverApplicationSubmitted");
    
    if (hasApplied) {
      // For demo, we'll randomly set some applications as approved
      // In production, this would come from your backend
      const isApproved = localStorage.getItem("driverApplicationApproved");
      if (isApproved) {
        setDriverStatus("approved");
      } else {
        setDriverStatus("pending");
      }
    } else {
      setDriverStatus("not_applied");
    }
  }, []);

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

  const handleStartDelivery = () => {
    setIsStartingDelivery(true);
    
    // Simulate connection to delivery system
    setTimeout(() => {
      setIsStartingDelivery(false);
      toast({
        title: "Bắt đầu nhận đơn",
        description: "Bạn đã sẵn sàng nhận đơn giao hàng."
      });
      // In a real app, this would navigate to a driver dashboard or change status
    }, 1500);
  };

  // Render content based on driver status
  const renderStatusContent = () => {
    switch (driverStatus) {
      case "approved":
        return (
          <div className="text-center mb-12">
            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-700 font-medium">
                Hồ sơ của bạn đã được phê duyệt. Bạn có thể bắt đầu nhận đơn giao hàng ngay bây giờ.
              </p>
            </div>
            <Button 
              onClick={handleStartDelivery}
              size="lg" 
              className="bg-foodsnap-teal hover:bg-foodsnap-teal/90 text-lg py-6 px-8"
              disabled={isStartingDelivery}
            >
              {isStartingDelivery ? (
                "Đang kết nối..."
              ) : (
                <>
                  <Play size={20} />
                  Bắt đầu nhận đơn
                </>
              )}
            </Button>
          </div>
        );
      
      case "pending":
        return (
          <div className="text-center mb-12">
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-yellow-700 font-medium">
                Hồ sơ của bạn đang được xem xét. Chúng tôi sẽ thông báo khi có kết quả.
              </p>
            </div>
            <p className="text-gray-600">
              Thời gian xét duyệt thông thường là trong vòng 24 giờ.
            </p>
          </div>
        );
      
      case "not_applied":
      default:
        return (
          <div className="text-center mb-12">
            <Button 
              onClick={handleRegistration}
              size="lg" 
              className="bg-foodsnap-teal hover:bg-foodsnap-teal/90 text-lg py-6 px-8"
            >
              Đăng ký làm tài xế giao hàng
            </Button>
          </div>
        );
    }
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
          
          {/* Status-based content */}
          {renderStatusContent()}
          
          {/* Only show these sections if not approved yet */}
          {driverStatus !== "approved" && (
            <>
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
              
              {/* Requirements Section */}
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
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DeliveryDriverRegistrationLinks;
