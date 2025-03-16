import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  User2,
  Send,
  Loader2,
  Sparkles,
  Brain,
  LucideIcon,
  MessageSquare,
  Zap,
  Clock,
  RefreshCcw,
  Plus
} from "lucide-react";
import { useAuth } from '@/lib/auth';
import { useToast } from "@/components/ui/use-toast";
import { getAIResponse } from '@/services/chatService';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { format } from 'date-fns';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: Bot,
    title: "AI Powered",
    description: "Advanced language model for natural conversations",
    color: "blue"
  },
  {
    icon: Sparkles,
    title: "Smart Responses",
    description: "Contextual and informative interactions",
    color: "purple"
  },
  {
    icon: Brain,
    title: "Learning Assistant",
    description: "Helps with career development and learning",
    color: "green"
  },
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load chat sessions from local storage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      setChatSessions(JSON.parse(savedSessions));
    }
    const lastActiveChat = localStorage.getItem('currentChatId');
    if (lastActiveChat) {
      setCurrentChatId(lastActiveChat);
      const session = JSON.parse(savedSessions || '[]').find((s: ChatSession) => s.id === lastActiveChat);
      if (session) {
        setMessages(session.messages);
      }
    }
  }, []);

  // Save chat sessions to local storage
  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
    }
    if (currentChatId) {
      localStorage.setItem('currentChatId', currentChatId);
    }
  }, [chatSessions, currentChatId]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setChatSessions(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setMessages([]);
  };

  const switchChat = (chatId: string) => {
    const session = chatSessions.find(s => s.id === chatId);
    if (session) {
      setCurrentChatId(chatId);
      setMessages(session.messages);
    }
  };

  const updateChatSession = (messages: Message[]) => {
    if (!currentChatId) return;
    
    setChatSessions(prev => prev.map(session => {
      if (session.id === currentChatId) {
        return {
          ...session,
          messages,
          title: messages[0]?.content.slice(0, 30) + '...' || 'New Chat',
          updatedAt: Date.now(),
        };
      }
      return session;
    }));
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    updateChatSession(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getAIResponse(userMessage.content);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      updateChatSession(updatedMessages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    if (currentChatId) {
      updateChatSession([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A1229] overflow-hidden">
      <Navbar />
      <main className="flex-grow flex flex-col pt-16 overflow-hidden">
        <div className="container mx-auto px-6 py-8 max-w-[1400px] flex gap-6">
          {/* Chat History Sidebar */}
          <div className={`w-64 flex-shrink-0 ${isSidebarOpen ? '' : 'hidden'}`}>
            <Card className="bg-[#0B1120] border-gray-800 h-[calc(100vh-8rem)] flex flex-col">
              <CardHeader className="border-b border-gray-800 space-y-2 py-4">
                <Button
                  onClick={createNewChat}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
              </CardHeader>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-2">
                  {chatSessions.map((session) => (
                    <Button
                      key={session.id}
                      variant="ghost"
                      className={`w-full justify-start text-left text-sm ${
                        currentChatId === session.id
                          ? 'bg-[#1C2536] text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      onClick={() => switchChat(session.id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <div className="truncate">{session.title}</div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Main Chat Area */}
          <Card className="bg-[#0B1120] border-gray-800 shadow-xl overflow-hidden h-[calc(100vh-8rem)] flex-1">
            <CardHeader className="border-b border-gray-800 space-y-6 pb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#1C2536] rounded-xl">
                  <MessageSquare className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-semibold text-white">AI Assistant</CardTitle>
                  <CardDescription className="text-base text-gray-400">
                    Your personal AI assistant powered by Gemini
                  </CardDescription>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl bg-[#1C2536] border border-gray-800 hover:border-gray-700 transition-colors"
                  >
                    <div className="p-2 bg-[#0B1120] rounded-lg">
                      <feature.icon className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{feature.title}</h3>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between px-6 py-2 border-b border-gray-800 bg-[#0B1120]">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">
                      {messages.length > 0 ? `Started ${format(messages[0].timestamp, 'h:mm a')}` : 'New chat'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChat}
                    className="text-gray-400 hover:text-white"
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Clear chat
                  </Button>
                </div>
                <ScrollArea 
                  ref={scrollAreaRef}
                  className="flex-1 px-6 py-4"
                >
                  <div className="space-y-6 pb-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-4 ${
                          message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
                        }`}
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-lg ${
                            message.role === 'assistant'
                              ? 'bg-[#1C2536] text-blue-500'
                              : 'bg-blue-500/10 text-blue-500'
                          }`}
                        >
                          {message.role === 'assistant' ? (
                            <Bot className="h-5 w-5" />
                          ) : (
                            <User2 className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex flex-col gap-1 min-w-0 max-w-[85%]">
                          <div
                            className={`rounded-lg px-4 py-2.5 ${
                              message.role === 'assistant'
                                ? 'bg-[#1C2536] text-white'
                                : 'bg-blue-500/10 text-white'
                            }`}
                          >
                            {message.content}
                          </div>
                          <span className="text-xs text-gray-500 px-1">
                            {format(message.timestamp, 'h:mm a')}
                          </span>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex items-start gap-4">
                        <div className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-lg bg-[#1C2536] text-blue-500">
                          <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                        <div className="flex flex-col gap-1 min-w-0 max-w-[85%]">
                          <div className="rounded-lg px-4 py-2.5 bg-[#1C2536] text-white">
                            Thinking...
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <form onSubmit={handleSend} className="p-4 border-t border-gray-800 bg-[#0B1120]">
                  <div className="flex gap-3">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Ask anything..."
                      className="bg-[#1C2536] border-gray-800 text-white placeholder:text-gray-400 focus-visible:ring-blue-500"
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                    <Zap className="h-3 w-3" />
                    <span>Tip: Press Enter to send, Shift + Enter for new line</span>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
} 