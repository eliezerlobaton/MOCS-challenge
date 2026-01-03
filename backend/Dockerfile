FROM node:22-alpine

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.26.2 --activate

WORKDIR /app

# Marcar que está rodando em Docker
ENV DOCKER=true
ENV IS_DOCKER=true

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build TypeScript
RUN pnpm build

# Expose backend port
EXPOSE 3001

# Start development server (without --env-file flag in Docker)
CMD ["pnpm", "start"]
