# Stage 1: Base
FROM node:18-alpine AS base
LABEL maintainer="AdithNair03"
LABEL description="Skill Bridge Backend API"
LABEL version="1.0.0"

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production && npm cache clean --force

# Stage 2: Production
FROM node:18-alpine AS production

WORKDIR /app

# Copy node_modules from base
COPY --from=base /app/node_modules ./node_modules

# Copy source code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S skillbridge -u 1001

# Set ownership
RUN chown -R skillbridge:nodejs /app

# Switch to non-root user
USER skillbridge

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:5000 || exit 1

# Start command
CMD ["node", "server.js"]
