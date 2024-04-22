start:
	docker-compose -f docker-compose.dev.yml up -d

deploy:
	docker compose -f docker-compose.prod.yml pull && docker-compose -f docker-compose.prod.yml up -d

deploy-image:
	docker build -t fchat_api -f Dockerfile.prod . && docker tag fchat_api frymarshall/fchat_api:latest && docker push frymarshall/fchat_api:latest 

compile: 
	npx tsc
migrate: 
	npm run migrate
test: 
	npm run test
