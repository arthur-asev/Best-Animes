FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY server-test.js ./
COPY src ./src
EXPOSE 5000
CMD ["node", "server-test.js"]
