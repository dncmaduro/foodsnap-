
import { 
  LayoutDashboard, 
  Menu, 
  Package, 
  Info 
} from "lucide-react";
import { useLocation, Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/restaurant-dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Menu",
    url: "/restaurant-menu",
    icon: Menu,
  },
  {
    title: "Orders",
    url: "/restaurant-orders",
    icon: Package,
  },
  {
    title: "Restaurant Info",
    url: "/restaurant-details",
    icon: Info,
  },
];

export function RestaurantSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Restaurant Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url}
                      className={`flex items-center gap-3 ${
                        location.pathname === item.url ? 'text-foodsnap-orange' : 'text-gray-600'
                      }`}
                    >
                      <item.icon size={20} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
