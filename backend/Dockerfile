FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/proto ./proto

# Copy template files (for email service)
COPY ./apps/email/templates ./dist/apps/email/templates
COPY ./apps/api-gateway/templates ./dist/apps/api-gateway/templates

# Environment variables
ENV NODE_ENV=production

# Expose port for API Gateway
EXPOSE 3000

# Command to run the app (default to API Gateway)
CMD ["npm", "run", "start:prod"]