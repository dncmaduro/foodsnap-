
import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeaturedRestaurants from '@/components/FeaturedRestaurants';
import PopularDishes from '@/components/PopularDishes';
import Recommendations from '@/components/Recommendations';
import Footer from '@/components/Footer';

const Index = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow">
        <HeroSection />
        <FeaturedRestaurants />
        <PopularDishes />
        <Recommendations />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
