# e2e-licensed-app

A small Node.js Express app used for end-to-end testing.

## Licence key

The app **requires** a licence key, supplied through the `APP_LICENCE_KEY`
environment variable. **The licence key is provided by the customer** — it is
not included in this repository and must never be committed or logged.

At startup the app checks the key and exits immediately if it is:

- missing: `Startup error: Missing required environment variable APP_LICENCE_KEY`
- invalid: `Startup error: APP_LICENCE_KEY is invalid`

The key is never printed or logged.

## Running locally

Requires Node.js 18 or later.

```sh
npm install
APP_LICENCE_KEY=<customer-provided-key> npm start
```

The app listens on port 3000 by default (override with `PORT`).

## Running with Docker Compose

Export the key in your shell, then start the service. The compose file passes
`APP_LICENCE_KEY` through from your environment and has no default.

```sh
export APP_LICENCE_KEY=<customer-provided-key>
docker compose up --build
```

## Routes

| Method | Path          | Response                                   |
| ------ | ------------- | ------------------------------------------ |
| GET    | `/`           | HTML page                                  |
| GET    | `/api/status` | JSON: status, licence state, start time, uptime |
| GET    | `/health`     | JSON: `{ "status": "ok" }`                 |
