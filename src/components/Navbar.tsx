
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RecycleIcon, PlusCircleIcon, CalendarIcon, InfoIcon, ShoppingBagIcon, MapPinIcon, WalletIcon, BotIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <Link to="/" className="flex items-center mb-4 sm:mb-0">
          <RecycleIcon className="h-8 w-8 text-eco-green-dark mr-2" strokeWidth={1.5} />
          <span className="text-2xl font-bold flutter-text-gradient">E-Cycle</span>
        </Link>
        
        <nav className="flex flex-wrap justify-center gap-2">
          <Link to="/">
            <Button 
              variant={isActive('/') ? "default" : "ghost"}
              className="flutter-button"
              size="sm"
            >
              Home
            </Button>
          </Link>
          <Link to="/register">
            <Button 
              variant={isActive('/register') ? "default" : "ghost"}
              className="flutter-button"
              size="sm"
            >
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Register Item
            </Button>
          </Link>
          <Link to="/request">
            <Button 
              variant={isActive('/request') ? "default" : "ghost"}
              className="flutter-button"
              size="sm"
            >
              <CalendarIcon className="h-4 w-4 mr-1" />
              Collection
            </Button>
          </Link>
          <Link to="/marketplace">
            <Button 
              variant={isActive('/marketplace') ? "default" : "ghost"}
              className="flutter-button"
              size="sm"
            >
              <ShoppingBagIcon className="h-4 w-4 mr-1" />
              Marketplace
            </Button>
          </Link>
          <Link to="/locator">
            <Button 
              variant={isActive('/locator') ? "default" : "ghost"}
              className="flutter-button"
              size="sm"
            >
              <MapPinIcon className="h-4 w-4 mr-1" />
              Recycling Map
            </Button>
          </Link>
          <Link to="/wallet">
            <Button 
              variant={isActive('/wallet') ? "default" : "ghost"}
              className="flutter-button"
              size="sm"
            >
              <WalletIcon className="h-4 w-4 mr-1" />
              Wallet
            </Button>
          </Link>
          <Link to="/ai-assistant">
            <Button 
              variant={isActive('/ai-assistant') ? "default" : "ghost"}
              className="flutter-button"
              size="sm"
            >
              <BotIcon className="h-4 w-4 mr-1" />
              AI Assistant
            </Button>
          </Link>
          <Link to="/information">
            <Button 
              variant={isActive('/information') ? "default" : "ghost"}
              className="flutter-button"
              size="sm"
            >
              <InfoIcon className="h-4 w-4 mr-1" />
              Info
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
