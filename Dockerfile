FROM node:14.21.1-alpine

COPY . /app

WORKDIR /app/flower-catalog

RUN npm install

ENTRYPOINT ["npm", "start"]