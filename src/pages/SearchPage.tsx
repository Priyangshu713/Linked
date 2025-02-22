import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchNews } from '../services/newsApi';
import ArticleCard from '../components/ArticleCard';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const results = await searchNews(query);
      setArticles(results);
      setLoading(false);
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 pt-32">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Search Results for "{query}"
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <ArticleCard key={index} article={article} />
        ))}
      </div>
    </main>
  );
}