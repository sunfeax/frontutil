FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG API_URL=/api
RUN sed -i "s|http://localhost:8089|${API_URL}|g" src/app/environment/environment.ts && \
    npm run build && \
    if [ -d dist/frontutil/browser ]; then mv dist/frontutil/browser dist/app; else mv dist/frontutil dist/app; fi

FROM nginx:1.27-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/app/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
