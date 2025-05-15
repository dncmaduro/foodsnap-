import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Cột 1: Về FoodSnap */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Về FoodSnap</h3>
            <p className="text-gray-400 mb-4">
              FoodSnap kết nối bạn với những nhà hàng chất lượng và giao đồ ăn nhanh chóng, đáng tin
              cậy tận nơi bạn muốn.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Youtube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Dịch vụ của chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Đối tác nhà hàng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Đăng ký tài xế giao hàng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Tuyển dụng
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ & Trợ giúp */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hỗ trợ & Trợ giúp</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Trung tâm hỗ trợ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <Mail size={16} className="mr-2" />
                <span>support@foodsnap.com</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Phone size={16} className="mr-2" />
                <span>+84 888 123 456</span>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Tải ứng dụng FoodSnap</h4>
              <div className="flex space-x-2">
                <a
                  href="#"
                  className="bg-gray-800 py-2 px-3 rounded hover:bg-gray-700 transition-colors text-xs"
                >
                  App Store
                </a>
                <a
                  href="#"
                  className="bg-gray-800 py-2 px-3 rounded hover:bg-gray-700 transition-colors text-xs"
                >
                  Google Play
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} FoodSnap. Đã đăng ký bản quyền.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
