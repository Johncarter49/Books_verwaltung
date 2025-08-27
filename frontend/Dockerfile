FROM node:20-alpine

WORKDIR /app

COPY frontend/package.json frontend/pnpm-lock.yaml* /app/

RUN corepack enable && corepack prepare pnpm@9.7.0 --activate && apk add --no-cache curl
RUN pnpm install --frozen-lockfile || pnpm install

# Copy frontend files excluding node_modules
COPY frontend/webapp/ /app/webapp/
COPY frontend/ui5.yaml /app/
COPY frontend/tsconfig.json /app/

EXPOSE 8080
CMD ["pnpm", "start"]


