
import { ClipboardList, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const DashboardActions = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Manage Orders</h3>
          <p className="text-muted-foreground mb-4">
            View and manage all incoming orders, update order status, and track deliveries.
          </p>
          <Button 
            className="w-full" 
            size="lg"
            onClick={() => navigate('/restaurant-orders')}
          >
            <ClipboardList className="mr-2 h-5 w-5" />
            Check Orders
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Menu Management</h3>
          <p className="text-muted-foreground mb-4">
            Update your menu items, prices, and availability in real-time.
          </p>
          <Button 
            className="w-full" 
            size="lg"
            onClick={() => navigate('/restaurant-menu')}
          >
            <Edit className="mr-2 h-5 w-5" />
            Edit Menu
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardActions;
