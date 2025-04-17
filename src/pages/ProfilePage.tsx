
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

// Mock data for saved addresses
const initialAddresses = [
  { id: '1', label: 'Home', address: '123 Main St, Anytown, USA, 12345' },
  { id: '2', label: 'Work', address: '456 Office Blvd, Business City, USA, 67890' },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, logout } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addresses, setAddresses] = useState(initialAddresses);
  const [newAddress, setNewAddress] = useState({ label: '', address: '' });
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
    if (newAddress.label.trim() === '' || newAddress.address.trim() === '') {
      toast({
        title: "Invalid Address",
        description: "Please enter both label and address.",
        variant: "destructive",
      });
      return;
    }
    
    const newId = Date.now().toString();
    setAddresses([...addresses, { id: newId, ...newAddress }]);
    setNewAddress({ label: '', address: '' });
    setIsAddingAddress(false);
    
    toast({
      title: "Address Added",
      description: "Your new address has been added successfully.",
    });
  };

  const handleEditAddress = (id: string) => {
    const addressToEdit = addresses.find(addr => addr.id === id);
    if (addressToEdit) {
      setNewAddress({ label: addressToEdit.label, address: addressToEdit.address });
      setEditingAddressId(id);
      setIsAddingAddress(true);
    }
  };

  const handleUpdateAddress = () => {
    if (editingAddressId) {
      setAddresses(addresses.map(addr => 
        addr.id === editingAddressId 
          ? { ...addr, label: newAddress.label, address: newAddress.address } 
          : addr
      ));
      setNewAddress({ label: '', address: '' });
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
                    setNewAddress({ label: '', address: '' });
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Label
                    </label>
                    <Input 
                      value={newAddress.label} 
                      onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                      placeholder="Home, Work, etc."
                      className="max-w-md mb-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Address
                    </label>
                    <Input 
                      value={newAddress.address} 
                      onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                      placeholder="Street, City, State, Zip"
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
                        setNewAddress({ label: '', address: '' });
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
                              <p className="font-medium">{address.label}</p>
                              <p className="text-sm text-gray-600">{address.address}</p>
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
