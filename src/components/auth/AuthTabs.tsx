import { Button } from "../ui/button";

interface AuthTabsProps {
  view: "sign_up" | "sign_in";
  onViewChange: (view: "sign_up" | "sign_in") => void;
}

export function AuthTabs({ view, onViewChange }: AuthTabsProps) {
  return (
    <div className="mb-4 flex justify-center space-x-4">
      <Button
        variant={view === "sign_up" ? "default" : "outline"}
        onClick={() => onViewChange("sign_up")}
      >
        Sign Up
      </Button>
      <Button
        variant={view === "sign_in" ? "default" : "outline"}
        onClick={() => onViewChange("sign_in")}
      >
        Sign In
      </Button>
    </div>
  );
}