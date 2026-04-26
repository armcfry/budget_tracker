#!/usr/bin/env bash
# Environment variables for docker-compose.yml

# --- Postgres ---
export DB_NAME="budget-tracker"
export DB_USER="postgres"
export DB_PASSWORD="postgres-test"

# --- Backend ---
export APP_ENV="development"          # development | production
export SECRET_KEY="change-me-to-a-random-secret"

# --- Frontend ---
export NEXT_PUBLIC_API_URL="http://localhost:8000"

# --- pgAdmin (optional, only used with --profile tools) ---
export PGADMIN_EMAIL="armcfry@gmail.com"
export PGADMIN_PASSWORD="changeme"
