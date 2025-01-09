import { Card } from "./ui/card";
import { Bell } from "lucide-react";

const newsItems = [
  {
    title: "New AI-Powered Tracking System",
    date: "2024-03-20",
    content: "Introducing advanced parcel tracking with real-time updates.",
  },
  {
    title: "Extended Working Hours",
    date: "2024-03-19",
    content: "Selected post offices now open till 8 PM on weekdays.",
  },
  {
    title: "Digital Payment Options",
    date: "2024-03-18",
    content: "Now accepting all major digital payment methods.",
  },
];

const NewsUpdates = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold text-gray-800">Latest Updates</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsItems.map((item, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{item.date}</p>
              <p className="text-gray-600">{item.content}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsUpdates;