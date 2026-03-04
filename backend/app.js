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
const helmet = require("helmet");
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
// Helmet sets secure HTTP response headers (CSP, X-Frame-Options, HSTS, etc.).
// Must be first so it covers every response, including error responses.
app.use(helmet());

// Restrict CORS to known safe origins.
// In development the Vite dev server (port 5173) and backend (port 3003) run
// on different ports = different origins, so CORS is required.
// In production both are served by this same Express process = same origin,
// so CORS headers are never sent for production traffic and this list is unused.
const allowedOrigins = [
  "http://localhost:5173",  // Vite dev server
  "http://localhost:3003",  // backend dev port
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
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
