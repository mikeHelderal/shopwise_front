# Étape 1 : Build de l'app Angular
FROM node:22-alpine as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Étape 2 : Serveur Nginx pour distribuer le front
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/shopwise-front/browser/. /usr/share/nginx/html/
# Configuration pour éviter les erreurs 404 lors du rafraîchissement des pages Angular
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
    location /api { \
            proxy_pass http://backend:8080; \
            proxy_set_header Host \$host; \
            proxy_set_header X-Real-IP \$remote_addr; \
        } \
}" > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
