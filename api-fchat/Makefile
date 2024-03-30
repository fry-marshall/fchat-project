start:
	docker-compose -f docker-compose.dev.yml up -d
compile: 
	npx tsc
migrate: 
	npm run migrate
test: 
	tsc -w & npm run test --watch
