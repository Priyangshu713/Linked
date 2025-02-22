import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import type { Article } from '../types';

export default function ArticlePage() {
  const location = useLocation();
  const article = location.state?.article as Article;

  if (!article) {
    return (
      <div className="container mx-auto px-4 pt-32 text-center">
        <h1 className="text-2xl font-bold text-red-600">Article not found</h1>
        <Link to="/" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          Return to homepage
        </Link>
      </div>
    );
  }

  const formattedDate = format(new Date(article.publishedAt), 'MMMM dd, yyyy');
  const fallbackImage = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';

  return (
    <main className="container mx-auto px-4 pt-32 pb-16">
      <Link
        to="/"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to headlines
      </Link>

      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {article.title}
          </h1>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
            <User className="w-5 h-5 mr-2" />
            <span className="mr-4">{article.author || article.source.name}</span>
            <Clock className="w-5 h-5 mr-2" />
            <span>{formattedDate}</span>
          </div>

          {article.urlToImage && (
            <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
              <img
                src={article.urlToImage || fallbackImage}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = fallbackImage;
                }}
              />
            </div>
          )}
        </header>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
            {article.description}
          </p>
          
          <div className="text-gray-800 dark:text-gray-200 space-y-4">
            {article.content?.split('[+')[0]}
          </div>

          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">
              This is a preview of the article. To read the full story, visit:
            </p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-2"
            >
              {article.source.name}
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </article>
    </main>
  );
}