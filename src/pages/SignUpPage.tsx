import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Phone, Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { useToast } from '@/hooks/use-toast'
import { useAuthStore } from '@/store/authStore'
import { useApiMutation } from '@/hooks/useApi'

// Define the registration request and response types
interface RegisterRequest {
  fullname: string
  phonenumber: string
  email: string
  password: string
}

interface RegisterResponse {
  user: {
    id: string
    fullname: string
    phonenumber: string
    email: string
  }
  token: string
}

const SignUpPage = () => {
  const [fullname, setFullname] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()
  const { toast } = useToast()
  const { login } = useAuthStore()

  // Set up the registration mutation
  const registerMutation = useApiMutation<RegisterResponse, RegisterRequest>('/auth/register', {
    onSuccess: () => {
      toast({
        title: 'Tạo tài khoản thành công!',
        description: 'Tài khoản của bạn đã được tạo.',
      })

      // Auto-login the user
      login(phone, password)
      navigate('/')
    },
    onError: (error) => {
      toast({
        title: 'Đăng ký thất bại',
        description: error.message || 'Có lỗi xảy ra',
        variant: 'destructive',
      })
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!fullname.trim()) {
      newErrors.fullname = 'Họ tên là bắt buộc'
    }

    if (!phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc'
    } else if (!/^\d{10,}$/.test(phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ'
    }

    if (!email.trim()) {
      newErrors.email = 'Email là bắt buộc'
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    if (!password) {
      newErrors.password = 'Mật khẩu là bắt buộc'
    } else if (password.length < 8) {
      newErrors.password = 'Mật khẩu ít nhất 8 ký tự'
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu nhập lại không khớp'
    }

    if (!agreedToTerms) {
      newErrors.terms = 'Bạn cần đồng ý với Điều khoản & Chính sách'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)
      registerMutation.mutate({
        fullname,
        phonenumber: phone,
        email,
        password,
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Tạo tài khoản</h2>
            <p className="mt-2 text-sm text-gray-600">Tham gia FoodSnap để đặt món ăn yêu thích</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Full Name Input */}
              <div>
                <Label htmlFor="fullname">Họ tên</Label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <Input
                    id="fullname"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className={`${errors.fullname ? 'border-red-500' : ''}`}
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </div>
                {errors.fullname && <p className="mt-1 text-sm text-red-600">{errors.fullname}</p>}
              </div>

              {/* Phone Number Input */}
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0912345678"
                    className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              {/* Email Input */}
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ban@example.com"
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Password Input */}
              <div>
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`${errors.password ? 'border-red-500' : ''}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              {/* Confirm Password Input */}
              <div>
                <Label htmlFor="confirmPassword">Nhập lại mật khẩu</Label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`${errors.confirmPassword ? 'border-red-500' : ''}`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                    className={errors.terms ? 'border-red-500' : ''}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <Label htmlFor="terms" className="text-gray-700">
                    Tôi đồng ý với{' '}
                    <Link to="/terms" className="text-foodsnap-orange hover:underline">
                      Điều khoản dịch vụ
                    </Link>{' '}
                    và{' '}
                    <Link to="/privacy" className="text-foodsnap-orange hover:underline">
                      Chính sách bảo mật
                    </Link>
                  </Label>
                  {errors.terms && <p className="mt-1 text-sm text-red-600">{errors.terms}</p>}
                </div>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-foodsnap-orange hover:bg-foodsnap-orange/90 text-white py-2 px-4 rounded-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang tạo tài khoản...' : 'Đăng ký'}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <button
                className="text-foodsnap-orange hover:underline font-medium"
                onClick={() => {
                  const loginDialog = document.getElementById('login-button')
                  if (loginDialog) {
                    ;(loginDialog as HTMLButtonElement).click()
                  }
                }}
              >
                Đăng nhập
              </button>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default SignUpPage
