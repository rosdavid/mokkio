/* eslint-disable no-console */
/**
 * Logger utility for production-safe logging
 * Only logs in development mode to avoid console pollution in production
 *
 * Note: This file is intentionally allowed to use console.* methods
 * as it's the logger utility wrapper. All other code should use this logger.
 */

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = {
  /**
   * Log general information (only in development)
   */
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Log errors (always logged, even in production)
   */
  error: (...args: unknown[]) => {
    console.error(...args);
  },

  /**
   * Log warnings (only in development)
   */
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Log debug information (only in development)
   */
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  /**
   * Log info with timestamp (only in development)
   */
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(`[${new Date().toISOString()}]`, ...args);
    }
  },
};
