# Psykologkompasset - produktions-image til Coolify (Hetzner).
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
# Fuld node_modules, så Prisma CLI kan køre migrationer ved opstart.
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
# UPLOAD_DIR skal være et persistent volume (fx /data/uploads), sat i Coolify.
CMD ["sh", "-c", "node node_modules/prisma/build/index.js migrate deploy && node server.js"]
