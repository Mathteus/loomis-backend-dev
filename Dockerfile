FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/
ENV NODE_OPTIONS="--max-old-space-size=512"
ENV REDIS_URL="redis://default:j2LHhf0MAuj0JmLvQF3Ag04GtMF623FV@redis-12567.c57.us-east-1-4.ec2.redns.redis-cloud.com:12567"

EXPOSE 10000
CMD ["node", "dist/main.js"]