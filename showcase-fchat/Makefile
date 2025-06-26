prod:
	docker pull frymarshall/fchat_showcase && docker compose -f docker-compose.yml up -d
	
deploy:
	docker build -t fchat_showcase -f Dockerfile . && docker tag fchat_showcase frymarshall/fchat_showcase:latest && docker push frymarshall/fchat_showcase:latest 
