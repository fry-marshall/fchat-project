dev:
	docker-compose -f docker-compose.dev.yml up -d

start:
	docker pull frymarshall/fchat_auth && docker run -d frymarshall/fchat_auth

deploy:
	docker build -t fchat_auth -f Dockerfile.prod . && docker tag fchat_auth frymarshall/fchat_auth:latest && docker push frymarshall/fchat_auth:latest 
