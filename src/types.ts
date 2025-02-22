export interface Article {
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  author: string;
  source: {
    id: string | null;
    name: string;
  };
}

export interface NewsApiResponse {
  status: 'ok' | 'error';
  totalResults?: number;
  articles?: Article[];
  message?: string;
  code?: string;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
}

export type Category = 'politics' | 'business' | 'sports' | 'entertainment' | 'technology';