
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  RecycleIcon, 
  CalendarIcon, 
  InfoIcon, 
  PlusCircleIcon,
  ClockIcon, 
  BarChart3Icon,
  TreesIcon,
  GlobeIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import StatCard from '@/components/StatCard';
import WasteItemCard, { WasteType } from '@/components/WasteItemCard';

// Mock data for recently added items
const recentItems = [
  {
    id: 1,
    title: 'iPhone 11 Pro (Not Charging)',
    type: 'Mobile' as WasteType,
    condition: 'Damaged' as 'Working' | 'Damaged' | 'Not Working',
    imageUrl: 'https://placehold.co/300x200/e2e8f0/64748b?text=iPhone'
  },
  {
    id: 2,
    title: 'Dell XPS 15 Laptop',
    type: 'Laptop' as WasteType,
    condition: 'Working' as 'Working' | 'Damaged' | 'Not Working',
    imageUrl: 'https://placehold.co/300x200/e2e8f0/64748b?text=Laptop'
  },
  {
    id: 3,
    title: 'Old CRT Monitor',
    type: 'Computer' as WasteType,
    condition: 'Not Working' as 'Working' | 'Damaged' | 'Not Working',
    imageUrl: 'https://placehold.co/300x200/e2e8f0/64748b?text=Monitor'
  }
];

const Index = () => {
  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-r from-eco-green-light/10 to-eco-blue-light/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                <span className="flutter-text-gradient">Recycle</span> Your Electronics, 
                <span className="flutter-text-gradient"> Save</span> Our Planet
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Easy, responsible e-waste management for a sustainable future.
                Register your electronic waste and request a collection today!
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link to="/register">
                  <Button className="flutter-button px-6 py-6" size="lg">
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Register E-Waste
                  </Button>
                </Link>
                <Link to="/information">
                  <Button variant="outline" className="flutter-button px-6 py-6" size="lg">
                    <InfoIcon className="w-5 h-5 mr-2" />
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end relative">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-eco-green-dark/20 to-eco-blue-dark/20 rounded-3xl transform rotate-6"></div>
                <img 
                  src="https://placehold.co/600x400/e2e8f0/64748b?text=E-Waste+Management" 
                  alt="E-Waste Collection" 
                  className="relative z-10 rounded-3xl shadow-xl w-full"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-16 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-background"></div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Our <span className="flutter-text-gradient">Impact</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="E-Waste Collected" 
              value="5,732 kg" 
              icon={<RecycleIcon className="h-5 w-5" />} 
              description="Total electronic waste processed"
            />
            <StatCard 
              title="Collection Requests" 
              value="1,250+" 
              icon={<CalendarIcon className="h-5 w-5" />} 
              description="Successful pickup services"
            />
            <StatCard 
              title="CO₂ Reduced" 
              value="215 tons" 
              icon={<TreesIcon className="h-5 w-5" />} 
              description="Environmental impact"
            />
            <StatCard 
              title="Rare Materials Recovered" 
              value="87 kg" 
              icon={<GlobeIcon className="h-5 w-5" />} 
              description="Precious metals and rare earth elements"
            />
          </div>
        </div>
      </section>

      {/* Recent Items Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Recently Added Items</h2>
            <Link to="/register">
              <Button variant="ghost" className="flutter-button">
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                Add Your Item
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentItems.map((item) => (
              <WasteItemCard 
                key={item.id}
                title={item.title}
                type={item.type}
                condition={item.condition}
                imageUrl={item.imageUrl}
                onClick={() => console.log(`View details for ${item.title}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-eco-green-dark to-eco-blue-dark rounded-3xl overflow-hidden shadow-xl">
            <div className="px-8 py-16 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Dispose Your E-Waste?</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
                Schedule a pickup and we'll collect your electronic waste for proper recycling. 
                It's that simple!
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/request">
                  <Button className="bg-white text-eco-green-dark hover:bg-gray-100 flutter-button px-6 py-6" size="lg">
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    Request Collection
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 flutter-button px-6 py-6" size="lg">
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Register Items
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            How <span className="flutter-text-gradient">It Works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-eco-green-light/20 text-eco-green-dark rounded-full flex items-center justify-center mx-auto mb-6">
                <PlusCircleIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Register Your Items</h3>
              <p className="text-muted-foreground">Log your electronic devices that need disposal with details.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-eco-blue-light/20 text-eco-blue-dark rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Schedule Collection</h3>
              <p className="text-muted-foreground">Request a convenient time for us to collect your e-waste.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-eco-green-light/20 text-eco-green-dark rounded-full flex items-center justify-center mx-auto mb-6">
                <RecycleIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">We Recycle Properly</h3>
              <p className="text-muted-foreground">Your e-waste gets recycled following environmental standards.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
