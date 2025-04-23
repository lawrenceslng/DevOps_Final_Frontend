import axios from 'axios';

const PRODUCT_SERVICE_URL = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || 'http://localhost:3003';
const ORDER_SERVICE_URL = process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || 'http://localhost:3001';
const CART_SERVICE_URL = process.env.NEXT_PUBLIC_CART_SERVICE_URL || 'http://localhost:3002';

// Product Service
export const productService = {
  getAllProducts: async () => {
    console.log(PRODUCT_SERVICE_URL)
    const response = await axios.get(`${PRODUCT_SERVICE_URL}/products`);
    return response.data;
  }
};

// Order Service
export const orderService = {
  getOrders: async (email: string) => {
    console.log('API Service - Getting orders for email:', email);
    console.log('API Service - Using ORDER_SERVICE_URL:', ORDER_SERVICE_URL);
    try {
      const response = await axios.get(`${ORDER_SERVICE_URL}/order?email=${email}`);
      console.log('API Service - Orders response:', response.data);
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
    console.log('API Service - Creating order:', { email, total_price });
    try {
      const response = await axios.post(`${ORDER_SERVICE_URL}/order`, {
        user_email: email,
        total_price
      });
      console.log('API Service - Create order response:', response.data);
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
    const response = await axios.get(`${CART_SERVICE_URL}/cart?user_email=${email}`);
    return response.data;
  },

  addToCart: async (email: string, productId: number, quantity: number) => {
    const response = await axios.post(`${CART_SERVICE_URL}/cart`, {
      user_email: email,
      product_id: productId,
      quantity
    });
    return response.data;
  },

  clearCart: async (email: string) => {
    const response = await axios.post(`${CART_SERVICE_URL}/cart/clear`, {
      user_email: email
    });
    return response.data;
  }
};