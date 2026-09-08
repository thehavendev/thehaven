FROM node:20-alpine

WORKDIR /app

# Install production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --production

# Copy application
COPY . ./

# Create non-root user
RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 4001
VOLUME ["/app/data"]

CMD ["node", "server/server.js"]
