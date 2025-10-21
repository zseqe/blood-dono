# frontend/Dockerfile
# Stage 1: Build the Next.js app
FROM node:18-alpine AS builder
WORKDIR /app

# Copy necessary config and source code first
COPY next.config.mjs ./
COPY tsconfig.json ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY components.json ./
COPY ./public ./public
COPY ./app ./app
COPY ./lib ./lib
COPY ./hooks ./hooks
COPY ./components ./components

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm cache clean --force
RUN npm install

# Build the production-ready static files
RUN npm run build

# Stage 2: Serve the app
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]