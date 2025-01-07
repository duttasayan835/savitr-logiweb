import { useState, useEffect } from "react";
import { Menu, X, Package, MapPin, FileText, Phone, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      setUser(session?.user ?? null);

      if (event === 'SIGNED_IN') {
        try {
          const { data: adminProfile, error: adminError } = await supabase
            .from('admin_profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (adminError) {
            console.error("Error checking admin status:", adminError);
            return;
          }

          if (adminProfile) {
            console.log("Admin user detected, redirecting to admin/parcels");
            navigate("/admin/parcels");
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAdminClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }

    try {
      const { data: adminProfile, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking admin status:", error);
        toast({
          title: "Error",
          description: "An error occurred while checking permissions.",
          variant: "destructive",
        });
        return;
      }

      if (adminProfile) {
        console.log("Admin access granted, navigating to admin/parcels");
        navigate("/admin/parcels");
      } else {
        console.log("User is not an admin, showing access denied message");
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin dashboard.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in admin check:", error);
      toast({
        title: "Error",
        description: "An error occurred while checking permissions.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "An error occurred while signing out.",
        variant: "destructive",
      });
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const menuItems = [
    { name: "Track Package", icon: Package, href: "#track" },
    { name: "Find Branch", icon: MapPin, href: "#branches" },
    { name: "Services", icon: FileText, href: "#services" },
    { name: "Contact", icon: Phone, href: "#contact" },
    { name: "Admin", icon: LayoutDashboard, href: "/admin", onClick: handleAdminClick },
  ];

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Savitr-AI
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={item.onClick}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </a>
            ))}
            {user ? (
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button 
                onClick={handleLoginClick}
                className="bg-primary hover:bg-primary-hover"
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    if (item.onClick) {
                      item.onClick(e);
                    }
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </a>
              ))}
              {user ? (
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full flex items-center gap-2 justify-center mt-4"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <Button 
                  onClick={handleLoginClick}
                  className="w-full bg-primary hover:bg-primary-hover mt-4"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;