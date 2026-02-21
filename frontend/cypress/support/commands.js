/**
 * @file commands.js
 * Custom Cypress commands for common test operations.
 *
 * These commands bypass the UI for speed and reliability:
 * - cy.login(): Authenticates via API and sets localStorage directly
 * - cy.logout(): Clears the session from localStorage
 * - cy.createBlog(): Creates a blog via API with the stored JWT token
 */

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/**
 * Log in a user by calling the login API directly (bypasses UI).
 * Stores the response token in localStorage and reloads the app.
 */

Cypress.Commands.add("login", ({ username, password }) => {
  cy.request("POST", "http://localhost:3001/api/login", {
    username,
    password,
  }).then(({ body }) => {
    localStorage.setItem("blogUserKey", JSON.stringify(body));
    cy.visit("http://localhost:5173");
  });
});

/** Log out by removing the user token from localStorage */
Cypress.Commands.add("logout", () => {
  localStorage.removeItem("blogUserKey");
});

/** Create a blog via the API using the stored JWT (bypasses UI form) */
Cypress.Commands.add("createBlog", ({ title, author, url }) => {
  cy.request({
    url: "http://localhost:3001/api/blogs",
    method: "POST",
    body: { title, author, url },
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("blogUserKey")).token}`,
    },
  });

  cy.visit("http://localhost:5173");
});
