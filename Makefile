.PHONY: up down reset logs ps

# Start all containers
up:
	source ./set_env.sh && docker compose up -d

# Bring containers down, keep data intact
down:
	docker compose down

# Bring containers down AND wipe all persistent data (postgres volume)
reset:
	docker compose down -v --remove-orphans

# Tail logs across all containers (Ctrl+C to stop)
logs:
	docker compose logs -f

# Show running container status
status:
	docker compose ps
