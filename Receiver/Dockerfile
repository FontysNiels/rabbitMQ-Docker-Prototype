FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY receive_logs_direct.js ./

EXPOSE 5000

CMD ["node", "receive_logs_direct.js", "info"]