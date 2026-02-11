/**
 * @module middleware
 * Express middleware functions for request logging, authentication,
 * error handling, and unknown-endpoint responses.
 *
 * Middleware execution order (configured in app.js):
 *   1. requestLogger  - Logs every incoming request
 *   2. tokenExtractor - Extracts JWT from Authorization header
 *   3. (route-specific) userExtractor - Decodes token and attaches user
 *   4. unknownEndpoint - Catches requests that match no route
 *   5. errorHandler   - Centralized error formatting
 *
 * REFACTORING NOTES:
 * - tokenExtractor and userExtractor could be combined into a single
 *   middleware applied only to protected routes, reducing the number
 *   of middleware layers.
 * - The errorHandler could benefit from a mapping object instead of
 *   an if/else chain for cleaner extensibility:
 *     const errorMap = { CastError: 400, ValidationError: 400, ... }
 */

const logger = require("./logger");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

/**
 * Logs the HTTP method, path, and body of every incoming request.
 * Useful for debugging during development; consider disabling
 * or reducing verbosity for production.
 */
const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

/** Returns 404 for any request that doesn't match a defined route. */
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

/**
 * Centralized error handler. Maps known Mongoose/JWT error types
 * to appropriate HTTP status codes and messages. Unrecognized errors
 * are forwarded to Express's default handler via next().
 */
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "MongoServerError" && error.code === 11000) {
    return response
      .status(400)
      .json({ error: "expected `username` to be unique" });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token missing or invalid" });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({ error: "token expired" });
  }

  next(error);
};

/**
 * Extracts the JWT Bearer token from the Authorization header
 * and attaches it to `request.token`. Applied globally so that
 * downstream route-specific middleware (userExtractor) can use it.
 *
 * The HTTP Authorization header format is: "Bearer <token>"
 * This middleware strips the "Bearer " prefix, leaving only the token string.
 */
const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");

  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  }

  next();
};

/**
 * Route-level middleware that verifies the JWT token (set by tokenExtractor)
 * and attaches the corresponding User document to `request.user`.
 * Applied selectively to routes that require an authenticated user
 * (e.g., POST/DELETE/PUT on blogs).
 */
const userExtractor = async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);

    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" });
    }

    const user = await User.findById(decodedToken.id);
    request.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
