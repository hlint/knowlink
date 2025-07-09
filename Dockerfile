FROM imbios/bun-node:23-slim AS oven


FROM oven AS base
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

FROM base AS builder
WORKDIR /app
COPY ./package.json ./bun.lock ./
COPY ./patches ./patches
RUN bun ci
COPY . .
RUN sh scripts/standalone-build.sh

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone .
CMD bun start

