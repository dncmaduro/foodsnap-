
import { MapPin, Clock, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";

interface RestaurantInfoProps {
  restaurant: {
    address: string;
    hours: {
      [key: string]: string;
    };
    phone: string;
    email: string;
    about: string;
    location: {
      lat: number;
      lng: number;
    };
    social: {
      facebook: string;
      instagram: string;
      twitter: string;
    };
  };
}

const RestaurantInfo = ({ restaurant }: RestaurantInfoProps) => {
  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">About</h2>
        <p className="text-gray-600 mb-6">{restaurant.about}</p>

        <h2 className="text-xl font-bold mb-4 text-gray-800">Opening Hours</h2>
        <div className="bg-white rounded-lg border p-4 mb-6">
          <ul className="space-y-2">
            {days.map((day) => (
              <li key={day.key} className="flex justify-between text-sm">
                <span className="font-medium">{day.label}</span>
                <span className="text-gray-600">{restaurant.hours[day.key]}</span>
              </li>
            ))}
          </ul>
        </div>

        <h2 className="text-xl font-bold mb-4 text-gray-800">Contact</h2>
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <MapPin size={18} className="mr-2 text-foodsnap-teal" />
            <span>{restaurant.address}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Phone size={18} className="mr-2 text-foodsnap-teal" />
            <a href={`tel:${restaurant.phone}`} className="hover:text-foodsnap-orange">
              {restaurant.phone}
            </a>
          </div>
          <div className="flex items-center text-gray-600">
            <Mail size={18} className="mr-2 text-foodsnap-teal" />
            <a href={`mailto:${restaurant.email}`} className="hover:text-foodsnap-orange">
              {restaurant.email}
            </a>
          </div>
        </div>

        <h2 className="text-xl font-bold mt-6 mb-4 text-gray-800">Social Media</h2>
        <div className="flex space-x-4">
          <a
            href={`https://facebook.com/${restaurant.social.facebook}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            <Facebook size={20} />
          </a>
          <a
            href={`https://instagram.com/${restaurant.social.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-pink-800"
          >
            <Instagram size={20} />
          </a>
          <a
            href={`https://twitter.com/${restaurant.social.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600"
          >
            <Twitter size={20} />
          </a>
        </div>
      </div>

      {/* Map */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Location</h2>
        <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
          {/* Placeholder for an actual map integration */}
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
            <div className="text-center">
              <MapPin size={48} className="mx-auto mb-2 text-gray-400" />
              <p>Map integration would go here</p>
              <p className="text-sm">Location: {restaurant.location.lat}, {restaurant.location.lng}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantInfo;
