
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface OfflineSession {
  id: string;
  user_id: string;
  started_at: string;
  expires_at: string;
  is_active: boolean;
}

export const useOfflineMode = () => {
  const { user } = useAuth();
  const [isOffline, setIsOffline] = useState(false);
  const [offlineTimeRemaining, setOfflineTimeRemaining] = useState(0);
  const [currentSession, setCurrentSession] = useState<OfflineSession | null>(null);

  const checkActiveSession = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('offline_sessions' as any)
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error checking offline session:', error);
        return;
      }

      if (data) {
        const session = data as unknown as OfflineSession;
        setCurrentSession(session);
        setIsOffline(true);
        const expiresAt = new Date(session.expires_at).getTime();
        const now = new Date().getTime();
        const timeLeft = Math.max(0, Math.floor((expiresAt - now) / 1000));
        setOfflineTimeRemaining(timeLeft);
      } else {
        setIsOffline(false);
        setOfflineTimeRemaining(0);
        setCurrentSession(null);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [user]);

  const startOfflineMode = async () => {
    if (!user) return;

    try {
      // Deactivate any existing sessions
      await supabase
        .from('offline_sessions' as any)
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('is_active', true);

      // Create new session
      const { data, error } = await supabase
        .from('offline_sessions' as any)
        .insert([{
          user_id: user.id,
          is_active: true,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error starting offline session:', error);
        return;
      }

      const session = data as unknown as OfflineSession;
      setCurrentSession(session);
      setIsOffline(true);
      setOfflineTimeRemaining(15 * 60); // 15 minutes in seconds
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const endOfflineMode = async () => {
    if (!currentSession) return;

    try {
      await supabase
        .from('offline_sessions' as any)
        .update({ is_active: false })
        .eq('id', currentSession.id);

      setIsOffline(false);
      setOfflineTimeRemaining(0);
      setCurrentSession(null);
    } catch (error) {
      console.error('Error ending offline session:', error);
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isOffline && offlineTimeRemaining > 0) {
      interval = setInterval(() => {
        setOfflineTimeRemaining((prev) => {
          if (prev <= 1) {
            endOfflineMode();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isOffline, offlineTimeRemaining]);

  // Check for active session on mount
  useEffect(() => {
    checkActiveSession();
  }, [checkActiveSession]);

  const getOfflineFeatures = () => {
    return {
      canViewInformation: true,
      canUseAIAssistant: true,
      canViewRecyclingMap: true,
      canRegisterItems: false,
      canScheduleCollection: false,
      canAccessMarketplace: false,
      canAccessWallet: false,
    };
  };

  return {
    isOffline,
    offlineTimeRemaining,
    startOfflineMode,
    endOfflineMode,
    getOfflineFeatures,
  };
};
