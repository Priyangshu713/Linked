import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchButtonProps {
    onClick: () => Promise<void>;
    isLoading?: boolean;
}

export default function SearchButton({ onClick, isLoading }: SearchButtonProps) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isLoading || isAnimating) return;

        // Create ripple effect
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();

        setRipples(prev => [...prev, { x, y, id }]);
        setIsAnimating(true);

        // Remove ripple after animation
        setTimeout(() => {
            setRipples(prev => prev.filter(ripple => ripple.id !== id));
        }, 1000);

        try {
            await onClick();
        } finally {
            setIsAnimating(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className="relative overflow-hidden px-6 py-2 bg-blue-500 hover:bg-blue-600 
                 text-white rounded-lg transform transition-all duration-300 ease-out
                 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed
                 shadow-lg hover:shadow-blue-500/50 group"
            style={{ isolation: 'isolate' }}
        >
            <div className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Search className={`w-5 h-5 transition-transform duration-300 
                            ${isAnimating ? 'scale-90' : 'scale-100'}`} />
                )}
                <span className={`font-medium transition-opacity duration-300
                         ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                    Search
                </span>
            </div>

            {/* Ripple effects */}
            {ripples.map(ripple => (
                <span
                    key={ripple.id}
                    className="absolute bg-white/30 rounded-full animate-ripple"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        transform: 'translate(-50%, -50%)',
                        width: '200%',
                        paddingBottom: '200%',
                    }}
                />
            ))}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent
                    translate-x-[-100%] group-hover:translate-x-[100%] transition-transform
                    duration-1000 ease-out" />
        </button>
    );
} 