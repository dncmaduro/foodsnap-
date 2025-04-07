
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Promotion data
const promotions = [
  {
    id: 1,
    title: "50% OFF Your First Order",
    description: "Use code WELCOME50 at checkout",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    code: "WELCOME50",
    expiryDate: "2025-06-30",
    backgroundColor: "#FEF3E7"
  },
  {
    id: 2,
    title: "Free Delivery All Weekend",
    description: "On orders over $20",
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    code: "FREEWEEKEND",
    expiryDate: "2025-05-31",
    backgroundColor: "#E6F7F6"
  },
  {
    id: 3,
    title: "Buy One Get One Free",
    description: "On select menu items",
    image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    code: "BOGOFREE",
    expiryDate: "2025-06-15",
    backgroundColor: "#F5E7FF"
  }
];

const Promotions = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Current Promotions</h2>
          <p className="text-foodsnap-lightText">Special deals just for you</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <div 
              key={promo.id} 
              className="rounded-lg overflow-hidden shadow-md hover-scale card-shadow"
              style={{ backgroundColor: promo.backgroundColor }}
            >
              <div className="relative h-44 overflow-hidden">
                <img 
                  src={promo.image} 
                  alt={promo.title} 
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
              
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
                <p className="mb-4 text-gray-700">{promo.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="bg-white py-1 px-3 rounded-md border border-gray-200">
                    <span className="text-sm font-medium text-foodsnap-orange">{promo.code}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    Expires: {new Date(promo.expiryDate).toLocaleDateString()}
                  </p>
                </div>
                
                <Button className="w-full mt-4 bg-white border-none text-foodsnap-darkText hover:bg-gray-100 flex items-center justify-center gap-2 group">
                  <span>Redeem Offer</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Button variant="outline" className="text-foodsnap-orange border-foodsnap-orange hover:bg-foodsnap-orange hover:text-white">
            View All Promotions
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Promotions;
