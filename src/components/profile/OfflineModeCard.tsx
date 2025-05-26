
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WifiOffIcon } from 'lucide-react';

interface OfflineModeCardProps {
  isOffline: boolean;
  offlineTimeRemaining: number;
  onStartOfflineMode: () => void;
}

const OfflineModeCard = ({ isOffline, offlineTimeRemaining, onStartOfflineMode }: OfflineModeCardProps) => {
  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="flutter-card mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <WifiOffIcon className="h-5 w-5" />
          Offline Mode
        </CardTitle>
        <CardDescription>
          Access limited app features for 15 minutes without internet connection
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isOffline ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">
                Offline mode active
              </p>
              <p className="text-sm text-muted-foreground">
                Time remaining: {formatTimeRemaining(offlineTimeRemaining)}
              </p>
            </div>
            <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 transition-all duration-1000"
                style={{ width: `${(offlineTimeRemaining / (15 * 60)) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <Button 
            onClick={onStartOfflineMode}
            variant="outline"
            className="flutter-button"
          >
            <WifiOffIcon className="h-4 w-4 mr-2" />
            Start Offline Mode
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default OfflineModeCard;
