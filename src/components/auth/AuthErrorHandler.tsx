import { AuthError } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

interface AuthErrorHandlerProps {
  onViewChange?: (view: "sign_up" | "sign_in") => void;
}

export const useAuthErrorHandler = ({ onViewChange }: AuthErrorHandlerProps) => {
  const { toast } = useToast();

  const handleAuthError = (error: AuthError) => {
    console.error("Auth error:", error);
    
    let errorDetails;
    try {
      // Try to parse error details from the message if it contains JSON
      const errorBody = error.message.includes('{') ? 
        error.message.substring(error.message.indexOf('{')) : 
        error.message;
      
      errorDetails = JSON.parse(errorBody);
      console.log("Parsed error details:", errorDetails);
    } catch (e) {
      console.error("Error parsing details, using original:", e);
      errorDetails = { 
        code: error.message.includes("invalid_credentials") ? "invalid_credentials" : "",
        message: error.message 
      };
    }

    switch (errorDetails.code) {
      case "user_already_exists":
        console.log("User already exists, switching to sign in");
        toast({
          title: "Account exists",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive",
        });
        onViewChange?.("sign_in");
        break;

      case "invalid_credentials":
        console.log("Invalid credentials provided");
        toast({
          title: "Invalid credentials",
          description: "Please check your email and password and try again.",
          variant: "destructive",
        });
        break;

      default:
        if (errorDetails.message.includes("User already registered")) {
          console.log("User already registered (message check)");
          toast({
            title: "Account exists",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive",
          });
          onViewChange?.("sign_in");
        } else {
          console.log("Unhandled error:", errorDetails.message);
          toast({
            title: "Error",
            description: errorDetails.message || "An error occurred during authentication.",
            variant: "destructive",
          });
        }
    }
  };

  return { handleAuthError };
};