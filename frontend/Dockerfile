# Етап 1: Збираємо готовий проєкт (Build)
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Етап 2: Роздаємо зібрані файли через легкий сервер Nginx
FROM nginx:alpine
# Копіюємо результат з попереднього етапу в папку Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Відкриваємо стандартний веб-порт
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]