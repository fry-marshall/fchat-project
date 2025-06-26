dev:
	docker compose -f docker-compose.dev.yml up

prod:
	docker pull frymarshall/fchat_auth && docker compose -f docker-compose.yml up -d
	
deploy:
	docker build -t fchat_auth -f Dockerfile . && docker tag fchat_auth frymarshall/fchat_auth:latest && docker push frymarshall/fchat_auth:latest 
