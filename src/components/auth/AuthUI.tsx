import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { ViewType } from "@supabase/auth-ui-shared";

export interface AuthUIProps {
  view: "sign_up" | "sign_in";
  onViewChange: (view: "sign_up" | "sign_in") => void;
}

export const AuthUI = ({ view, onViewChange }: AuthUIProps) => {
  return (
    <div className="w-full max-w-[400px] mx-auto p-4 rounded-lg bg-white shadow-lg">
      <SupabaseAuth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="light"
        providers={[]}
        view={view}
        showLinks={true}
        onViewChange={({ view }) => {
          if (view === "sign_in" || view === "sign_up") {
            onViewChange(view);
          }
        }}
      />
    </div>
  );
};