dev:
	docker compose -f docker-compose.dev.yml up

prod:
	docker pull frymarshall/fchat_webapp && docker compose -f docker-compose.yml up -d

push-image:
	docker build -t fchat_webapp -f Dockerfile . && docker tag fchat_webapp frymarshall/fchat_webapp:latest && docker push frymarshall/fchat_webapp:latest 
