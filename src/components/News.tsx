import { useState, useEffect, useRef } from 'react';
import { 
  ArrowUpRight, 
  Calendar, 
  Share2,
  BookmarkPlus,
  MessageCircle,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ExternalLink,
  Clock,
  AlertCircle,
  Globe,
  Target,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { NewsItem } from '@/types/news';

const ITEMS_PER_PAGE = 6;
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const NEWS_CATEGORIES = ['technology', 'business', 'science'];
const API_BASE_URL = 'https://newsapi.org/v2';

const NewsCardSkeleton = () => (
  <Card className="relative bg-black/50 backdrop-blur-xl border-primary/20 overflow-hidden group">
    <CardContent className="p-0">
      <div className="aspect-video relative">
        <Skeleton className="absolute inset-0" />
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24 bg-primary/10" />
          <Skeleton className="h-5 w-32 bg-primary/10" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-7 w-full bg-primary/10" />
          <Skeleton className="h-7 w-3/4 bg-primary/10" />
        </div>
        <Skeleton className="h-16 w-full bg-primary/10" />
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Skeleton className="h-5 w-16 bg-primary/10" />
            <Skeleton className="h-5 w-16 bg-primary/10" />
          </div>
          <Skeleton className="h-5 w-20 bg-primary/10" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={`fixed bottom-8 right-8 z-50 bg-black/50 border-primary/20 backdrop-blur-sm
        hover:bg-primary/10 scroll-to-top hover-scale glow-on-hover ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
};

const News = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>('technology');
  const gridRef = useRef<HTMLDivElement>(null);

  // Calculate estimated read time
  const calculateReadTime = (text: string): string => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!NEWS_API_KEY) {
          throw new Error('News API key is not configured. Please check your environment variables.');
        }

        const url = `${API_BASE_URL}/top-headlines?country=us&category=${activeCategory}&pageSize=${ITEMS_PER_PAGE}&page=${currentPage}&apiKey=${NEWS_API_KEY}`;
        
        console.log('Fetching news from:', url.replace(NEWS_API_KEY, 'HIDDEN_KEY'));

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(`API Error: ${data.message || response.statusText || 'Failed to fetch news'}`);
        }

        if (data.status === 'error') {
          throw new Error(`API Error: ${data.message || 'API returned an error status'}`);
        }

        if (!data.articles || !Array.isArray(data.articles)) {
          throw new Error('No articles array found in the response');
        }

        const transformedItems: NewsItem[] = data.articles
          .filter((article: any) => Boolean(article.title))
          .map((article: any) => ({
            source: {
              id: article.source?.id || null,
              name: article.source?.name || 'Unknown Source'
            },
            author: article.author || 'Unknown Author',
            title: article.title,
            description: article.description || 'No description available',
            url: article.url,
            urlToImage: article.urlToImage || '/images/placeholder-news.webp',
            publishedAt: article.publishedAt || new Date().toISOString(),
            content: article.content || article.description || 'No content available',
            category: activeCategory,
            readTime: calculateReadTime(article.content || article.description || 'No content available')
          }));

        if (transformedItems.length === 0) {
          throw new Error('No valid articles found after transformation');
        }

        setItems(transformedItems);
        setTotalResults(data.totalResults || transformedItems.length);
        setError(null);
      } catch (err) {
        console.error('Detailed error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching news');
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [currentPage, activeCategory]);

  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages && !isLoading) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1 && !isLoading) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Failed to Load News</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <Button 
          variant="outline"
          onClick={() => setCurrentPage(1)}
          className="border-primary/20 hover:bg-primary/10"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        {NEWS_CATEGORIES.map((category) => (
          <Badge
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            className={`px-6 py-3 text-base capitalize cursor-pointer transform transition-all duration-300 hover:scale-105 flex items-center
              ${activeCategory === category 
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                : 'border-2 border-primary/40 bg-black/60 text-white/90 backdrop-blur-xl hover:bg-primary/20 hover:border-primary/60'}`}
            onClick={() => {
              setActiveCategory(category);
              setCurrentPage(1);
            }}
          >
            <div className={`flex items-center gap-2 ${activeCategory === category ? 'text-white' : 'text-primary'}`}>
              {category === 'technology' && <Globe className="h-5 w-5" />}
              {category === 'business' && <Target className="h-5 w-5" />}
              {category === 'science' && <Sparkles className="h-5 w-5" />}
              {category}
            </div>
          </Badge>
        ))}
      </div>

      {/* News Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {isLoading ? (
          Array(ITEMS_PER_PAGE).fill(null).map((_, index) => (
            <NewsCardSkeleton key={index} />
          ))
        ) : (
          items.map((item) => (
            <Card
              key={item.url}
              className="group relative bg-black/50 backdrop-blur-xl border-primary/20 overflow-hidden
                transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20"
            >
              <CardContent className="p-0">
                {/* Image Container */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.urlToImage}
                    alt={item.title}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/placeholder-news.webp';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <Badge
                    variant="outline"
                    className="absolute top-4 right-4 bg-primary/10 text-primary backdrop-blur-sm
                      border-primary/20 capitalize"
                  >
                    {item.category}
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(item.publishedAt)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {item.readTime}
                    </div>
                  </div>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group/title"
                  >
                    <h3 className="text-xl font-semibold text-white group-hover/title:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </a>

                  <p className="text-gray-400 line-clamp-3">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <ExternalLink className="h-4 w-4" />
                      {item.source.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        <BookmarkPlus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-primary/10 hover:text-primary"
                        onClick={() => {
                          navigator.share({
                            title: item.title,
                            text: item.description,
                            url: item.url
                          }).catch(() => {
                            navigator.clipboard.writeText(item.url);
                          });
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {!isLoading && items.length > 0 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={handlePrevPage}
            disabled={currentPage === 1 || isLoading}
            className="min-w-[100px] border-2 border-primary/40 bg-black/60 text-white/90 backdrop-blur-xl 
              hover:bg-primary/20 hover:border-primary/60 transform transition-all duration-300 hover:scale-105
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </Button>
          <span className="text-white/80 px-4">
            {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages || isLoading}
            className="min-w-[100px] border-2 border-primary/40 bg-black/60 text-white/90 backdrop-blur-xl 
              hover:bg-primary/20 hover:border-primary/60 transform transition-all duration-300 hover:scale-105
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      )}

      <ScrollToTopButton />
    </div>
  );
};

export default News; 