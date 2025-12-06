FROM node:latest

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app/

EXPOSE 5000

CMD ["node","--watch","main.js"]