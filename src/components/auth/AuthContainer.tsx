import { useAuthState } from "@/hooks/useAuthState";
import { AuthUI } from "./AuthUI";

interface AuthContainerProps {
  view: "sign_up" | "sign_in";
  onViewChange: (view: "sign_up" | "sign_in") => void;
  userType: "recipient" | "admin";
}

export function AuthContainer({ view, onViewChange, userType }: AuthContainerProps) {
  useAuthState();
  return <AuthUI view={view} onViewChange={onViewChange} userType={userType} />;
}