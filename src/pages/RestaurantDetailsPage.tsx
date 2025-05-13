import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Search, Edit, Trash, ToggleLeft, ToggleRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Footer from "@/components/Footer";
import DishFormDialog from "@/components/DishFormDialog";
import OrderManagement from "@/components/OrderManagement/OrderManagement";
import ProfileManagement from "@/components/ProfileManagement/ProfileManagement";

// Mock data for dishes
const mockDishes = [
  {
    id: '1',
    name: 'Phở Bò',
    description: 'Phở bò truyền thống với nước dùng đậm đà',
    price: 60000,
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
    available: true
  },
  {
    id: '2',
    name: 'Bún chả',
    description: 'Bún chả Hà Nội với nước mắm chua ngọt',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',
    available: true
  },
  {
    id: '3',
    name: 'Cơm tấm',
    description: 'Cơm tấm sườn bì chả với nước mắm pha chua ngọt',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    available: false
  },
  {
    id: '4',
    name: 'Bánh mì',
    description: 'Bánh mì thịt nguội đặc biệt với đầy đủ rau và gia vị',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1498936178812-4b2e558d2937',
    available: true
  },
  {
    id: '5',
    name: 'Bánh xèo',
    description: 'Bánh xèo miền Nam với nhân tôm thịt và rau sống',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1501286353178-1ec871214838',
    available: true
  },
];

// Access control - Placeholder for restaurant approval status check
const useRestaurantStatus = (id: string | undefined) => {
  // In a real app, this would fetch from an API
  // For this demo, we'll consider restaurants with ID 1-3 as approved
  const [status, setStatus] = useState<{ loading: boolean, approved: boolean }>({ 
    loading: true, 
    approved: false 
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const approved = id ? ['1', '2', '3'].includes(id) : false;
      setStatus({ loading: false, approved });
    }, 500);
  }, [id]);

  return status;
};

// Placeholder component for Profile tab
const ProfileManagement = () => (
  <div className="bg-white rounded-md p-6 shadow-sm">
    <h2 className="text-xl font-semibold mb-4">Quản lý thông tin nhà hàng</h2>
    <p className="text-gray-500">
      Nội dung quản lý thông tin nhà hàng sẽ được thêm vào sau.
    </p>
  </div>
);

// Menu Management component
const MenuManagement = () => {
  const [dishes, setDishes] = useState(mockDishes);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingDish, setEditingDish] = useState<null | typeof mockDishes[0]>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const itemsPerPage = 3;

  // Filter dishes by search term
  const filteredDishes = dishes.filter(dish => 
    dish.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate pagination
  const indexOfLastDish = currentPage * itemsPerPage;
  const indexOfFirstDish = indexOfLastDish - itemsPerPage;
  const currentDishes = filteredDishes.slice(indexOfFirstDish, indexOfLastDish);
  const totalPages = Math.ceil(filteredDishes.length / itemsPerPage);
  
  const toggleAvailability = (id: string) => {
    setDishes(dishes.map(dish => 
      dish.id === id ? { ...dish, available: !dish.available } : dish
    ));
    
    const dish = dishes.find(d => d.id === id);
    if (dish) {
      toast({
        title: `${dish.name} ${!dish.available ? 'đã được bật' : 'đã được tắt'}`,
        description: !dish.available ? "Món ăn đã được hiển thị trên thực đơn" : "Món ăn đã bị ẩn khỏi thực đơn",
      });
    }
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa món ăn này?")) {
      setDishes(dishes.filter(dish => dish.id !== id));
      toast({
        title: "Đã xóa món ăn",
        description: "Món ăn đã được xóa khỏi thực đơn",
      });
    }
  };
  
  const handleEdit = (dish: typeof mockDishes[0]) => {
    setEditingDish(dish);
    setIsEditDialogOpen(true);
  };
  
  const handleAddNew = () => {
    setIsAddDialogOpen(true);
  };

  const handleSaveNewDish = (values: any) => {
    const newDish = {
      ...values,
      id: `new-${Date.now()}`,
      available: true
    };
    
    setDishes([...dishes, newDish]);
    
    toast({
      title: "Thêm món mới thành công",
      description: `${values.name} đã được thêm vào thực đơn`,
    });
  };

  const handleUpdateDish = (values: any) => {
    if (!editingDish) return;
    
    setDishes(dishes.map(dish => 
      dish.id === editingDish.id ? { ...values, available: dish.available } : dish
    ));
    
    toast({
      title: "Cập nhật thành công",
      description: `${values.name} đã được cập nhật`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header section with title and add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Quản lý thực đơn</h2>
        <Button 
          onClick={handleAddNew} 
          className="bg-foodsnap-teal hover:bg-foodsnap-teal/90"
        >
          <Plus className="mr-1" size={18} /> Thêm món mới
        </Button>
      </div>
      
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="search"
          placeholder="Tìm kiếm món ăn..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Dish count information */}
      {filteredDishes.length > 0 && (
        <div className="text-sm text-gray-500">
          Hiển thị {indexOfFirstDish + 1}-{Math.min(indexOfLastDish, filteredDishes.length)} trong tổng số {filteredDishes.length} món ăn
        </div>
      )}
      
      {/* Dish list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentDishes.length > 0 ? (
          currentDishes.map((dish) => (
            <Card key={dish.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="w-24 h-24 flex-shrink-0">
                    <img 
                      src={dish.image} 
                      alt={dish.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-800">{dish.name}</h3>
                      <span className="font-medium text-foodsnap-orange">{(dish.price / 1000).toFixed(0)}K đ</span>
                    </div>
                    
                    {dish.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">{dish.description}</p>
                    )}
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <button 
                          onClick={() => toggleAvailability(dish.id)} 
                          className={`flex items-center text-sm ${dish.available ? 'text-green-600' : 'text-gray-500'}`}
                        >
                          {dish.available ? (
                            <><ToggleRight size={18} className="mr-1" /> Đang bán</>
                          ) : (
                            <><ToggleLeft size={18} className="mr-1" /> Ngừng bán</>
                          )}
                        </button>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleEdit(dish)}
                        >
                          <Edit size={16} className="text-blue-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleDelete(dish.id)}
                        >
                          <Trash size={16} className="text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            {searchTerm ? "Không tìm thấy món ăn nào phù hợp" : "Chưa có món ăn nào trong thực đơn"}
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  onClick={() => setCurrentPage(i + 1)} 
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
      {/* Add New Dish Dialog */}
      <DishFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleSaveNewDish}
        mode="add"
      />
      
      {/* Edit Dish Dialog */}
      {editingDish && (
        <DishFormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleUpdateDish}
          initialValues={editingDish}
          mode="edit"
        />
      )}
    </div>
  );
};

const RestaurantDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("menu");
  const { loading, approved } = useRestaurantStatus(id);

  // In a real app, we would fetch restaurant data based on the ID
  const restaurantName = `Nhà hàng #${id || ""}`;

  // Access control - Redirect if not approved
  useEffect(() => {
    if (!loading && !approved) {
      toast({
        title: "Không có quyền truy cập",
        description: "Nhà hàng chưa được phê duyệt không thể truy cập trang quản lý.",
        variant: "destructive"
      });
      navigate('/my-restaurants');
    }
  }, [loading, approved, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-foodsnap-teal border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-medium">Đang tải thông tin...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!approved) {
    return null; // We'll redirect in the useEffect
  }

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
