import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { ViewType } from "@supabase/auth-ui-shared";
import { AccountTypeDialog } from "./AccountTypeDialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export interface AuthUIProps {
  view: "sign_up" | "sign_in";
  onViewChange: (view: "sign_up" | "sign_in") => void;
}

export const AuthUI = ({ view, onViewChange }: AuthUIProps) => {
  const [showAccountTypeDialog, setShowAccountTypeDialog] = useState(false);
  const [userType, setUserType] = useState<"recipient" | "admin">("recipient");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session) {
        // Check if user is an admin
        const { data: adminProfile } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (adminProfile) {
          navigate('/admin');
        } else {
          navigate('/recipient/dashboard');
        }
      }
    } catch (error) {
      console.error('Error during sign in:', error);
      toast({
        title: "Error",
        description: "An error occurred during sign in. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleContinue = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (session) {
        if (userType === "admin") {
          // Create admin profile
          const { error: profileError } = await supabase
            .from('admin_profiles')
            .insert([
              {
                user_id: session.user.id,
                name: session.user.email?.split('@')[0] || 'Admin User',
                role: 'admin'
              }
            ]);

          if (profileError) throw profileError;
          navigate('/admin');
        } else {
          // Create recipient profile
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: session.user.id,
                user_type: 'recipient'
              }
            ]);

          if (profileError) throw profileError;
          navigate('/recipient/dashboard');
        }
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error",
        description: "An error occurred while setting up your account. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-[400px] mx-auto p-4 rounded-lg bg-white shadow-lg">
      <SupabaseAuth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="light"
        providers={[]}
        view={view as ViewType}
        showLinks={false}
        onSuccess={async () => {
          if (view === "sign_up") {
            setShowAccountTypeDialog(true);
          } else {
            await handleSignIn();
          }
        }}
      />
      <div className="mt-4 text-center">
        <button
          onClick={() => onViewChange(view === "sign_in" ? "sign_up" : "sign_in")}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {view === "sign_in" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
      <AccountTypeDialog
        isOpen={showAccountTypeDialog}
        setIsOpen={setShowAccountTypeDialog}
        userType={userType}
        setUserType={setUserType}
        onContinue={handleContinue}
      />
    </div>
  );
};