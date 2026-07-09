FROM node:20-alpine

WORKDIR /app

COPY client/package*.json client/
RUN cd client && npm install

COPY server/package*.json server/
RUN cd server && npm install

COPY client/ client/
COPY server/ server/

RUN cd client && npm run build

EXPOSE 3001

WORKDIR /app/server
CMD ["node", "src/index.js"]
