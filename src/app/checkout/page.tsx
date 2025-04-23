'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/store';
import { orderService, cartService, productService } from '@/services/api';

interface CartProduct {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function Checkout() {
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const router = useRouter();
  const store = useStore();
  
  const userEmail = useMemo(() => store.userEmail, [store.userEmail]);
  const cart = useMemo(() => store.cart, [store.cart]);
  const clearCart = useMemo(() => store.clearCart, [store.clearCart]);
  const isLoggedIn = useMemo(() => store.isLoggedIn, [store.isLoggedIn]);

  // Mock address for demonstration
  const mockAddress = {
    street: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'USA',
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/');
      return;
    }

    const fetchProducts = async () => {
      try {
        const allProducts = await productService.getAllProducts();
        const cartProducts = cart.map(cartItem => {
          const product = allProducts.find((p: { id: number }) => p.id === cartItem.id);
          return {
            ...product,
            quantity: cartItem.quantity,
          };
        });
        setProducts(cartProducts);
      } catch (error) {
        console.log("error: ", error)
        setError('Failed to load cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [cart, router, isLoggedIn]);

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      const total = calculateTotal();
      
      // Create order
      await orderService.createOrder(userEmail, total);
      
      // Clear cart in both backend and frontend
      await cartService.clearCart(userEmail);
      clearCart();
      
      setOrderPlaced(true);
      setTimeout(() => {
        router.push('/orders');
      }, 2000);
    } catch (error) {
      console.log("error: ", error)
      setError('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToProducts = () => {
    router.push('/products');
  };

  if (loading) return <div className="text-center p-8">Loading checkout...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;
  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-800">Redirecting to your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Checkout</h1>
          <button
            onClick={handleBackToProducts}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          >
            Back to Products
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-black">Shipping Information</h2>
          <div className="space-y-2 text-gray-800">
            <p>Email: {userEmail}</p>
            <p>Address: {mockAddress.street}</p>
            <p>City: {mockAddress.city}</p>
            <p>State: {mockAddress.state}</p>
            <p>ZIP Code: {mockAddress.zipCode}</p>
            <p>Country: {mockAddress.country}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-black">Order Summary</h2>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-800">Quantity: {product.quantity}</p>
                </div>
                <p className="font-medium text-gray-900">${(product.price * product.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-900">Total:</p>
                <p className="font-semibold text-xl text-gray-900">${calculateTotal().toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={products.length === 0}
          className={`w-full bg-primary text-white py-3 rounded-lg font-medium ${
            products.length === 0
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-primary-dark'
          }`}
        >
          Place Order
        </button>
      </div>
    </div>
  );
}