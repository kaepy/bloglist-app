/**
 * @module logger
 * Custom logging utility that suppresses output during test runs
 * to keep test output clean. All application logging should go
 * through these functions instead of calling console directly.
 *
 * REFACTORING NOTE: Consider integrating a structured logging
 * library (e.g., winston or pino) for production use, which would
 * provide log levels, timestamps, and JSON formatting out of the box.
 */

/** Log informational messages (suppressed in test environment) */
const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

/** Log error messages (suppressed in test environment) */
const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}

module.exports = {
  info, error
}