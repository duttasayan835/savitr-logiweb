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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ConsignmentTracker = () => {
  const [consignments, setConsignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('consignments')
        .select('*')
        .ilike('consignment_no', `%${searchTerm}%`);
      
      if (error) throw error;
      setConsignments(data || []);
    } catch (error) {
      console.error('Error searching consignments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Consignment Tracker</h1>
        <Card className="p-6">
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Enter consignment number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Consignment No</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expected Delivery</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Searching...</TableCell>
                </TableRow>
              ) : consignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No consignments found</TableCell>
                </TableRow>
              ) : (
                consignments.map((consignment) => (
                  <TableRow key={consignment.id}>
                    <TableCell>{consignment.consignment_no}</TableCell>
                    <TableCell>{consignment.recipient_name}</TableCell>
                    <TableCell>{consignment.status}</TableCell>
                    <TableCell>{new Date(consignment.expected_delivery_date).toLocaleDateString()}</TableCell>
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

export default ConsignmentTracker;