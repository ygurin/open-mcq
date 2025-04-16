FROM node:20-alpine as build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy only the necessary files for building
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY eslint.config.js ./
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

# Download data (required step)
COPY download-data.sh ./
RUN chmod +x download-data.sh
# Use echo to automatically select option 1 when prompted
RUN echo "1" | ./download-data.sh

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage to nginx serve directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]