
import { useState } from 'react';
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const [isLocating, setIsLocating] = useState(false);

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
            Món Ăn Ngon, <span className="text-foodsnap-orange">Giao Hàng Nhanh</span>
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl">
            Khám phá nhà hàng và đặt món ăn yêu thích của bạn được giao đến tận nơi.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
