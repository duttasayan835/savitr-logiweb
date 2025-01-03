import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Package, Users, Clock, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsignments();
  }, []);

  const fetchConsignments = async () => {
    try {
      const { data, error } = await supabase
        .from('consignments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setConsignments(data || []);
    } catch (error) {
      console.error('Error fetching consignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Total Consignments",
      value: consignments.length,
      icon: Package,
      trend: "+12.5%",
      color: "text-primary",
    },
    {
      title: "Active Deliveries",
      value: consignments.filter(c => c.status === 'in_transit').length,
      icon: Users,
      trend: "+5.2%",
      color: "text-secondary",
    },
    {
      title: "Pending Slots",
      value: consignments.filter(c => c.status === 'pending').length,
      icon: Clock,
      trend: "+8.1%",
      color: "text-accent",
    },
    {
      title: "Issues",
      value: consignments.filter(c => c.status === 'failed').length,
      icon: AlertTriangle,
      trend: "-2.3%",
      color: "text-destructive",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dynamic Slot Management System</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Entry
        </Button>
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

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Recent Consignments</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sl. No.</TableHead>
                <TableHead>Consignment No.</TableHead>
                <TableHead>Recipient Name</TableHead>
                <TableHead>Phone No.</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Scheduled Delivery Date</TableHead>
                <TableHead>Time Slot</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Loading consignments...
                  </TableCell>
                </TableRow>
              ) : consignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No consignments found
                  </TableCell>
                </TableRow>
              ) : (
                consignments.map((consignment, index) => (
                  <TableRow key={consignment.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{consignment.consignment_no}</TableCell>
                    <TableCell>{consignment.recipient_name}</TableCell>
                    <TableCell>{consignment.phone_no}</TableCell>
                    <TableCell>{consignment.address}</TableCell>
                    <TableCell>{new Date(consignment.expected_delivery_date).toLocaleDateString()}</TableCell>
                    <TableCell>Morning Slot</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;