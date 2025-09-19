FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/
ENV NODE_OPTIONS="--max-old-space-size=512"

EXPOSE 3000
CMD ["node", "dist/main.js"]