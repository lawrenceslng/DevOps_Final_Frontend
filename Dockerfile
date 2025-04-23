# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

# Environment variables for service URLs
ENV NEXT_PUBLIC_PRODUCT_SERVICE_URL=http://localhost:3003
ENV NEXT_PUBLIC_ORDER_SERVICE_URL=http://localhost:3001
ENV NEXT_PUBLIC_CART_SERVICE_URL=http://localhost:3002