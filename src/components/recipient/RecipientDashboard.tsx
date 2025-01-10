import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Clock, Package, Calendar } from "lucide-react";

interface DeliverySlot {
  id: string;
  consignment_no: string;
  type_of_consignment: string;
  expected_delivery_date: string;
  expected_time_slot: string;
  time_aligned: boolean;
  status: string;
}

const RecipientDashboard = () => {
  const [deliverySlots, setDeliverySlots] = useState<DeliverySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDeliverySlots = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/login");
          return;
        }

        const { data, error } = await supabase
          .from("delivery_slots")
          .select("*")
          .eq("user_id", user.id);

        if (error) throw error;

        console.log("Fetched delivery slots:", data);
        setDeliverySlots(data || []);
      } catch (error) {
        console.error("Error fetching delivery slots:", error);
        toast({
          title: "Error",
          description: "Failed to load delivery information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDeliverySlots();
  }, [navigate, toast]);

  const handleModifyDelivery = (consignmentNo: string) => {
    navigate(`/delivery/modify?consignment=${consignmentNo}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Deliveries</h1>
      
      {deliverySlots.length === 0 ? (
        <Card className="p-6 text-center">
          <p>No deliveries found.</p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {deliverySlots.map((slot) => (
            <Card key={slot.id} className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-primary" />
                    <span className="font-medium">Consignment No:</span>
                    <span>{slot.consignment_no}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="font-medium">Expected Delivery:</span>
                    <span>{new Date(slot.expected_delivery_date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="font-medium">Time Slot:</span>
                    <span>{slot.expected_time_slot}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-end">
                  <Button
                    onClick={() => handleModifyDelivery(slot.consignment_no)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Modify Date/Time
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipientDashboard;