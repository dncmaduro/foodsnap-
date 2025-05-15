import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash, ToggleLeft, ToggleRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import DishFormDialog from '@/components/DishFormDialog'
import { MenuItem } from '@/types/types'
import { useApiMutation, useApiPatchMutation, useApiDeleteMutation } from '@/hooks/useApi'

interface MenuManagementProps {
  menuItems: MenuItem[]
  restaurantId: number
  refetchRestaurant: () => void
}

const itemsPerPage = 3

const MenuManagement = ({ menuItems, restaurantId, refetchRestaurant }: MenuManagementProps) => {
  const [dishes, setDishes] = useState<MenuItem[]>(menuItems || [])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Thêm mới món (multipart/form-data nếu có file, còn lại json)
  const addDishMutation = useApiMutation<MenuItem, any>('/restaurant/menuitem', {
    onSuccess: () => {
      toast({ title: 'Thêm món thành công!' })
      setIsAddDialogOpen(false)
      refetchRestaurant()
    },
    onError: (err) => {
      toast({ title: 'Thêm món thất bại', variant: 'destructive', description: err?.message })
    },
  })

  // Sửa món (multipart nếu có file mới, không thì json)
  const editDishMutation = useApiPatchMutation<MenuItem, Partial<MenuItem>>(
    editingDish ? `/restaurant/menuitem/${editingDish.menuitem_id}` : '',
    {
      onSuccess: () => {
        toast({ title: 'Cập nhật món thành công!' })
        setIsEditDialogOpen(false)
        refetchRestaurant()
      },
      onError: (err) => {
        toast({ title: 'Cập nhật thất bại', variant: 'destructive', description: err?.message })
      },
    },
  )

  useEffect(() => {
    setDishes(menuItems || [])
  }, [menuItems])

  // Filter dishes by search term
  const filteredDishes = dishes.filter((dish) =>
    dish.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination
  const indexOfLastDish = currentPage * itemsPerPage
  const indexOfFirstDish = indexOfLastDish - itemsPerPage
  const currentDishes = filteredDishes.slice(indexOfFirstDish, indexOfLastDish)
  const totalPages = Math.ceil(filteredDishes.length / itemsPerPage)

  // Toggle available (call API)
  const toggleAvailability = (menuitem_id: string | number, active: boolean) => {
    editDishMutation.mutate({
      active: !active,
    })
  }

  // Delete dish (call API nếu có, chưa thì chỉ toast demo)
  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa món ăn này?')) {
      // TODO: Gọi API xóa ở đây nếu BE support (useApiDeleteMutation)
      toast({ title: 'Đã xóa món ăn (demo)', description: 'Món ăn đã được xóa khỏi thực đơn.' })
      refetchRestaurant()
    }
  }

  // Edit dish
  const handleEdit = (dish: MenuItem) => {
    setEditingDish(dish)
    setIsEditDialogOpen(true)
  }

  // Add dish dialog
  const handleAddNew = () => {
    setIsAddDialogOpen(true)
  }

  // Save new dish (FE truyền đúng kiểu: nếu có file thì FormData, không thì object)
  const handleSaveNewDish = async (values: any) => {
    let payload = values
    if (values instanceof FormData) {
      payload = values
      payload.append('restaurant_id', restaurantId.toString())
    } else {
      payload = { ...values, restaurant_id: restaurantId }
    }
    addDishMutation.mutate(payload)
  }

  // Save edit dish (nếu có imageFile thì FormData, không thì object)
  const handleUpdateDish = async (values: any) => {
    if (!editingDish) return

    let payload = values
    if (values instanceof FormData) {
      payload = values
    } else {
      payload = { ...values }
    }
    editDishMutation.mutate(payload)
  }

  return (
    <div className="space-y-6">
      {/* Header section with title and add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Quản lý thực đơn</h2>
        <Button onClick={handleAddNew} className="bg-foodsnap-teal hover:bg-foodsnap-teal/90">
          <Plus className="mr-1" size={18} /> Thêm món mới
        </Button>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
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
          Hiển thị {indexOfFirstDish + 1}-{Math.min(indexOfLastDish, filteredDishes.length)} trong
          tổng số {filteredDishes.length} món ăn
        </div>
      )}

      {/* Dish list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentDishes.length > 0 ? (
          currentDishes.map((dish) => (
            <Card key={dish.menuitem_id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={dish.image_url}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-800">{dish.name}</h3>
                      <span className="font-medium text-foodsnap-orange">
                        {(dish.price / 1000).toFixed(0)}K đ
                      </span>
                    </div>

                    {dish.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">{dish.description}</p>
                    )}

                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleAvailability(dish.menuitem_id, dish.active)}
                          className={`flex items-center text-sm ${
                            dish.active ? 'text-green-600' : 'text-gray-500'
                          }`}
                        >
                          {dish.active ? (
                            <>
                              <ToggleRight size={18} className="mr-1" /> Đang bán
                            </>
                          ) : (
                            <>
                              <ToggleLeft size={18} className="mr-1" /> Ngừng bán
                            </>
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
                          onClick={() => handleDelete(dish.menuitem_id)}
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
            {searchTerm ? 'Không tìm thấy món ăn nào phù hợp' : 'Chưa có món ăn nào trong thực đơn'}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="ghost"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Trước
          </Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? 'default' : 'ghost'}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="ghost"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Sau
          </Button>
        </div>
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
  )
}

export default MenuManagement
