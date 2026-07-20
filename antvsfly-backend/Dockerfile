# backend/Dockerfile
FROM node:22-alpine

WORKDIR /app

# Erst nur package.json kopieren → Layer-Caching nutzen
COPY package*.json ./
RUN npm ci --omit=dev

# Dann den Rest des Codes
COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]