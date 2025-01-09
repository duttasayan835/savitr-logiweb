import { Package, Search, MapPin, FileText, Phone, Mail } from "lucide-react";
import { Button } from "./ui/button";

const quickLinks = [
  {
    icon: Package,
    title: "Track Parcel",
    description: "Track your parcel status",
  },
  {
    icon: Search,
    title: "Find PIN Code",
    description: "Search postal codes",
  },
  {
    icon: MapPin,
    title: "Post Office",
    description: "Find nearest post office",
  },
  {
    icon: FileText,
    title: "Calculate Postage",
    description: "Check shipping rates",
  },
  {
    icon: Phone,
    title: "Customer Care",
    description: "24/7 support",
  },
  {
    icon: Mail,
    title: "Complaints",
    description: "Register complaints",
  },
];

const QuickLinks = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickLinks.map((link, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary hover:text-white group"
            >
              <link.icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{link.title}</span>
              <span className="text-xs text-gray-500 group-hover:text-gray-200">
                {link.description}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickLinks;