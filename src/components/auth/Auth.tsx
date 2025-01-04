import { useState } from "react";
import { AuthContainer } from "./AuthContainer";
import { AuthStateListener } from "./AuthStateListener";
import { AccountTypeDialog } from "./AccountTypeDialog";
import { AuthTabs } from "./AuthTabs";

export function Auth() {
  const [isOpen, setIsOpen] = useState(true);
  const [userType, setUserType] = useState<"recipient" | "admin">("recipient");
  const [view, setView] = useState<"sign_up" | "sign_in">("sign_up");

  const handleContinue = async () => {
    localStorage.setItem("signUpUserType", userType);
    setIsOpen(false);
  };

  const handleViewChange = (newView: "sign_up" | "sign_in") => {
    setView(newView);
  };

  return (
    <>
      <AuthStateListener />
      
      <AccountTypeDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        userType={userType}
        setUserType={setUserType}
        onContinue={handleContinue}
      />

      <div className="w-full max-w-[400px] mx-auto p-4 rounded-lg bg-white shadow-lg">
        <AuthTabs view={view} onViewChange={handleViewChange} />
        <AuthContainer view={view} />
      </div>
    </>
  );
}