FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build application
RUN npm run build contract

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist/apps/contract ./dist/apps/contract
COPY --from=builder /app/proto ./proto
COPY --from=builder /app/libs ./libs

# Environment variables
ENV NODE_ENV=production

# Command to run the Contract service
CMD ["node", "dist/apps/contract/src/main.js"]