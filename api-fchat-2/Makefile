dev:
	@echo "Starting app in development environment..."
	NODE_ENV=dev docker compose --env-file .env.dev up

prod:
	@echo "Starting app in production environment..."
	NODE_ENV=prod docker compose --env-file .env.prod up -d

deploy:
	docker build --target=prod -t fchat_api -f Dockerfile . && docker tag fchat_api frymarshall/fchat_api:latest && docker push frymarshall/fchat_api:latest