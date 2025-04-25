// next.config.js
/** @type {import('next').NextConfig} */

const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/api/products',
            destination: 'http://product-service:3003/products',
          },
          {
            source: '/api/orders',
            destination: 'http://order-service:3001/order',
          },
          {
            source: '/api/cart/',
            destination: 'http://cart-service:3002/cart',
          },
          {
            source: '/api/cart/:path*',
            destination: 'http://cart-service:3002/cart/:path*',
          },
        ];
      },
    output: 'export',
  };
  
  module.exports = nextConfig;
  