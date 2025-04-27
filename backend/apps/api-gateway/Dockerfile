FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build application
RUN npm run build api-gateway

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist/apps/api-gateway ./dist/apps/api-gateway
COPY --from=builder /app/proto ./proto
COPY --from=builder /app/libs ./libs

# Copy template files
COPY ./apps/api-gateway/templates ./dist/apps/api-gateway/templates

# Environment variables
ENV NODE_ENV=production

# Expose port for API Gateway
EXPOSE 3000

# Command to run the API Gateway
CMD ["node", "dist/apps/api-gateway/src/main.js"]