
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, MapPin, Plus, Trash2, Save, User, LogOut } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Constants for the district options
const DISTRICTS = ["Cầu Giấy", "Đống Đa", "Ba Đình", "Thanh Xuân"];

// Mock data for saved addresses
const initialAddresses = [
  { id: '1', district: 'Cầu Giấy', specificAddress: 'Số 123, ngõ 45, đường Trung Kính' },
  { id: '2', district: 'Đống Đa', specificAddress: 'Số 67, ngõ 8, đường Tôn Đức Thắng' },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, logout } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addresses, setAddresses] = useState(initialAddresses);
  const [newAddress, setNewAddress] = useState({ district: '', specificAddress: '' });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }
    
    // Initialize form with user data
    if (user) {
      setName(user.name);
      setPhoneNumber(user.phone);
    }
  }, [user, isAuthenticated, navigate]);

  const handleSaveProfile = () => {
    // In a real app, you would save changes to the backend here
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
    setIsEditing(false);
  };

  const handleAddAddress = () => {
    if (newAddress.district.trim() === '' || newAddress.specificAddress.trim() === '') {
      toast({
        title: "Invalid Address",
        description: "Please select a district and enter a specific address.",
        variant: "destructive",
      });
      return;
    }
    
    const newId = Date.now().toString();
    setAddresses([...addresses, { id: newId, ...newAddress }]);
    setNewAddress({ district: '', specificAddress: '' });
    setIsAddingAddress(false);
    
    toast({
      title: "Address Added",
      description: "Your new address has been added successfully.",
    });
  };

  const handleEditAddress = (id: string) => {
    const addressToEdit = addresses.find(addr => addr.id === id);
    if (addressToEdit) {
      setNewAddress({ 
        district: addressToEdit.district, 
        specificAddress: addressToEdit.specificAddress 
      });
      setEditingAddressId(id);
      setIsAddingAddress(true);
    }
  };

  const handleUpdateAddress = () => {
    if (editingAddressId) {
      setAddresses(addresses.map(addr => 
        addr.id === editingAddressId 
          ? { ...addr, district: newAddress.district, specificAddress: newAddress.specificAddress } 
          : addr
      ));
      setNewAddress({ district: '', specificAddress: '' });
      setIsAddingAddress(false);
      setEditingAddressId(null);
      
      toast({
        title: "Address Updated",
        description: "Your address has been updated successfully.",
      });
    }
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
    
    toast({
      title: "Address Removed",
      description: "Your address has been removed.",
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  if (!isAuthenticated) {
    return null; // Redirect handled in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>
          
          {/* Restaurant Verification Link for Restaurant Users */}
          {user?.type === 'restaurant' && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Restaurant Management</h3>
                    <p className="text-sm text-gray-600">View and manage your restaurant verification status</p>
                  </div>
                  <Button 
                    onClick={() => navigate('/restaurant-verification')}
                    className="bg-foodsnap-orange hover:bg-foodsnap-orange/90"
                  >
                    View Restaurants
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* User Information Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="" alt={name} />
                    <AvatarFallback className="text-lg">
                      <User size={40} />
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="text-xs">
                    Upload Photo
                  </Button>
                </div>
                
                <div className="flex-1 space-y-4 w-full">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <Input 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="max-w-md"
                      />
                    ) : (
                      <p className="text-gray-900">{name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <Input 
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Your phone number"
                        className="max-w-md"
                      />
                    ) : (
                      <p className="text-gray-900">{phoneNumber}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              {isEditing ? (
                <Button onClick={handleSaveProfile} className="flex items-center">
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)} className="flex items-center">
                  <Edit2 size={16} className="mr-2" />
                  Edit Profile
                </Button>
              )}
            </CardFooter>
          </Card>
          
          {/* Saved Addresses Section */}
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Saved Addresses</CardTitle>
              {!isAddingAddress && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIsAddingAddress(true);
                    setEditingAddressId(null);
                    setNewAddress({ district: '', specificAddress: '' });
                  }}
                  className="flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  Add New Address
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isAddingAddress ? (
                <div className="space-y-4 border rounded-md p-4">
                  <h3 className="font-medium">
                    {editingAddressId ? "Edit Address" : "Add New Address"}
                  </h3>
                  
                  {/* City (Fixed) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <Input 
                      value="Hà Nội" 
                      readOnly
                      className="max-w-md mb-2 bg-gray-100"
                    />
                  </div>
                  
                  {/* District Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      District
                    </label>
                    <Select
                      value={newAddress.district}
                      onValueChange={(value) => setNewAddress({...newAddress, district: value})}
                    >
                      <SelectTrigger className="max-w-md mb-2">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {DISTRICTS.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Specific Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specific Address
                    </label>
                    <Input 
                      value={newAddress.specificAddress} 
                      onChange={(e) => setNewAddress({...newAddress, specificAddress: e.target.value})}
                      placeholder="Nhập địa chỉ cụ thể"
                      className="max-w-md mb-4"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    {editingAddressId ? (
                      <Button onClick={handleUpdateAddress}>
                        Update Address
                      </Button>
                    ) : (
                      <Button onClick={handleAddAddress}>
                        Save Address
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsAddingAddress(false);
                        setEditingAddressId(null);
                        setNewAddress({ district: '', specificAddress: '' });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {addresses.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      No saved addresses. Add your first address.
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {addresses.map((address) => (
                        <li 
                          key={address.id} 
                          className="flex items-start justify-between border-b pb-3 last:border-0"
                        >
                          <div className="flex items-start">
                            <MapPin className="text-gray-400 mt-1 mr-2 flex-shrink-0" size={18} />
                            <div>
                              <p className="text-sm text-gray-600">Hà Nội</p>
                              <p className="font-medium">{address.district}</p>
                              <p className="text-sm text-gray-600">{address.specificAddress}</p>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditAddress(address.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit2 size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteAddress(address.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </CardContent>
          </Card>
          
          {/* Logout Button */}
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center text-red-500 hover:text-white hover:bg-red-500 border-red-200 hover:border-red-500"
          >
            <LogOut size={16} className="mr-2" />
            Log Out
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
