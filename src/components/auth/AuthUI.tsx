import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { ViewType } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useAuthErrorHandler } from "./AuthErrorHandler";

export interface AuthUIProps {
  view: "sign_up" | "sign_in";
  onViewChange: (view: "sign_up" | "sign_in") => void;
  userType: "recipient" | "admin";
}

export const AuthUI = ({ view, onViewChange, userType }: AuthUIProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleAuthError } = useAuthErrorHandler({ onViewChange });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN') {
        try {
          if (session) {
            if (userType === 'admin') {
              // Check for existing admin profile
              const { data: adminProfile, error: adminError } = await supabase
                .from('admin_profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .maybeSingle();

              if (view === "sign_up") {
                if (!adminProfile) {
                  // Create new admin profile
                  const { error: createError } = await supabase
                    .from('admin_profiles')
                    .insert([
                      {
                        user_id: session.user.id,
                        name: session.user.email?.split('@')[0] || 'Admin User',
                        role: 'admin'
                      }
                    ]);

                  if (createError) throw createError;
                }
                navigate('/admin');
              } else if (adminProfile) {
                navigate('/admin');
              } else {
                throw new Error("Unauthorized access to admin portal");
              }
            } else {
              // Check for existing recipient profile
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();

              if (view === "sign_up" || !profile) {
                // Create new recipient profile if it doesn't exist
                const { error: createError } = await supabase
                  .from('profiles')
                  .upsert([
                    {
                      id: session.user.id,
                      user_type: 'recipient',
                      full_name: session.user.email?.split('@')[0] || 'User'
                    }
                  ], {
                    onConflict: 'id'
                  });

                if (createError) {
                  console.error('Error creating profile:', createError);
                  throw createError;
                }
                
                navigate('/recipient/dashboard');
              } else if (profile) {
                navigate('/recipient/dashboard');
              } else {
                throw new Error("Profile not found");
              }
            }
          }
        } catch (error) {
          console.error('Error during authentication:', error);
          await supabase.auth.signOut();
          handleAuthError(error as any);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, userType, view]);

  return (
    <div className="w-full">
      <SupabaseAuth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="light"
        providers={[]}
        view={view as ViewType}
        showLinks={false}
      />
      <div className="mt-4 text-center">
        <button
          onClick={() => onViewChange(view === "sign_in" ? "sign_up" : "sign_in")}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {view === "sign_in" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
};