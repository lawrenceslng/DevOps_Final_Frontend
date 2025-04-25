import axios from 'axios';
import { getRuntimeConfig } from '@/config/runtimeConfig';

// Product Service
export const productService = {
  getAllProducts: async () => {
    const { PRODUCT_SERVICE_URL } = getRuntimeConfig(); // ✅ Now read at runtime
    console.log(PRODUCT_SERVICE_URL);
    const response = await axios.get(`${PRODUCT_SERVICE_URL}/products`);
    return response.data;
  }
};

// Order Service
export const orderService = {
  getOrders: async (email: string) => {
    const { ORDER_SERVICE_URL } = getRuntimeConfig(); // ✅ Runtime-safe
    console.log('API Service - Getting orders for email:', email);
    console.log('API Service - Using ORDER_SERVICE_URL:', ORDER_SERVICE_URL);
    try {
      const response = await axios.get(`${ORDER_SERVICE_URL}/order?email=${email}`);
      return response.data;
    } catch (error) {
      console.error('API Service - Error getting orders:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('API Service - Error details:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      }
      throw error;
    }
  },

  createOrder: async (email: string, total_price: number) => {
    const { ORDER_SERVICE_URL } = getRuntimeConfig(); // ✅ Runtime-safe
    console.log('API Service - Creating order:', { email, total_price });
    try {
      const response = await axios.post(`${ORDER_SERVICE_URL}/order`, {
        user_email: email,
        total_price
      });
      return response.data;
    } catch (error) {
      console.error('API Service - Error creating order:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('API Service - Error details:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      }
      throw error;
    }
  }
};

// Cart Service
export const cartService = {
  getCart: async (email: string) => {
    const { CART_SERVICE_URL } = getRuntimeConfig(); // ✅ Runtime-safe
    const response = await axios.get(`${CART_SERVICE_URL}/cart?user_email=${email}`);
    return response.data;
  },

  addToCart: async (email: string, productId: number, quantity: number) => {
    const { CART_SERVICE_URL } = getRuntimeConfig(); // ✅ Runtime-safe
    const response = await axios.post(`${CART_SERVICE_URL}/cart`, {
      user_email: email,
      product_id: productId,
      quantity
    });
    return response.data;
  },

  clearCart: async (email: string) => {
    const { CART_SERVICE_URL } = getRuntimeConfig(); // ✅ Runtime-safe
    const response = await axios.post(`${CART_SERVICE_URL}/cart/clear`, {
      user_email: email
    });
    return response.data;
  }
};
