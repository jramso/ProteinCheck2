# Use the official Node.js 20 Alpine image as base
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first for better caching of dependencies
COPY package*.json ./

# Install dependencies (both dev and prod dependencies are needed for building Vite and running server.ts via tsx)
RUN npm ci

# Copy all project files
COPY . .

# Build the frontend application using Vite
RUN npm run build

# Expose the application port
EXPOSE 3000

# Set environment variables default
ENV NODE_ENV=production
ENV PORT=3000

# Command to run the application using tsx runner
CMD ["npx", "tsx", "server.ts"]
