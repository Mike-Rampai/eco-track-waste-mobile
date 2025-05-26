
import React from 'react';
import { WifiOffIcon, ClockIcon } from 'lucide-react';
import { useOfflineMode } from '@/hooks/useOfflineMode';

const OfflineIndicator = () => {
  const { isOffline, offlineTimeRemaining } = useOfflineMode();

  if (!isOffline) return null;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-16 right-4 z-40 bg-orange-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
      <WifiOffIcon className="h-4 w-4" />
      <span>Offline Mode</span>
      <div className="flex items-center gap-1">
        <ClockIcon className="h-3 w-3" />
        <span>{formatTime(offlineTimeRemaining)}</span>
      </div>
    </div>
  );
};

export default OfflineIndicator;
