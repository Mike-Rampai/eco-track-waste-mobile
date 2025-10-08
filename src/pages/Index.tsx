
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RecycleIcon, SmartphoneIcon, LaptopIcon, TruckIcon, MapPinIcon, ShoppingBagIcon, WalletIcon, UserPlusIcon, ArrowRightIcon } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDevices: 0,
    totalUsers: 0,
    co2Saved: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total devices from e_waste_items
        const { count: devicesCount } = await supabase
          .from('e_waste_items')
          .select('*', { count: 'exact', head: true });

        // Fetch total users from profiles
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Calculate CO2 saved (estimated 15kg per device)
        const co2PerDevice = 15;
        const totalCo2 = (devicesCount || 0) * co2PerDevice;

        setStats({
          totalDevices: devicesCount || 0,
          totalUsers: usersCount || 0,
          co2Saved: totalCo2
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Subscribe to real-time updates
    const devicesChannel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'e_waste_items'
        },
        () => fetchStats()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(devicesChannel);
    };
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-green-light/10 to-eco-blue-light/10">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center fade-in">
        <div className="container mx-auto max-w-4xl">
          <RecycleIcon className="h-16 w-16 text-eco-green-dark mx-auto mb-6" strokeWidth={1.5} />
          <h1 className="text-5xl font-bold mb-6 flutter-text-gradient">
            Sustainable E-Waste Management
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the circular economy revolution. Register your electronic devices, schedule collections, 
            and earn rewards while protecting our planet.
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/auth">
                <Button size="lg" className="flutter-button">
                  <UserPlusIcon className="h-5 w-5 mr-2" />
                  Get Started - Sign Up Free
                </Button>
              </Link>
              <Link to="/information">
                <Button variant="outline" size="lg" className="flutter-button">
                  Learn More
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register">
                <Button size="lg" className="flutter-button">
                  <RecycleIcon className="h-5 w-5 mr-2" />
                  Register Your First Item
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="outline" size="lg" className="flutter-button">
                  <ShoppingBagIcon className="h-4 w-4 mr-2" />
                  Explore Marketplace
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatCard
              title="Devices Recycled"
              value={loading ? "..." : formatNumber(stats.totalDevices)}
              description="Electronic devices properly recycled"
              icon={<RecycleIcon className="h-8 w-8" />}
            />
            <StatCard
              title="CO₂ Saved"
              value={loading ? "..." : `${formatNumber(stats.co2Saved)} kg`}
              description="Carbon emissions prevented"
              icon={<SmartphoneIcon className="h-8 w-8" />}
            />
            <StatCard
              title="Active Users"
              value={loading ? "..." : formatNumber(stats.totalUsers)}
              description="Community members making a difference"
              icon={<LaptopIcon className="h-8 w-8" />}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">How E-Cycle Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="flutter-card text-center">
              <CardHeader>
                <RecycleIcon className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Register Items</CardTitle>
                <CardDescription>
                  {user ? "Upload details and photos of your electronic devices ready for recycling." : "Sign in to register your electronic devices for recycling."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user ? (
                  <Link to="/register">
                    <Button className="flutter-button w-full">
                      Register Now
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth">
                    <Button className="flutter-button w-full">
                      Sign In to Register
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            <Card className="flutter-card text-center">
              <CardHeader>
                <TruckIcon className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Schedule Collection</CardTitle>
                <CardDescription>
                  {user ? "Book a convenient pickup time and our certified collectors will come to you." : "Sign in to schedule convenient pickup times for your devices."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user ? (
                  <Link to="/request">
                    <Button className="flutter-button w-full">
                      Schedule Pickup
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth">
                    <Button className="flutter-button w-full">
                      Sign In to Schedule
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            <Card className="flutter-card text-center">
              <CardHeader>
                <WalletIcon className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Earn Rewards</CardTitle>
                <CardDescription>
                  {user ? "Get eco-points and cash rewards for your contribution to sustainable recycling." : "Sign in to earn rewards and track your environmental impact."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user ? (
                  <Link to="/wallet">
                    <Button className="flutter-button w-full">
                      View Wallet
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth">
                    <Button className="flutter-button w-full">
                      Sign In for Rewards
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Public Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Without Signing In</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="flutter-card">
              <CardHeader>
                <MapPinIcon className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Find Recycling Centers</CardTitle>
                <CardDescription>
                  Locate certified e-waste recycling facilities near you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/locator">
                  <Button variant="outline" className="flutter-button w-full">
                    View Map
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="flutter-card">
              <CardHeader>
                <RecycleIcon className="h-8 w-8 text-primary mb-2" />
                <CardTitle>AI Assistant</CardTitle>
                <CardDescription>
                  Get expert advice on e-waste disposal and recycling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/ai-assistant">
                  <Button variant="outline" className="flutter-button w-full">
                    Ask AI
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 px-4 bg-primary/5">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of users who are already contributing to a more sustainable future. 
              Sign up now and start your e-waste recycling journey.
            </p>
            <Link to="/auth">
              <Button size="lg" className="flutter-button">
                <UserPlusIcon className="h-5 w-5 mr-2" />
                Sign Up Free Today
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
