'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/store';
import { productService } from '@/services/api';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  
  const router = useRouter();
  const store = useStore();
  
  const addToCart = useMemo(() => store.addToCart, [store.addToCart]);
  const isLoggedIn = useMemo(() => store.isLoggedIn, [store.isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/');
      return;
    }

    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        // Ensure data is an array
        const productsArray = Array.isArray(data) ? data : [];
        setProducts(productsArray);
        const initialQuantities = productsArray.reduce((acc: { [key: number]: number }, product: Product) => {
          acc[product.id] = 1;
          return acc;
        }, {});
        setQuantities(initialQuantities);
      } catch (error) {
        console.log("error: ", error)
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [router, isLoggedIn]);

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id];
    if (quantity > 0 && quantity <= product.quantity) {
      addToCart(product.id, quantity);
    }
  };

  if (loading) return <div className="text-center p-8">Loading products...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Products</h1>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/orders')}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
            >
              View Orders
            </button>
            <button
              onClick={() => router.push('/checkout')}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
            >
              Checkout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h2>
              <p className="text-gray-800 mb-4">${Number(product.price).toFixed(2)}</p>
              <p className="text-sm text-gray-700 mb-4">
                Available: {product.quantity}
              </p>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={quantities[product.id]}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value > 0 && value <= product.quantity) {
                      setQuantities({
                        ...quantities,
                        [product.id]: value,
                      });
                    }
                  }}
                  className="w-20 px-2 py-1 border rounded"
                />
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}