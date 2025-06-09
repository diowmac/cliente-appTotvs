# Build da aplicação
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Servir via Nginx
FROM nginx:alpine
COPY --from=build /app/dist/cliente-app/browser /usr/share/nginx/html

# Copia o nginx.conf customizado
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
