import { useState } from "react";
import { AuthUI } from "@/components/auth/AuthUI";

const LoginPage = () => {
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_in");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <AuthUI view={view} onViewChange={setView} />
    </div>
  );
};

export default LoginPage;