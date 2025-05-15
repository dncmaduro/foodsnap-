import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Clock,
  LogOut,
  UserPlus,
  Truck,
  ClipboardList,
  Store,
  FilePlus,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/contexts/CartContext'
import { useAuthStore } from '@/store/authStore'
import LoginDialog from './LoginDialog'

// Helper: chuẩn hóa icon size
const menuIconClass = 'w-5 h-5 md:w-6 md:h-6'

const QUICK_MENU = [
  {
    part: 'Shipper',
    items: [
      {
        label: 'Đăng ký làm shipper',
        to: '/delivery-registration',
        icon: <Truck className={menuIconClass + ' text-foodsnap-teal'} />,
      },
      {
        label: 'Trang cho shipper',
        to: '/delivery-orders',
        icon: <ClipboardList className={menuIconClass + ' text-foodsnap-orange'} />,
      },
    ],
  },
  {
    part: 'Nhà hàng',
    items: [
      {
        label: 'Đăng ký nhà hàng',
        to: '/restaurant-registration',
        icon: <FilePlus className={menuIconClass + ' text-foodsnap-teal'} />,
      },
      {
        label: 'Quản lý nhà hàng',
        to: '/my-restaurants',
        icon: <Store className={menuIconClass + ' text-foodsnap-orange'} />,
      },
    ],
  },
]

// Các route mà menu sẽ ẩn (ví dụ: trang admin, v.v.)
const HIDE_QUICK_MENU_ROUTES = [/^\/admin/, /^\/driver-profile/]

// Các route chỉ show 1 phần quick menu (ví dụ: trang shipper chỉ hiện Shipper menu)
const ONLY_SHIPPER_MENU_ROUTES = [/^\/delivery/]

// Các route chỉ show 1 phần quick menu (ví dụ: trang nhà hàng chỉ hiện Nhà hàng menu)
const ONLY_RESTAURANT_MENU_ROUTES = [/^\/my-restaurants/, /^\/restaurant-management/]

