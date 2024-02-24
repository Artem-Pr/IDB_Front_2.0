# Use this if app is not builded

# Stage 1
FROM node:17-alpine as builder

ARG HOST_APP_PORT
ARG LOCAL_BACKEND_PORT
ARG LOCAL_BACKEND_WEB_SOCKET_PORT

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .

# Create the .env file with multiple environment variables
RUN echo "HOST_APP_PORT=${HOST_APP_PORT}" > .env && \
    echo "LOCAL_BACKEND_PORT=${LOCAL_BACKEND_PORT}" >> .env && \
    echo "LOCAL_BACKEND_WEB_SOCKET_PORT=${LOCAL_BACKEND_WEB_SOCKET_PORT}" >> .env

RUN npm run build-dev-back

# Stage 2
FROM nginx:1.25-alpine
EXPOSE 3000

# Copy the build output to replace the default nginx contents.
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]



# Use this if app is already builded

# FROM nginx:1.25-alpine
# EXPOSE 3000

# # Copy the build output to replace the default nginx contents.
# COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
# RUN rm -rf /usr/share/nginx/html/*
# COPY ./build /usr/share/nginx/html

# ENTRYPOINT [ "nginx", "-g", "daemon off;" ]