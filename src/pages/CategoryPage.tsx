import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTopHeadlines } from '../services/newsApi';
import ArticleCard from '../components/ArticleCard';

export default function CategoryPage() {
  const { category } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const news = await getTopHeadlines(category);
      setArticles(news);
      setLoading(false);
    };

    fetchNews();
  }, [category]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 pt-32">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white capitalize">
        {category} News
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <ArticleCard key={index} article={article} />
        ))}
      </div>
    </main>
  );
}