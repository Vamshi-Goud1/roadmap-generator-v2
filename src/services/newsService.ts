import axios from 'axios';

// You'll need to sign up for a free API key at https://newsapi.org
const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: {
    name: string;
  };
  publishedAt: string;
  url: string;
  urlToImage: string;
  category: 'education' | 'technology' | 'jobs';
}

export interface NewsResponse {
  education: NewsItem[];
  technology: NewsItem[];
  jobs: NewsItem[];
}

const fetchCategoryNews = async (query: string, category: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/everything`, {
      params: {
        q: query,
        apiKey: API_KEY,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 6, // Limit to 6 articles per category
      },
    });

    return response.data.articles.map((article: any) => ({
      ...article,
      id: Math.random().toString(36).substr(2, 9), // Generate a random ID
      category,
    }));
  } catch (error) {
    console.error(`Error fetching ${category} news:`, error);
    return [];
  }
};

export const fetchAllNews = async (): Promise<NewsResponse> => {
  try {
    const [educationNews, techNews, jobNews] = await Promise.all([
      fetchCategoryNews('education AND (online learning OR skills development OR career development)', 'education'),
      fetchCategoryNews('technology AND (AI OR machine learning OR software development)', 'technology'),
      fetchCategoryNews('job market AND (remote work OR career opportunities OR employment trends)', 'jobs'),
    ]);

    return {
      education: educationNews,
      technology: techNews,
      jobs: jobNews,
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    throw new Error('Failed to fetch news updates');
  }
};

const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';

export const fetchNews = async () => {
  try {
    const response = await axios.get(NEWS_API_URL, {
      params: {
        country: 'us',
        category: 'technology',
        pageSize: 6,
        page: 1,
        apiKey: API_KEY,
      },
    });

    // Process the articles to use placeholder image if urlToImage has CORS issues
    const articles = response.data.articles.map(article => ({
      ...article,
      // Use a fallback image if the urlToImage is from a problematic domain
      urlToImage: article.urlToImage?.includes('videocardz.com') 
        ? '/placeholder-news.jpg' // You should add this placeholder image to your public folder
        : article.urlToImage
    }));

    return { ...response.data, articles };
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}; 