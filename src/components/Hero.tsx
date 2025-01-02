import { Package, Search, MapPin } from "lucide-react";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white to-gray-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Content */}
      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="text-center max-w-4xl mx-auto animate-fade-down">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Next-Gen Postal Services
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12">
            Experience the future of logistics with AI-powered tracking and
            delivery optimization
          </p>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-primary hover:text-white group"
            >
              <Package className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span>Track Package</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-secondary hover:text-black group"
            >
              <Search className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span>Quick Search</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-accent hover:text-white group"
            >
              <MapPin className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span>Find Branch</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};

export default Hero;