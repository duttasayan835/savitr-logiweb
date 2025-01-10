import { useState, useEffect } from "react";
import { Menu, X, Package, MapPin, FileText, Phone, LayoutDashboard, LogOut, Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: adminProfile } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();

        setIsAdmin(!!adminProfile);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: adminProfile } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();

        setIsAdmin(!!adminProfile);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleHashLinkClick = (hash: string) => {
    if (location.pathname !== '/') {
      navigate('/' + hash);
    } else {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
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
    setIsOpen(false);
  };

  const publicMenuItems = [
    { name: "Track Package", icon: Package, hash: "#track" },
    { name: "Find Branch", icon: MapPin, hash: "#branches" },
    { name: "Services", icon: FileText, hash: "#services" },
    { name: "Contact", icon: Phone, hash: "#contact" },
  ];

  const adminMenuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/parcels" },
    { name: "Parcels", icon: Package, path: "/admin/parcels" },
    { name: "Slots", icon: FileText, path: "/admin/slots" },
    { name: "Tracker", icon: MapPin, path: "/admin/tracker" },
  ];

  const recipientMenuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Track Package", icon: Package, hash: "#track" },
  ];

  const menuItems = user 
    ? (isAdmin ? adminMenuItems : recipientMenuItems)
    : publicMenuItems;

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Savitr-AI
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              item.hash ? (
                <button
                  key={item.name}
                  onClick={() => handleHashLinkClick(item.hash)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </button>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
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

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {menuItems.map((item) => (
                item.hash ? (
                  <button
                    key={item.name}
                    onClick={() => handleHashLinkClick(item.hash)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium w-full text-left"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
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