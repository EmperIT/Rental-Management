FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./

# Đảm bảo NODE_ENV=production và PUBLIC_URL được đặt đúng
ENV NODE_ENV=production
ENV PUBLIC_URL=.

# First update the package-lock.json
RUN npm install

# Copy all files
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Tạo file config.js để lưu trữ cấu hình runtime
RUN echo "window.RUNTIME_CONFIG = { \
    API_BASE_URL: '/api' \
};" > /usr/share/nginx/html/config.js

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]