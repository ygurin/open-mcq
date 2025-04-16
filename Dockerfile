FROM node:20-alpine as build

WORKDIR /app

# Install necessary utilities
RUN apk add --no-cache bash curl unzip

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy only the necessary files for building
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY eslint.config.js ./
COPY index.html ./
COPY src/ ./src/
COPY public/ ./public/

# Copy the download script
COPY download-data.sh ./
RUN chmod +x download-data.sh

# Run the script with argument '1' to select the first option non-interactively
RUN ./download-data.sh 1

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage to nginx serve directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]