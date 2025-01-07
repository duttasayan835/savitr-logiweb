import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const SlotManagement = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_slots')
        .select('*')
        .order('expected_delivery_date', { ascending: true });
      
      if (error) throw error;
      setSlots(data || []);
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Delivery Slot Management</h1>
        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Consignment No</TableHead>
                <TableHead>Expected Date</TableHead>
                <TableHead>Time Slot</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : slots.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No slots found</TableCell>
                </TableRow>
              ) : (
                slots.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell>{slot.consignment_no}</TableCell>
                    <TableCell>{format(new Date(slot.expected_delivery_date), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{slot.expected_time_slot}</TableCell>
                    <TableCell>{slot.status}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default SlotManagement;