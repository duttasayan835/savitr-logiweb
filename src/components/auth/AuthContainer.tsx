import { useAuthState } from "@/hooks/useAuthState";
import { AuthUI } from "./AuthUI";

interface AuthContainerProps {
  view: "sign_up" | "sign_in";
}

export function AuthContainer({ view }: AuthContainerProps) {
  useAuthState();
  return <AuthUI view={view} />;
}