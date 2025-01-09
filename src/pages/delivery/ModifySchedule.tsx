import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeliveryModification } from "@/components/delivery/DeliveryModification";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ModifySchedulePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deliveryData, setDeliveryData] = useState<{
    consignmentNo: string;
    currentDate: Date;
    currentTimeSlot: string;
    typeOfConsignment: string;
  } | null>(null);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No active session, redirecting to login");
        navigate("/login");
        return;
      }

      try {
        // For testing purposes, using a default consignment number
        const testConsignmentNo = "TEST123"; // You can replace this with actual consignment number
        console.log("Fetching delivery data for consignment:", testConsignmentNo);
        
        const { data, error } = await supabase
          .from("delivery_slots")
          .select("*")
          .eq("consignment_no", testConsignmentNo)
          .single();

        if (error) {
          console.error("Error fetching delivery data:", error);
          throw error;
        }

        if (data) {
          console.log("Delivery data found:", data);
          setDeliveryData({
            consignmentNo: data.consignment_no,
            currentDate: new Date(data.expected_delivery_date),
            currentTimeSlot: data.expected_time_slot,
            typeOfConsignment: data.type_of_consignment,
          });
        } else {
          console.log("No delivery data found");
          toast({
            title: "Not Found",
            description: "Delivery information not found",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error in checkAuthAndFetchData:", error);
        toast({
          title: "Error",
          description: "Failed to load delivery information",
          variant: "destructive",
        });
      }
    };

    checkAuthAndFetchData();
  }, [navigate, toast]);

  if (!deliveryData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading delivery information...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DeliveryModification {...deliveryData} />
    </div>
  );
}