# ---- Base Stage ----
FROM node:18-alpine AS base
RUN apk add --no-cache openssl
WORKDIR /app

# Install dependencies only when needed
COPY package*.json ./
RUN npm ci --only=production

# Generate Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# ---- Final Stage ----
FROM node:18-alpine
RUN apk add --no-cache openssl
WORKDIR /app

# Copy from base
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/prisma ./prisma

# Copy source
COPY src ./src

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "src/server.js"]