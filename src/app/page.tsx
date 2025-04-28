'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/store';

export default function Home() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const setUserEmail = useMemo(() => useStore.getState().setUserEmail, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setUserEmail(email);
    router.push('/products');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary-light to-primary-dark p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {/* <h1 className="text-3xl  font-bold text-center mb-8 text-primary">Welcome to Blue Bay</h1> */}
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">Welcome to Green Bay</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-black"
              placeholder="Enter your email"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors duration-200"
          >
            Continue to Shop
          </button>
        </form>
      </div>
    </div>
  );
}
