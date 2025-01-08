import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DeliveryModification } from "@/components/delivery/DeliveryModification";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ModifySchedulePage() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [deliveryData, setDeliveryData] = useState<{
    consignmentNo: string;
    currentDate: Date;
    currentTimeSlot: string;
    typeOfConsignment: string;
  } | null>(null);

  const consignmentNo = searchParams.get("consignment");

  useEffect(() => {
    const fetchDeliveryData = async () => {
      if (!consignmentNo) {
        toast({
          title: "Error",
          description: "No consignment number provided",
          variant: "destructive",
        });
        return;
      }

      try {
        const { data, error } = await supabase
          .from("delivery_slots")
          .select("*")
          .eq("consignment_no", consignmentNo)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setDeliveryData({
            consignmentNo: data.consignment_no,
            currentDate: new Date(data.expected_delivery_date),
            currentTimeSlot: data.expected_time_slot,
            typeOfConsignment: data.type_of_consignment,
          });
        }
      } catch (error) {
        console.error("Error fetching delivery data:", error);
        toast({
          title: "Error",
          description: "Failed to load delivery information",
          variant: "destructive",
        });
      }
    };

    fetchDeliveryData();
  }, [consignmentNo, toast]);

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