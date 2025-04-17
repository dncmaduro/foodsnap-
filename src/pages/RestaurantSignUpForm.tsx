
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Phone, Store, MapPin, CreditCard, Upload, Building, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import LoginDialog from '@/components/LoginDialog';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

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

const RestaurantSignUpForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [idCardFront, setIdCardFront] = useState<File | null>(null);
  const [idCardBack, setIdCardBack] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    restaurantName: '',
    restaurantAddress: '',
    identificationNumber: '',
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    restaurantName: '',
    restaurantAddress: '',
    identificationNumber: '',
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    idCardFront: '',
    idCardBack: '',
    agreeToTerms: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    // Phone validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
      valid = false;
    } else if (!/^\+?[0-9\s-()]{8,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Enter a valid phone number';
      valid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
      valid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    // Restaurant information validation
    if (!formData.restaurantName.trim()) {
      newErrors.restaurantName = 'Restaurant name is required';
      valid = false;
    }

    if (!formData.restaurantAddress.trim()) {
      newErrors.restaurantAddress = 'Restaurant address is required';
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

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      toast({
        title: "Application submitted!",
        description: "We'll review your restaurant application and get back to you soon.",
        duration: 3000
      });
      
      console.log("Form submitted with data:", formData);
      console.log("ID Card Front:", idCardFront);
      console.log("ID Card Back:", idCardBack);
      setTimeout(() => navigate('/'), 1500);
    }
  };

  const handleLoginClick = () => {
    setLoginDialogOpen(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Register Your Restaurant</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Account Information Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone Number Input */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="pl-10"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="restaurant@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pr-10"
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pr-10"
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        </div>

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

            {/* Restaurant Address Input */}
            <div className="space-y-2">
              <Label htmlFor="restaurantAddress">Restaurant Address *</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="restaurantAddress"
                  name="restaurantAddress"
                  type="text"
                  placeholder="Full Restaurant Address"
                  className="pl-10"
                  value={formData.restaurantAddress}
                  onChange={handleChange}
                />
              </div>
              {errors.restaurantAddress && (
                <p className="text-sm text-red-500">{errors.restaurantAddress}</p>
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

        {/* Terms & Privacy */}
        <div className="space-y-2">
          <div className="flex items-start">
            <Checkbox 
              id="agreeToTerms" 
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => {
                setFormData({
                  ...formData,
                  agreeToTerms: checked === true
                });
                if (errors.agreeToTerms) {
                  setErrors({
                    ...errors,
                    agreeToTerms: ''
                  });
                }
              }}
            />
            <Label htmlFor="agreeToTerms" className="ml-2 text-sm">
              I confirm that the above information is accurate and I agree to the{" "}
              <a href="/terms" className="text-foodsnap-orange hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-foodsnap-orange hover:underline">
                Privacy Policy
              </a>
            </Label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full bg-foodsnap-orange hover:bg-foodsnap-orange/90"
        >
          Sign Up & Submit for Verification
        </Button>
      </form>

      {/* Alternative Navigation */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Already registered?{" "}
          <button 
            onClick={handleLoginClick} 
            className="text-foodsnap-orange hover:underline font-medium"
          >
            Login Here
          </button>
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <a href="/help" className="hover:text-foodsnap-orange">Help</a>
          <a href="/contact" className="hover:text-foodsnap-orange">Contact</a>
          <a href="/terms" className="hover:text-foodsnap-orange">Terms</a>
          <a href="/privacy" className="hover:text-foodsnap-orange">Privacy</a>
        </div>
      </footer>

      <LoginDialog 
        isOpen={loginDialogOpen} 
        onClose={() => setLoginDialogOpen(false)} 
      />
    </div>
  );
};

export default RestaurantSignUpForm;
