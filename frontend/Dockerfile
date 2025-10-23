# frontend/Dockerfile
# Stage 1: Build the Next.js app
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package.json and install dependencies first (for better caching)
COPY package*.json ./
RUN npm cache clean --force
RUN npm ci

# Copy all necessary files for build
COPY . .

# Build the production-ready static files
RUN npm run build

# Stage 2: Serve the app
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV production

# Copy built application and necessary files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000
CMD ["npm", "start"]