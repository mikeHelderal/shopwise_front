# Étape 1 : Build de l'app Angular
FROM node:22-alpine as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Étape 2 : Serveur Nginx pour distribuer le front
FROM nginx:alpine
COPY --from=build /app/dist/shopwise-front /usr/share/nginx/html
EXPOSE 80
