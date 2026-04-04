# -------------------------------------------------------
# Frontend — Next.js + React + TypeScript
# -------------------------------------------------------

FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Install dependencies first (separate layer for Docker cache efficiency)
COPY budget-tracker/package.json budget-tracker/package-lock.json* ./
RUN npm install

# Copy the rest of the source code
# (in dev this is overridden by the volume mount in docker-compose.yml)
COPY budget-tracker/ .

# Expose the port Next.js dev server listens on
EXPOSE 3000

# Start Next.js in development mode with hot-reloading
CMD ["npm", "run", "dev"]