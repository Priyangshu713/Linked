import React, { useEffect, useState } from 'react';
import { getTopHeadlines } from '../services/newsApi';
import ArticleCard from '../components/ArticleCard';
import WeatherWidget from '../components/WeatherWidget';
import NewsletterSubscribe from '../components/NewsletterSubscribe';
import type { Article } from '../types';

export default function HomePage() {
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const news = await getTopHeadlines();
        
        if (!news || news.length === 0) {
          setError('No news articles available');
          return;
        }

        setFeaturedArticle(news[0]);
        setArticles(news.slice(1));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load news';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();

    // Auto-refresh news every 5 minutes
    const refreshInterval = setInterval(fetchNews, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 pt-32">
      {featuredArticle && (
        <section className="mb-12">
          <ArticleCard article={featuredArticle} featured />
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Latest News
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article, index) => (
                <ArticleCard 
                  key={`${article.url}-${index}`} 
                  article={article} 
                />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          <WeatherWidget />
          <NewsletterSubscribe />
        </aside>
      </div>
    </main>
  );
}