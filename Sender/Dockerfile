FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY emit_log_direct.js ./

EXPOSE 5000

CMD ["node", "emit_logs_direct.js"]