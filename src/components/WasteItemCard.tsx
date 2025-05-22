
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, RecycleIcon, AlertCircleIcon, SmartphoneIcon, MonitorIcon, LaptopIcon, PrinterIcon, HeadphonesIcon } from 'lucide-react';

export type WasteType = 'Mobile' | 'Computer' | 'Laptop' | 'Printer' | 'Accessories' | 'Other';

interface WasteItemCardProps {
  title: string;
  type: WasteType;
  condition: 'Working' | 'Damaged' | 'Not Working';
  imageUrl?: string;
  onClick?: () => void;
}

const getItemIcon = (type: WasteType) => {
  switch (type) {
    case 'Mobile': return <SmartphoneIcon className="h-5 w-5" />;
    case 'Computer': return <MonitorIcon className="h-5 w-5" />;
    case 'Laptop': return <LaptopIcon className="h-5 w-5" />;
    case 'Printer': return <PrinterIcon className="h-5 w-5" />;
    case 'Accessories': return <HeadphonesIcon className="h-5 w-5" />;
    default: return <RecycleIcon className="h-5 w-5" />;
  }
};

const getConditionColor = (condition: string) => {
  switch (condition) {
    case 'Working': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'Damaged': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'Not Working': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  }
};

const WasteItemCard = ({ title, type, condition, imageUrl, onClick }: WasteItemCardProps) => {
  const defaultImage = "https://placehold.co/300x200/e2e8f0/64748b?text=Electronic+Waste";
  
  return (
    <Card className="flutter-card overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl || defaultImage} 
          alt={title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
        <Badge 
          variant="secondary" 
          className="absolute top-3 left-3 flex items-center gap-1"
        >
          {getItemIcon(type)}
          {type}
        </Badge>
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${getConditionColor(condition)}`}>
          <AlertCircleIcon className="h-3 w-3" />
          {condition}
        </div>
      </div>
      <CardContent className="pt-4">
        <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
      </CardContent>
      <CardFooter className="pt-2 pb-4">
        <Button 
          onClick={onClick} 
          variant="outline" 
          className="w-full flutter-button justify-between bg-gradient-to-r from-eco-green-light/10 to-eco-blue-light/10"
        >
          <span>View Details</span>
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WasteItemCard;
