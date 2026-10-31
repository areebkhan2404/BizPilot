FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY server/ ./server/
COPY uploads/ ./uploads/
EXPOSE 5000
CMD ["node", "server/server.js"]
