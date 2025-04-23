'use client';

import { useEffect, useState, useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/store';
import { orderService } from '@/services/api';

interface Order {
  id: number;
  order_number: string;
  user_email: string;
  total_price: number;
  status: 'placed' | 'shipped' | 'delivered';
  created_at: string;
  updated_at: string;  // Adding this as it's returned from the backend
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();
  const store = useStore();
  
  const userEmail = useMemo(() => store.userEmail, [store.userEmail]);
  const isLoggedIn = useMemo(() => store.isLoggedIn, [store.isLoggedIn]);

  useEffect(() => {
    console.log('Orders page - Initial render', { isLoggedIn: isLoggedIn(), userEmail });
    
    if (!isLoggedIn()) {
      console.log('Orders page - User not logged in, redirecting to home');
      router.push('/');
      return;
    }

    const fetchOrders = async () => {
      try {
        console.log('Orders page - Fetching orders for email:', userEmail);
        const data = await orderService.getOrders(userEmail);
        console.log('Orders page - Received orders:', data);
        
        // Validate the data structure
        if (Array.isArray(data)) {
          // Ensure all required fields are present and of correct type
          const validatedOrders = data.map(order => ({
            id: Number(order.id),
            order_number: String(order.order_number),
            user_email: String(order.user_email),
            total_price: Number(order.total_price),
            status: order.status as 'placed' | 'shipped' | 'delivered',
            created_at: String(order.created_at),
            updated_at: String(order.updated_at)
          }));
          console.log('Orders page - Validated orders:', validatedOrders);
          setOrders(validatedOrders);
        } else {
          throw new Error('Invalid data format received from server');
        }
      } catch (error) {
        console.error('Orders page - Error fetching orders:', error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response) {
            console.error('Orders page - Error response:', {
              status: axiosError.response.status,
              data: axiosError.response.data
            });
          }
        }
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userEmail, router, isLoggedIn]);

  const handleBackToProducts = () => {
    router.push('/products');
  };

  if (loading) return <div className="text-center p-8">Loading orders...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Your Orders</h1>
          <button
            onClick={handleBackToProducts}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          >
            Back to Products
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-lg shadow">
            <p className="text-gray-800">You haven&apos;t placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Order #{order.order_number}</h2>
                    <p className="text-gray-800">
                      Placed on {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ${order.total_price.toFixed(2)}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}