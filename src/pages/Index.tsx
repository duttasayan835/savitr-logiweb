import React from "react";
import { Card } from "@/components/ui/card";

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-4">Welcome to Savitr-AI</h1>
        <p className="text-gray-600">
          Track your packages, manage deliveries, and more with our comprehensive logistics platform.
        </p>
      </Card>
    </div>
  );
};

export default HomePage;