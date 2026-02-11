/**
 * @module config
 * Centralized configuration module for environment variables.
 * Loads variables from a .env file using the dotenv package and
 * selects the appropriate MongoDB URI based on the current NODE_ENV.
 *
 * Exported values:
 *   - MONGODB_URI: Database connection string (test or production)
 *   - PORT: HTTP server port
 *   - SECRET: JWT signing secret
 *
 * REFACTORING NOTE: Consider adding validation for required env vars
 * (e.g., throw on startup if SECRET or MONGODB_URI is missing) to
 * fail fast instead of producing cryptic runtime errors.
 */

require("dotenv").config();

const SECRET = process.env.SECRET;
const PORT = process.env.PORT;

// Use a separate database for tests to avoid polluting production data
const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET,
};
