/* eslint-disable no-console */
import { Axiom } from '@axiomhq/js';
import { AxiomJSTransport, Logger } from '@axiomhq/logging';

import { browser } from '$app/environment';

import { siteConfig } from '$lib/config/site-config.js';
import { processLogArgs } from '$lib/logger-helpers.js';

const PUBLIC_AXIOM_DATASET = siteConfig.axiom.publicDataset;
const PUBLIC_AXIOM_TOKEN = siteConfig.axiom.publicToken;

function resolveClientEnvironment() {
  if (!browser || typeof window === 'undefined') {
    return import.meta.env?.MODE ?? 'development';
  }

  const port = window.location.port || null;
  const host = window.location.host || window.location.hostname || '';
  const normalized = host.toLowerCase();

  if (!normalized.includes('local')) {
    return 'production';
  }

  if (port === '4373') {
    return 'staging';
  }

  return import.meta.env?.MODE ?? 'development';
}

class BrowserConsoleTransport {
  log(logEntries) {
    if (!Array.isArray(logEntries) || !isEnabled()) return;

    logEntries.forEach(entry => {
      const level = (entry.level || 'info').toLowerCase();
      const message = entry.message || entry.msg || '';
      const details = entry.detailedMessage ? [entry.detailedMessage] : [];
      const payload = entry.fields ? [entry.fields] : [];
      const args = [`[${level.toUpperCase()}]`, message, ...details, ...payload];

      switch (level) {
        case 'debug':
          console.debug(...args);
          break;
        case 'info':
          console.info(...args);
          break;
        case 'warn':
          console.warn(...args);
          break;
        case 'error':
          console.error(...args);
          break;
        default:
          console.log(...args);
      }
    });
  }
}

function createLogger() {
  const transports = [];

  if (PUBLIC_AXIOM_TOKEN && PUBLIC_AXIOM_DATASET) {
    const axiom = new Axiom({ token: PUBLIC_AXIOM_TOKEN });
    transports.push(
      new AxiomJSTransport({
        axiom,
        dataset: PUBLIC_AXIOM_DATASET,
        logLevel: 'debug',
      })
    );
  }

  transports.push(new BrowserConsoleTransport());

  return new Logger({
    transports,
    level: 'debug',
    overrideDefaultFormatters: true,
    formatters: [
      logEvent => ({
        ...logEvent,
        environment: resolveClientEnvironment(),
      }),
    ],
  });
}

const axiomLogger = createLogger();

function isEnabled() {
  try {
    return localStorage.getItem('_console_debug') !== 'false';
  } catch {
    return true;
  }
}

function toggle(enable) {
  try {
    const nextState = enable ?? !isEnabled();
    localStorage.setItem('_console_debug', String(nextState));
    return nextState;
  } catch {
    return false;
  }
}

export const logger = {
  debug(...args) {
    const { message, eventFields } = processLogArgs(args);
    axiomLogger.debug(message, eventFields);
  },
  info(...args) {
    const { message, eventFields } = processLogArgs(args);
    axiomLogger.info(message, eventFields);
  },
  warn(...args) {
    const { message, eventFields } = processLogArgs(args);
    axiomLogger.warn(message, eventFields);
  },
  error(...args) {
    const { message, eventFields } = processLogArgs(args);
    axiomLogger.error(message, eventFields);
  },
  isEnabled,
  toggle,
};

export function withLoggerContext(_context, fn) {
  return fn();
}

if (browser && typeof window !== 'undefined') {
  window.logger = logger;
  window.toggleLogger = logger.toggle.bind(logger);
}

export default logger;
