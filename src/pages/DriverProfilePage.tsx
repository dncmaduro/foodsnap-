
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DriverProfile {
  fullName: string;
  phone: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

// Mock data for the driver profile
const DEFAULT_PROFILE: DriverProfile = {
  fullName: "Nguyễn Văn A",
  phone: "0912345678",
  bankName: "Vietcombank",
  accountNumber: "1234567890",
  accountHolder: "NGUYEN VAN A",
};

export default function DriverProfilePage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // In a real app, this would be fetched from an API
  const [profile, setProfile] = useState<DriverProfile>(() => {
    const savedProfile = localStorage.getItem("driverProfile");
    return savedProfile ? JSON.parse(savedProfile) : DEFAULT_PROFILE;
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<DriverProfile>(profile);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would make an API call to update the profile
    setProfile(formData);
    localStorage.setItem("driverProfile", JSON.stringify(formData));
    
    toast({
      title: "Cập nhật thành công",
      description: "Thông tin tài xế đã được cập nhật.",
    });
    
    setIsEditing(false);
  };
  
  return (
    <div className="container mx-auto px-2 py-4 max-w-2xl">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => navigate(-1)}
        className="mb-2 -ml-2 gap-1"
      >
        <ChevronLeft className="h-4 w-4" /> Quay lại
      </Button>
      
      <h1 className={`${isMobile ? "text-xl" : "text-2xl"} font-bold mb-4`}>Hồ sơ tài xế</h1>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className={isMobile ? "text-base" : "text-lg"}>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                name="fullName"
                value={isEditing ? formData.fullName : profile.fullName}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={!isEditing ? "bg-muted cursor-default" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại liên hệ</Label>
              <Input
                id="phone"
                name="phone"
                value={isEditing ? formData.phone : profile.phone}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={!isEditing ? "bg-muted cursor-default" : ""}
              />
            </div>
            
            <div className="pt-2 border-t">
              <h3 className={`${isMobile ? "text-sm" : "text-base"} font-medium mb-3`}>Thông tin tài khoản ngân hàng</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Tên ngân hàng</Label>
                  <Input
                    id="bankName"
                    name="bankName"
                    value={isEditing ? formData.bankName : profile.bankName}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted cursor-default" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Số tài khoản</Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    value={isEditing ? formData.accountNumber : profile.accountNumber}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted cursor-default" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accountHolder">Tên chủ tài khoản</Label>
                  <Input
                    id="accountHolder"
                    name="accountHolder"
                    value={isEditing ? formData.accountHolder : profile.accountHolder}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted cursor-default" : ""}
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-2 flex justify-end space-x-2">
              {isEditing ? (
                <>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(profile);
                    }}
                  >
                    Hủy
                  </Button>
                  <Button type="submit">Lưu thay đổi</Button>
                </>
              ) : (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Chỉnh sửa
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={() => navigate("/delivery-orders")}
        >
          Quay lại danh sách đơn hàng
        </Button>
      </div>
    </div>
  );
}
