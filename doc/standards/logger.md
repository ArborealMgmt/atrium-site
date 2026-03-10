# Logger Standards

This project centralizes all structured logging through `$lib/logger.server.js`. Follow the rules below whenever you add server-side instrumentation or inspect request context.

## Golden Rules

1. **Never use `console.*` in server code.** Always call `logger.debug|info|warn|error`.
2. **Always provide a human-readable message.** Keep it short and actionable.
3. **Put structured details inside the optional metadata object as `detailedMessage`.** The logger helper already stringifies objects safely.
4. **Rely on the request context.** `src/hooks.server.js` sets `locals.brand`, `locals.host`, and `locals.environment`, and `withLoggerContext` propagates the same values to every log event.

```js
logger.info('[maynard][load] start', {
  detailedMessage: { cacheKey, brandId: locals.brand },
});
```

## Environment + Host

- The hook derives `locals.host` from `x-forwarded-host` or `host`.
- `locals.environment` comes from `resolveEnvironmentFromHost`:
  - Non-`*.local` hosts ⇒ `production`
  - `*.local:4373` ⇒ `staging`
  - Anything else ⇒ `process.env.NODE_ENV ?? 'development'`
- `/health` echoes these same `locals` values, so if `/health` is wrong, fix the hook.

## Logger Context

- Wrapping a request with `withLoggerContext` is already handled inside `handle`.
- Any downstream code can import `{ logger }` and will automatically emit:
  - `brand`
  - `traceId`
  - `forwardedHost`
  - `host`,
  - `environment`
  - `pathname`
- If you add background jobs or utilities that run outside of `handle`, wrap their work with:

```js
return withLoggerContext({ brand: 'brand-default', environment: 'development' }, () => {
  logger.info('[job] started');
});
```

## Health Endpoint

- `/health` must only use data from `locals` (avoid re-reading `process.env`).
- Default placeholder values:
  - `host`: `'not-set'`
  - `environment`: `'unknown'`

## Client Logging

- Client-side logging lives in `$lib/logger.client.js`. Use it only for debugging features surfaced to the UI (never send secrets).
- Do not import the client logger into server code.
