import React from "react";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Package,
  Users,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Bookings",
      value: "1,234",
      icon: Package,
      trend: "+12.5%",
      color: "text-primary",
    },
    {
      title: "Active Users",
      value: "856",
      icon: Users,
      trend: "+5.2%",
      color: "text-secondary",
    },
    {
      title: "Revenue",
      value: "₹85,432",
      icon: TrendingUp,
      trend: "+8.1%",
      color: "text-accent",
    },
    {
      title: "Issues",
      value: "23",
      icon: AlertTriangle,
      trend: "-2.3%",
      color: "text-destructive",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="p-6 hover:shadow-lg transition-shadow animate-fade-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <p
                  className={`text-sm mt-1 ${
                    stat.trend.startsWith("+")
                      ? "text-green-500"
                      : "text-destructive"
                  }`}
                >
                  {stat.trend} from last month
                </p>
              </div>
              <div className={`${stat.color} opacity-80`}>
                <stat.icon className="h-8 w-8" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
          <div className="space-y-4">
            {/* Placeholder for recent bookings table */}
            <p className="text-muted-foreground">Loading recent bookings...</p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="space-y-4">
            {/* Placeholder for system status */}
            <p className="text-muted-foreground">All systems operational</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;