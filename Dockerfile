FROM node:18.6-alpine3.16
COPY . /app
RUN npm install
EXPOSE 8080
CMD [ "node", "server.js" ]