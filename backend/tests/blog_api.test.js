/**
 * @file blog_api.test.js
 * Integration tests for the Blog and User REST APIs.
 *
 * These tests exercise the full HTTP stack using supertest:
 * - Real Express app (imported from app.js)
 * - Real MongoDB test database (configured via TEST_MONGODB_URI)
 * - JWT authentication via helper-generated tokens
 *
 * Test structure:
 *   describe "when there is initially some blogs saved"
 *     ├─ GET /api/blogs - List blogs
 *     ├─ POST /api/blogs - Create blogs (with auth)
 *     ├─ DELETE /api/blogs/:id - Delete blogs (owner + auth checks)
 *     ├─ PUT /api/blogs/:id - Update blogs (likes)
 *     └─ describe "when there is initially one user"
 *         ├─ POST /api/users - Registration success/failure cases
 *         └─ Validation: unique username, min length, password rules
 *
 * Run options:
 *   npm test -- tests/blog_api.test.js          (by file)
 *   npm test -- -t 'a specific test name'       (by test name)
 *   npm test -- -t 'blogs'                      (pattern match)
 */

const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");

const { test, describe, after, beforeEach } = require("node:test");
const app = require("../app");
const api = supertest(app);
const helper = require("./test_helper");
const assert = require("assert");

const Blog = require("../models/blog");
const User = require("../models/user");

describe("when there is initially some blogs saved", () => {
  // Initialize the database with known data before every test for isolation
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);

    await User.deleteMany({});
    await User.insertMany(helper.initialUsers);
  });

  test("blogs are returned as json", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // Verify the response contains exactly the ed blogs
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("blogs are returned with id property", async () => {
    // Mongoose toJSON transform should convert _id -> id
    const response = await api.get("/api/blogs").expect(200);
    response.body.forEach((blog) => assert(blog.id));
  });

  describe("addition of a new blog", () => {
    test("succeed with valid data", async () => {
      const newBlog = {
        title: "Test is test na naaa naa na na",
        author: "Person999",
        url: "url999",
        likes: 999,
      };

      // Generate a JWT for the initialized test user
      const authToken = await helper.testUserToken();

      const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      // Verify the created blog matches the input
      assert.strictEqual(response.body.title, newBlog.title);
      assert.strictEqual(response.body.author, newBlog.author);
      assert.strictEqual(response.body.url, newBlog.url);
      assert.strictEqual(response.body.likes, newBlog.likes);

      // Verify total blog count increased by one
      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

      // Verify the new title exists in the database
      const titles = blogsAtEnd.map((b) => b.title);
      assert(titles.includes("Test is test na naaa naa na na"));

      // Verify the blog is associated with a user
      assert(response.body.user !== null);
    });

    test("likes default value set to 0 if no other value given", async () => {
      const newBlog = {
        title: "Test zero",
        author: "Person999",
        url: "url999",
        // likes intentionally omitted to test default behavior
      };

      const authToken = await helper.testUserToken();

      const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.likes, 0);
    });

    test("fails with statuscode 400 if title or url is invalid", async () => {
      const newBlog = {
        author: "Person999",
        // title and url intentionally omitted — should fail validation
      };

      const authToken = await helper.testUserToken();

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newBlog)
        .expect(400);

      // Verify that the invalid blog was not saved
      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });
  });

  describe("deletion of a blog", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      const authToken = await helper.testUserToken();

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      // Verify blog count decreased by one
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

      // Verify the deleted blog's title no longer exists
      const titles = blogsAtEnd.map((r) => r.title);
      assert(!titles.includes(blogToDelete.title));
    });

    test("fails with statuscode 401 if token is missing", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      // Send an empty Bearer token to simulate missing authentication
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", "Bearer ")
        .expect(401);

      const blogsAtEnd = await helper.blogsInDb();

      // Verify blog count is unchanged — deletion was rejected
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);

      // Verify the blog still exists
      const titles = blogsAtEnd.map((r) => r.title);
      assert(titles.includes(blogToDelete.title));
    });
  });

  describe("modification of a blog", () => {
    test("succeeds with valid id", async () => {
      const modifiedBlog = {
        likes: 999,
      };

      const blogsAtStart = await helper.blogsInDb();
      const blogToModify = blogsAtStart[0];
      const authToken = await helper.testUserToken();

      await api
        .put(`/api/blogs/${blogToModify.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(modifiedBlog)
        .expect(200);

      // Verify the likes value was updated in the database
      const blogsAtEnd = await helper.blogsInDb();
      const blogAfterMod = blogsAtEnd[0];
      assert.strictEqual(blogAfterMod.likes, modifiedBlog.likes);
    });
  });

  describe("when there is initially one user at db", () => {
    // This beforeEach creates a fresh user with a real bcrypt hash, separate from the initialUsers data used in blog tests
    beforeEach(async () => {
      await User.deleteMany({});

      const passwordHash = await bcrypt.hash("sekret", 10);
      const user = new User({ username: "root", passwordHash });

      await user.save();
    });

    test("creation succeeds with a fresh username", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "matti_meikalainen",
        name: "Matti Meikäläinen",
        password: "salainen",
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

      const usernames = usersAtEnd.map((u) => u.username);
      assert(usernames.includes(newUser.username));
    });

    test("creation fails with proper statuscode and message if username already taken", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "root",
        name: "Superuser",
        password: "salainen",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      assert(result.body.error.includes("expected `username` to be unique"));

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("creation fails with proper statuscode and message if username is missing", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "",
        name: "Test User",
        password: "salainen",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      assert(
        result.body.error.includes(
          "User validation failed: username: Path `username` is required.",
        ),
      );

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("creation fails with proper statuscode and message if username is too short", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "te",
        name: "Test User",
        password: "salainen",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      assert(
        result.body.error.includes(
          "is shorter than the minimum allowed length (3)",
        ),
      );

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("creation fails with proper statuscode and message if password is missing", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "testUser",
        name: "Test User",
        password: "",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      assert(result.body.error.includes("password missing."));

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("creation fails with proper statuscode and message if password is too short", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "testUser",
        name: "Test User",
        password: "sa",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      assert(
        result.body.error.includes(
          "password is shorter than the minimum allowed length (3).",
        ),
      );

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
  });
});

after(() => {
  mongoose.connection.close();
});
