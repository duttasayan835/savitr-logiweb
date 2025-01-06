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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminDashboard = () => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newConsignment, setNewConsignment] = useState({
    slNo: "",
    consignmentNo: "",
    recipientName: "",
    phoneNo: "",
    address: "",
    typeOfConsignment: "Letter/Document",
    scheduledDate: "",
    timeSlot: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('consignments')
        .insert([
          {
            consignment_no: newConsignment.consignmentNo,
            recipient_name: newConsignment.recipientName,
            phone_no: newConsignment.phoneNo,
            address: newConsignment.address,
            expected_delivery_date: newConsignment.scheduledDate,
            status: 'pending'
          }
        ]);

      if (error) throw error;
      fetchConsignments();
      setNewConsignment({
        slNo: "",
        consignmentNo: "",
        recipientName: "",
        phoneNo: "",
        address: "",
        typeOfConsignment: "Letter/Document",
        scheduledDate: "",
        timeSlot: "",
      });
    } catch (error) {
      console.error('Error adding consignment:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dynamic Slot Management System</h1>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="slNo">Sl. No. *</Label>
            <Input
              id="slNo"
              value={newConsignment.slNo}
              onChange={(e) => setNewConsignment(prev => ({ ...prev, slNo: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="consignmentNo">Consignment No. *</Label>
            <Input
              id="consignmentNo"
              value={newConsignment.consignmentNo}
              onChange={(e) => setNewConsignment(prev => ({ ...prev, consignmentNo: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="recipientName">Recipient Name *</Label>
            <Input
              id="recipientName"
              value={newConsignment.recipientName}
              onChange={(e) => setNewConsignment(prev => ({ ...prev, recipientName: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="phoneNo">Phone No. *</Label>
            <Input
              id="phoneNo"
              value={newConsignment.phoneNo}
              onChange={(e) => setNewConsignment(prev => ({ ...prev, phoneNo: e.target.value }))}
              required
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={newConsignment.address}
              onChange={(e) => setNewConsignment(prev => ({ ...prev, address: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="typeOfConsignment">Type of Consignment *</Label>
            <Select 
              value={newConsignment.typeOfConsignment}
              onValueChange={(value) => setNewConsignment(prev => ({ ...prev, typeOfConsignment: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Letter/Document">Letter/Document</SelectItem>
                <SelectItem value="Package">Package</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="scheduledDate">Scheduled Delivery Date *</Label>
            <Input
              id="scheduledDate"
              type="date"
              value={newConsignment.scheduledDate}
              onChange={(e) => setNewConsignment(prev => ({ ...prev, scheduledDate: e.target.value }))}
              required
            />
          </div>
          <div className="col-span-2">
            <Label>Time Slot *</Label>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <Button
                type="button"
                variant={newConsignment.timeSlot === "morning" ? "default" : "outline"}
                onClick={() => setNewConsignment(prev => ({ ...prev, timeSlot: "morning" }))}
              >
                Morning Slot (10:00AM-12:00PM)
              </Button>
              <Button
                type="button"
                variant={newConsignment.timeSlot === "afternoon" ? "default" : "outline"}
                onClick={() => setNewConsignment(prev => ({ ...prev, timeSlot: "afternoon" }))}
              >
                Afternoon Slot (12:00PM-3:00PM)
              </Button>
              <Button
                type="button"
                variant={newConsignment.timeSlot === "evening" ? "default" : "outline"}
                onClick={() => setNewConsignment(prev => ({ ...prev, timeSlot: "evening" }))}
              >
                Evening Slot (3:00PM-5:00PM)
              </Button>
            </div>
          </div>
          <div className="col-span-2 flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sl. No.</TableHead>
                <TableHead>Consignment No.</TableHead>
                <TableHead>Recipient Name</TableHead>
                <TableHead>Phone No.</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Type Of Consignment</TableHead>
                <TableHead>Scheduled Delivery Date</TableHead>
                <TableHead>Time Slot</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    Loading consignments...
                  </TableCell>
                </TableRow>
              ) : consignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
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
                    <TableCell>{consignment.type_of_consignment || "Letter/Document"}</TableCell>
                    <TableCell>{new Date(consignment.expected_delivery_date).toLocaleDateString()}</TableCell>
                    <TableCell>{consignment.time_slot || "Morning Slot"}</TableCell>
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