# Build React frontend
FROM node:20-alpine AS frontend

WORKDIR /app/client

COPY client/package*.json ./
RUN npm install --include=dev

COPY client/ ./
RUN npm run build

# Setup backend
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY server/ ./server/

# Copy frontend build
COPY --from=frontend /app/client/dist ./client/dist

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "server/server.js"]