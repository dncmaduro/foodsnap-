
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Store } from "lucide-react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Mock data for restaurants
const approvedRestaurants = [
  {
    id: '1',
    name: 'Phở 24',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    registrationDate: '05/01/2025',
    status: 'approved'
  },
  {
    id: '2',
    name: 'Bún Chả Hà Nội',
    address: '45 Lê Lợi, Quận 1, TP.HCM',
    registrationDate: '15/02/2025',
    status: 'approved'
  },
  {
    id: '3',
    name: 'Cơm Tấm Sài Gòn',
    address: '67 Đồng Khởi, Quận 1, TP.HCM',
    registrationDate: '20/03/2025',
    status: 'approved'
  },
];

const pendingRestaurants = [
  {
    id: '4',
    name: 'Bánh Mì Huỳnh Hoa',
    address: '89 Nguyễn Du, Quận 1, TP.HCM',
    registrationDate: '10/04/2025',
    status: 'pending'
  },
  {
    id: '5',
    name: 'Hủ Tiếu Nam Vang',
    address: '12 Lê Thánh Tôn, Quận 1, TP.HCM',
    registrationDate: '25/04/2025',
    status: 'pending'
  },
];

const MyRestaurantsPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const restaurantsPerPage = 10;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/restaurant-management')} 
          className="mb-6 text-gray-700 hover:text-foodsnap-teal"
        >
          <ArrowLeft size={18} className="mr-2" />
          <span>Quay lại trang quản lý</span>
        </Button>
        
        <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Danh sách nhà hàng đã đăng ký</h1>
        
        {/* Tabs */}
        <Tabs defaultValue="approved" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="approved">Nhà hàng đã được phê duyệt</TabsTrigger>
            <TabsTrigger value="pending">Nhà hàng đang chờ phê duyệt</TabsTrigger>
          </TabsList>
          
          {/* Approved Restaurants Tab */}
          <TabsContent value="approved">
            <div className="grid grid-cols-1 gap-6">
              {approvedRestaurants.map(restaurant => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
              {approvedRestaurants.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  Bạn chưa có nhà hàng nào đã được phê duyệt.
                </p>
              )}
            </div>
          </TabsContent>
          
          {/* Pending Restaurants Tab */}
          <TabsContent value="pending">
            <div className="grid grid-cols-1 gap-6">
              {pendingRestaurants.map(restaurant => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
              {pendingRestaurants.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  Bạn không có nhà hàng nào đang chờ phê duyệt.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Pagination */}
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </main>

      <Footer />
    </div>
  );
};

// Restaurant Card Component
const RestaurantCard = ({ restaurant }: { restaurant: any }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-2">
              <Store className="h-5 w-5 text-foodsnap-teal" />
              <h3 className="text-xl font-medium">{restaurant.name}</h3>
              <Badge variant={restaurant.status === 'approved' ? 'default' : 'secondary'} className={restaurant.status === 'approved' ? 'bg-green-500' : 'bg-amber-500'}>
                {restaurant.status === 'approved' ? 'Đã phê duyệt' : 'Đang chờ phê duyệt'}
              </Badge>
            </div>
            
            <div className="flex items-start gap-2 text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{restaurant.address}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Đăng ký: {restaurant.registrationDate}</span>
            </div>
          </div>
          
          <Button variant="outline" className="mt-4 md:mt-0 w-full md:w-auto" asChild>
            <Link to={`/restaurant-details/${restaurant.id}`}>Xem chi tiết</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MyRestaurantsPage;
