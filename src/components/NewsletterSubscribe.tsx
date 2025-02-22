import React, { useState } from 'react';
import { Mail } from 'lucide-react';

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h3 className="text-xl font-semibold ml-2 text-gray-900 dark:text-white">
          Subscribe to Our Newsletter
        </h3>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Get the latest news delivered directly to your inbox
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}