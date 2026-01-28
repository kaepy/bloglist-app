const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt"); //poistettu käytöstä

const { test, describe, after, beforeEach } = require("node:test");
const app = require("../app");
const api = supertest(app);
const helper = require("./test_helper");
const assert = require("assert");

const Blog = require("../models/blog");
const User = require("../models/user");

/* These are integration tests of the full API:
- Test actual HTTP endpoints (/api/blogs, /api/users)
- Need a real Express app running
- Need a real database to store/retrieve test data
*/

// npm test -- tests/blog_api.test.js // tiedoston perusteella
// npm test -- -t 'a specific blog is within the returned blogs' // testin nimen perusteella
// npm test -- -t 'blogs' // kaikki testit, joiden nimessä on sana blogs

const testUser = {
  username: "testuser",
  name: "Test User",
  password: "password",
};

describe("when there is initially some blogs saved", () => {
  beforeEach(async () => {
    // initialize blogs
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);

    // initialize users
    await User.deleteMany({});
    await User.insertMany(helper.initialUsers);
  });

  test("blogs are returned as json", async () => {
    // supertest osuus
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // hyödynnetään supertestillä saatua responsea jesti expectissä
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("blogs are returned with id property", async () => {
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

      // Luo kirjautuneen käyttäjän ja sille tokenin joka otetaan talteen
      const authToken = await helper.testUserToken();

      const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.title, newBlog.title);
      assert.strictEqual(response.body.author, newBlog.author);
      assert.strictEqual(response.body.url, newBlog.url);
      assert.strictEqual(response.body.likes, newBlog.likes);

      // tarkistetaan että kannassa on yksi blogi enemmän
      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

      // tarkistetaan että uusi blogi löytyy kannasta
      const titles = blogsAtEnd.map((b) => b.title);
      assert(titles.includes("Test is test na naaa naa na na"));

      assert(response.body.user !== null);
    });

    test("likes default value set to 0 if no other value given", async () => {
      const newBlog = {
        title: "Test zero",
        author: "Person999",
        url: "url999",
      };

      const authToken = await helper.testUserToken();

      const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      // console.log(response.body)

      assert.strictEqual(response.body.likes, 0);
    });

    test("fails with statuscode 400 if title or url is invalid", async () => {
      const newBlog = {
        author: "Person999",
      };

      const authToken = await helper.testUserToken();

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newBlog)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();

      // console.log(blogsAtEnd)

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });
  });

  describe("deletion of a blog", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      // Tehdään kannasta kopio alkutilanteelle ja poimitaan mikä blogi poistetaan
      const blogsAtStart = await helper.blogsInDb();
      //console.log('blogsAtStart: ', blogsAtStart)

      const blogToDelete = blogsAtStart[0];
      //console.log('blogToDelete: ', blogToDelete.id)

      // Luo kirjautuneen käyttäjän ja sille tokenin joka otetaan talteen
      const authToken = await helper.testUserToken();
      //console.log('authToken: ', authToken)

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      // Tarkistetaan että kannassa on yksi blogi vähemmän
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

      // Tarkistetaan että poistettua blogia ei enää löydy kannasta
      const titles = blogsAtEnd.map((r) => r.title);
      assert(!titles.includes(blogToDelete.title));
    });

    test("fails with statuscode 401 if token is missing", async () => {
      // Tehdään kannasta kopio alkutilanteelle ja poimitaan mikä blogi poistetaan
      const blogsAtStart = await helper.blogsInDb();
      //console.log('blogsAtStart: ', blogsAtStart)

      const blogToDelete = blogsAtStart[0];
      //console.log('blogToDelete: ', blogToDelete)

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", "Bearer ")
        .expect(401);

      const blogsAtEnd = await helper.blogsInDb();

      // Tarkistetaan että kannassa on yhtä monta blogia
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);

      // Tarkistetaan ettei poistettu blogi löytyy kannasta
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

      //console.log(blogToModify)

      await api
        .put(`/api/blogs/${blogToModify.id}`)
        .send(modifiedBlog)
        .expect(200);

      const blogsAtEnd = await helper.blogsInDb();
      const blogAfterMod = blogsAtEnd[0];

      //console.log(blogAfterMod)

      assert.strictEqual(blogAfterMod.likes, modifiedBlog.likes);
    });
  });

  describe("when there is initially one user at db", () => {
    beforeEach(async () => {
      await User.deleteMany({});
      //await User.insertMany(helper.initialUsers)

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
