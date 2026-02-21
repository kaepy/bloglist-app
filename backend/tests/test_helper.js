/**
 * @module tests/test_helper
 * Shared test utilities and initial data for backend integration tests.
 *
 * Provides:
 * - initialBlogs / initialUsers: Initial data inserted before each test
 * - nonExistingId: Generates a valid-format MongoDB ID that doesn't exist
 * - blogsInDb / usersInDb: Snapshot helpers to read current DB state
 * - testUserToken: Creates a JWT for the first initialized user (for auth tests)
 */

const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

/**
 * Initial blog data for tests. Both blogs are authored by the same user
 * (linked via the `user` field matching initialUsers[0]._id).
 */
const initialBlogs = [
  {
    title: "The Lord of the Blogs",
    author: "J. R. R. Token",
    url: "loordi url",
    likes: 42,
    user: "647451ea7a78ae6fc9786135",
    _id: "6474f3b7e2ab2e8719835602",
    __v: 0,
  },
  {
    title: "The Lego Lasse",
    author: "J. R. R. Token",
    url: "loordi url",
    likes: 42,
    user: "647451ea7a78ae6fc9786135",
    _id: "6474f4a8e2ab2e8719835612",
    __v: 0,
  },
];

/**
 * Initial user data. The blogs array contains ObjectIds matching initialBlogs
 * entries, establishing the user-blog ownership relationship.
 * Note: passwordHash is null — this user can only be authenticated via
 * testUserToken(), which signs a JWT directly without password verification.
 */
const initialUsers = [
  {
    username: "testi",
    name: "Testi Testinen",
    passwordHash: null,
    blogs: ["6474f3b7e2ab2e8719835602", "6474f4a8e2ab2e8719835612"],
    _id: "647451ea7a78ae6fc9786135",
  },
];

/**
 * Generate a valid-format MongoDB ObjectId that doesn't exist in the DB.
 * Creates a temporary document, immediately deletes it, and returns the ID.
 */
const nonExistingId = async () => {
  const blog = new Blog({ content: "willremovethissoon" });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

/** Return all blogs currently in the test database as plain JSON objects */
const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

/** Return all users currently in the test database as plain JSON objects */
const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

/**
 * Generate a valid JWT for the first user in the test database.
 * This bypasses the login flow entirely — no password is needed because
 * the token is signed directly with the user's ID and the app's SECRET.
 * The token expires in 1 hour, matching the production login behavior.
 */
const testUserToken = async () => {
  const users = await usersInDb();
  const testUser = users[0];

  const userForToken = {
    username: testUser.username,
    id: testUser.id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  return token;
};

module.exports = {
  initialBlogs,
  initialUsers,
  nonExistingId,
  blogsInDb,
  usersInDb,
  testUserToken,
};
