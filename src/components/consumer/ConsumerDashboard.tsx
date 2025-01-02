import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Package, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Temporary mock data - would come from API in production
const spendingData = [
  { month: "Jan", amount: 2400 },
  { month: "Feb", amount: 1398 },
  { month: "Mar", amount: 9800 },
  { month: "Apr", amount: 3908 },
  { month: "May", amount: 4800 },
  { month: "Jun", amount: 3800 },
];

const activeShipments = [
  {
    id: "PKG001",
    status: "In Transit",
    origin: "Mumbai",
    destination: "Delhi",
    eta: "2024-03-20",
  },
  {
    id: "PKG002",
    status: "Out for Delivery",
    origin: "Bangalore",
    destination: "Chennai",
    eta: "2024-03-19",
  },
];

const ConsumerDashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome back, User!</h1>
        <Button>New Shipment</Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-primary" />
            <span>Track Package</span>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Schedule Pickup</span>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>View Reports</span>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            <span>Support</span>
          </div>
        </Card>
      </div>

      {/* Active Shipments */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Active Shipments</h2>
        <div className="grid gap-4">
          {activeShipments.map((shipment) => (
            <Card key={shipment.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Package ID: {shipment.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    {shipment.origin} → {shipment.destination}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-sm">
                    {shipment.status}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    ETA: {new Date(shipment.eta).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Spending Chart */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Monthly Spending</h2>
        <div className="h-[300px]">
          <ChartContainer
            className="h-[300px]"
            config={{
              primary: {
                theme: {
                  light: "hsl(var(--primary))",
                  dark: "hsl(var(--primary))",
                },
              },
            }}
          >
            <AreaChart data={spendingData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorAmount)"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </Card>
    </div>
  );
};

export default ConsumerDashboard;