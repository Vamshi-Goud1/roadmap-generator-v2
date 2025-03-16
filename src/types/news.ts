export interface NewsItem {
  source: {
    id: string | null;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
  category?: string;
  readTime?: string;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsItem[];
} 