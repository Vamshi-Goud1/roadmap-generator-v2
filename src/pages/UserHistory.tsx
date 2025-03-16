import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  Download, 
  Trash2, 
  Loader2, 
  AlertCircle,
  History as HistoryIcon,
  Target,
  Brain,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/lib/auth';
import { getUserHistory, deleteHistoryItem, HistoryItem } from "@/services/historyService";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function UserHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'keywords'>('roadmap');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/signin');
      return;
    }

    const loadHistory = async () => {
      try {
        setError(null);
        setLoading(true);
        const userHistory = await getUserHistory(user.uid);
        setHistory(userHistory);
      } catch (error) {
        console.error('Error loading history:', error);
        setError(error instanceof Error ? error.message : 'Failed to load history');
        toast({
          title: "Error",
          description: "Failed to load history. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [user, authLoading, navigate, toast]);

  const handleExport = (item: HistoryItem) => {
    toast({
      title: "Coming Soon",
      description: "Export functionality will be available soon.",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      await deleteHistoryItem(id);
      setHistory(history.filter(item => item.id !== id));
      toast({
        title: "Deleted",
        description: "History item has been deleted.",
      });
    } catch (error) {
      console.error('Error deleting history item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-gray-900 to-black">
        <Navbar />
        <div className="flex-grow flex items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-gray-900 to-black">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="border-red-500/50 bg-red-500/10 backdrop-blur-xl">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
        <Footer />
      </div>
    );
  }

  const filteredHistory = history.filter(item => item.type === activeTab);

  return (
    <div className="min-h-screen bg-[#0B1120]">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <div className="p-4 bg-blue-500/10 rounded-full mb-6">
            <HistoryIcon className="h-12 w-12 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Your Learning Journey
          </h1>
          <p className="text-gray-400 max-w-2xl text-center">
            Track your progress and revisit your career development milestones. Access your personalized roadmaps and keyword analyses all in one place.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#1C2536] p-6 rounded-xl border border-gray-800">
            <div className="p-3 bg-blue-500/10 rounded-lg w-fit mb-4">
              <Target className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Career Roadmaps</h3>
            <p className="text-gray-400 text-sm">
              Review your generated career paths and learning milestones
            </p>
          </div>
          <div className="bg-[#1C2536] p-6 rounded-xl border border-gray-800">
            <div className="p-3 bg-blue-500/10 rounded-lg w-fit mb-4">
              <Brain className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Skill Analysis</h3>
            <p className="text-gray-400 text-sm">
              Track extracted keywords and skills from your job searches
            </p>
          </div>
          <div className="bg-[#1C2536] p-6 rounded-xl border border-gray-800">
            <div className="p-3 bg-blue-500/10 rounded-lg w-fit mb-4">
              <Sparkles className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Progress Tracking</h3>
            <p className="text-gray-400 text-sm">
              Monitor your development and achievements over time
            </p>
          </div>
        </div>

        <Tabs
          defaultValue={activeTab}
          onValueChange={(value) => setActiveTab(value as 'roadmap' | 'keywords')}
          className="space-y-6"
        >
          <TabsList className="bg-[#1C2536] w-full justify-start gap-2 p-1.5 rounded-lg border border-gray-800">
            <TabsTrigger
              value="roadmap"
              className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-500 text-gray-400 px-4 py-2 rounded-md transition-all duration-200 hover:text-white"
            >
              <Target className="h-4 w-4 mr-2" />
              Roadmaps
            </TabsTrigger>
            <TabsTrigger
              value="keywords"
              className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-500 text-gray-400 px-4 py-2 rounded-md transition-all duration-200 hover:text-white"
            >
              <Brain className="h-4 w-4 mr-2" />
              Keywords
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roadmap" className="space-y-4">
            {filteredHistory.length === 0 ? (
              <div className="bg-[#1C2536] rounded-xl border border-gray-800 p-12 flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-blue-500/10 rounded-full mb-4">
                  <Target className="h-10 w-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Roadmaps Yet</h3>
                <p className="text-gray-400 max-w-sm">
                  Generate your first career roadmap to start tracking your professional journey
                </p>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div key={item.id} className="group bg-[#1C2536] rounded-xl border border-gray-800 overflow-hidden">
                  <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => item.id && toggleExpand(item.id)}>
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        <Target className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-500 transition-colors line-clamp-1">
                          {item.query}
                        </h3>
                        <p className="text-gray-400 text-sm flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {formatDate(item.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExport(item);
                          }}
                          className="h-8 w-8 border-gray-700 hover:border-blue-500 hover:text-blue-500"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            item.id && handleDelete(item.id);
                          }}
                          disabled={deleting === item.id}
                          className="h-8 w-8 ml-2 border-gray-700 hover:border-red-500 hover:text-red-500"
                        >
                          {deleting === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {item.id && expandedItems.includes(item.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  {item.id && expandedItems.includes(item.id) && (
                    <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                      <div className="space-y-3">
                        {item.data?.steps?.map((step: any, index: number) => (
                          <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all duration-200 group/step">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium text-white group-hover/step:text-blue-500 transition-colors">
                                {step.title}
                              </h4>
                            </div>
                          </div>
                        )) || (
                          <div className="text-sm text-gray-400 p-3 rounded-lg bg-gray-800/50">
                            No steps available
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="keywords" className="space-y-4">
            {filteredHistory.length === 0 ? (
              <div className="bg-[#1C2536] rounded-xl border border-gray-800 p-12 flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-blue-500/10 rounded-full mb-4">
                  <Brain className="h-10 w-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Keywords Yet</h3>
                <p className="text-gray-400 max-w-sm">
                  Extract keywords from job descriptions to optimize your resume
                </p>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div key={item.id} className="group bg-[#1C2536] rounded-xl border border-gray-800 overflow-hidden">
                  <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => item.id && toggleExpand(item.id)}>
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        <Brain className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-500 transition-colors line-clamp-1">
                          {item.query}
                        </h3>
                        <p className="text-gray-400 text-sm flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {formatDate(item.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExport(item);
                          }}
                          className="h-8 w-8 border-gray-700 hover:border-blue-500 hover:text-blue-500"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            item.id && handleDelete(item.id);
                          }}
                          disabled={deleting === item.id}
                          className="h-8 w-8 ml-2 border-gray-700 hover:border-red-500 hover:text-red-500"
                        >
                          {deleting === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {item.id && expandedItems.includes(item.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  {item.id && expandedItems.includes(item.id) && (
                    <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                      <div className="space-y-4">
                        {item.data?.keywords && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                              <Target className="h-4 w-4 text-blue-500" />
                              Keywords
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {item.data.keywords.map((keyword: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20"
                                >
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {item.data?.skills && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-purple-400" />
                              Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {item.data.skills.map((skill: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {item.data?.technologies && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                              <Brain className="h-4 w-4 text-blue-400" />
                              Technologies
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {item.data.technologies.map((tech: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20"
                                >
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
} 