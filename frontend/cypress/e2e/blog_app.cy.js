/**
 * @file blog_app.cy.js
 * Cypress end-to-end tests for the Blog application.
 *
 * These tests run against a real frontend (baseUrl from cypress.config.js)
 * and backend (BACKEND env from cypress.config.js). Before each test,
 * the database is reset via the /api/testing/reset endpoint and two fresh
 * users are created.
 *
 * Test structure:
 *   - Login form visibility
 *   - Login success/failure
 *   - Blog CRUD operations (create, like, delete)
 *   - Comments (add comments, display comments)
 *   - Authorization (only creator sees remove button)
 *   - Sorting by likes
 *   - Navigation (nav links, users list, user detail pages)
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

    cy.visit("/");
  });

  it("Login form is shown", function () {
    cy.get("#username");
    cy.get("#password");
    cy.get("#login-button");
  });

  describe("Login", function () {
    it("Succeeds with correct credentials", function () {
      cy.get("#username").type("himmeli");
      cy.get("#password").type("hommeli");
      cy.get("#login-button").click();

      cy.contains("Welcome back, Himmeli Hommeli!");
    });

    it("Fails with wrong credentials", function () {
      cy.get("#username").type("himmeli");
      cy.get("#password").type("wrong");
      cy.get("#login-button").click();

      cy.contains("Invalid username or password");
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
      cy.contains("New blog").click();

      cy.get("#title").type("title example");
      cy.get("#author").type("author example");
      cy.get("#url").type("url example");
      cy.get("#create-button").click();

      cy.contains('A new blog "title example" by author example added!');
      cy.contains("title example");
    });

    it("Logging out returns to the login form", function () {
      cy.contains("Logout").click();

      // After logout the authenticated Router is torn down; login form should appear
      cy.get("#login-button");
    });

    it("Clicking a blog title shows its full details", function () {
      cy.contains("yet title").click();

      // The detail page must display all key fields
      cy.contains("yet title");
      cy.contains("yet author");
      cy.contains("yet url");
      cy.contains("Like (0)");
      // "Added by" link to the creator's user page should be present
      cy.contains("himmeli");
    });

    it("Added by link navigates to the user detail page", function () {
      cy.contains("yet title").click();

      // Click the "Added by himmeli" link on the blog detail page
      cy.contains("himmeli").click();

      // Should land on the user detail page showing the username and their blogs
      cy.contains("himmeli");
      cy.contains("Blogs added by");
      cy.contains("yet title");
    });

    it("A blog can be liked", function () {
      // Navigate to the detail page, then interact with the like button there
      cy.contains("another title").click();

      cy.contains("Like (0)");
      cy.get("#like-button").click();

      cy.contains('New like added to blog "another title"!');
      cy.contains("Like (1)");
    });

    it("A blog can be removed", function () {
      // Navigate to the detail page — the remove button lives there after the refactor
      // window.confirm is auto-stubbed to true by Cypress
      cy.contains("and title").click();

      cy.get("#remove-button").click();

      // onSuccess calls navigate("/"), so we land back on the list automatically
      cy.contains('Blog "and title" removed!');
      // Scope to .blog elements — the notification message also contains "and title"
      // so a document-level cy.contains("and title").should("not.exist") would always fail
      cy.get(".blog").should("not.contain", "and title");
    });

    it("Only blog creator can see remove button", function () {
      // Verify remove button is visible for the creator (himmeli)
      cy.contains("yet title").click();
      cy.get("#remove-button").should("exist");

      // Go back to the list, then switch to a different user
      // Aliases don't survive navigation, so we re-find the blog title after login
      cy.go("back");
      cy.logout();
      cy.login({ username: "gimmeli", password: "gommeli" });

      // Verify remove button is NOT visible for non-creator
      cy.contains("yet title").click();
      cy.get("#remove-button").should("not.exist");
    });

    it("User can add a comment to a blog", function () {
      cy.contains("yet title").click();

      // Initially shows "No comments yet."
      cy.contains("No comments yet.");

      // Add a comment
      cy.get("#comment").type("This is a great blog post!");
      cy.get("#add-comment-button").click();

      // Verify the comment appears in the list
      cy.contains("This is a great blog post!");

      // Verify "No comments yet." is no longer shown
      cy.contains("No comments yet.").should("not.exist");
    });

    it("User can add multiple comments to a blog", function () {
      cy.contains("yet title").click();

      // Add first comment
      cy.get("#comment").type("First comment");
      cy.get("#add-comment-button").click();
      cy.contains("First comment");

      // Add second comment
      cy.get("#comment").type("Second comment");
      cy.get("#add-comment-button").click();
      cy.contains("Second comment");

      // Both comments should be visible
      cy.contains("First comment");
      cy.contains("Second comment");
    });

    it("Blogs are sorted by likes", function () {
      // Like "another" 5 times — wait for each count update before the next click
      // to avoid the stale-cache race condition (both optimistic updates reading the
      // same blog.likes snapshot if clicks fire before the mutation resolves)
      cy.contains("another title").click();
      for (let i = 0; i < 5; i++) {
        cy.get("#like-button").click();
        cy.contains(`Like (${i + 1})`);
      }
      cy.go("back");

      // Like "yet" 2 times
      cy.contains("yet title").click();
      for (let i = 0; i < 2; i++) {
        cy.get("#like-button").click();
        cy.contains(`Like (${i + 1})`);
      }
      cy.go("back");

      // "and" stays at 0 likes — verify DOM order matches descending like count
      // voteBlogMutation.onSuccess updates the ["blogs"] cache via setQueryData,
      // so the list re-sorts without a network refetch
      cy.get(".blog").eq(0).should("contain", "another title");
      cy.get(".blog").eq(1).should("contain", "yet title");
      cy.get(".blog").eq(2).should("contain", "and title");
    });

    describe("Navigation", function () {
      it("Nav bar shows Blogs and Users links", function () {
        // Both navigation buttons should be visible in the AppBar
        cy.get("nav, header").within(function () {
          cy.contains("Blogs");
          cy.contains("Users");
        });
      });

      it("Users link navigates to the users list", function () {
        cy.contains("Users").click();

        // The Users page should display both test users in a table
        cy.contains("Users");
        cy.contains("Blogs Created");
        cy.contains("himmeli");
        cy.contains("gimmeli");
      });

      it("Blogs link navigates back to the blog list", function () {
        // Navigate away from blogs first
        cy.contains("Users").click();
        cy.contains("Blogs Created");

        // Navigate back via the Blogs nav link
        cy.contains("Blogs").click();

        // All three blogs should be visible on the list page
        cy.contains("yet title");
        cy.contains("another title");
        cy.contains("and title");
      });

      it("Clicking a username on the users page shows their blogs", function () {
        cy.contains("Users").click();
        cy.contains("himmeli").click();

        // User detail page — shows the username and all blogs created by this user
        cy.contains("Blogs added by");
        cy.contains("himmeli");
        cy.contains("yet title");
        cy.contains("another title");
        cy.contains("and title");
      });

      it("User with no blogs shows empty state", function () {
        cy.contains("Users").click();
        cy.contains("gimmeli").click();

        // Gimmeli has no blogs — the detail page should indicate this
        cy.contains("Blogs added by");
        cy.contains("gimmeli");
        cy.contains("No blogs added yet.");
      });
    });
  });
});
