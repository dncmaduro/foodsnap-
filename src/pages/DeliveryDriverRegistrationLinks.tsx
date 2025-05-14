
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Driver application status
export type DriverStatus = "not_applied" | "pending" | "approved" | "rejected";

export default function DeliveryDriverRegistrationLinks() {
  const navigate = useNavigate();
  const [driverStatus, setDriverStatus] = useState<DriverStatus>("not_applied");

  useEffect(() => {
    // Check if user has applied to be a driver
    const applicationStatus = localStorage.getItem("driverApplicationStatus");
    if (applicationStatus) {
      setDriverStatus(applicationStatus as DriverStatus);
    }
  }, []);

  const handleStartAcceptingOrders = () => {
    navigate("/delivery-orders");
  };

  const handleApplyAsDriver = () => {
    navigate("/delivery-registration/form");
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Đăng ký làm Tài xế giao hàng</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Thông tin đăng ký</CardTitle>
          <CardDescription>
            Đăng ký làm tài xế giao hàng và bắt đầu kiếm thu nhập linh hoạt.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {driverStatus === "not_applied" && (
            <div className="space-y-4">
              <p>Bạn chưa đăng ký làm tài xế giao hàng. Hãy hoàn thành đơn đăng ký để bắt đầu.</p>
              <Button onClick={handleApplyAsDriver}>Đăng ký ngay</Button>
            </div>
          )}

          {driverStatus === "pending" && (
            <div className="space-y-4">
              <p className="text-amber-600 font-medium">Hồ sơ của bạn đang được phê duyệt</p>
              <p>
                Chúng tôi đang xem xét hồ sơ của bạn. Quá trình này thường mất 1-2 ngày làm việc.
                Bạn sẽ nhận được thông báo qua email khi hồ sơ được phê duyệt.
              </p>
            </div>
          )}

          {driverStatus === "approved" && (
            <div className="space-y-4">
              <p className="text-green-600 font-medium">Hồ sơ của bạn đã được phê duyệt!</p>
              <p>
                Chúc mừng! Bạn đã có thể bắt đầu nhận đơn hàng và giao hàng ngay bây giờ.
                Hãy nhấn nút bên dưới để xem các đơn hàng có thể nhận.
              </p>
              <Button onClick={handleStartAcceptingOrders}>Bắt đầu nhận đơn</Button>
            </div>
          )}

          {driverStatus === "rejected" && (
            <div className="space-y-4">
              <p className="text-red-600 font-medium">Hồ sơ của bạn đã bị từ chối</p>
              <p>
                Rất tiếc, hồ sơ của bạn không được phê duyệt. Vui lòng liên hệ bộ phận hỗ trợ
                để biết thêm chi tiết và cách thức nộp lại hồ sơ.
              </p>
              <Button variant="outline" onClick={handleApplyAsDriver}>Nộp lại hồ sơ</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quyền lợi của Tài xế</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc pl-5">
            <li>Thu nhập hấp dẫn, thanh toán hàng tuần</li>
            <li>Thời gian làm việc linh hoạt</li>
            <li>Hỗ trợ kỹ thuật 24/7</li>
            <li>Cơ hội nhận thưởng và ưu đãi đặc biệt</li>
            <li>Không tính phí đăng ký, bắt đầu ngay không cần đầu tư</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
