<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

Locals backend challenge.

## Installation

First, install the dependencies:

```bash
$ npm install
or
$ yarn
```

then, run the docker-compose:

```bash
docker-compose-up
```

then, run the migrations:

```bash
$ npm run migration:run
or
$ yarn migration:run
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Swagger UI

While the application is running, open your browser and navigate to <http://localhost:3000/docs>. You should see the Swagger UI.
