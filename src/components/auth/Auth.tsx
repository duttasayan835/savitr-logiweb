import { ReactNode } from "react";
import { useAuthCheck } from "@/hooks/useAuthCheck";

interface AuthProps {
  children: ReactNode;
  requiredRole?: "admin" | "recipient";
}

export const Auth = ({ children, requiredRole }: AuthProps) => {
  const { isLoading } = useAuthCheck(requiredRole);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};