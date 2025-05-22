
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Filter, Gift } from 'lucide-react';
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

// Sample data for marketplace listings
const SAMPLE_LISTINGS = [
  {
    id: '1',
    title: 'iPhone 11 Pro',
    description: 'Good condition, minor scratches on screen. Battery health at 85%.',
    price: 350,
    type: 'Mobile',
    condition: 'Good',
    isFree: false,
    location: 'Manhattan, NY',
    createdAt: new Date('2025-05-15'),
    imageUrl: 'https://placehold.co/400x300/e2e8f0/64748b?text=iPhone+11+Pro',
    seller: 'Alex Johnson'
  },
  {
    id: '2',
    title: 'Dell XPS 15 Laptop',
    description: 'Powerful laptop with 16GB RAM and 512GB SSD. Perfect for developers.',
    price: 800,
    type: 'Laptop',
    condition: 'Very Good',
    isFree: false,
    location: 'Brooklyn, NY',
    createdAt: new Date('2025-05-18'),
    imageUrl: 'https://placehold.co/400x300/e2e8f0/64748b?text=Dell+XPS+15',
    seller: 'Jordan Smith'
  },
  {
    id: '3',
    title: 'Free - Old HP Monitor',
    description: '24" monitor, still works great. Free to anyone who can pick it up.',
    price: 0,
    type: 'Computer',
    condition: 'Fair',
    isFree: true,
    location: 'Queens, NY',
    createdAt: new Date('2025-05-20'),
    imageUrl: 'https://placehold.co/400x300/e2e8f0/64748b?text=HP+Monitor',
    seller: 'Morgan Lee'
  },
  {
    id: '4',
    title: 'Logitech Keyboard and Mouse',
    description: 'Wireless combo, barely used. MX Keys keyboard and MX Master 3 mouse.',
    price: 120,
    type: 'Accessories',
    condition: 'Like New',
    isFree: false,
    location: 'Bronx, NY',
    createdAt: new Date('2025-05-21'),
    imageUrl: 'https://placehold.co/400x300/e2e8f0/64748b?text=Logitech+Setup',
    seller: 'Jamie Rivera'
  }
];

const Marketplace = () => {
  const [listings, setListings] = useState(SAMPLE_LISTINGS);
  const [filterType, setFilterType] = useState<string | undefined>();
  const [filterCondition, setFilterCondition] = useState<string | undefined>();
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleAddListing = (newListing: any) => {
    const listingWithId = {
      ...newListing,
      id: `${listings.length + 1}`,
      createdAt: new Date(),
      seller: 'You' // In a real app, this would be the current user's name
    };
    setListings([listingWithId, ...listings]);
    setIsDialogOpen(false);
    toast({
      title: "Listing created successfully",
      description: "Your item has been added to the marketplace.",
    });
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
        !listing.description.toLowerCase().includes(searchQuery.toLowerCase())) {
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
