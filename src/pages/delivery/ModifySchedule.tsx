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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No active session, redirecting to login");
        navigate("/login");
        return;
      }

      try {
        const testConsignmentNo = "TEST123";
        console.log("Fetching delivery data for consignment:", testConsignmentNo);
        
        const { data, error } = await supabase
          .from("delivery_slots")
          .select("*")
          .eq("consignment_no", testConsignmentNo)
          .maybeSingle();

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
            description: "No delivery information found for this consignment number. Please contact support.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error in checkAuthAndFetchData:", error);
        toast({
          title: "Error",
          description: "Failed to load delivery information. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading delivery information...</p>
      </div>
    );
  }

  if (!deliveryData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No delivery information found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DeliveryModification {...deliveryData} />
    </div>
  );
}