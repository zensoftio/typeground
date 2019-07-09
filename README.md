# Type Ground

Starter Kit for Backend applications.

## Getting Started

These instructions will get you a copy of the project up and running on your 
local machine for development and testing purposes. See deployment for notes 
on how to deploy the project on a live system.

### Prerequisites

For running this application you need to have [NodeJs](https://nodejs.org/en/) 
and [NPM](https://www.npmjs.com/).
We recommend to use [NVM](https://github.com/creationix/nvm) for managing Node.js versions.
For NVM installation please refer to [manual](https://github.com/creationix/nvm#install--update-script).

### Installing
1) Install Docker.
   Visit [official web site][docker], choose your OS and follow instructions

2) Set up PostgreSQL via docker for more information visit [this][dockerPostgres]
    * Pull Postgres docker image
    ```
    docker pull postgres
    ```
    * Run docker container
    ```
    docker run -d --restart unless-stopped --name postgres --net host --hostname postgres -e POSTGRES_USER=typeground -e POSTGRES_PASSWORD=typeground -p 5432:5432 -v postgres_data:/var/lib/postgresql/data postgres
    ```
    * Open psql shell
    ```
    docker exec -it postgres psql -U postgres
    ```
    * Create 'typeground' role
    ```
    CREATE USER typeground WITH LOGIN PASSWORD 'typeground';
    ALTER ROLE typeground WITH SUPERUSER; 
    ```
    * Create 'typeground' database
    ```
    CREATE DATABASE typeground;
    GRANT ALL PRIVILEGES ON DATABASE typeground TO typeground;
    ```
    
3) Set up RabbitMQ via docker for more information visit [this][dockerRabbitMq]

    * Pull RabbitMQ image from docker
    ```
    docker pull rabbitmq
    ```
    * Run docker container
    ```
    docker run -d --restart unless-stopped --name rabbitmq --net host -v rabbitmq_data:/var/lib/rabbitmq -e RABBITMQ_DEFAULT_USER=typeground -e RABBITMQ_DEFAULT_PASS=typeground rabbitmq:3-management-alpine
    ```
    * RabbitMQ management panel available [here][localhostRabbitManagementPanel]

4) Install dependencies    
    ```
    npm install
    ```
5) Run project
   ```
   npm run start
   ```

## Running the tests
- `npm run test`

## Start Project with separated commands
- `npm run clean`
- `npm run tsc`
- `node ./bin/www`

## Deployment

// TODO: fill this

## Built With

* [Express.js](https://expressjs.com/) - HTTP API framework
* [TypeScript](https://www.typescriptlang.org/) - Primary language
* [DB Migrate](https://github.com/db-migrate/node-db-migrate) - DB migration manager
* [config](https://github.com/lorenwest/node-config) - Configuration manager
* [Typeorm](http://typeorm.io/) - ORM for PostgreSQL

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, 
and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. 
For the versions available, see the [tags on this repository](https://github.com/zensoftio/typeground/releases). 

## License

This project is licensed under the MIT License - see the 
[LICENSE.txt](LICENSE.txt) file for details.

## Acknowledgments

* Heavily inspired by [Spring Framework](https://github.com/spring-projects/spring-framework)

[docker]: https://docs.docker.com/
[dockerPostgres]: https://hub.docker.com/_/postgres/
[dockerRabbitMq]: https://hub.docker.com/_/rabbitmq/
[localhostRabbitManagementPanel]: http://localhost:15672