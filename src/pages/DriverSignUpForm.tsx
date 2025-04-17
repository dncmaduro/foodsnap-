
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Upload, Check, Phone, Mail, Lock, IdCard, FileImage } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import LoginDialog from '@/components/LoginDialog';

const phoneRegex = /^\d{10,}$/;

const formSchema = z.object({
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(phoneRegex, "Please enter a valid phone number"),
  email: z.string()
    .email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  idCardNumber: z.string()
    .length(12, "ID Card Number must be exactly 12 digits")
    .regex(/^\d{12}$/, "ID Card Number must contain only digits"),
  drivingLicenseFront: z.instanceof(FileList)
    .refine((files) => files.length > 0, "Please upload the front side of your driving license"),
  drivingLicenseBack: z.instanceof(FileList)
    .refine((files) => files.length > 0, "Please upload the back side of your driving license"),
  vehicleRegFront: z.instanceof(FileList)
    .refine((files) => files.length > 0, "Please upload the front side of your vehicle registration"),
  vehicleRegBack: z.instanceof(FileList)
    .refine((files) => files.length > 0, "Please upload the back side of your vehicle registration"),
  termsAgreed: z.boolean()
    .refine((value) => value === true, "You must agree to the terms and conditions")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const DriverSignUpForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      idCardNumber: "",
      termsAgreed: false,
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    toast({
      title: "Application submitted",
      description: "Your driver application has been submitted for verification. We'll contact you soon.",
      duration: 5000,
    });
    
    // In a real app, you would send this data to your backend
    // For now, we'll just redirect to the home page after a short delay
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleLoginClick = () => {
    setLoginDialogOpen(true);
  };

  return (
    <div className="container px-4 py-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Become a Delivery Driver</h1>
        <p className="text-gray-600 mt-2">Join our delivery team and start earning</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Driver Information</CardTitle>
          <CardDescription>
            Please provide your information to create your delivery driver account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Account Information</h3>
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input 
                            className="pl-10" 
                            placeholder="Enter your phone number" 
                            {...field} 
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input 
                            className="pl-10" 
                            placeholder="Enter your email" 
                            {...field} 
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input 
                            className="pl-10 pr-10" 
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password" 
                            {...field} 
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-10 w-10"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input 
                            className="pl-10 pr-10"
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="Confirm your password" 
                            {...field} 
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-10 w-10"
                          onClick={toggleConfirmPasswordVisibility}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showConfirmPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Driver Verification Section */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Driver Verification</h3>
                
                <FormField
                  control={form.control}
                  name="idCardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Citizen Identification Card Number</FormLabel>
                      <div className="relative">
                        <IdCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input 
                            className="pl-10" 
                            placeholder="Enter your 12-digit ID number" 
                            {...field} 
                          />
                        </FormControl>
                      </div>
                      <FormDescription>
                        Must be exactly 12 digits
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="drivingLicenseFront"
                    render={({ field: { onChange, value, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Front Side of Driving License</FormLabel>
                        <div className="border border-dashed rounded-md p-4 text-center hover:bg-gray-50 transition cursor-pointer">
                          <FileImage className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <FormLabel className="cursor-pointer text-sm text-gray-500 block">
                            Click to upload or drag and drop
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="file" 
                              className="hidden"
                              onChange={(e) => onChange(e.target.files)} 
                              accept="image/*"
                              {...fieldProps} 
                            />
                          </FormControl>
                          {value instanceof FileList && value.length > 0 && (
                            <p className="text-xs text-green-600 mt-2 flex items-center justify-center">
                              <Check className="h-3 w-3 mr-1" />
                              {value[0].name}
                            </p>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="drivingLicenseBack"
                    render={({ field: { onChange, value, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Back Side of Driving License</FormLabel>
                        <div className="border border-dashed rounded-md p-4 text-center hover:bg-gray-50 transition cursor-pointer">
                          <FileImage className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <FormLabel className="cursor-pointer text-sm text-gray-500 block">
                            Click to upload or drag and drop
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="file" 
                              className="hidden"
                              onChange={(e) => onChange(e.target.files)} 
                              accept="image/*"
                              {...fieldProps} 
                            />
                          </FormControl>
                          {value instanceof FileList && value.length > 0 && (
                            <p className="text-xs text-green-600 mt-2 flex items-center justify-center">
                              <Check className="h-3 w-3 mr-1" />
                              {value[0].name}
                            </p>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="vehicleRegFront"
                    render={({ field: { onChange, value, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Front Side of Vehicle Registration</FormLabel>
                        <div className="border border-dashed rounded-md p-4 text-center hover:bg-gray-50 transition cursor-pointer">
                          <FileImage className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <FormLabel className="cursor-pointer text-sm text-gray-500 block">
                            Click to upload or drag and drop
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="file" 
                              className="hidden"
                              onChange={(e) => onChange(e.target.files)} 
                              accept="image/*"
                              {...fieldProps} 
                            />
                          </FormControl>
                          {value instanceof FileList && value.length > 0 && (
                            <p className="text-xs text-green-600 mt-2 flex items-center justify-center">
                              <Check className="h-3 w-3 mr-1" />
                              {value[0].name}
                            </p>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vehicleRegBack"
                    render={({ field: { onChange, value, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Back Side of Vehicle Registration</FormLabel>
                        <div className="border border-dashed rounded-md p-4 text-center hover:bg-gray-50 transition cursor-pointer">
                          <FileImage className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <FormLabel className="cursor-pointer text-sm text-gray-500 block">
                            Click to upload or drag and drop
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="file" 
                              className="hidden"
                              onChange={(e) => onChange(e.target.files)} 
                              accept="image/*"
                              {...fieldProps} 
                            />
                          </FormControl>
                          {value instanceof FileList && value.length > 0 && (
                            <p className="text-xs text-green-600 mt-2 flex items-center justify-center">
                              <Check className="h-3 w-3 mr-1" />
                              {value[0].name}
                            </p>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Terms & Agreement Section */}
              <div className="space-y-4 pt-4 border-t">
                <FormField
                  control={form.control}
                  name="termsAgreed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          I confirm that the above information is accurate and I agree to the{" "}
                          <a href="#" className="text-foodsnap-orange hover:underline">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-foodsnap-orange hover:underline">
                            Privacy Policy
                          </a>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-foodsnap-orange hover:bg-foodsnap-orange/90"
              >
                Sign Up & Submit for Verification
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col items-center">
          <p className="text-sm text-gray-600 mt-4">
            Already registered?{" "}
            <span 
              className="text-foodsnap-orange cursor-pointer hover:underline"
              onClick={handleLoginClick}
            >
              Login Here
            </span>
          </p>
        </CardFooter>
      </Card>

      <LoginDialog 
        isOpen={loginDialogOpen} 
        onClose={() => setLoginDialogOpen(false)} 
      />
    </div>
  );
};

export default DriverSignUpForm;
