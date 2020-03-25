#!/bin/bash

mysql_daemon=krb-mysql
mysql_image=daocloud.io/library/mysql:5.7.26
mysql_port=3308

redis_daemon=krb-redis
redis_image=redis:4.0.2
redis_port=6380

install_mysql() {
    echo -e "[INSTALL MYSQL]"
    docker rm -vf $mysql_daemon >/dev/null || true >/dev/null
    # docker pull $mysql_image >/dev/null

    rm -rf $(pwd)/docker_volumes/mysql || true
    mkdir -p $(pwd)/docker_volumes/mysql
    docker pull $mysql_image
    docker run \
        --name $mysql_daemon \
        --privileged=true \
        -e TZ=Asia/Shanghai \
        -e MYSQL_ROOT_PASSWORD=victory \
        -v $(pwd)/docker_volumes/mysql:/var/lib/mysql \
        -p $mysql_port:$mysql_port \
        -d $mysql_image \
        --port=$mysql_port

    echo "starting $mysql_daemon..."
    verify_mysql_status $mysql_daemon
    echo -e "$mysql_daemon started successfully."
    docker ps -a | grep $mysql_daemon
}

verify_mysql_status() {
    echo -ne "verifying $mysql_daemon..."

    passwd=" -p"$mysql_password
    cmd="docker exec -it "$mysql_daemon" /usr/bin/mysql -f -h127.0.0.1 -P"$mysql_port" -uroot -e 'SELECT 1' | awk 'NR==4 {print \$2}' | sed -n '1, 1p'"
    # echo -e $cmd

    result=$($cmd)
    while [[ "" == $result ]]; do
        sleep 1
        result=$($cmd)
        echo -ne '.'
    done

    echo -ne "ok\n"
    return 0
}

create_database() {
    echo -e "[CREATE DATABASE]"
    verify_mysql_status $mysql_deamon

    echo -e "create database..."
    if [[ $1 == "" ]]; then
        sql_dir=$(pwd)
    else
        sql_dir=$1
    fi

    docker cp $sql_dir/createuser.sql $mysql_daemon:/home
    docker cp $sql_dir/db.sql $mysql_daemon:/home
    docker cp ./makedb $mysql_daemon:/home

    passwd=" -p"$mysql_password
    docker exec $mysql_daemon /home/makedb $passwd
    echo -e "done."
}

install_redis() {
    docker rm -vf $redis_daemon || true
    docker pull $redis_image
    docker run --name $redis_daemon -p $redis_port:6379 -d $redis_image

    echo "starting $redis_daemon..."
    sleep 5
    # verify_redis_status $redis_daemon
    echo -e "$redis_daemon started successfully."
    docker ps -a | grep $redis_daemon
}

verify_redis_status() {
    echo -ne "verifying $redis_daemon..."

    cmd="docker exec -it "$redis_daemon" /usr/local/bin/redis-cli ping"
    # echo -e $cmd

    result=$($cmd)
    while [[ "PONG*" != $result ]]; do
        sleep 1
        result=$($cmd)
        echo -ne '.'
    done

    echo -ne "ok\n"
    return 0
}

if [[ $1 == "mysql" ]]; then
    install_mysql
elif [[ $1 == "data" ]]; then
    create_database $(pwd)/sql
elif [[ $1 == "redis" ]]; then
    install_redis
elif [[ $1 == "deploy" ]]; then
    # 安装依赖
    yarn
    # 表结构迁移
    NODE_ENV=$NODE_ENV npm run typeorm migration:run
    # 启动 web
    NODE_ENV=$NODE_ENV npm run deploy
else
    echo 'Usage: ./make <command>'
    echo ' '
    echo 'commands: '
    echo '  - mysql: install mysql'
    echo '  - data: create database'
    echo '  - redis: install redis'
fi
