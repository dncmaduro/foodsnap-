
import { DollarSign, Star, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const DashboardStats = () => {
  // Mock data - in a real app, this would come from an API
  const stats = {
    ordersToday: 24,
    revenueToday: 1250.50,
    averageRating: 4.5
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardContent className="flex items-center p-6">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <ShoppingBag className="h-6 w-6 text-blue-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Orders Today</p>
            <h3 className="text-2xl font-bold">{stats.ordersToday}</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <DollarSign className="h-6 w-6 text-green-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Revenue Today</p>
            <h3 className="text-2xl font-bold">${stats.revenueToday.toFixed(2)}</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <div className="bg-yellow-100 p-3 rounded-full mr-4">
            <Star className="h-6 w-6 text-yellow-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
            <h3 className="text-2xl font-bold">{stats.averageRating} / 5</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
