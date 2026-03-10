import { randomUUID } from 'node:crypto';

import { resolveEnvironmentFromHost } from '$lib/environment.server.js';
import { logger, withLoggerContext } from '$lib/logger.server';

const SSR_CACHE_HEADER = 'public, max-age=300, stale-while-revalidate=300';

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
  // Read relevant request headers
  const forwardedHost = event.request.headers.get('x-forwarded-host');
  const forwardedProto = event.request.headers.get('x-forwarded-proto');
  const hostHeader = event.request.headers.get('host');
  const host = (forwardedHost?.split(',')[0]?.trim() || hostHeader) ?? 'localhost';
  const protocol = forwardedProto || (host.includes('local') ? 'http' : 'https');
  const path = event.url.pathname;
  const environment = resolveEnvironmentFromHost(host);

  // Fix origin for CSRF protection when behind proxy
  if (forwardedHost || forwardedProto) {
    const origin = `${protocol}://${host}`;
    const originHeader = event.request.headers.get('origin');

    try {
      event.url = new URL(event.url.pathname + event.url.search, origin);

      if (event.request.method === 'POST') {
        logger.debug('CSRF origin check context', {
          detailedMessage: {
            method: event.request.method,
            path: event.url.pathname,
            forwardedHost,
            forwardedProto,
            computedOrigin: origin,
            originHeader,
            eventUrlOrigin: event.url.origin,
            originMatches: originHeader === origin,
          },
        });
      }
    } catch (err) {
      logger.warn('Failed to update event.url with forwarded origin', {
        detailedMessage: {
          error: err.message,
          forwardedHost,
          forwardedProto,
        },
      });
    }
  }

  // Hardcoded for Terrapin Apartments (property 234)
  const propertyId = 234;

  // Save to locals
  event.locals.brand = propertyId;
  event.locals.host = host;
  event.locals.protocol = protocol;
  event.locals.path = path;
  event.locals.environment = environment;

  // Create Context for Logger
  const traceId = randomUUID();
  event.locals.traceId = traceId;
  return withLoggerContext(
    {
      propertyId,
      traceId,
      forwardedHost,
      host,
      protocol,
      environment,
      path,
    },
    async () => {
      const response = await resolve(event);
      maybeApplySsrCacheHeader(event, response);
      return response;
    }
  );
};

// 5. Apply SSR Cache Header for HTML responses
function maybeApplySsrCacheHeader(event, response) {
  if (event.request.method !== 'GET') return;

  const contentType = response.headers.get('content-type') || '';
  const isHtml = contentType.includes('text/html');
  if (!isHtml) return;

  if (!response.headers.has('cache-control')) {
    response.headers.set('cache-control', SSR_CACHE_HEADER);
  }
}

// Common browser icon paths that browsers request automatically
// These are harmless 404s and don't need to be logged as errors
const IGNORED_ICON_PATHS = [
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/apple-touch-icon-precomposed.png',
];

// Azure Function endpoints that only exist in production
// These 404s are expected in local preview mode
const IGNORED_AZURE_PATHS = ['/api/sk_render'];

/** @type {import('@sveltejs/kit').HandleError} */
export const handleError = async ({ event, error: err, status, message }) => {
  const path = event.url.pathname;

  // Skip logging 404 errors for common browser icon requests
  if (status === 404 && IGNORED_ICON_PATHS.includes(path)) {
    return {
      message: 'Not found',
    };
  }

  // Skip logging 404 errors for Azure Function endpoints (only exist in production)
  if (status === 404 && IGNORED_AZURE_PATHS.includes(path)) {
    return {
      message: 'Not found',
    };
  }

  // Create a logger context from event.locals if available
  // This ensures errors are logged even if the original context was lost
  const errorContext = {
    propertyId: event.locals?.brand,
    traceId: event.locals?.traceId || randomUUID(),
    forwardedHost: event.request.headers.get('x-forwarded-host'),
    host: event.locals?.host,
    protocol: event.locals?.protocol,
    environment: event.locals?.environment,
    path,
  };

  return withLoggerContext(errorContext, () => {
    // Log all errors that reach the error handler
    logger.error('[hooks][handleError] unhandled error', {
      detailedMessage: {
        path,
        method: event.request.method,
        status,
        message,
        errorName: err?.name,
        errorMessage: err?.message,
        errorStack: err?.stack,
        errorType: err?.type,
        brand: event.locals?.brand,
        host: event.locals?.host,
        environment: event.locals?.environment,
      },
    });

    // Return a safe error message for production
    return {
      message: status === 500 ? 'Internal server error' : message,
    };
  });
};
