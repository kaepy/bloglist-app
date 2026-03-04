/**
 * @module app
 * Express application setup and configuration.
 *
 * This module is the heart of the backend:
 * 1. Connects to MongoDB
 * 2. Registers global middleware (CORS, JSON parsing, logging, auth)
 * 3. Mounts route handlers for blogs, users, login, and (in test mode) testing
 * 4. Adds catch-all middleware for unknown endpoints and error handling
 *
 * The app is exported WITHOUT calling .listen() so that:
 * - index.js can start the HTTP server
 * - supertest can import the app directly for integration tests
 */

const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

// Enforce strict query filtering to prevent unexpected query behavior
mongoose.set("strictQuery", false);

// --- Database Connection ---
logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message);
  });

// --- Global Middleware (order matters!) ---
app.use(cors());                              // Enable CORS for all origins
app.use(express.static("../frontend/dist"));  // Serve the frontend production build
app.use(express.json());                      // Parse JSON request bodies
app.use(middleware.requestLogger);            // Log every request (dev convenience)
app.use(middleware.tokenExtractor);           // Extract JWT from Authorization header

// --- Route Handlers ---
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

// Expose a database-reset endpoint only in the test environment
if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

// --- SPA Fallback ---
// Serve index.html for any non-API GET request so React Router
// can handle client-side routes (e.g. /blogs/:id) on page refresh.
// Must be after API routes but before unknownEndpoint so that
// missing API endpoints still return 404 JSON as expected.
const distPath = path.resolve(__dirname, "../frontend/dist");
app.get(/^\/(?!api\/).*/, (req, res, next) => {
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) next(err);
  });
});

// --- Error-handling Middleware (must be after routes) ---
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
