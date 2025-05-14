import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PenLine, Plus, Trash2, Check, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

type Address = {
  id: string;
  label: string;
  district: string;
  address: string;
  isDefault: boolean;
};

// Available districts
const DISTRICTS = ["Cầu Giấy", "Đống Đa", "Ba Đình", "Thanh Xuân"];

const ProfilePage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [currentRole, setCurrentRole] = useState("user");
  const [driverStatus, setDriverStatus] = useState<"not_applied" | "pending" | "approved">("not_applied");
  
  // Check driver registration status when the component mounts or when role changes
  useEffect(() => {
    if (currentRole === "driver") {
      const hasApplied = localStorage.getItem("driverApplicationSubmitted");
      
      if (hasApplied) {
        const isApproved = localStorage.getItem("driverApplicationApproved");
        if (isApproved) {
          setDriverStatus("approved");
        } else {
          setDriverStatus("pending");
        }
      } else {
        setDriverStatus("not_applied");
      }
    }
  }, [currentRole]);
  
  // Updated mock addresses to include district
  const [addresses, setAddresses] = useState<Address[]>([
    { id: "1", label: "Home", district: "Cầu Giấy", address: "123 Main St, Anytown", isDefault: true },
    { id: "2", label: "Work", district: "Đống Đa", address: "456 Office Ave, Business City", isDefault: false },
  ]);
  
  const [newAddressLabel, setNewAddressLabel] = useState("");
  const [newAddressDistrict, setNewAddressDistrict] = useState("");
  const [newAddress, setNewAddress] = useState("");
  
  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleSaveChanges = () => {
    // In a real app, this would update the user profile in your backend
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully."
    });
    setIsEditing(false);
  };

  const handleAddAddress = () => {
    if (newAddressLabel.trim() !== "" && newAddressDistrict.trim() !== "" && newAddress.trim() !== "") {
      const newAddressObj: Address = {
        id: Date.now().toString(),
        label: newAddressLabel,
        district: newAddressDistrict,
        address: newAddress,
        isDefault: addresses.length === 0
      };
      
      setAddresses([...addresses, newAddressObj]);
      setNewAddressLabel("");
      setNewAddressDistrict("");
      setNewAddress("");
      
      toast({
        title: "Address Added",
        description: "Your new address has been added successfully."
      });
    }
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(address => address.id !== id));
    toast({
      title: "Address Deleted",
      description: "Address has been removed from your profile."
    });
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(addresses.map(address => ({
      ...address,
      isDefault: address.id === id
    })));
    
    toast({
      title: "Default Address Updated",
      description: "Your default address has been updated."
    });
  };

  const handleRoleChange = (role: string) => {
    setCurrentRole(role);
    
    if (role === "driver") {
      // Navigate to delivery registration page when switching to driver role
      navigate('/delivery-registration');
    } else {
      toast({
        title: "Role Changed",
        description: `You are now viewing as a ${role === "restaurant" ? "Restaurant Owner" : "Customer"}`
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        {/* User Information Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Personal Information</span>
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center"
                >
                  <PenLine size={16} className="mr-2" />
                  Edit
                </Button>
              ) : (
                <Button 
                  onClick={handleSaveChanges}
                  className="flex items-center"
                >
                  <Check size={16} className="mr-2" />
                  Save Changes
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="mt-1"
                  />
                ) : (
                  <div className="text-lg mt-1">{name || "Not set"}</div>
                )}
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                {isEditing ? (
                  <Input 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="mt-1"
                  />
                ) : (
                  <div className="text-lg mt-1">{phone || "Not set"}</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Saved Addresses Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Saved Addresses</span>
              <Sheet>
                <SheetTrigger asChild>
                  <Button className="flex items-center">
                    <Plus size={16} className="mr-2" />
                    Add New Address
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Add New Address</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-4 mt-6">
                    <div>
                      <Label htmlFor="addressLabel">Address Label</Label>
                      <Input
                        id="addressLabel"
                        placeholder="Home, Work, etc."
                        value={newAddressLabel}
                        onChange={(e) => setNewAddressLabel(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="addressDistrict">Quận</Label>
                      <Select
                        value={newAddressDistrict}
                        onValueChange={setNewAddressDistrict}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Chọn quận" />
                        </SelectTrigger>
                        <SelectContent>
                          {DISTRICTS.map(district => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="address">Địa chỉ đầy đủ</Label>
                      <Input
                        id="address"
                        placeholder="số nhà, tên đường"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <Button 
                      onClick={handleAddAddress} 
                      className="w-full mt-4"
                      disabled={!newAddressLabel.trim() || !newAddressDistrict || !newAddress.trim()}
                    >
                      Save Address
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {addresses.length > 0 ? (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div 
                    key={address.id} 
                    className={`p-4 border rounded-md ${address.isDefault ? 'border-foodsnap-teal bg-teal-50' : 'border-gray-200'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium flex items-center">
                          {address.label}
                          {address.isDefault && (
                            <span className="ml-2 text-xs bg-foodsnap-teal text-white px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-gray-600 mt-1">
                          <div>{address.district}</div>
                          <div>{address.address}</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {!address.isDefault && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleSetDefaultAddress(address.id)}
                          >
                            Set as Default
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No addresses saved yet
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Role Switcher Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Account Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="role">Current Role: {currentRole === "user" ? "Customer" : currentRole === "restaurant" ? "Restaurant Owner" : "Delivery Driver"}</Label>
                <Select value={currentRole} onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select your account role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Customer</SelectItem>
                    <SelectItem value="restaurant">Restaurant Owner</SelectItem>
                    <SelectItem value="driver">Delivery Driver</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {currentRole === "restaurant" && (
                <div className="mt-4">
                  <Button 
                    onClick={() => navigate('/restaurant-management')} 
                    className="w-full"
                  >
                    Quản lý nhà hàng
                  </Button>
                </div>
              )}
              
              {currentRole !== "user" && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-amber-700 mt-2">
                  <p>Note: Switching to {currentRole === "restaurant" ? "Restaurant Owner" : "Delivery Driver"} mode is a preview. Additional verification may be required.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Logout Button */}
        <Button 
          onClick={handleLogout}
          variant="destructive" 
          className="w-full mb-8"
        >
          Logout
        </Button>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
