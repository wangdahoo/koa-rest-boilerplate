default: help

mysql:
	@./bin/mysql

redis:
	@./bin/redis

data:
	@./bin/database

deploy:
	@./bin/ne ./bin/deploy

help:
	@echo 'Usage: make <command>'
	@echo ' '
	@echo 'commands: '
	@echo '  - mysql: install mysql'
	@echo '  - data: create database'
	@echo '  - redis: install redis'
	@echo '  - deploy: deploy api, you should install pm2 first'
	@echo ' '
