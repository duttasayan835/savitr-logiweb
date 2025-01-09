import { Package, Search, MapPin } from "lucide-react";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-white to-gray-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto animate-fade-down">
          <div className="flex justify-center mb-6">
            <img 
              src="/placeholder.svg" 
              alt="India Post Logo" 
              className="h-20 w-auto"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Welcome to India Post
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-12">
            Connecting India through Innovation and Trust
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-4 mb-12">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Enter Tracking Number"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="bg-primary hover:bg-primary-hover">
                Track Package
              </Button>
            </div>
          </div>

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
              className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-primary hover:text-white group"
            >
              <Search className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span>Find PIN Code</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-primary hover:text-white group"
            >
              <MapPin className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span>Post Office Locator</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};

export default Hero;