// Hàm check route khớp với pattern nào
const checkRoute = (patterns: RegExp[], pathname: string) =>
  patterns.some((reg) => reg.test(pathname))

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [quickMenuOpen, setQuickMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { totalItems } = useCart()
  const { user, isAuthenticated, logout } = useAuthStore()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleQuickMenu = () => setQuickMenuOpen((open) => !open)
  const closeQuickMenu = () => setQuickMenuOpen(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLoginClick = () => {
    setLoginDialogOpen(true)
  }

  const handleLogout = () => {
    logout()
  }

  // --- Route handling ---
  const { pathname } = location
  let menuData: typeof QUICK_MENU = QUICK_MENU

  // Nếu route nằm trong các route ẩn quick menu thì không hiện nút menu luôn
  const hideQuickMenu = checkRoute(HIDE_QUICK_MENU_ROUTES, pathname)
  // Nếu route nằm trong shipper chỉ hiện part Shipper
  if (checkRoute(ONLY_SHIPPER_MENU_ROUTES, pathname)) {
    menuData = QUICK_MENU.filter((m) => m.part === 'Shipper')
  }
  // Nếu route nằm trong nhà hàng chỉ hiện part Nhà hàng
  else if (checkRoute(ONLY_RESTAURANT_MENU_ROUTES, pathname)) {
    menuData = QUICK_MENU.filter((m) => m.part === 'Nhà hàng')
  }

  // Nếu cần ẩn toàn bộ Navigation ở 1 số trang, có thể return null ở đây

  // --- End Route handling ---

  // Render dropdown menu cho quickMenu (popover)
  const renderQuickMenuDropdown = () => (
    <div
      className="absolute right-0 z-50 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl py-3"
      onMouseLeave={closeQuickMenu}
      onBlur={closeQuickMenu}
      tabIndex={0}
    >
      {menuData.map((part) => (
        <div key={part.part} className="mb-3 last:mb-0">
          <div className="px-4 py-1 font-semibold text-gray-600 text-xs uppercase tracking-widest">
            {part.part}
          </div>
          {part.items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors"
              onClick={() => {
                setQuickMenuOpen(false)
                setIsMenuOpen(false) // mobile menu đóng luôn nếu đang bật
              }}
            >
              {item.icon}
              <span className="text-base">{item.label}</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  )

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-foodsnap-orange">
                Food<span className="text-foodsnap-teal">Snap</span>
              </span>
            </Link>
          </div>

          {/* Search Desktop */}
          <div className="hidden md:flex items-center justify-center flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Tìm kiếm món ăn hoặc nhà hàng"
                className="pr-10 border-gray-300 focus:border-foodsnap-teal"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-foodsnap-orange"
              >
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Main nav desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-foodsnap-orange transition-colors">
              Trang chủ
            </Link>
            <Link
              to="/order-history"
              className="text-gray-700 hover:text-foodsnap-orange transition-colors flex items-center"
            >
              <Clock size={20} className="mr-1" />
              Lịch sử đơn hàng
            </Link>

            <div className="relative">
              <Link
                to="/cart"
                className="text-gray-700 hover:text-foodsnap-orange transition-colors"
              >
                <ShoppingCart className={menuIconClass} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-foodsnap-orange text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>

            {/* Quick Menu Dropdown */}
            {!hideQuickMenu && (
              <div className="relative">
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 text-foodsnap-teal hover:bg-foodsnap-teal/10"
                  onClick={toggleQuickMenu}
                  aria-haspopup="menu"
                  aria-expanded={quickMenuOpen}
                >
                  <Menu className={menuIconClass} />
                  <span>Dịch vụ</span>
                  <ChevronDown size={16} className="ml-1" />
                </Button>
                {quickMenuOpen && renderQuickMenuDropdown()}
              </div>
            )}

            {isAuthenticated() ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-1 text-gray-700 hover:text-foodsnap-orange"
                  onClick={() => navigate('/profile')}
                >
                  <User className={menuIconClass} />
                  <span className="hidden lg:inline">{user?.fullname}</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-500"
                >
                  <LogOut className={menuIconClass} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-1 text-gray-700 hover:text-foodsnap-orange"
                  onClick={handleLoginClick}
                  id="login-button"
                >
                  <User className={menuIconClass} />
                  <span className="hidden lg:inline">Đăng nhập</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center space-x-1 text-foodsnap-orange border-foodsnap-orange hover:bg-foodsnap-orange hover:text-white"
                  onClick={() => navigate('/signup')}
                >
                  <UserPlus className={menuIconClass} />
                  <span className="hidden lg:inline">Đăng ký</span>
                </Button>
              </div>
            )}
          </div>

          {/* Hamburger menu mobile */}
          <div className="flex md:hidden">
            <Button variant="ghost" onClick={toggleMenu} aria-label="Menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Search Mobile */}
        <div className="mt-3 flex md:hidden">
          <form onSubmit={handleSearch} className="relative w-full">
            <Input
              type="text"
              placeholder="Tìm kiếm món ăn hoặc nhà hàng"
              className="pr-10 border-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-foodsnap-orange"
            >
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-gray-200">
            <div className="flex flex-col space-y-3 pt-3">
              <Link to="/" className="text-gray-700 hover:text-foodsnap-orange transition-colors">
                Trang chủ
              </Link>
              <Link
                to="/order-history"
                className="text-gray-700 hover:text-foodsnap-orange transition-colors flex items-center"
              >
                <Clock className={menuIconClass + ' mr-2'} />
                <span>Lịch sử đơn hàng</span>
              </Link>

              <Link
                to="/cart"
                className="text-gray-700 hover:text-foodsnap-orange transition-colors flex items-center"
              >
                <ShoppingCart className={menuIconClass + ' mr-2'} />
                <span>Giỏ hàng {totalItems > 0 && `(${totalItems})`}</span>
              </Link>

              {/* Quick Menu Dropdown (mobile) */}
              {!hideQuickMenu && (
                <div className="relative">
                  <Button
                    variant="outline"
                    className="w-full flex items-center gap-2 justify-center border-foodsnap-teal text-foodsnap-teal hover:bg-foodsnap-teal/10 my-2"
                    onClick={toggleQuickMenu}
                  >
                    <Menu className={menuIconClass} />
                    <span>Dịch vụ</span>
                    <ChevronDown size={16} className="ml-1" />
                  </Button>
                  {quickMenuOpen && <div className="w-full">{renderQuickMenuDropdown()}</div>}
                </div>
              )}

              {isAuthenticated() ? (
                <>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-foodsnap-orange flex items-center"
                  >
                    <User className={menuIconClass + ' mr-2'} />
                    <span>{user?.fullname || 'Tài khoản của tôi'}</span>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-500 flex items-center justify-start p-0"
                  >
                    <LogOut className={menuIconClass + ' mr-2'} />
                    <span>Đăng xuất</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-foodsnap-orange transition-colors flex items-center justify-start p-0"
                    onClick={() => {
                      handleLoginClick()
                      setIsMenuOpen(false)
                    }}
                  >
                    <User className={menuIconClass + ' mr-2'} />
                    <span>Đăng nhập</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-foodsnap-orange transition-colors flex items-center justify-start p-0"
                    onClick={() => {
                      navigate('/signup')
                      setIsMenuOpen(false)
                    }}
                  >
                    <UserPlus className={menuIconClass + ' mr-2'} />
                    <span>Đăng ký</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <LoginDialog isOpen={loginDialogOpen} onClose={() => setLoginDialogOpen(false)} />
    </nav>
  )
}

export default Navigation
