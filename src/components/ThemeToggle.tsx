import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains('dark');
        setIsDark(isDarkMode);
    }, []);

    const toggleTheme = () => {
        if (isTransitioning) return; // Prevent multiple clicks during transition

        setIsTransitioning(true);
        const html = document.documentElement;

        // Add transition class before theme change
        html.classList.add('animate-dark-mode');

        // Add fade out
        document.body.classList.add('fade-out');

        setTimeout(() => {
            if (html.classList.contains('dark')) {
                html.classList.remove('dark');
                setIsDark(false);
                localStorage.theme = 'light';
            } else {
                html.classList.add('dark');
                setIsDark(true);
                localStorage.theme = 'dark';
            }

            // Remove fade out
            setTimeout(() => {
                document.body.classList.remove('fade-out');
                html.classList.remove('animate-dark-mode');
                setIsTransitioning(false);
            }, 300);
        }, 200);
    };

    return (
        <button
            onClick={toggleTheme}
            disabled={isTransitioning}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 transition-all duration-500 ease-in-out
                        hover:scale-110 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500 transition-all duration-500 ease-in-out 
                               rotate-0 hover:rotate-180 transform-gpu" />
            ) : (
                <Moon className="w-5 h-5 text-gray-700 transition-all duration-500 ease-in-out 
                                rotate-0 hover:-rotate-180 transform-gpu" />
            )}
        </button>
    );
} 