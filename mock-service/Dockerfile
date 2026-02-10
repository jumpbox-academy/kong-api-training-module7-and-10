FROM node:18-alpine

WORKDIR /app

COPY app.js .

RUN npm init -y && npm install express

EXPOSE 4000

CMD ["node", "app.js"]
