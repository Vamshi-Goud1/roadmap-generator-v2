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
  Eye,
  Brain,
  Sparkles,
  History as HistoryIcon,
  BarChart,
  Target,
  Lightbulb,
  Newspaper,
  GraduationCap,
  Cpu,
  Briefcase,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/lib/auth';
import { getUserHistory, deleteHistoryItem, HistoryItem } from "@/services/historyService";
import { fetchAllNews, NewsItem } from "@/services/newsService";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import html2pdf from 'html2pdf.js';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'keywords' | 'news'>('roadmap');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<HistoryItem | null>(null);
  const [newsData, setNewsData] = useState<{
    education: NewsItem[];
    technology: NewsItem[];
    jobs: NewsItem[];
  }>({
    education: [],
    technology: [],
    jobs: []
  });
  const [newsLoading, setNewsLoading] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadHistory = async () => {
      if (!auth?.user) {
        navigate('/signin');
        return;
      }

      try {
        setError(null);
        setLoading(true);
        console.log('Loading history for user:', auth.user.uid);
        const userHistory = await getUserHistory(auth.user.uid);
        console.log('Loaded history:', userHistory);
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

    if (!auth.loading) {
      loadHistory();
    }
  }, [auth.user, auth.loading, navigate, toast]);

  useEffect(() => {
    const fetchNews = async () => {
      if (activeTab === 'news' && newsData.education.length === 0) {
        setNewsLoading(true);
        try {
          const news = await fetchAllNews();
          setNewsData(news);
        } catch (error) {
          console.error('Error fetching news:', error);
          toast({
            title: "Error",
            description: "Failed to load news updates. Please try again.",
            variant: "destructive",
          });
        } finally {
          setNewsLoading(false);
        }
      }
    };

    fetchNews();
  }, [activeTab, toast, newsData.education.length]);

  const handleExport = async (item: HistoryItem) => {
    if (!item.data) {
      toast({
        title: "Error",
        description: "No data available to export",
        variant: "destructive",
      });
      return;
    }

    setDownloading(item.id || null);
    try {
      // Create a temporary container
      const container = document.createElement('div');
      container.style.padding = '20px';
      container.style.backgroundColor = 'white';
      
      // Add content based on type
      if (item.type === 'roadmap') {
        container.innerHTML = `
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #2563eb; font-size: 24px; margin-bottom: 10px;">Career Roadmap</h1>
            <h2 style="font-size: 20px; margin-bottom: 5px;">${item.query}</h2>
            <p style="color: #666;">Generated on ${formatDate(item.timestamp)}</p>
          </div>
          ${item.data.steps.map((step, index) => `
            <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <h3 style="color: #1f2937; font-size: 18px; margin-bottom: 10px;">
                ${index + 1}. ${step.title}
              </h3>
              <p style="color: #4b5563; margin-bottom: 10px;">${step.description}</p>
              ${step.resources && step.resources.length > 0 ? `
                <div style="margin-top: 10px;">
                  <h4 style="color: #1f2937; font-size: 16px; margin-bottom: 5px;">Resources:</h4>
                  <ul style="list-style-type: disc; margin-left: 20px;">
                    ${step.resources.map(resource => `
                      <li>
                        <a href="${resource.link}" style="color: #2563eb; text-decoration: none;">
                          ${resource.name}
                        </a>
                      </li>
                    `).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          `).join('')}
        `;
      } else {
        // Keywords export
        container.innerHTML = `
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #2563eb; font-size: 24px; margin-bottom: 10px;">Keywords Analysis</h1>
            <h2 style="font-size: 20px; margin-bottom: 5px;">${item.query}</h2>
            <p style="color: #666;">Generated on ${formatDate(item.timestamp)}</p>
          </div>
          <div style="margin-bottom: 20px;">
            <h3 style="color: #1f2937; font-size: 18px; margin-bottom: 10px;">Keywords</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${item.data.keywords?.map(keyword => `
                <span style="background-color: #f3f4f6; padding: 4px 12px; border-radius: 16px; color: #4b5563;">
                  ${keyword}
                </span>
              `).join('') || 'No keywords available'}
            </div>
          </div>
          <div style="margin-bottom: 20px;">
            <h3 style="color: #1f2937; font-size: 18px; margin-bottom: 10px;">Skills</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${item.data.skills?.map(skill => `
                <span style="background-color: #f3f4f6; padding: 4px 12px; border-radius: 16px; color: #4b5563;">
                  ${skill}
                </span>
              `).join('') || 'No skills available'}
            </div>
          </div>
          <div style="margin-bottom: 20px;">
            <h3 style="color: #1f2937; font-size: 18px; margin-bottom: 10px;">Technologies</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${item.data.technologies?.map(tech => `
                <span style="background-color: #f3f4f6; padding: 4px 12px; border-radius: 16px; color: #4b5563;">
                  ${tech}
                </span>
              `).join('') || 'No technologies available'}
            </div>
          </div>
          <div>
            <h3 style="color: #1f2937; font-size: 18px; margin-bottom: 10px;">Analysis</h3>
            <p style="color: #4b5563;">${item.data.analysis || 'No analysis available'}</p>
          </div>
        `;
      }

      // PDF options
      const opt = {
        margin: [0.5, 0.5],
        filename: `${item.type}-${item.query.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait'
        }
      };

      // Generate PDF
      await html2pdf().from(container).set(opt).save();

      toast({
        title: "Success",
        description: "Your file has been downloaded successfully",
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast({
        title: "Error",
        description: "Failed to export file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloading(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      console.log('Deleting history item:', id);
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

  const handlePreview = (item: HistoryItem) => {
    setPreviewItem(item);
  };

  if (auth.loading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!auth.user) {
    navigate('/signin');
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto py-8">
          <Alert variant="destructive">
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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-gray-900 to-black">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl bg-black/40 backdrop-blur-lg border border-white/10 p-10 mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 animate-pulse"></div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-primary/20 rounded-lg backdrop-blur-xl">
                <HistoryIcon className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                Your Journey
              </h1>
            </div>
            <p className="text-lg text-white/80 max-w-2xl leading-relaxed">
              Track your progress, revisit your roadmaps, and stay updated with the latest insights in your field.
              Your personal career development timeline, all in one place.
            </p>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs
          defaultValue={activeTab}
          onValueChange={(value) => setActiveTab(value as 'roadmap' | 'keywords' | 'news')}
          className="space-y-8"
        >
          <TabsList className="bg-black/60 border border-white/10 backdrop-blur-xl w-full justify-start gap-4 p-2 rounded-xl">
            <TabsTrigger
              value="roadmap"
              className="data-[state=active]:bg-primary/30 data-[state=active]:text-white text-white/70 px-6 py-2.5 rounded-lg transition-all duration-300 hover:bg-white/5"
            >
              <Target className="h-5 w-5 mr-2" />
              Roadmaps
            </TabsTrigger>
            <TabsTrigger
              value="keywords"
              className="data-[state=active]:bg-primary/30 data-[state=active]:text-white text-white/70 px-6 py-2.5 rounded-lg transition-all duration-300 hover:bg-white/5"
            >
              <Brain className="h-5 w-5 mr-2" />
              Keywords
            </TabsTrigger>
            <TabsTrigger
              value="news"
              className="data-[state=active]:bg-primary/30 data-[state=active]:text-white text-white/70 px-6 py-2.5 rounded-lg transition-all duration-300 hover:bg-white/5"
            >
              <Newspaper className="h-5 w-5 mr-2" />
              News
            </TabsTrigger>
          </TabsList>

          {error && (
            <Alert variant="destructive" className="mb-6 border-red-500/50 bg-red-500/10 backdrop-blur-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-primary animate-pulse" />
                </div>
              </div>
            </div>
          ) : (
            <>
              <TabsContent value="roadmap" className="space-y-8">
                {history
                  .filter((item) => item.type === 'roadmap')
                  .map((item) => (
                    <Card key={item.id} className="group bg-black/40 border-white/10 backdrop-blur-xl hover:bg-black/50 transition-all duration-300 hover:border-primary/20 rounded-xl overflow-hidden">
                      <CardHeader className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                              {item.query}
                            </CardTitle>
                            <CardDescription className="text-white/70 flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4" />
                              {formatDate(item.timestamp)}
                            </CardDescription>
                          </div>
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setPreviewItem(item)}
                              className="bg-white/5 border-white/10 hover:bg-primary/20 hover:border-primary/30 transition-all duration-300"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleExport(item)}
                              disabled={downloading === item.id}
                              className="bg-white/5 border-white/10 hover:bg-primary/20 hover:border-primary/30 transition-all duration-300"
                            >
                              {downloading === item.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(item.id!)}
                              disabled={deleting === item.id}
                              className="bg-white/5 border-white/10 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300"
                            >
                              {deleting === item.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="px-6 pb-6">
                        <div className="grid gap-4">
                          {item.data?.steps?.slice(0, 3).map((step, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group/step">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 group-hover/step:bg-primary/20">
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-medium text-white mb-2 group-hover/step:text-primary transition-colors">
                                  {step.title}
                                </h4>
                                <p className="text-sm text-white/70 line-clamp-2 leading-relaxed">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          ))}
                          {item.data?.steps?.length > 3 && (
                            <Button
                              variant="ghost"
                              className="w-full text-primary hover:text-primary/80 hover:bg-primary/10 transition-all duration-300"
                              onClick={() => setPreviewItem(item)}
                            >
                              View all {item.data.steps.length} steps
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="keywords" className="space-y-8">
                {history
                  .filter((item) => item.type === 'keywords')
                  .map((item) => (
                    <Card key={item.id} className="group bg-black/40 border-white/10 backdrop-blur-xl hover:bg-black/50 transition-all duration-300 hover:border-primary/20 rounded-xl">
                      <CardHeader className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                              {item.query}
                            </CardTitle>
                            <CardDescription className="text-white/70 flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4" />
                              {formatDate(item.timestamp)}
                            </CardDescription>
                          </div>
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleExport(item)}
                              disabled={downloading === item.id}
                              className="bg-white/5 border-white/10 hover:bg-primary/20 hover:border-primary/30 transition-all duration-300"
                            >
                              {downloading === item.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(item.id!)}
                              disabled={deleting === item.id}
                              className="bg-white/5 border-white/10 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300"
                            >
                              {deleting === item.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="px-6 pb-6">
                        <div className="space-y-6">
                          {item.data?.keywords && (
                            <div>
                              <h4 className="text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
                                <Target className="h-4 w-4 text-primary" />
                                Keywords
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {item.data.keywords.map((keyword, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-sm hover:bg-primary/20 transition-all duration-300"
                                  >
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {item.data?.skills && (
                            <div>
                              <h4 className="text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
                                <Brain className="h-4 w-4 text-purple-400" />
                                Skills
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {item.data.skills.map((skill, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="bg-purple-500/10 text-purple-400 border-purple-500/20 px-3 py-1 text-sm hover:bg-purple-500/20 transition-all duration-300"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {item.data?.technologies && (
                            <div>
                              <h4 className="text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
                                <Cpu className="h-4 w-4 text-blue-400" />
                                Technologies
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {item.data.technologies.map((tech, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1 text-sm hover:bg-blue-500/20 transition-all duration-300"
                                  >
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="news" className="space-y-8">
                {newsLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 text-primary animate-pulse" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="group bg-black/40 border-white/10 backdrop-blur-xl hover:bg-black/50 transition-all duration-300 hover:border-primary/20 rounded-xl overflow-hidden">
                      <CardHeader className="p-6">
                        <CardTitle className="flex items-center gap-3 text-white">
                          <div className="p-2 bg-primary/20 rounded-lg">
                            <GraduationCap className="h-6 w-6 text-primary" />
                          </div>
                          Education
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-6 pb-6 space-y-4">
                        {newsData.education.slice(0, 3).map((item, index) => (
                          <a
                            key={index}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group/item"
                          >
                            <h4 className="text-sm font-medium text-white mb-2 line-clamp-2 group-hover/item:text-primary transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-xs text-white/70 flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                    
                            </p>
                          </a>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="group bg-black/40 border-white/10 backdrop-blur-xl hover:bg-black/50 transition-all duration-300 hover:border-purple-500/20 rounded-xl overflow-hidden">
                      <CardHeader className="p-6">
                        <CardTitle className="flex items-center gap-3 text-white">
                          <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Cpu className="h-6 w-6 text-purple-400" />
                          </div>
                          Technology
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-6 pb-6 space-y-4">
                        {newsData.technology.slice(0, 3).map((item, index) => (
                          <a
                            key={index}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group/item"
                          >
                            <h4 className="text-sm font-medium text-white mb-2 line-clamp-2 group-hover/item:text-purple-400 transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-xs text-white/70 flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                          
                            </p>
                          </a>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="group bg-black/40 border-white/10 backdrop-blur-xl hover:bg-black/50 transition-all duration-300 hover:border-blue-500/20 rounded-xl overflow-hidden">
                      <CardHeader className="p-6">
                        <CardTitle className="flex items-center gap-3 text-white">
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Briefcase className="h-6 w-6 text-blue-400" />
                          </div>
                          Jobs
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-6 pb-6 space-y-4">
                        {newsData.jobs.slice(0, 3).map((item, index) => (
                          <a
                            key={index}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group/item"
                          >
                            <h4 className="text-sm font-medium text-white mb-2 line-clamp-2 group-hover/item:text-blue-400 transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-xs text-white/70 flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                            </p>
                          </a>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>

        {/* Preview Dialog */}
        <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
          <DialogContent className="max-w-3xl bg-black/95 border-white/10 text-white backdrop-blur-xl rounded-xl">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle className="text-2xl font-bold">{previewItem?.query}</DialogTitle>
              <DialogDescription className="text-white/70 flex items-center gap-2 mt-2">
                <Clock className="h-4 w-4" />
                Generated on {previewItem && formatDate(previewItem.timestamp)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 p-6">
              {previewItem?.type === 'roadmap' && previewItem.data?.steps?.map((step, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">{step.title}</h3>
                      <p className="mt-2 text-white/70 leading-relaxed">{step.description}</p>
                      {step.resources && step.resources.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-primary" />
                            Resources
                          </h4>
                          <div className="space-y-2">
                            {step.resources.map((resource, idx) => (
                              <a
                                key={idx}
                                href={resource.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group"
                              >
                                <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                {resource.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default History; 