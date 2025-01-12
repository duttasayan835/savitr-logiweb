import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NotificationList } from "./notifications/NotificationList";
import { supabase } from "@/integrations/supabase/client";

const Navigation = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/lovable-uploads/8a28cf14-d9ce-4238-9030-24fdfccf76f7.png"
                alt="Logo"
              />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationList />
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;