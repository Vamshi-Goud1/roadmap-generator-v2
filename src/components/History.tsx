import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Download, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getUserHistory, deleteHistoryItem, HistoryItem } from "@/services/historyService";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'keywords'>('roadmap');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const loadHistory = async () => {
      try {
        const userHistory = await getUserHistory(user.uid);
        setHistory(userHistory);
      } catch (error) {
        console.error('Error loading history:', error);
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
  }, [user, navigate, toast]);

  const handleExport = (item: ) => {
    // Implementation will be added later
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

  const filteredHistory = history.filter(item => item.type === activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your History</h2>
      </div>

      <Tabs defaultValue="roadmap" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger 
            value="roadmap"
            onClick={() => setActiveTab('roadmap')}
          >
            Roadmaps
          </TabsTrigger>
          <TabsTrigger 
            value="keywords"
            onClick={() => setActiveTab('keywords')}
          >
            Keywords
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roadmap" className="space-y-4">
          {filteredHistory.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No roadmap history available
              </CardContent>
            </Card>
          ) : (
            filteredHistory.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {item.query}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Generated on {formatDate(item.timestamp)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport(item)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => item.id && handleDelete(item.id)}
                        disabled={deleting === item.id}
                      >
                        {deleting === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-500" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {item.type === 'roadmap' && (
                    <div className="mt-4 space-y-2">
                      {item.data.steps.map((step: any, index: number) => (
                        <div key={index} className="text-sm text-gray-600 dark:text-gray-300">
                          {index + 1}. {step.title}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          {filteredHistory.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No keywords history available
              </CardContent>
            </Card>
          ) : (
            filteredHistory.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {item.query}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Generated on {formatDate(item.timestamp)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport(item)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => item.id && handleDelete(item.id)}
                        disabled={deleting === item.id}
                      >
                        {deleting === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-500" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {item.type === 'keywords' && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {item.data.keywords.map((keyword: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default History; 