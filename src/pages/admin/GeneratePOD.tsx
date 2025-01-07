import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const GeneratePOD = () => {
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGeneratePOD = async () => {
    if (!date) return;
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .functions.invoke('generate-pod', {
          body: { date }
        });

      if (error) throw error;

      // Create a Blob from the PDF data
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `POD_${date}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating POD:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Generate POD</h1>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="max-w-md">
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <Button onClick={handleGeneratePOD} disabled={loading || !date}>
              <FileText className="mr-2 h-4 w-4" />
              Generate POD
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default GeneratePOD;