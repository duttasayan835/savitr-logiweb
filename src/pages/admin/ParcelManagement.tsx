import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ParcelUploadForm from "@/components/admin/ParcelUploadForm";
import { useToast } from "@/hooks/use-toast";

const ParcelManagementPage = () => {
  const { toast } = useToast();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Parcel Management</h1>
        </div>
        <div className="border-t">
          <ParcelUploadForm />
        </div>
      </div>
    </AdminLayout>
  );
};

export default ParcelManagementPage;