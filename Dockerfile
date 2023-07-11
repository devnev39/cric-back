FROM node:18.6-alpine3.16
WORKDIR /app
COPY package*.json /app/
RUN npm install react-scripts@5.0.1 -g --silent
RUN npm ci
COPY . /app
EXPOSE 8080
CMD [ "node", "server.js" ]