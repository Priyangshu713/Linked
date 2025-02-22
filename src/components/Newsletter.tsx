import React, { useState } from 'react';
import { Mail, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { subscribeToNewsletter } from '../services/emailService';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const validateEmail = (email: string) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setStatus('error');
            setMessage('Please enter a valid email address');
            return;
        }

        try {
            setLoading(true);
            setStatus('idle');
            setMessage('');

            await subscribeToNewsletter(email);

            setStatus('success');
            setMessage('Thank you for subscribing! Please check your email for confirmation.');
            setEmail('');
        } catch (error) {
            setStatus('error');
            setMessage(error instanceof Error ? error.message : 'Failed to subscribe');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
                <Mail className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-bold text-white">Subscribe to Our Newsletter</h2>
            </div>

            <p className="text-gray-300 mb-4">
                Get the latest news delivered directly to your inbox
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                        'Subscribe'
                    )}
                </button>
            </form>

            {status !== 'idle' && (
                <div className={`mt-4 flex items-center gap-2 ${status === 'success' ? 'text-green-500' : 'text-red-500'
                    }`}>
                    {status === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <XCircle className="w-5 h-5" />
                    )}
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
} 