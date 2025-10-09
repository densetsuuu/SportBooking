FROM node:24-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

ENV TURBO_TELEMETRY_DISABLED=1
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ENV UPDATENOTIFIER=false

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
RUN pnpm add --global turbo@2.3.3
COPY . .
RUN turbo prune @sport_booking/backend --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=builder /app/out/json .
COPY --from=builder /app/out/pnpm-lock.yaml .
RUN pnpm install

# Build the project
COPY --from=builder /app/out/full .
COPY turbo.json turbo.json
RUN pnpm turbo build --filter=@sport_booking/backend

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN mkdir /app/tmp
COPY --from=installer /app .

EXPOSE 3333
CMD ["sh", "-c", "cd apps/backend/build && node bin/server.js"]
