/**
 * @file blog_app.cy.js
 * Cypress end-to-end tests for the Blog application.
 *
 * These tests run against a real frontend (localhost:5173) and backend
 * (localhost:3001). Before each test, the database is reset via the
 * /api/testing/reset endpoint and two fresh users are created.
 *
 * Test structure:
 *   - Login form visibility
 *   - Login success/failure
 *   - Blog CRUD operations (create, like, delete)
 *   - Authorization (only creator sees remove button)
 *   - Sorting by likes
 *
 * REFACTORING NOTES:
 * - `it.only` on the last test means all other "When logged in" tests
 *   are skipped during normal runs. Remove `.only` to run the full suite.
 * - The like-button loop (`for (let i = 0; i < 5; i++)`) can be flaky
 *   because each click triggers an async API call. Add `cy.wait` or
 *   assert the updated count before clicking again.
 * - Hard-coded URLs (localhost:5173, localhost:3001) should use
 *   Cypress.env or cypress.config.js baseUrl for portability.
 * - Custom commands (cy.login, cy.createBlog, cy.logout) are defined in
 *   cypress/support/commands.js and bypass the UI for faster setup.
 */

describe("Blog app", function () {
  beforeEach(function () {
    // Initialize two test users for testing ownership/authorization logic
    const user1 = {
      name: "Himmeli Hommeli",
      username: "himmeli",
      password: "hommeli",
    };

    const user2 = {
      name: "Gimmeli Gommeli",
      username: "gimmeli",
      password: "gommeli",
    };

    // Reset the test database and create fresh users before every test
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user1);
    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user2);

    cy.visit("http://localhost:5173");
  });

  it("Login form is shown", function () {
    cy.contains("username").get("#username");
    cy.contains("password").get("#password");
    cy.contains("login");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("himmeli");
      cy.get("#password").type("hommeli");
      cy.get("#login-button").click();

      cy.contains("Welcome himmeli!");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("himmeli");
      cy.get("#password").type("wrong");
      cy.get("#login-button").click();

      cy.contains("Ups! Wrong credentials. Try again :)");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "himmeli", password: "hommeli" });

      cy.createBlog({
        title: "yet title",
        author: "yet author",
        url: "yet url",
      });
      cy.createBlog({
        title: "another title",
        author: "another author",
        url: "another url",
      });
      cy.createBlog({
        title: "and title",
        author: "and author",
        url: "and url",
      });
    });

    it("A blog can be created", function () {
      cy.contains("new blog").click();

      cy.get("#title").type("title example");
      cy.get("#author").type("author example");
      cy.get("#url").type("url example");
      cy.get("#create-button").click();

      cy.contains("A new blog title example by author example added");
      cy.contains("title example");
    });

    it("A blog can be liked", function () {
      // Expand blog details, click like, and verify the count increments
      cy.contains("another title")
        .as("likeBlog")
        .find("#viewhide-button")
        .click();

      cy.get("@likeBlog").contains("likes").should("contain", "0");
      cy.get("@likeBlog").find("#like-button").click();

      cy.contains("New like added to blog another title");
      // After liking, the blog may re-sort; search from parent to find updated count
      cy.get("@likeBlog").parent().contains("likes").should("contain", "1");
    });

    it("A blog can be removed", function () {
      cy.contains("and title")
        .as("blogToRemove")
        .find("#viewhide-button")
        .click();

      cy.get("@blogToRemove").find("#remove-button").click();

      cy.contains("Blog and title removed");
      cy.get("and another title").should("not.exist");
    });

    it("Only blog creator can see remove button", function () {
      // Verify remove button is visible for the creator (himmeli)
      cy.contains("yet title")
        .as("blogToRemove")
        .find("#viewhide-button")
        .click();

      cy.get("@blogToRemove").find("#remove-button");

      // Log out himmeli and log in gimmeli (different user)
      cy.logout();
      cy.login({ username: "gimmeli", password: "gommeli" });

      // Verify remove button is NOT visible for non-creator
      cy.get("@blogToRemove").find("#viewhide-button").click();

      cy.get("@blogToRemove").find("#remove-button").should("not.exist");
    });

    it.only("Blogs are sorted by likes", function () {
      // Expand all three blogs to access their like buttons
      cy.get(".blog")
        .contains("yet title")
        .as("likeYetBlog")
        .find("#viewhide-button")
        .click();

      cy.get(".blog")
        .contains("another title")
        .as("likeAnotherBlog")
        .find("#viewhide-button")
        .click();

      cy.get(".blog")
        .contains("and title")
        .as("likeAndBlog")
        .find("#viewhide-button")
        .click();

      // Like "another" 5 times, "yet" 2 times, "and" 0 times
      // Then verify DOM order matches descending like count
      for (let i = 0; i < 5; i++) {
        cy.get("@likeAnotherBlog").find("#like-button").click();
      }
      cy.get("@likeAnotherBlog").contains("likes").should("contain", "5");

      cy.get("@likeYetBlog").find("#like-button").click();
      cy.get("@likeYetBlog").find("#like-button").click();
      cy.get("@likeYetBlog").contains("likes").should("contain", "2");

      cy.get(".blog").eq(0).should("contain", "another title");
      cy.get(".blog").eq(1).should("contain", "yet title");
      cy.get(".blog").eq(2).should("contain", "and title");
    });
  });
});
