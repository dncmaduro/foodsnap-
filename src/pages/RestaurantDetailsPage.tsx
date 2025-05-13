
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

// Placeholder components for each tab content
const MenuManagement = () => (
  <div className="bg-white rounded-md p-6 shadow-sm">
    <h2 className="text-xl font-semibold mb-4">Quản lý thực đơn</h2>
    <p className="text-gray-500">
      Nội dung quản lý thực đơn sẽ được thêm vào sau.
    </p>
  </div>
);

const OrderManagement = () => (
  <div className="bg-white rounded-md p-6 shadow-sm">
    <h2 className="text-xl font-semibold mb-4">Quản lý đơn hàng</h2>
    <p className="text-gray-500">
      Nội dung quản lý đơn hàng sẽ được thêm vào sau.
    </p>
  </div>
);

const ProfileManagement = () => (
  <div className="bg-white rounded-md p-6 shadow-sm">
    <h2 className="text-xl font-semibold mb-4">Quản lý thông tin nhà hàng</h2>
    <p className="text-gray-500">
      Nội dung quản lý thông tin nhà hàng sẽ được thêm vào sau.
    </p>
  </div>
);

const RestaurantDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("menu");

  // In a real app, we would fetch restaurant data based on the ID
  const restaurantName = `Nhà hàng #${id || ""}`;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          asChild
          className="mb-6 text-gray-700 hover:text-foodsnap-teal"
        >
          <Link to="/my-restaurants">
            <ArrowLeft size={18} className="mr-2" />
            <span>Quay lại</span>
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center md:text-left">
            {restaurantName}
          </h1>
          <p className="text-gray-600 mt-2 text-center md:text-left">
            Quản lý thực đơn, đơn hàng và thông tin nhà hàng
          </p>
        </div>

        <Tabs
          defaultValue="menu"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-3 mb-8">
            <TabsTrigger value="menu">Thực đơn</TabsTrigger>
            <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
            <TabsTrigger value="profile">Thông tin nhà hàng</TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="mt-0">
            <MenuManagement />
          </TabsContent>

          <TabsContent value="orders" className="mt-0">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="profile" className="mt-0">
            <ProfileManagement />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default RestaurantDetailsPage;
