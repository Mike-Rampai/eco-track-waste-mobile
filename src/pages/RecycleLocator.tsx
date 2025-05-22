
import React, { useState, useEffect } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin, Search, Loader2 } from 'lucide-react';
import RecyclingFacilityCard, { RecyclingFacility } from '@/components/RecyclingFacilityCard';

// Sample recycling facility data
const mockFacilities: RecyclingFacility[] = [
  {
    id: '1',
    name: 'Green E-Cycle Center',
    address: '123 Recycling Way, Cape Town',
    distance: 2.3,
    phoneNumber: '021-555-0123',
    operatingHours: 'Mon-Fri: 8am-5pm, Sat: 9am-2pm',
    acceptedItems: ['Computers', 'Phones', 'Batteries', 'Appliances'],
    website: 'https://example.com/green-ecycle',
  },
  {
    id: '2',
    name: 'Tech Reclaim Depot',
    address: '456 Electronics Ave, Johannesburg',
    distance: 3.7,
    phoneNumber: '011-555-0456',
    operatingHours: 'Mon-Sat: 9am-6pm',
    acceptedItems: ['Computers', 'TVs', 'Printers', 'Cables'],
    website: 'https://example.com/tech-reclaim',
  },
  {
    id: '3',
    name: 'Electro Waste Solutions',
    address: '789 Circuit Blvd, Durban',
    distance: 5.1,
    phoneNumber: '031-555-0789',
    operatingHours: 'Mon-Fri: 8:30am-4:30pm',
    acceptedItems: ['Batteries', 'Phones', 'Appliances', 'Cables'],
  },
  {
    id: '4',
    name: 'E-Waste Recovery Center',
    address: '321 Component Street, Pretoria',
    distance: 6.8,
    phoneNumber: '012-555-0321',
    operatingHours: 'Tue-Sat: 10am-5pm',
    acceptedItems: ['Computers', 'TVs', 'Phones', 'Appliances', 'Batteries'],
    website: 'https://example.com/ewaste-recovery',
  },
  {
    id: '5',
    name: 'CircuitBoard Recyclers',
    address: '654 Digital Road, Port Elizabeth',
    distance: 8.2,
    phoneNumber: '041-555-0654',
    operatingHours: 'Mon-Fri: 9am-5pm',
    acceptedItems: ['Computers', 'Circuit Boards', 'Phones'],
    website: 'https://example.com/circuitboard',
  },
];

// Function to calculate the "real" distance based on the user's location
// In a real app, this would use an actual geolocation API
const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number = -33.918861, 
  lon2: number = 18.423300
): number => {
  // Simple random distance simulation
  // In a real app, you would use the Haversine formula or a mapping API
  return parseFloat((Math.random() * 10 + 1).toFixed(1));
};

const RecycleLocator = () => {
  const { toast } = useToast();
  const { location, error, loading } = useGeolocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemFilter, setItemFilter] = useState<string>('All');
  const [distanceSort, setDistanceSort] = useState<'asc' | 'desc'>('asc');
  const [facilities, setFacilities] = useState<RecyclingFacility[]>([]);

  // Initialize facilities with calculated distances
  useEffect(() => {
    if (location) {
      const facilitiesWithDistance = mockFacilities.map(facility => ({
        ...facility,
        distance: calculateDistance(location.latitude, location.longitude)
      }));
      setFacilities(facilitiesWithDistance);
      
      toast({
        title: "Location Found",
        description: "Showing recycling centers near your location.",
      });
    }
  }, [location, toast]);

  // Handle geolocation errors
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Location Error",
        description: error,
      });
      
      // Fall back to default data if there's a location error
      setFacilities(mockFacilities);
    }
  }, [error, toast]);

  // Filter and sort facilities
  const filteredFacilities = facilities
    .filter(facility => {
      const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           facility.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesItemFilter = itemFilter === 'All' || 
                               facility.acceptedItems.some(item => item.toLowerCase() === itemFilter.toLowerCase());
      
      return matchesSearch && matchesItemFilter;
    })
    .sort((a, b) => {
      return distanceSort === 'asc' ? a.distance - b.distance : b.distance - a.distance;
    });

  // Get unique item types for filtering
  const uniqueItemTypes = Array.from(
    new Set(mockFacilities.flatMap(f => f.acceptedItems))
  ).sort();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">E-Waste Recycling Locator</h1>
        <p className="text-muted-foreground">
          Find e-waste recycling facilities near you to responsibly dispose of your electronic waste
        </p>
      </div>

      {/* Search and filter controls */}
      <div className="bg-card rounded-lg shadow-sm border p-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or address..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={itemFilter} onValueChange={setItemFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Item Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Items</SelectItem>
                {uniqueItemTypes.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={distanceSort} onValueChange={(value) => setDistanceSort(value as 'asc' | 'desc')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by Distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Nearest First</SelectItem>
                <SelectItem value="desc">Farthest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Location status */}
        <div className="mt-4 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          {loading ? (
            <div className="flex items-center text-muted-foreground">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Getting your location...
            </div>
          ) : location ? (
            <span className="text-sm text-muted-foreground">
              Using your current location
              <Button 
                variant="link" 
                className="text-sm h-auto p-0 ml-2" 
                onClick={() => window.location.reload()}
              >
                Refresh
              </Button>
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              Location unavailable. Showing default results.
              <Button 
                variant="link" 
                className="text-sm h-auto p-0 ml-2" 
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </span>
          )}
        </div>
      </div>

      {/* Results section */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Results</h2>
        <Badge variant="outline" className="text-muted-foreground">
          {filteredFacilities.length} facilities found
        </Badge>
      </div>

      {loading && facilities.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredFacilities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((facility) => (
            <RecyclingFacilityCard key={facility.id} facility={facility} />
          ))}
        </div>
      ) : (
        <div className="text-center p-12 border rounded-lg">
          <h3 className="text-lg font-medium mb-2">No recycling facilities found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setItemFilter('All');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecycleLocator;
