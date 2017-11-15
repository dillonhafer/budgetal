# Budgetal [![CircleCI](https://img.shields.io/circleci/project/github/dillonhafer/budgetal-go/master.svg?style=flat-square)](https://circleci.com/gh/dillonhafer/budgetal-go)


A Budgetal implementation written in Go with Create React App on the
frontend

## Setup

> This project relies on buffalo version 0.10.1, it breaks in older/newer versions.

How to setup the backend server:

```sh
# Lock to buffalo 0.10.1
$ git clone https://github.com/buffalogo/buffalo.git $GOPATH/src/github.com/buffalogo/buffalo
$ cd $GOPATH/src/github.com/buffalogo/buffalo
$ git checkout tags/v0.10.1

# Download budgetal
$ git clone https://github.com/dillonhafer/budgetal-go.git
$ cd budgetal-go
$ buffalo db create
$ buffalo db migrate
$ buffalo dev
```

How to setup the frontend server:

```
cd frontend
yarn install
yarn start
```

## Configuration

1. `PORT` the port can be configured by setting the `PORT` env var
2. `ADDR` the listening address can be configured by setting the `ADDR` env var
3. `DATABASE_URL` the database connection can be configured by setting the `DATABASE_URL` env var
4. `CORS` space separated list of domains, defaults to `http://localhost:3001`
5. `BUDGETAL_HEADER` name of header used when authenticating, defaults to `X-Budgetal-Session`
6. `BUDGETAL_COOKIE` name of cookie used when authenticating, defaults to `_budgetal_session`

**Production will also need the following:**

1. `GO_ENV` application run-time environment, usually `production`
2. `SMTP_USER` username for smtp service
3. `SMTP_PASSWORD` password for smtp service
4. `SMTP_HOST` host for smtp service
5. `SMTP_PORT` port for smtp service

**The front end needs certain `ENV` vars at build time:**

1. `REACT_APP_HELP_FRAME` Used to populate the iframe in the help modal.
2. `REACT_APP_BASE_URL` Used to specify the base api url for all fetch requests.

## Tests

How to run the backend tests:

```
$ buffalo test
```

## Deploying

There is a built-in deploy command for deploying to an ubuntu server running nginx and systemd. There is an example systemd service, but no example nginx file (yet).

See `grifts/deploy.go` for configuration details.

1. Full deploy: `buffalo t deploy`
2. Backend deploy: `buffalo t deploy:backend`
3. Frontend deploy: `buffalo t deploy:frontend`
