#FROM python:3.8.10-slim
FROM python:3.10-slim as back-end-build

# building the fast-api server
WORKDIR /app

COPY back-end /app
#COPY Database/init.sql /docker-entrypoint-initdb.d/
#COPY back-end/requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

# buidling the web
#FROM node:18-alpine as front-end-build
#
#WORKDIR /food-web
#COPY front-end/dist/intellichef /usr/share/nginx/html
#
#FROM nginx:latest as ngin-build
#COPY front-end/nginx.conf  /etc/nginx/conf.d/default.conf
#
## Expose ports for both frontend and backend
#EXPOSE 80
EXPOSE 8000

