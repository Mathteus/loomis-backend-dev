FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY dist/ ./dist/

EXPOSE 10000
CMD ["node", "dist/main.js"]
