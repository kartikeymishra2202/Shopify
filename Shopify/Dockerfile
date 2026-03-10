# Build stage
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
COPY package-lock.json ./
RUN npm ci
COPY . .

# Vite only reads env at build time; pass these via build args in docker-compose.prod.yml
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ARG VITE_AUTH0_REDIRECT_URI
ARG VITE_MIXPANEL_TOKEN_DEV
ARG VITE_MIXPANEL_TOKEN_PROD
ENV VITE_AUTH0_DOMAIN=$VITE_AUTH0_DOMAIN \
    VITE_AUTH0_CLIENT_ID=$VITE_AUTH0_CLIENT_ID \
    VITE_AUTH0_REDIRECT_URI=$VITE_AUTH0_REDIRECT_URI \
    VITE_MIXPANEL_TOKEN_DEV=$VITE_MIXPANEL_TOKEN_DEV \
    VITE_MIXPANEL_TOKEN_PROD=$VITE_MIXPANEL_TOKEN_PROD

RUN npm run build

# Production stage (static files only)
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
