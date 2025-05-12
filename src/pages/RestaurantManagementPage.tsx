
import { Link } from "react-router-dom";
import { Store, FileText, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const RestaurantManagementPage = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất thành công");
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-white border-b border-gray-200 py-3 px-4 flex justify-end">
        <Button 
          variant="ghost" 
          onClick={handleLogout} 
          className="text-gray-700 hover:text-red-500 flex items-center"
        >
          <LogOut size={18} className="mr-2" />
          <span>Đăng xuất</span>
        </Button>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Quản lý nhà hàng của bạn</h1>
        
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-600 mb-8 text-center md:text-left">
            Bạn có thể đăng ký nhà hàng mới hoặc xem danh sách các nhà hàng đã đăng ký tại đây.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="border-2 border-dashed border-gray-200 hover:border-foodsnap-teal transition-colors">
              <CardContent className="flex flex-col items-center p-6">
                <div className="w-16 h-16 rounded-full bg-foodsnap-teal/10 flex items-center justify-center mb-4">
                  <Store className="h-8 w-8 text-foodsnap-teal" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Đăng ký nhà hàng mới</h2>
                <p className="text-gray-500 text-center mb-4">
                  Tạo hồ sơ nhà hàng mới và bắt đầu nhận đơn hàng trực tuyến
                </p>
                <Button 
                  className="w-full"
                  asChild
                >
                  <Link to="/restaurant-registration">Đăng ký ngay</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-dashed border-gray-200 hover:border-foodsnap-orange transition-colors">
              <CardContent className="flex flex-col items-center p-6">
                <div className="w-16 h-16 rounded-full bg-foodsnap-orange/10 flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-foodsnap-orange" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Nhà hàng đã đăng ký</h2>
                <p className="text-gray-500 text-center mb-4">
                  Quản lý thông tin và menu của các nhà hàng hiện có
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-foodsnap-orange text-foodsnap-orange hover:bg-foodsnap-orange hover:text-white"
                  asChild
                >
                  <Link to="/my-restaurants">Xem danh sách</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
            <p className="text-amber-800 text-sm">
              <strong>Lưu ý:</strong> Để đăng ký nhà hàng mới, bạn cần chuẩn bị giấy phép kinh doanh, 
              thông tin liên hệ và menu của nhà hàng. Chúng tôi sẽ xác minh thông tin của bạn trong 
              vòng 24-48 giờ làm việc.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RestaurantManagementPage;
