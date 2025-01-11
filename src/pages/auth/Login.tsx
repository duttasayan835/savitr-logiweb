import { useState } from "react";
import { AuthUI } from "@/components/auth/AuthUI";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LoginPage = () => {
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_in");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Tabs defaultValue="recipient" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="recipient">Recipient</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          <TabsContent value="recipient">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-center mb-6">Recipient Portal</h2>
              <AuthUI view={view} onViewChange={setView} userType="recipient" />
            </div>
          </TabsContent>
          <TabsContent value="admin">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-center mb-6">Admin Portal</h2>
              <AuthUI view={view} onViewChange={setView} userType="admin" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LoginPage;