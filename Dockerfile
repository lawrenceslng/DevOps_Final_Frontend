# -------------------------
# Step 1: Development image (for local dev with live reload)
# -------------------------
FROM node:20-alpine as dev

WORKDIR /app
COPY . .
RUN npm install

EXPOSE 3000
CMD ["npm", "run", "dev"]

# -------------------------
# Step 2: Build the frontend (production build + export)
# -------------------------
FROM node:20-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build && npm run export

# -------------------------
# Step 3: Production image (static site)
# -------------------------
FROM nginx:alpine as prod

# Copy static site
COPY --from=builder /app/out /usr/share/nginx/html

# Copy template for runtime config
COPY public/env-config.template.js /usr/share/nginx/html/env-config.template.js

# Inject config at container startup
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
