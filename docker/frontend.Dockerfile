FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

# Copy application
COPY frontend/ .

# Expose port
EXPOSE 3000

# Run in development mode
CMD ["npm", "run", "dev"]
