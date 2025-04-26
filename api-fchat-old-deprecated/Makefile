dev:
	docker-compose -f docker-compose.dev.yml up -d

start:
	docker pull frymarshall/fchat_api && docker compose -f docker-compose.prod.yml up -d

deploy:
	docker build -t fchat_api -f Dockerfile . && docker tag fchat_api frymarshall/fchat_api:latest && docker push frymarshall/fchat_api:latest 

compile: 
	npx tsc

migrate: 
	npm run migrate

test: 
	npm run test
