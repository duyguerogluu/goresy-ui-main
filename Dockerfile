# build env
FROM node:16.15.1-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . ./
RUN npm run build

# production env
FROM nginx:1.23.0
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/startup.sh /
EXPOSE 80
CMD /startup.sh
