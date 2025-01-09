import React from "react";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import QuickLinks from "@/components/QuickLinks";
import NewsUpdates from "@/components/NewsUpdates";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <QuickLinks />
      <Services />
      <NewsUpdates />
    </div>
  );
};

export default HomePage;