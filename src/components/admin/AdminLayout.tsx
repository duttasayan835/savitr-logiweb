import React from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Package, label: "Parcels", path: "/admin/parcels" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-full bg-card border-r shadow-sm">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Savitr-AI Admin
            </h1>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <Button variant="ghost" className="w-full justify-start text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;