// src/config/runtimeConfig.ts
declare global {
    interface Window {
      __ENV__?: {
        PRODUCT_SERVICE_URL: string;
        ORDER_SERVICE_URL: string;
        CART_SERVICE_URL: string;
      };
    }
  }

export const getRuntimeConfig = () => {
    if (typeof window !== 'undefined' && window.__ENV__) {
      return {
        PRODUCT_SERVICE_URL: window.__ENV__.PRODUCT_SERVICE_URL,
        ORDER_SERVICE_URL: window.__ENV__.ORDER_SERVICE_URL,
        CART_SERVICE_URL: window.__ENV__.CART_SERVICE_URL,
      };
    }
  
    // fallback for SSR or safety
    return {
      PRODUCT_SERVICE_URL: 'http://localhost:3003',
      ORDER_SERVICE_URL: 'http://localhost:3001',
      CART_SERVICE_URL: 'http://localhost:3002',
    };
  };
  