# ---------- Stage 1: Build with Bun ----------
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy lockfile + package.json first (better caching)
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Build the app
RUN bun run build


# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=builder /app/dist/client /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
