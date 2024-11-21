FROM nginx:latest

# Copy the static website files to the Nginx document root
COPY ./build/ /etc/nginx/html/
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
