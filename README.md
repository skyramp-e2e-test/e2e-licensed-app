# e2e-licensed-app

A small Node.js Express app used for end-to-end testing.

## Licence key

No licence key is needed. `APP_LICENCE_KEY` is optional:

- not set (or empty): the app starts with its **built-in test licence**, a harmless
  test default that is not a real key. It logs
  `APP_LICENCE_KEY is not set: using the built-in test licence (a test default, not a real key).`
  and reports the licence as `test`.
- set: the app checks it at startup, reports the licence as `valid`, and exits with
  `Startup error: APP_LICENCE_KEY is invalid` if it is wrong.

A real key is provided by the customer. It is not in this repository and must never
be committed or logged; the app never prints it.

## Running locally

Requires Node.js 18 or later.

```sh
npm install
npm start
```

The app listens on port 3000 by default (override with `PORT`).

## Running with Docker Compose

```sh
docker compose up --build
```

To use a real licence, export `APP_LICENCE_KEY` in your shell first; the compose
file passes it through and defaults to empty (the test licence).

## Routes

| Method | Path          | Response                                   |
| ------ | ------------- | ------------------------------------------ |
| GET    | `/`           | HTML page                                  |
| GET    | `/api/status` | JSON: status, licence state (`test` or `valid`), start time, uptime |
| GET    | `/health`     | JSON: `{ "status": "ok" }`                 |
