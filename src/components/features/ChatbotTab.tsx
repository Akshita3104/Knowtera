import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Bot, User } from 'lucide-react';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotTabProps {
  chatMessages: ChatMessage[];
  userChatInput: string;
  onUserChatInputChange: (value: string) => void;
  handleChatSubmit: () => void;
  isLoading: boolean;
  hasDocument: boolean;
}

export function ChatbotTab({
  chatMessages,
  userChatInput,
  onUserChatInputChange,
  handleChatSubmit,
  isLoading,
  hasDocument,
}: ChatbotTabProps) {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [chatMessages]);

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="font-headline text-lg">AI Chatbot</CardTitle>
        <CardDescription>Ask questions about the uploaded document.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 w-full rounded-md border p-4 mb-4 bg-secondary/30" ref={scrollAreaRef}>
          {chatMessages.map((msg, index) => (
            <div key={index} className={`mb-3 flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}>
              <div className={`p-3 rounded-lg max-w-[80%] flex items-start gap-2.5 ${
                msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {msg.role === 'assistant' ? <Bot className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <User className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && chatMessages.length > 0 && chatMessages[chatMessages.length-1].role === 'user' && (
            <div className="flex justify-start p-2">
              <div className="p-3 rounded-lg bg-muted text-muted-foreground flex items-center gap-2.5">
                <Bot className="w-5 h-5 flex-shrink-0" />
                <LoadingSpinner size="h-4 w-4" />
              </div>
            </div>
          )}
           {!hasDocument && chatMessages.length === 0 && (
             <p className="text-sm text-muted-foreground text-center py-10">Please provide document text to start chatting.</p>
           )}
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder={hasDocument ? "Type your question..." : "Please upload a document first"}
            value={userChatInput}
            onChange={(e) => onUserChatInputChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && hasDocument && handleChatSubmit()}
            disabled={isLoading || !hasDocument}
            className="flex-grow"
            aria-label="Chat input"
          />
          <Button onClick={handleChatSubmit} disabled={isLoading || !hasDocument || !userChatInput.trim()}>
            {isLoading ? <LoadingSpinner size="h-4 w-4" /> : 'Send'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
