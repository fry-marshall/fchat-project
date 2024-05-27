dev:
	docker-compose -f docker-compose.dev.yml up -d

start:
	docker pull frymarshall/fchat_webapp && docker run -d frymarshall/fchat_webapp

deploy:
	docker build -t fchat_webapp -f Dockerfile.prod . && docker tag fchat_webapp frymarshall/fchat_webapp:latest && docker push frymarshall/fchat_webapp:latest 
