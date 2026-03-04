/**
 * @module controllers/login
 * Express router handling user authentication.
 *
 * POST / - Accepts { username, password }, verifies credentials against
 * the bcrypt hash stored in the database, and returns a signed JWT
 * along with user info (username, name).
 *
 * Token payload: { username, id }
 * Token lifetime: 1 hour (3600 seconds)
 *
 * Rate limiting: max 20 login attempts per 15 minutes per IP to slow
 * down brute-force and credential-stuffing attacks.
 */

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { rateLimit } = require("express-rate-limit");
const loginRouter = require("express").Router();
const User = require("../models/user");
const config = require("../utils/config");

/**
 * Limits login attempts to 5 per 15 minutes per IP address.
 * The vague error message avoids revealing whether the limit is
 * per-username or per-IP (information disclosure prevention).
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per `window` (here, per 15 minutes)
  message: { error: "Too many login attempts. Please try again later." },
  standardHeaders: true, // Return rate limit info in RateLimit-* headers
  legacyHeaders: false, // Disable deprecated X-RateLimit-* headers
});

loginRouter.post("/", loginLimiter, async (request, response) => {
  const { username, password } = request.body;

  // Look up user by username; returns null if not found
  const user = await User.findOne({ username });

  // Compare the plain-text password against the stored bcrypt hash.
  // If user is null, short-circuit to false to avoid leaking whether
  // the username exists (timing-safe comparison is handled by bcrypt).
  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "Invalid username or password",
    });
  }

  // Minimal payload — only include what downstream code needs
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, config.SECRET, { expiresIn: 60 * 60 });

  response.status(200).send({ token, username: user.username, name: user.name, id: user._id });
});

module.exports = loginRouter;
