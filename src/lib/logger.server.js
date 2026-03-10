/**
 * Server-side logger with Axiom integration and async context support.
 */

import { AsyncLocalStorage } from 'node:async_hooks';

import { Axiom } from '@axiomhq/js';
import { AxiomJSTransport, EVENT, Logger } from '@axiomhq/logging';

import { siteConfig } from '$lib/config/site-config.js';
import { processLogArgs } from '$lib/logger-helpers.js';

const AXIOM_DATASET = siteConfig.axiom.dataset;
const AXIOM_TOKEN = siteConfig.axiom.token;

/**
 * Console transport for fallback logging when Axiom isn't configured
 * Only logs errors and warnings to avoid cluttering console
 */
class ConsoleFallbackTransport {
  log(logEntries) {
    if (!Array.isArray(logEntries)) return;

    logEntries.forEach(entry => {
      const level = (entry.level || 'info').toLowerCase();
      // Only log errors and warnings to console as fallback
      if (level !== 'error' && level !== 'warn') return;

      const message = entry.message || entry.msg || '';
      const details = entry.detailedMessage ? [entry.detailedMessage] : [];
      const payload = entry.fields ? [entry.fields] : [];
      const args = [`[${level.toUpperCase()}]`, message, ...details, ...payload];

      if (level === 'error') {
        // eslint-disable-next-line no-console
        console.error(...args);
      } else if (level === 'warn') {
        // eslint-disable-next-line no-console
        console.warn(...args);
      }
    });
  }
}

function createLogger() {
  const transports = [];

  if (AXIOM_TOKEN && AXIOM_DATASET) {
    const axiom = new Axiom({ token: AXIOM_TOKEN });
    transports.push(
      new AxiomJSTransport({
        axiom,
        dataset: AXIOM_DATASET,
        logLevel: 'debug',
      })
    );
  } else {
    // Add console fallback when Axiom isn't configured (for development/debugging)
    transports.push(new ConsoleFallbackTransport());
  }

  return new Logger({
    transports,
    level: 'debug',
    overrideDefaultFormatters: true,
    formatters: [
      logEvent => ({
        ...logEvent,
      }),
    ],
  });
}

const axiomLogger = createLogger();

const contextStorage = new AsyncLocalStorage();

const getLoggerContext = () => contextStorage.getStore() ?? null;

export function withLoggerContext(context, fn) {
  return contextStorage.run(context, fn);
}

function combineEventFields(eventFields = {}, context = null) {
  if (!context) {
    return eventFields || {};
  }

  return {
    ...eventFields,
    brand: context.brand,
    traceId: context.traceId,
    forwardedHost: context.forwardedHost,
    host: context.host,
    environment: context.environment,
    pathname: context.path,
  };
}

function buildMeta(eventFields = {}) {
  const context = getLoggerContext();
  const metaFields = combineEventFields(eventFields, context);
  if (!metaFields || Object.keys(metaFields).length === 0) {
    return {};
  }

  return { [EVENT]: metaFields };
}

export const logger = {
  debug(...args) {
    const { message, eventFields } = processLogArgs(args);
    axiomLogger.debug(message, buildMeta(eventFields));
  },
  info(...args) {
    const { message, eventFields } = processLogArgs(args);
    axiomLogger.info(message, buildMeta(eventFields));
  },
  warn(...args) {
    const { message, eventFields } = processLogArgs(args);
    axiomLogger.warn(message, buildMeta(eventFields));
  },
  error(...args) {
    const { message, eventFields } = processLogArgs(args);
    axiomLogger.error(message, buildMeta(eventFields));
  },
};

export function getLoggerHealth() {
  const transports = axiomLogger?.config?.transports ?? [];
  return {
    contextStorage: Boolean(contextStorage),
    transportCount: transports.length,
    axiomEnabled: transports.some(transport => transport instanceof AxiomJSTransport),
  };
}

export default logger;
