FROM node:24-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

ENV TURBO_TELEMETRY_DISABLED=1
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ENV UPDATENOTIFIER=false

FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN pnpm add --global turbo@2.3.3
COPY . .
RUN turbo prune @sport-booking/backend --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=builder /app/out/json .
COPY --from=builder /app/out/pnpm-lock.yaml .

RUN pnpm install

COPY --from=builder /app/out/full .
RUN pnpm turbo build --filter=@sport-booking/backend...

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN mkdir /app/tmp

COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/backend/node_modules ./build/node_modules
COPY --from=installer /app/apps/backend/build ./build

EXPOSE 3333
CMD ["node", "build/bin/server.js"]