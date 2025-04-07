
import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const HeroSection = () => {
  const [address, setAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleGeolocation = () => {
    setIsLocating(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you would use a reverse geocoding service
          // to convert coordinates to an address
          setAddress("Using your current location");
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setIsLocating(false);
    }
  };

  return (
    <section className="relative">
      {/* Hero Image */}
      <div className="relative h-[500px] lg:h-[600px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')",
            filter: "brightness(0.7)" 
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
            Delicious Food, <span className="text-foodsnap-orange">Delivered Fast</span>
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl">
            Discover restaurants and get your favorite meals delivered right to your door.
          </p>
          
          {/* Location Input Container */}
          <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foodsnap-orange" size={20} />
                <Input
                  type="text"
                  placeholder="Enter your delivery address"
                  className="pl-10 bg-gray-50 border-gray-200"
                  value={address}
                  onChange={handleAddressChange}
                />
              </div>
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2 border-foodsnap-teal text-foodsnap-teal hover:bg-foodsnap-teal hover:text-white"
                onClick={handleGeolocation}
                disabled={isLocating}
              >
                <Navigation size={18} />
                {isLocating ? "Locating..." : "Use my location"}
              </Button>
            </div>
          </div>
          
          <Button className="bg-foodsnap-orange hover:bg-foodsnap-orange/90 text-white px-6 py-6 rounded-full text-lg">
            Find Restaurants Near You
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
