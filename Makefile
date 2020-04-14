default: help

mysql:
	@./bin/mysql

redis:
	@./bin/redis

deploy:
	@./bin/ne ./bin/deploy

docker:
	@make docker.build
	@make docker.run

docker.build:
	@./bin/docker_build

docker.run:
	@./bin/docker_run

help:
	@echo 'Usage: make <command>'
	@echo ' '
	@echo 'commands: '
	@echo '  - mysql: install mysql'
	@echo '  - redis: install redis'
	@echo '  - deploy: deploy api, you should install pm2 first'
	@echo ' '
