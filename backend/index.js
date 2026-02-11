/**
 * @module index
 * Application entry point. Imports the configured Express app and
 * starts the HTTP server on the port specified in environment variables.
 *
 * Separating app creation (app.js) from server startup (index.js)
 * allows supertest to import the app without binding to a port.
 */

const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger");

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
