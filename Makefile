default: help

mysql:
	@./bin/mysql

redis:
	@./bin/redis

deploy:
	@./bin/ne ./bin/deploy

help:
	@echo 'Usage: make <command>'
	@echo ' '
	@echo 'commands: '
	@echo '  - mysql: install mysql'
	@echo '  - redis: install redis'
	@echo '  - deploy: deploy api, you should install pm2 first'
	@echo ' '
