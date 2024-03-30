
start:
	docker-compose -f docker-compose.dev.yml up -d

deploy:
	docker compose -f docker-compose.prod.yml pull && docker-compose -f docker-compose.prod.yml up -d

deploy-image:
	docker build -t fchat_auth -f Dockerfile.prod . && docker tag fchat_auth frymarshall/fchat_auth:latest && docker push frymarshall/fchat_auth:latest 
