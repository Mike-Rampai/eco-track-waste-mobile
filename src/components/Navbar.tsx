
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RecycleIcon, PlusCircleIcon, CalendarIcon, InfoIcon, ShoppingBagIcon, MapPinIcon, WalletIcon, BotIcon, LogOutIcon, UserIcon, LockIcon, SettingsIcon, ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useOfflineMode } from '@/hooks/useOfflineMode';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isOffline, getOfflineFeatures } = useOfflineMode();
  const offlineFeatures = getOfflineFeatures();

  const canGoBack = window.history.length > 1;
  const showBackButton = location.pathname !== '/';

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const ProtectedNavButton = ({ to, children, icon: Icon, label, offlineAllowed = false }: { 
    to: string; 
    children: React.ReactNode; 
    icon: React.ComponentType<any>; 
    label: string;
    offlineAllowed?: boolean;
  }) => {
    if (user) {
      const isDisabled = isOffline && !offlineAllowed;
      
      if (isDisabled) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost"
                  className="flutter-button opacity-50 whitespace-nowrap cursor-not-allowed"
                  size="sm"
                  disabled
                >
                  <LockIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden sm:inline">{children}</span>
                  <span className="sm:hidden text-xs">{children.toString().split(' ')[0]}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Not available in offline mode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }

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
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3 flex flex-col sm:flex-row justify-between items-center">
        <Link to="/" className="flex items-center mb-2 sm:mb-0">
          <RecycleIcon className="h-5 w-5 sm:h-7 sm:w-7 text-eco-green-dark mr-2" strokeWidth={1.5} />
          <span className="text-base sm:text-xl font-bold flutter-text-gradient">E-Cycle</span>
        </Link>
        
        <nav className="flex overflow-x-auto gap-1 items-center w-full sm:w-auto pb-safe scrollbar-hide">
          {showBackButton && (
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flutter-button whitespace-nowrap"
            >
              <ArrowLeftIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Back</span>
              <span className="sm:hidden text-xs">←</span>
            </Button>
          )}
          
          <Link to="/">
            <Button 
              variant={isActive('/') ? "default" : "ghost"}
              className="flutter-button whitespace-nowrap"
              size="sm"
            >
              <span className="text-xs">Home</span>
            </Button>
          </Link>
          
          <ProtectedNavButton 
            to="/register" 
            icon={PlusCircleIcon} 
            label="item registration"
            offlineAllowed={offlineFeatures.canRegisterItems}
          >
            Register
          </ProtectedNavButton>

          <ProtectedNavButton 
            to="/request" 
            icon={CalendarIcon} 
            label="collection requests"
            offlineAllowed={offlineFeatures.canScheduleCollection}
          >
            Collection
          </ProtectedNavButton>

          <ProtectedNavButton 
            to="/marketplace" 
            icon={ShoppingBagIcon} 
            label="marketplace"
            offlineAllowed={offlineFeatures.canAccessMarketplace}
          >
            Market
          </ProtectedNavButton>

          <ProtectedNavButton 
            to="/wallet" 
            icon={WalletIcon} 
            label="wallet"
            offlineAllowed={offlineFeatures.canAccessWallet}
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
              <span className="hidden sm:inline">Map</span>
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
              <span className="hidden sm:inline">AI</span>
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
              <span className="text-xs">Info</span>
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
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="default" size="sm" className="flutter-button whitespace-nowrap">
                <span className="text-xs">Sign In</span>
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
