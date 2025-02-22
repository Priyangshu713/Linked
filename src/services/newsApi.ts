import axios from 'axios';
import type { NewsApiResponse, Article } from '../types';

// Ensure API key is available
const API_KEY = VITE_NEWS_API_KEY;

if (!API_KEY) {
  throw new Error('News API key is not configured. Please add VITE_NEWS_API_KEY to your environment variables.');
}

const newsApi = axios.create({
  baseURL: 'https://newsapi.org/v2',
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your News API configuration.');
    }
    if (error.response?.status === 429) {
      throw new Error('API rate limit exceeded. Please try again later.');
    }
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(`API request failed: ${errorMessage}`);
  }
  throw new Error(`API request failed: ${String(error)}`);
};

export const getTopHeadlines = async (category?: string, page: number = 1): Promise<Article[]> => {
  try {
    // Get today's date and yesterday's date
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Format dates as YYYY-MM-DD
    const fromDate = yesterday.toISOString().split('T')[0];
    const toDate = today.toISOString().split('T')[0];

    const response = await newsApi.get<NewsApiResponse>('/top-headlines', {
      params: {
        country: 'us',
        ...(category && { category }), // Only add category if it exists
        page,
        pageSize: 100,
        apiKey: API_KEY,
        from: fromDate,
        to: toDate,
        sortBy: 'publishedAt', // Sort by newest first
      },
    });

    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Failed to fetch news');
    }

    // Sort articles by date, newest first
    const articles = response.data.articles || [];
    return articles.sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  } catch (error) {
    console.error('Error fetching top headlines:', error);
    return [];
  }
};

export const searchNews = async (query: string, page: number = 1): Promise<Article[]> => {
  try {
    if (!query.trim()) {
      return [];
    }

    // Get date for last 24 hours
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Format dates as YYYY-MM-DD
    const fromDate = yesterday.toISOString().split('T')[0];
    const toDate = today.toISOString().split('T')[0];

    const response = await newsApi.get<NewsApiResponse>('/everything', {
      params: {
        q: query,
        language: 'en',
        page,
        pageSize: 100,
        sortBy: 'publishedAt', // Sort by newest first
        from: fromDate,
        to: toDate,
        apiKey: API_KEY,
      },
    });

    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Failed to fetch news');
    }

    // Sort articles by date, newest first
    const articles = response.data.articles || [];
    return articles.sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  } catch (error) {
    console.error('Error searching news:', error);
    return [];
  }
};

// Add a function to check if an article is recent (within last 24 hours)
export const isRecentArticle = (publishedAt: string): boolean => {
  const articleDate = new Date(publishedAt).getTime();
  const twentyFourHoursAgo = new Date().getTime() - (24 * 60 * 60 * 1000);
  return articleDate > twentyFourHoursAgo;
};
