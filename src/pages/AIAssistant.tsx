
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BotIcon, SendIcon, UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import RealtimeAI from '@/components/RealtimeAI';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Assistant. I can help you with any questions on topics like technology, science, e-waste management, general knowledge, and much more. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Predefined responses for common e-waste questions
  const getAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('smartphone') || lowerQuestion.includes('phone') || lowerQuestion.includes('mobile')) {
      return "For smartphones and mobile phones:\n\n1. Remove personal data and perform a factory reset\n2. Remove the battery if possible\n3. Take to certified e-waste recyclers or manufacturer take-back programs\n4. Many retailers offer trade-in programs\n5. Never throw in regular trash - phones contain valuable metals like gold, silver, and rare earth elements\n\nSmartphones can be refurbished and reused, or materials can be recovered for new electronics.";
    }
    
    if (lowerQuestion.includes('laptop') || lowerQuestion.includes('computer') || lowerQuestion.includes('pc')) {
      return "For laptops and computers:\n\n1. Back up important data and wipe the hard drive completely\n2. Remove batteries if possible\n3. Donate if still functional to schools or charities\n4. Take to certified e-waste recycling centers\n5. Consider manufacturer take-back programs\n\nComputers contain valuable materials like copper, aluminum, and precious metals that can be recovered and reused.";
    }
    
    if (lowerQuestion.includes('battery') || lowerQuestion.includes('batteries')) {
      return "For batteries:\n\n1. Never throw batteries in regular trash\n2. Sort by type: alkaline, lithium-ion, lead-acid, etc.\n3. Take to designated battery collection points\n4. Many retailers have battery drop-off programs\n5. Lithium-ion batteries (from phones, laptops) need special handling\n\nBatteries contain toxic materials but also valuable metals that can be recycled into new batteries.";
    }
    
    if (lowerQuestion.includes('tv') || lowerQuestion.includes('television') || lowerQuestion.includes('monitor')) {
      return "For TVs and monitors:\n\n1. Check if still functional - consider donation\n2. Never put in regular trash due to lead and mercury content\n3. Take to certified e-waste recyclers\n4. Some manufacturers offer take-back programs\n5. Remove any batteries from remotes\n\nOlder CRT TVs/monitors contain lead and require special handling. Newer LCD/LED models contain valuable materials for recycling.";
    }
    
    if (lowerQuestion.includes('printer') || lowerQuestion.includes('scanner')) {
      return "For printers and scanners:\n\n1. Remove ink/toner cartridges (recycle separately)\n2. Clear any paper jams and remove paper\n3. Take to e-waste recycling centers\n4. Many office supply stores accept old printers\n5. Consider manufacturer take-back programs\n\nPrinters contain metals and plastics that can be recycled, plus valuable components in the electronics.";
    }
    
    if (lowerQuestion.includes('cable') || lowerQuestion.includes('charger') || lowerQuestion.includes('cord')) {
      return "For cables and chargers:\n\n1. Don't throw in regular trash - they contain copper and other metals\n2. Take to e-waste collection points\n3. Many electronics stores accept old cables\n4. Strip copper wire if you have the tools (for large quantities)\n5. USB cables and phone chargers are especially valuable for recycling\n\nCables contain copper which is highly recyclable and valuable.";
    }
    
    if (lowerQuestion.includes('refrigerator') || lowerQuestion.includes('fridge') || lowerQuestion.includes('appliance')) {
      return "For large appliances like refrigerators:\n\n1. Contact your utility company - many offer rebate programs\n2. Schedule pickup with certified recyclers\n3. Ensure proper refrigerant removal (contains ozone-depleting substances)\n4. Remove all food and clean before disposal\n5. Consider donation if still functional\n\nLarge appliances contain valuable metals and require proper refrigerant handling to protect the environment.";
    }
    
    if (lowerQuestion.includes('recycle') || lowerQuestion.includes('where') || lowerQuestion.includes('location')) {
      return "To find e-waste recycling locations:\n\n1. Use our Recycling Map feature to find nearby facilities\n2. Check with local waste management companies\n3. Contact manufacturer take-back programs\n4. Visit retailer drop-off programs\n5. Look for community e-waste collection events\n\nAlways verify that recyclers are certified and follow proper environmental standards.";
    }
    
    if (lowerQuestion.includes('data') || lowerQuestion.includes('security') || lowerQuestion.includes('personal')) {
      return "For data security before disposal:\n\n1. Back up important files to cloud or external drive\n2. Sign out of all accounts and services\n3. Perform a factory reset or format\n4. For hard drives: use data wiping software or physical destruction\n5. Remove memory cards and SIM cards\n\nProper data wiping prevents identity theft and protects your personal information.";
    }
    
    if (lowerQuestion.includes('environment') || lowerQuestion.includes('toxic') || lowerQuestion.includes('harmful')) {
      return "Environmental impact of e-waste:\n\n1. Contains toxic materials: lead, mercury, cadmium, brominated flame retardants\n2. Improper disposal contaminates soil and water\n3. Accounts for 70% of toxic waste in landfills despite being only 2% of total waste\n4. Proper recycling recovers valuable materials and prevents pollution\n5. Global e-waste grows by 4% annually\n\nRecycling e-waste properly protects the environment and conserves natural resources.";
    }
    
    // Default response for unrecognized questions
    return "I can help you with e-waste disposal questions! Here are some topics I can assist with:\n\n• Smartphone and mobile phone disposal\n• Computer and laptop recycling\n• Battery disposal guidelines\n• TV and monitor recycling\n• Printer and scanner disposal\n• Cable and charger recycling\n• Large appliance disposal\n• Data security before disposal\n• Environmental impact of e-waste\n• Finding recycling locations\n\nPlease ask me about any specific electronic device or e-waste topic!";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    // Add placeholder for AI response
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      content: '',
      isUser: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiMessage]);

    try {
      // Convert messages to API format
      const conversationHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      }));
      conversationHistory.push({ role: 'user', content: currentMessage });

      const response = await fetch(`https://mpvsxmwiriarcwuqmsfu.supabase.co/functions/v1/ai-assistant`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wdnN4bXdpcmlhcmN3dXFtc2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDU2NTQsImV4cCI6MjA2MzU4MTY1NH0.hve2qa3uEsBTP5a-cjK9JpDs-Gg6zMr7IUcO7xHvzcQ`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: conversationHistory,
          userId: user?.id
        }),
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      // Handle streaming response
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulatedContent += parsed.content;
                // Update the AI message with accumulated content
                setMessages(prev => prev.map(msg => 
                  msg.id === aiMessageId 
                    ? { ...msg, content: accumulatedContent }
                    : msg
                ));
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Error calling AI assistant:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
      
      // Update with error message
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, content: "I'm sorry, I encountered an error. Please try again." }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewRealtimeMessage = (newMessage: { role: 'user' | 'assistant'; content: string; timestamp: Date }) => {
    const message: Message = {
      id: Date.now().toString(),
      content: newMessage.content,
      isUser: newMessage.role === 'user',
      timestamp: newMessage.timestamp,
    };
    setMessages(prev => [...prev, message]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "Explain quantum computing in simple terms",
    "How do I properly dispose of old smartphones?",
    "What's the latest in renewable energy technology?", 
    "Help me understand machine learning basics",
    "What are the environmental impacts of e-waste?"
  ];

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="text-center py-6 px-4 flex-shrink-0 border-b">
        <h1 className="text-3xl font-bold mb-2 flutter-text-gradient flex items-center justify-center gap-2">
          <BotIcon className="h-8 w-8 text-primary" />
          E-Waste AI Assistant
        </h1>
        <p className="text-muted-foreground">
          Ask me anything! I can help with general questions, technology, science, e-waste management, and more.
        </p>
      </div>

      <Card className="flutter-card flex-1 flex flex-col rounded-none border-0">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="text-lg">Chat with AI Assistant</CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 mb-4 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-4 p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        message.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {message.isUser ? <UserIcon className="h-4 w-4" /> : <BotIcon className="h-4 w-4" />}
                      </div>
                      <div className={`p-3 rounded-lg ${
                        message.isUser 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-foreground'
                      }`}>
                        <p className="whitespace-pre-line text-sm leading-relaxed">{message.content}</p>
                        <p className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <RealtimeAI messages={messages.map(m => ({ role: m.isUser ? 'user' : 'assistant', content: m.content, timestamp: m.timestamp }))} onNewMessage={handleNewRealtimeMessage} />
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex gap-2 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                        <BotIcon className="h-4 w-4" />
                      </div>
                      <div className="bg-muted text-foreground p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="mb-4 flex-shrink-0">
              <p className="text-sm text-muted-foreground mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage(question)}
                    className="text-xs"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="flex gap-2 flex-shrink-0">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flutter-input"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="flutter-button shrink-0"
            >
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
