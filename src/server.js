'use strict';

const crypto = require('crypto');
const express = require('express');

// SHA-256 hex digest of the valid licence key. The key itself is never stored here.
const EXPECTED_LICENCE_HASH =
  '7b43663d43c40f6691b85be5afc8a598265420d0015be46f4b7ad63c35e35ca1';

function fail(message) {
  console.error(`Startup error: ${message}`);
  process.exit(1);
}

// APP_LICENCE_KEY is optional. Without it the app runs on a built-in test licence: a harmless default
// for testing, not a real key (it unlocks nothing and is never compared with the hash above).
function validateLicence() {
  const key = process.env.APP_LICENCE_KEY;
  if (key === undefined || key.trim() === '') {
    console.log('APP_LICENCE_KEY is not set: using the built-in test licence (a test default, not a real key).');
    return 'test';
  }

  const digest = crypto.createHash('sha256').update(key, 'utf8').digest();
  const expected = Buffer.from(EXPECTED_LICENCE_HASH, 'hex');
  if (!crypto.timingSafeEqual(digest, expected)) {
    fail('APP_LICENCE_KEY is invalid');
  }
  return 'valid';
}

const licence = validateLicence();

const app = express();
const startedAt = new Date();
const port = Number(process.env.PORT) || 3000;

app.get('/', (req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>E2E Licensed App</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 40rem; margin: 3rem auto; padding: 0 1rem; color: #222; }
    code { background: #f2f2f2; padding: 0.1rem 0.3rem; border-radius: 3px; }
  </style>
</head>
<body>
  <h1 id="title">E2E Licensed App</h1>
  <p id="licence-status">Licence: ${licence === 'test' ? 'test (built-in default)' : 'valid'}</p>
  <ul>
    <li><a href="/api/status">/api/status</a></li>
    <li><a href="/health">/health</a></li>
  </ul>
</body>
</html>`);
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    licence,
    startedAt: startedAt.toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
