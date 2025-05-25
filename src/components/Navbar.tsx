
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RecycleIcon, PlusCircleIcon, CalendarIcon, InfoIcon, ShoppingBagIcon, MapPinIcon, WalletIcon, BotIcon, LogOutIcon, UserIcon, LockIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const ProtectedNavButton = ({ to, children, icon: Icon, label }: { 
    to: string; 
    children: React.ReactNode; 
    icon: React.ComponentType<any>; 
    label: string;
  }) => {
    if (user) {
      return (
        <Link to={to}>
          <Button 
            variant={isActive(to) ? "default" : "ghost"}
            className="flutter-button whitespace-nowrap"
            size="sm"
          >
            <Icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden sm:inline">{children}</span>
            <span className="sm:hidden text-xs">{children.toString().split(' ')[0]}</span>
          </Button>
        </Link>
      );
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/auth">
              <Button 
                variant="ghost"
                className="flutter-button opacity-60 whitespace-nowrap"
                size="sm"
              >
                <LockIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">{children}</span>
                <span className="sm:hidden text-xs">{children.toString().split(' ')[0]}</span>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sign in to access {label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 flex flex-col sm:flex-row justify-between items-center">
        <Link to="/" className="flex items-center mb-2 sm:mb-0">
          <RecycleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-eco-green-dark mr-2" strokeWidth={1.5} />
          <span className="text-lg sm:text-2xl font-bold flutter-text-gradient">E-Cycle</span>
        </Link>
        
        <nav className="flex overflow-x-auto gap-1 sm:gap-2 items-center w-full sm:w-auto pb-safe scrollbar-hide">
          <Link to="/">
            <Button 
              variant={isActive('/') ? "default" : "ghost"}
              className="flutter-button whitespace-nowrap"
              size="sm"
            >
              <span className="text-xs sm:text-sm">Home</span>
            </Button>
          </Link>
          
          <ProtectedNavButton 
            to="/register" 
            icon={PlusCircleIcon} 
            label="item registration"
          >
            Register Item
          </ProtectedNavButton>

          <ProtectedNavButton 
            to="/request" 
            icon={CalendarIcon} 
            label="collection requests"
          >
            Collection
          </ProtectedNavButton>

          <ProtectedNavButton 
            to="/marketplace" 
            icon={ShoppingBagIcon} 
            label="marketplace"
          >
            Marketplace
          </ProtectedNavButton>

          <ProtectedNavButton 
            to="/wallet" 
            icon={WalletIcon} 
            label="wallet"
          >
            Wallet
          </ProtectedNavButton>
          
          <Link to="/locator">
            <Button 
              variant={isActive('/locator') ? "default" : "ghost"}
              className="flutter-button whitespace-nowrap"
              size="sm"
            >
              <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Recycling Map</span>
              <span className="sm:hidden text-xs">Map</span>
            </Button>
          </Link>
          <Link to="/ai-assistant">
            <Button 
              variant={isActive('/ai-assistant') ? "default" : "ghost"}
              className="flutter-button whitespace-nowrap"
              size="sm"
            >
              <BotIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">AI Assistant</span>
              <span className="sm:hidden text-xs">AI</span>
            </Button>
          </Link>
          <Link to="/information">
            <Button 
              variant={isActive('/information') ? "default" : "ghost"}
              className="flutter-button whitespace-nowrap"
              size="sm"
            >
              <InfoIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Info</span>
              <span className="sm:hidden text-xs">Info</span>
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flutter-button whitespace-nowrap">
                  <UserIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden sm:inline">Account</span>
                  <span className="sm:hidden text-xs">User</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={signOut}>
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="default" size="sm" className="flutter-button whitespace-nowrap">
                <span className="text-xs sm:text-sm">Sign In</span>
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
