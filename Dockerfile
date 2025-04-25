# -------------------------
# Step 1: Build the frontend
# -------------------------
FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Only run build in production mode
ARG NODE_ENV=production
RUN if [ "$NODE_ENV" = "production" ]; then npm run build && npm run export; fi

# -------------------------
# Step 2: Production image (static)
# -------------------------
FROM nginx:alpine as prod

# Copy static site
COPY --from=builder /app/out /usr/share/nginx/html

# Add env-config template
COPY public/env-config.template.js /usr/share/nginx/html/env-config.template.js

# Entry script to inject env vars
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

# -------------------------
# Step 3: Development image
# -------------------------
FROM node:20-alpine as dev

WORKDIR /app
COPY . .
RUN npm install

EXPOSE 3000
CMD ["npm", "start"]
