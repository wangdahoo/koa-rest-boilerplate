# koa-rest-boilerplate

## 准备

- [安装 docker](https://docs.docker.com/docker-for-mac/install/)
- [docker 镜像加速](https://www.daocloud.io/mirror)


## 开发

- 安装 mysql 并创建数据库

    ```bash
    # 注意：如果本地 docker 需要 sudo 运行的话，前面也要加 sudo

    # 安装 mysql
    ./make mysql
    # 创建数据库
    ./make data
    ```

- 安装 redis

    ```bash
    # 可选
    ./make redis
    ```

- 安装依赖

    ```bash
    yarn
    ```

- 本地开发环境运行 web

    ```bash
    yarn start
    ```

    > web: [http://localhost:3000](http://localhost:3000)

- 本地开发环境运行 job

    ```bash
    # 运行位于 app/job/demo 的 schedule job
    JOB=demo yarn job
    ```

- migration

    ```bash
    npm run typeorm migration:generate --  -n <YourMigrationName> -f ormconfig.js
    ```
