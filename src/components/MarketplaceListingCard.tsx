
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Gift, 
  MapPin, 
  Calendar, 
  SmartphoneIcon, 
  MonitorIcon, 
  LaptopIcon, 
  PrinterIcon, 
  HeadphonesIcon, 
  PackageIcon,
  MessageCircle
} from 'lucide-react';

interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  condition: string;
  isFree: boolean;
  location: string;
  createdAt: Date;
  imageUrl: string;
  seller: string;
}

interface MarketplaceListingCardProps {
  listing: MarketplaceListing;
  onContactSeller: () => void;
}

const getItemIcon = (type: string) => {
  switch (type) {
    case 'Mobile': return <SmartphoneIcon className="h-4 w-4" />;
    case 'Computer': return <MonitorIcon className="h-4 w-4" />;
    case 'Laptop': return <LaptopIcon className="h-4 w-4" />;
    case 'Printer': return <PrinterIcon className="h-4 w-4" />;
    case 'Accessories': return <HeadphonesIcon className="h-4 w-4" />;
    default: return <PackageIcon className="h-4 w-4" />;
  }
};

const getConditionColor = (condition: string) => {
  switch (condition) {
    case 'Like New': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'Very Good': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'Good': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'Fair': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
    case 'Poor': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  }
};

const MarketplaceListingCard = ({ listing, onContactSeller }: MarketplaceListingCardProps) => {
  return (
    <Card className="flutter-card overflow-hidden h-full flex flex-col">
      <div className="relative">
        <img 
          src={listing.imageUrl} 
          alt={listing.title} 
          className="w-full h-48 object-cover transition-transform hover:scale-105 duration-500"
        />
        {listing.isFree && (
          <Badge 
            className="absolute top-3 left-3 bg-primary hover:bg-primary/90 text-white flex items-center gap-1"
          >
            <Gift className="h-3 w-3" />
            FREE
          </Badge>
        )}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${getConditionColor(listing.condition)}`}>
          {listing.condition}
        </div>
      </div>
      
      <CardContent className="pt-4 flex-1">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-lg font-semibold line-clamp-2">{listing.title}</h3>
          {!listing.isFree && (
            <span className="text-lg font-bold">R{listing.price}</span>
          )}
        </div>
        
        <p className="text-muted-foreground line-clamp-2 text-sm mb-3">{listing.description}</p>
        
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="flex items-center gap-1">
            {getItemIcon(listing.type)}
            {listing.type}
          </Badge>
          
          <Badge variant="outline" className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {listing.location}
          </Badge>
          
          <Badge variant="outline" className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDistanceToNow(listing.createdAt, { addSuffix: true })}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 border-t mt-auto">
        <div className="w-full pt-3">
          <div className="text-sm mb-3">
            Listed by <span className="font-medium">{listing.seller}</span>
          </div>
          <Button 
            onClick={onContactSeller}
            className="w-full flutter-button justify-center"
            variant="default"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Seller
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MarketplaceListingCard;
