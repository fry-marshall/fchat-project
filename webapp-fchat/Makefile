
start:
	docker-compose -f docker-compose.dev.yml up -d

deploy:
	docker compose -f docker-compose.prod.yml pull && docker-compose -f docker-compose.prod.yml up -d

deploy-image:
	docker build -t fchat_webapp -f Dockerfile.prod . && docker tag fchat_webapp frymarshall/fchat_webapp:latest && docker push frymarshall/fchat_webapp:latest 
