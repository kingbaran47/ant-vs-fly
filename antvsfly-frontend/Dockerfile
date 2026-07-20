# Build stage
FROM node:22-alpine AS build
WORKDIR /app

# Erst nur package.json kopieren → Layer-Caching nutzen
COPY package*.json ./
RUN npm ci

# Dann den Rest des Codes
COPY . .

# Standardmäßig Production-Build (backendUrl aus environment.production.ts);
# via --build-arg BUILD_CONFIGURATION=development lässt sich z.B. localhost:3000 einkompilieren
ARG BUILD_CONFIGURATION=production
RUN npm run build -- --configuration=$BUILD_CONFIGURATION

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist/antvsfly-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
