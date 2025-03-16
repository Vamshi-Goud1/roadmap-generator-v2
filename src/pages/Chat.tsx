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
  Plus,
  ChevronDown,
  Copy,
  Check,
  Trash2,
  Pencil
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

const formatAIResponse = (content: string) => {
  // Remove multiple asterisks and format lists
  return content
    .replace(/\*\*\*(.*?)\*\*\*/g, '$1') // Remove triple asterisks
    .replace(/\*\*(.*?)\*\*/g, '$1')     // Remove double asterisks
    .replace(/\*(.*?)\*/g, '$1')         // Remove single asterisks
    .split('\n')
    .map(line => {
      // Format numbered lists while preserving numbers
      if (/^\d+\.\s/.test(line)) {
        return line;
      }
      // Convert asterisk lists to bullet points
      if (line.trim().startsWith('*')) {
        return '•' + line.substring(line.indexOf('*') + 1);
      }
      return line;
    })
    .join('\n');
};

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
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

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

  const scrollToBottom = (force: boolean = false) => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        const isAtBottom = Math.abs((scrollContainer.scrollHeight - scrollContainer.scrollTop) - scrollContainer.clientHeight) < 50;
        if (isAtBottom || force) {
          setTimeout(() => {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
          }, 100);
        }
      }
    }
  };

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        const isAtBottom = Math.abs((scrollContainer.scrollHeight - scrollContainer.scrollTop) - scrollContainer.clientHeight) < 50;
        setShowScrollButton(!isAtBottom);
      }
    }
  };

  useEffect(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom(true);
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
        content: formatAIResponse(response),
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

  const copyToClipboard = async (text: string, messageIndex: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageIndex);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const deleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatSessions(prev => prev.filter(session => session.id !== chatId));
    if (currentChatId === chatId) {
      const remainingSessions = chatSessions.filter(session => session.id !== chatId);
      if (remainingSessions.length > 0) {
        switchChat(remainingSessions[0].id);
      } else {
        setCurrentChatId(null);
        setMessages([]);
      }
    }
  };

  const startEditingChat = (chatId: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(chatId);
    setEditTitle(title);
  };

  const saveEditedChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatSessions(prev => prev.map(session => 
      session.id === chatId 
        ? { ...session, title: editTitle || 'New Chat' }
        : session
    ));
    setEditingChatId(null);
    setEditTitle('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A1229] overflow-hidden">
      <Navbar />
      <main className="flex-grow flex flex-col pt-16 overflow-hidden">
        <div className="container mx-auto px-6 py-8 max-w-[1400px] flex gap-6">
          {/* Chat History Sidebar */}
          <div className={`w-64 flex-shrink-0 ${isSidebarOpen ? '' : 'hidden'}`}>
            <Card className="bg-[#0B1120] border-gray-800 h-[calc(100vh-8rem)] flex flex-col shadow-xl">
              <CardHeader className="border-b border-gray-800 space-y-2 py-4">
                <Button
                  onClick={createNewChat}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
              </CardHeader>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-2">
                  {chatSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center group"
                    >
                      <Button
                        variant="ghost"
                        className={`flex-1 justify-start text-left text-sm transition-all duration-200 ${
                          currentChatId === session.id
                            ? 'bg-[#1C2536] text-white shadow-md'
                            : 'text-gray-400 hover:text-white hover:bg-[#1C2536]/50'
                        }`}
                        onClick={() => switchChat(session.id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {editingChatId === session.id ? (
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-transparent border-b border-gray-600 focus:border-blue-500 outline-none px-1 w-full"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                saveEditedChat(session.id, e as any);
                              }
                            }}
                          />
                        ) : (
                          <div className="truncate">{session.title}</div>
                        )}
                      </Button>
                      <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 pr-2">
                        {editingChatId === session.id ? (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={(e) => saveEditedChat(session.id, e)}
                          >
                            <Check className="h-3 w-3 text-green-500" />
                          </Button>
                        ) : (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={(e) => startEditingChat(session.id, session.title, e)}
                          >
                            <Pencil className="h-3 w-3 text-gray-400" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={(e) => deleteChat(session.id, e)}
                        >
                          <Trash2 className="h-3 w-3 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Main Chat Area */}
          <Card className="flex-1 bg-[#0B1120] border-gray-800 h-[calc(100vh-8rem)] flex flex-col overflow-hidden shadow-xl relative">
            <CardHeader className="border-b border-gray-800 bg-[#0B1120]/95 backdrop-blur-sm z-10">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Bot className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-white">AI Assistant</CardTitle>
                  <CardDescription className="text-gray-300">
                    Your personal AI assistant powered by Gemini
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <div className="flex-1 flex flex-col overflow-hidden relative">
              {/* Features Section */}
              {messages.length === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
                  {features.map((feature, index) => (
                    <Card key={index} className="bg-[#1C2536] border-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out transform hover:scale-[1.02]">
                      <CardHeader className="space-y-4">
                        <div className={`p-3 bg-${feature.color}-500/10 rounded-lg w-fit`}>
                          <feature.icon className={`h-8 w-8 text-${feature.color}-500`} />
                        </div>
                        <div className="space-y-2">
                          <CardTitle className="text-lg font-semibold text-white">{feature.title}</CardTitle>
                          <CardDescription className="text-gray-300 text-sm leading-relaxed">
                            {feature.description}
                          </CardDescription>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}

              {/* Messages Section */}
              <ScrollArea 
                ref={scrollAreaRef} 
                className="flex-1 p-4 overflow-y-auto"
                style={{ height: messages.length > 0 ? '100%' : 'auto' }}
              >
                <div className="space-y-4 pb-2">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`flex items-start space-x-2 max-w-[80%] ${
                          message.role === 'user'
                            ? 'flex-row-reverse space-x-reverse'
                            : 'flex-row'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-[#1C2536] text-gray-100'
                        } shadow-lg relative group`}>
                          <div className={`p-2 ${message.role === 'assistant' ? 'space-y-2' : ''}`}>
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">
                              {message.content.split('\n').map((line, i) => (
                                <span key={i}>
                                  {line}
                                  {i < message.content.split('\n').length - 1 && <br />}
                                </span>
                              ))}
                            </p>
                            <div className="text-xs mt-2 opacity-70 flex items-center justify-between">
                              <span>{format(message.timestamp, 'h:mm a')}</span>
                              {message.role === 'assistant' && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => copyToClipboard(message.content, index)}
                                >
                                  {copiedMessageId === index ? (
                                    <Check className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <Copy className="h-3 w-3 text-gray-400" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
                          message.role === 'user'
                            ? 'bg-blue-500/10'
                            : 'bg-[#1C2536]'
                        }`}>
                          {message.role === 'user' ? (
                            <User2 className="h-5 w-5 text-blue-500" />
                          ) : (
                            <Bot className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-center space-x-2 bg-[#1C2536] p-3 rounded-lg shadow-lg">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        <p className="text-sm">AI is thinking...</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Scroll to Bottom Button */}
              {showScrollButton && messages.length > 0 && (
                <Button
                  onClick={() => scrollToBottom(true)}
                  className="absolute bottom-20 right-6 h-10 w-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-all duration-200 flex items-center justify-center"
                  size="icon"
                >
                  <ChevronDown className="h-5 w-5" />
                </Button>
              )}

              {/* Input Section */}
              <div className="p-4 border-t border-gray-800 bg-[#0B1120]/95 backdrop-blur-sm">
                <form onSubmit={handleSend} className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 bg-[#1C2536] border-gray-700 focus:border-blue-500 text-white shadow-inner"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className={`${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    } bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-all duration-200`}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearChat}
                    className="border-gray-700 text-gray-400 hover:text-white hover:bg-[#1C2536] shadow-lg transition-all duration-200"
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
} 