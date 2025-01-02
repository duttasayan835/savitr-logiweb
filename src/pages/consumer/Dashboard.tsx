import ConsumerDashboard from "@/components/consumer/ConsumerDashboard";
import Navigation from "@/components/Navigation";

const DashboardPage = () => {
  return (
    <div>
      <Navigation />
      <div className="pt-16">
        <ConsumerDashboard />
      </div>
    </div>
  );
};

export default DashboardPage;