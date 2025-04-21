dev:
	@echo "Starting app in development environment..."
	NODE_ENV=dev docker compose --env-file .env.dev up

prod:
	@echo "Starting app in production environment..."
	NODE_ENV=prod docker compose --env-file .env.prod up -d
