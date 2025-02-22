import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import ArticlePage from './pages/ArticlePage';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    // Remove no-transition class after page load
    const timeout = setTimeout(() => {
      document.documentElement.classList.remove('no-transition');
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  // Add no-transition class to prevent transition on page load
  useEffect(() => {
    document.documentElement.classList.add('no-transition');
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen onLoadComplete={handleLoadComplete} />}
      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/article" element={<ArticlePage />} />
            </Routes>
          </div>
        </Router>
      </div>
    </>
  );
}

export default App;