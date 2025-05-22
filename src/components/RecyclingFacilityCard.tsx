
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react';

export interface RecyclingFacility {
  id: string;
  name: string;
  address: string;
  distance: number;
  phoneNumber: string;
  operatingHours: string;
  acceptedItems: string[];
  website?: string;
}

interface RecyclingFacilityCardProps {
  facility: RecyclingFacility;
}

const RecyclingFacilityCard = ({ facility }: RecyclingFacilityCardProps) => {
  return (
    <Card className="flutter-card overflow-hidden h-full flex flex-col">
      <CardContent className="pt-4 flex-1">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-lg font-semibold">{facility.name}</h3>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {facility.distance.toFixed(1)} km away
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{facility.address}</p>
          </div>

          <div className="flex items-start gap-2">
            <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{facility.phoneNumber}</p>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{facility.operatingHours}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Accepted items:</p>
          <div className="flex flex-wrap gap-2">
            {facility.acceptedItems.map((item, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 border-t mt-auto">
        <div className="w-full pt-3 flex gap-2">
          <Button
            className="w-full flutter-button justify-center"
            variant="outline"
            onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(facility.address)}`, '_blank')}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Directions
          </Button>
          
          {facility.website && (
            <Button
              className="flutter-button justify-center"
              variant="ghost"
              onClick={() => window.open(facility.website, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default RecyclingFacilityCard;
