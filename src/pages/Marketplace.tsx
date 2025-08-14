import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Filter, Gift, Loader2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MarketplaceListingForm from '@/components/MarketplaceListingForm';
import MarketplaceListingCard from '@/components/MarketplaceListingCard';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  condition: string;
  location: string;
  imageUrl: string;
  isFree: boolean;
  seller: string;
  createdAt: Date;
}

const Marketplace = () => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string | undefined>();
  const [filterCondition, setFilterCondition] = useState<string | undefined>();
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();

  // Fetch listings from Supabase
  const fetchListings = async () => {
    try {
      const { data: listingsData, error } = await supabase
        .from('marketplace_listings')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch user profiles separately
      const userIds = listingsData?.map(listing => listing.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      // Transform data to match component expectations
      const transformedListings = listingsData?.map(listing => {
        const profile = profilesData?.find(p => p.id === listing.user_id);
        return {
          ...listing,
          seller: profile?.full_name || 'Anonymous',
          imageUrl: listing.image_url,
          isFree: listing.is_free,
          createdAt: new Date(listing.created_at),
        };
      }) || [];

      setListings(transformedListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast({
        title: "Error",
        description: "Failed to load marketplace listings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchListings();

    const channel = supabase
      .channel('marketplace-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'marketplace_listings'
        },
        () => {
          fetchListings(); // Refetch when any change occurs
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const handleAddListing = async (newListing: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a listing",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('marketplace_listings')
        .insert({
          user_id: user.id,
          title: newListing.title,
          description: newListing.description,
          price: newListing.price,
          type: newListing.type,
          condition: newListing.condition,
          location: newListing.location,
          image_url: newListing.imageUrl,
          is_free: newListing.isFree || newListing.price === 0,
        });

      if (error) throw error;

      setIsDialogOpen(false);
      toast({
        title: "Listing Added",
        description: "Your item has been listed successfully!",
      });
    } catch (error) {
      console.error('Error adding listing:', error);
      toast({
        title: "Error",
        description: "Failed to add listing. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Filter listings based on selected filters and search query
  const filteredListings = listings.filter(listing => {
    // Filter by type
    if (filterType && listing.type !== filterType) return false;
    
    // Filter by condition
    if (filterCondition && listing.condition !== filterCondition) return false;
    
    // Filter by free items
    if (showFreeOnly && !listing.isFree) return false;
    
    // Filter by search query
    if (searchQuery && !listing.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !(listing.description && listing.description.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    
    return true;
  });

  const handleContactSeller = (listingId: string) => {
    toast({
      title: "Contact request sent",
      description: "The seller has been notified of your interest. They will contact you soon.",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading marketplace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flutter-text-gradient">Electronics Marketplace</h1>
          <p className="text-muted-foreground mt-2">Buy, sell or give away electronics in your community</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0 flutter-button" size="lg">
              <PlusCircle className="h-4 w-4 mr-2" />
              List Your Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>List an item for sale or donation</DialogTitle>
              <DialogDescription>
                Fill in the details about the electronic item you want to list on the marketplace.
              </DialogDescription>
            </DialogHeader>
            <MarketplaceListingForm onSubmit={handleAddListing} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Filters */}
      <div className="bg-muted/50 p-4 rounded-lg mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input 
            placeholder="Search listings..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flutter-input"
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select onValueChange={setFilterType} value={filterType}>
            <SelectTrigger className="w-[150px] flutter-input">
              <SelectValue placeholder="Device type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={undefined}>All Types</SelectItem>
              <SelectItem value="Mobile">Mobile Phones</SelectItem>
              <SelectItem value="Computer">Computers</SelectItem>
              <SelectItem value="Laptop">Laptops</SelectItem>
              <SelectItem value="Printer">Printers</SelectItem>
              <SelectItem value="Accessories">Accessories</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          
          <Select onValueChange={setFilterCondition} value={filterCondition}>
            <SelectTrigger className="w-[150px] flutter-input">
              <SelectValue placeholder="Condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={undefined}>All Conditions</SelectItem>
              <SelectItem value="Like New">Like New</SelectItem>
              <SelectItem value="Very Good">Very Good</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Fair">Fair</SelectItem>
              <SelectItem value="Poor">Poor</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant={showFreeOnly ? "default" : "outline"} 
            onClick={() => setShowFreeOnly(!showFreeOnly)}
            className="flutter-button"
          >
            <Gift className="h-4 w-4 mr-2" />
            Free Items {showFreeOnly ? '✓' : ''}
          </Button>
        </div>
      </div>
      
      {/* Listings grid */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <MarketplaceListingCard 
              key={listing.id} 
              listing={listing}
              onContactSeller={() => handleContactSeller(listing.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/30 rounded-lg">
          <h3 className="text-xl font-medium mb-2">No listings found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or add a new listing.</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;