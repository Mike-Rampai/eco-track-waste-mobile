import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface RealtimeAIProps {
  messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }>;
  onNewMessage: (message: { role: 'user' | 'assistant'; content: string; timestamp: Date }) => void;
}

export const RealtimeAI: React.FC<RealtimeAIProps> = ({ messages, onNewMessage }) => {
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    // Set up real-time subscription for AI responses
    const channel = supabase
      .channel('ai-chat-updates')
      .on('broadcast', { event: 'ai-typing' }, (payload) => {
        setIsTyping(payload.typing);
      })
      .on('broadcast', { event: 'ai-response' }, (payload) => {
        onNewMessage({
          role: 'assistant',
          content: payload.message,
          timestamp: new Date(payload.timestamp)
        });
        setIsTyping(false);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onNewMessage]);

  // Typing indicator
  if (isTyping) {
    return (
      <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg max-w-xs">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">AI is typing...</span>
      </div>
    );
  }

  return null;
};

export default RealtimeAI;