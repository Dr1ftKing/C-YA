FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Accept build arg and set as env var
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the app (now VITE_API_URL is available)
RUN npm run build

EXPOSE 5173

CMD ["npm", "start"]