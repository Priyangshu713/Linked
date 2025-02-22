import React from 'react';
import { Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import type { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const formattedDate = format(new Date(article.publishedAt), 'MMM dd, yyyy');
  const fallbackImage = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
  
  if (featured) {
    return (
      <Link
        to="/article"
        state={{ article }}
        className="relative rounded-xl overflow-hidden h-[600px] group block"
      >
        <img
          src={article.urlToImage || fallbackImage}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = fallbackImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              {article.title}
            </h2>
            <p className="text-gray-200 text-lg mb-4 line-clamp-2">
              {article.description}
            </p>
            <div className="flex items-center text-gray-300 text-sm">
              <User size={16} className="mr-2" />
              <span>{article.author || article.source.name || 'NewsDaily Staff'}</span>
              <span className="mx-2">•</span>
              <Clock size={16} className="mr-2" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/article"
      state={{ article }}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 block"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={article.urlToImage || fallbackImage}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = fallbackImage;
          }}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {article.description}
        </p>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <User size={16} className="mr-2" />
          <span>{article.author || article.source.name || 'NewsDaily Staff'}</span>
          <span className="mx-2">•</span>
          <Clock size={16} className="mr-2" />
          <span>{formattedDate}</span>
        </div>
      </div>
    </Link>
  );
}