
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, MapPin, CreditCard, Upload, Building, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FileUploadProps {
  label: string;
  onChange: (file: File | null) => void;
  accept?: string;
}

// Custom file upload component
const FileUpload = ({ label, onChange, accept = "image/*" }: FileUploadProps) => {
  const [fileName, setFileName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFileName(files[0].name);
      onChange(files[0]);
    } else {
      setFileName("");
      onChange(null);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div 
        className="border border-dashed border-gray-300 rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={handleClick}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-6 w-6 text-gray-400" />
          <p className="text-sm text-gray-500">
            {fileName || "Click to upload or drag and drop"}
          </p>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={accept}
          />
        </div>
      </div>
    </div>
  );
};

const RestaurantDetailsForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [idCardFront, setIdCardFront] = useState<File | null>(null);
  const [idCardBack, setIdCardBack] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    restaurantName: '',
    restaurantDistrict: '',
    restaurantSpecificAddress: '',
    identificationNumber: '',
    accountHolderName: '',
    bankName: '',
    accountNumber: ''
  });

  const [errors, setErrors] = useState({
    restaurantName: '',
    restaurantDistrict: '',
    restaurantSpecificAddress: '',
    identificationNumber: '',
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    idCardFront: '',
    idCardBack: ''
  });

  // Load account info from previous step
  useEffect(() => {
    const savedData = localStorage.getItem('restaurantSignUpData');
    if (!savedData) {
      // If no data exists, redirect back to the first form
      toast({
        title: "Error",
        description: "Please complete the first step of registration",
        variant: "destructive"
      });
      navigate('/signup');
    }
  }, [navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    // Restaurant information validation
    if (!formData.restaurantName.trim()) {
      newErrors.restaurantName = 'Restaurant name is required';
      valid = false;
    }

    if (!formData.restaurantDistrict) {
      newErrors.restaurantDistrict = 'Please select a district';
      valid = false;
    }

    if (!formData.restaurantSpecificAddress.trim()) {
      newErrors.restaurantSpecificAddress = 'Specific address is required';
      valid = false;
    }

    // ID card validation
    if (!formData.identificationNumber.trim()) {
      newErrors.identificationNumber = 'ID number is required';
      valid = false;
    } else if (!/^\d{12}$/.test(formData.identificationNumber)) {
      newErrors.identificationNumber = 'ID number must be 12 digits';
      valid = false;
    }

    // ID card image validation
    if (!idCardFront) {
      newErrors.idCardFront = 'Front side of ID card is required';
      valid = false;
    }

    if (!idCardBack) {
      newErrors.idCardBack = 'Back side of ID card is required';
      valid = false;
    }

    // Bank information validation
    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account holder name is required';
      valid = false;
    }

    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
      valid = false;
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Get account data from previous step
      const accountData = JSON.parse(localStorage.getItem('restaurantSignUpData') || '{}');
      
      // Combine data from both forms
      const completeFormData = {
        ...accountData,
        ...formData,
        // We don't store the files in localStorage, but in a real app 
        // you would upload them to a server
        idCardFrontUploaded: !!idCardFront,
        idCardBackUploaded: !!idCardBack
      };
      
      console.log("Complete form submitted with data:", completeFormData);
      
      toast({
        title: "Application submitted!",
        description: "We'll review your restaurant application and get back to you soon.",
        duration: 3000
      });
      
      // Clear the localStorage data since submission is complete
      localStorage.removeItem('restaurantSignUpData');
      
      // Redirect to homepage
      setTimeout(() => navigate('/'), 1500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Complete Your Restaurant Registration</h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Restaurant Information Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Restaurant Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Restaurant Name Input */}
                <div className="space-y-2">
                  <Label htmlFor="restaurantName">Restaurant Name *</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Store className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="restaurantName"
                      name="restaurantName"
                      type="text"
                      placeholder="Your Restaurant Name"
                      className="pl-10"
                      value={formData.restaurantName}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.restaurantName && (
                    <p className="text-sm text-red-500">{errors.restaurantName}</p>
                  )}
                </div>

                {/* Restaurant City (Fixed) */}
                <div className="space-y-2">
                  <Label htmlFor="restaurantCity">City</Label>
                  <Input
                    id="restaurantCity"
                    name="restaurantCity"
                    type="text"
                    value="Hà Nội"
                    className="bg-gray-100"
                    readOnly
                  />
                </div>
                
                {/* Restaurant District Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="restaurantDistrict">District *</Label>
                  <Select 
                    value={formData.restaurantDistrict} 
                    onValueChange={(value) => handleSelectChange(value, 'restaurantDistrict')}
                  >
                    <SelectTrigger id="restaurantDistrict" className="w-full">
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cầu Giấy">Cầu Giấy</SelectItem>
                      <SelectItem value="Đống Đa">Đống Đa</SelectItem>
                      <SelectItem value="Ba Đình">Ba Đình</SelectItem>
                      <SelectItem value="Thanh Xuân">Thanh Xuân</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.restaurantDistrict && (
                    <p className="text-sm text-red-500">{errors.restaurantDistrict}</p>
                  )}
                </div>

                {/* Restaurant Specific Address */}
                <div className="space-y-2">
                  <Label htmlFor="restaurantSpecificAddress">Specific Address *</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="restaurantSpecificAddress"
                      name="restaurantSpecificAddress"
                      type="text"
                      placeholder="Nhập địa chỉ cụ thể"
                      className="pl-10"
                      value={formData.restaurantSpecificAddress}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.restaurantSpecificAddress && (
                    <p className="text-sm text-red-500">{errors.restaurantSpecificAddress}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Owner Verification Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Owner Verification</h3>
              <div className="grid grid-cols-1 gap-6">
                {/* Citizen ID Card Number */}
                <div className="space-y-2">
                  <Label htmlFor="identificationNumber">Citizen Identification Card Number (12 digits) *</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="identificationNumber"
                      name="identificationNumber"
                      type="text"
                      placeholder="123456789012"
                      className="pl-10"
                      value={formData.identificationNumber}
                      onChange={handleChange}
                      maxLength={12}
                    />
                  </div>
                  {errors.identificationNumber && (
                    <p className="text-sm text-red-500">{errors.identificationNumber}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Upload Front ID Card */}
                  <div>
                    <FileUpload 
                      label="Upload Front Side of ID Card *"
                      onChange={setIdCardFront}
                      accept="image/*"
                    />
                    {errors.idCardFront && (
                      <p className="text-sm text-red-500 mt-1">{errors.idCardFront}</p>
                    )}
                  </div>

                  {/* Upload Back ID Card */}
                  <div>
                    <FileUpload 
                      label="Upload Back Side of ID Card *"
                      onChange={setIdCardBack}
                      accept="image/*"
                    />
                    {errors.idCardBack && (
                      <p className="text-sm text-red-500 mt-1">{errors.idCardBack}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Information Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Bank Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Holder Name */}
                <div className="space-y-2">
                  <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="accountHolderName"
                      name="accountHolderName"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10"
                      value={formData.accountHolderName}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.accountHolderName && (
                    <p className="text-sm text-red-500">{errors.accountHolderName}</p>
                  )}
                </div>

                {/* Bank Name */}
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Building className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="bankName"
                      name="bankName"
                      type="text"
                      placeholder="Bank of America"
                      className="pl-10"
                      value={formData.bankName}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.bankName && (
                    <p className="text-sm text-red-500">{errors.bankName}</p>
                  )}
                </div>

                {/* Account Number */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="accountNumber">Bank Account Number *</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="accountNumber"
                      name="accountNumber"
                      type="text"
                      placeholder="1234567890"
                      className="pl-10"
                      value={formData.accountNumber}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.accountNumber && (
                    <p className="text-sm text-red-500">{errors.accountNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-foodsnap-orange hover:bg-foodsnap-orange/90"
            >
              Sign Up & Submit for Verification
            </Button>

            {/* Back Button */}
            <Button 
              type="button" 
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate('/signup')}
            >
              Back to Account Information
            </Button>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RestaurantDetailsForm;
