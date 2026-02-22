/**
 * @module controllers/users
 * Express router for user management (registration and listing).
 *
 * Routes:
 *   GET  / - List all users with their populated blogs
 *   POST / - Register a new user (password validation + bcrypt hashing)
 */

const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

/** GET / - Retrieve all users with their associated blog data (title, author, url, likes) */
usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", { title: 1, author: 1, url: 1, likes: 1 });

  response.json(users);
});

/** GET /:id - Retrieve a single user by its MongoDB ID */
usersRouter.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id).populate("blogs", { title: 1, author: 1, url: 1, likes: 1 });
  if (user) {
    response.json(user);
  } else {
    response.status(404).end();
  }
});

/**
 * POST / - Register a new user.
 * Validates password presence and minimum length before hashing.
 * Mongoose schema validates username constraints (uniqueness, length, format).
 */
usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  // Password validation must happen before hashing (schema validators
  // cannot see the plain-text password, only the hash)
  if (!password) {
    return response.status(400).json({ error: "password missing." });
  } else if (password.length < 3) {
    return response.status(400).json({ error: "password is shorter than the minimum allowed length (3)." });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = usersRouter;
