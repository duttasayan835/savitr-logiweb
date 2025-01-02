import {
  Truck,
  Package,
  Clock,
  Shield,
  MapPin,
  MessageSquare,
} from "lucide-react";

const services = [
  {
    icon: Package,
    title: "Smart Parcel Booking",
    description:
      "AI-powered booking system with automatic address validation and cost estimation",
  },
  {
    icon: Truck,
    title: "Real-time Tracking",
    description:
      "Track your parcels in real-time with precise GPS location and ETA updates",
  },
  {
    icon: Clock,
    title: "Express Delivery",
    description:
      "Priority handling and faster delivery options for urgent shipments",
  },
  {
    icon: Shield,
    title: "Secure Shipping",
    description:
      "End-to-end encryption and real-time monitoring for maximum security",
  },
  {
    icon: MapPin,
    title: "Branch Locator",
    description:
      "Find the nearest post office with detailed information and working hours",
  },
  {
    icon: MessageSquare,
    title: "24/7 Support",
    description:
      "AI-powered customer support available round the clock for your queries",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience next-generation postal services powered by artificial
            intelligence and cutting-edge technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-gray-200 hover:border-primary/20 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <service.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;