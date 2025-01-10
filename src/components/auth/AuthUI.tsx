import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";

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
        onViewChange={({ view }) => onViewChange(view as "sign_up" | "sign_in")}
      />
    </div>
  );
};