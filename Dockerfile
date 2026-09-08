FROM node:22-alpine

WORKDIR /app

# Install build tools required by better-sqlite3
RUN apk add --no-cache python3 make g++

# Install production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy application
COPY . ./

# Create non-root user
RUN addgroup -S app && adduser -S app -G app
RUN chown -R app:app /app

USER app

EXPOSE 4001
VOLUME ["/app/data"]

CMD ["node", "server/server.js"]
