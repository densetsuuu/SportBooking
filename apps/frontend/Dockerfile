FROM node:20-alpine AS builder
RUN npm install -g pnpm@9

WORKDIR /app

ENV SKIP_NITRO=true

# Copier le monorepo entier (pas seulement le frontend)
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./
COPY apps ./apps

WORKDIR /app/apps/frontend

RUN pnpm install --no-frozen-lockfile
RUN pnpm build

# Stage final: nginx pour servir les fichiers statiques
FROM nginx:stable-alpine AS runner

COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
