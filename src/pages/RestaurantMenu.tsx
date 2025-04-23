import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DishCard from "@/components/restaurant/DishCard";
import DishFormDialog, { DishFormData } from "@/components/restaurant/DishFormDialog";
import DeleteConfirmDialog from "@/components/restaurant/DeleteConfirmDialog";
import { useRestaurantMenu, MenuItem } from "@/hooks/useRestaurantMenu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RestaurantSidebar } from "@/components/restaurant/RestaurantSidebar";

const RestaurantMenu = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isRestaurant } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { 
    filteredDishes, 
    isLoading, 
    addDish, 
    updateDish, 
    deleteDish,
    toggleAvailability,
    searchDishes
  } = useRestaurantMenu();

  if (!isAuthenticated || !isRestaurant) {
    return <Navigate to="/" replace />;
  }

  const handleOpenAddForm = () => {
    setSelectedDish(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (id: string) => {
    const dish = filteredDishes.find(d => d.id === id);
    if (dish) {
      setSelectedDish(dish);
      setIsFormOpen(true);
    }
  };

  const handleOpenDeleteDialog = (id: string) => {
    const dish = filteredDishes.find(d => d.id === id);
    if (dish) {
      setSelectedDish(dish);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleSaveDish = (formData: DishFormData) => {
    if (selectedDish?.id) {
      updateDish({
        id: selectedDish.id,
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        image: formData.image || null,
        category: selectedDish.category,
        isAvailable: formData.isAvailable
      });
    } else {
      addDish({
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        image: formData.image || null,
        category: "New Items",
        isAvailable: formData.isAvailable
      });
    }
    setIsFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedDish?.id) {
      deleteDish(selectedDish.id);
    }
    setIsDeleteDialogOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchDishes(searchQuery);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <SidebarProvider>
        <div className="flex-1 flex w-full">
          <RestaurantSidebar />
          <main className="flex-1 p-8 overflow-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Menu Management</h1>
                <p className="text-muted-foreground">Add, edit, and manage your restaurant menu items</p>
              </div>
              <Button onClick={handleOpenAddForm} className="gap-2">
                <Plus size={18} />
                Add New Dish
              </Button>
            </div>

            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchDishes(e.target.value);
                  }}
                  className="pl-10 pr-4"
                />
              </div>
            </form>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : (
              <>
                {filteredDishes.length === 0 ? (
                  <div className="text-center py-12 border rounded-lg bg-gray-50">
                    <p className="text-lg text-gray-600 mb-4">No dishes found</p>
                    <Button onClick={handleOpenAddForm} className="gap-2">
                      <Plus size={18} />
                      Add your first dish
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {filteredDishes.map((dish) => (
                      <DishCard
                        key={dish.id}
                        dish={dish}
                        onEdit={handleOpenEditForm}
                        onDelete={handleOpenDeleteDialog}
                        onToggleAvailability={toggleAvailability}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </SidebarProvider>

      <Footer />

      {isFormOpen && (
        <DishFormDialog
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveDish}
          initialData={
            selectedDish
              ? {
                  id: selectedDish.id,
                  name: selectedDish.name,
                  description: selectedDish.description || "",
                  price: selectedDish.price.toString(),
                  image: selectedDish.image || "",
                  isAvailable: selectedDish.isAvailable,
                }
              : undefined
          }
        />
      )}

      {isDeleteDialogOpen && selectedDish && (
        <DeleteConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          itemName={selectedDish.name}
        />
      )}
    </div>
  );
};

export default RestaurantMenu;
