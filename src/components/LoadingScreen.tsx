import React, { useEffect, useState } from 'react';
import { Link as LinkIcon } from 'lucide-react';

interface LoadingScreenProps {
    onLoadComplete?: () => void;
}

export default function LoadingScreen({ onLoadComplete }: LoadingScreenProps) {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [loadingText, setLoadingText] = useState('Connecting to your world');

    // Loading text animation
    useEffect(() => {
        const texts = [
            'Connecting to your world',
            'Curating your feed',
            'Almost ready',
        ];
        let currentIndex = 0;

        const textInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % texts.length;
            setLoadingText(texts[currentIndex]);
        }, 2500);

        return () => clearInterval(textInterval);
    }, []);

    // Progress animation
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => {
                        setIsVisible(false);
                        onLoadComplete?.();
                    }, 500);
                    return 100;
                }
                return Math.min(prev + Math.random() * 8, 100);
            });
        }, 150);

        return () => clearInterval(timer);
    }, [onLoadComplete]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
            <div className="relative flex flex-col items-center">
                {/* Logo */}
                <div className="mb-8 relative">
                    <div className="relative flex items-center gap-2 transform-gpu">
                        <LinkIcon className="w-12 h-12 text-blue-600 dark:text-blue-500 animate-pulse" />
                        <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-500 dark:to-blue-700 bg-clip-text text-transparent">
                            Linked
                        </span>
                    </div>
                </div>

                {/* Progress Circle */}
                <div className="relative w-24 h-24 mb-8">
                    <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle
                            className="text-gray-100 dark:text-gray-800"
                            strokeWidth="6"
                            stroke="currentColor"
                            fill="none"
                            r="44"
                            cx="50"
                            cy="50"
                        />
                        {/* Progress circle */}
                        <circle
                            className="text-blue-600 dark:text-blue-500 transition-all duration-300 ease-in-out"
                            strokeWidth="6"
                            strokeDasharray={276.46}
                            strokeDashoffset={276.46 - (progress / 100) * 276.46}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            r="44"
                            cx="50"
                            cy="50"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-medium text-gray-800 dark:text-gray-200">
                            {Math.round(progress)}%
                        </span>
                    </div>
                </div>

                {/* Loading Text */}
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 text-lg font-medium min-h-[28px] animate-fade">
                        {loadingText}
                    </p>
                    <div className="flex gap-1.5 justify-center mt-2">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-bounce"
                                style={{ animationDelay: `${i * 0.15}s` }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Minimal background pattern */}
            <div className="absolute inset-0 -z-10 opacity-[0.02] dark:opacity-[0.05]">
                <div className="absolute inset-0 bg-gradient-radial" />
                <div className="absolute inset-0 bg-minimal-grid" />
            </div>
        </div>
    );
} 