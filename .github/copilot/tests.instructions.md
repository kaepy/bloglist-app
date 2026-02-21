---
applyTo: "**/*.test.{js,jsx,ts,tsx},**/*.test.js,**/tests/**/*.js,frontend/src/**/*.test.*,backend/tests/**"
---

## Frontend Tests (files under `frontend/`)

- Runner: **Vitest** with globals enabled — do NOT import `describe`, `test`, `expect`, or `vi`, they are available globally
- Use `@testing-library/react` (`render`, `screen`) and `@testing-library/user-event` v14 with `userEvent.setup()` pattern
- Structure: `describe` / `test` blocks — **not** `it`
- Test names should follow the pattern `"when [condition], it should [outcome]"` — focus on behavior, not implementation
- Mocking: `vi.mock()` for modules, `vi.fn()` for functions
- Wrap components in `QueryClientProvider` + `UserContextProvider` + `NotificationContextProvider` as needed (match the provider tree in `frontend/src/main.jsx`)
- Use `await waitFor(() => { ... })` for async assertions
- Assert with jest-dom matchers (`toBeInTheDocument`, `toHaveValue`, `toHaveBeenCalled`, etc.)

## Cypress E2E Tests (files under `frontend/cypress/`)

- Use `describe`/`it` blocks with **`function()` syntax** — NOT arrow functions (arrow functions break Cypress `this` context)
- Reset DB in `beforeEach` via `cy.request("POST", \`${Cypress.env("BACKEND")}/testing/reset\`)`
- Use custom commands for setup — `cy.login({ username, password })`, `cy.createBlog({ title, author, url })` — these bypass the UI for speed and reliability. Do NOT drive the UI for test setup.
- Use `Cypress.env("BACKEND")` for the backend URL (not hardcoded `localhost:3001`)
- Custom commands are defined in `frontend/cypress/support/commands.js`

## Backend Tests (files under `backend/`)

- Runner: **Node.js built-in test runner** — `const { test, describe, after, beforeEach } = require("node:test")` and `const assert = require("assert")`
- Use `supertest` wrapping the Express `app` from `app.js` (not `index.js`)
- Assertions: `assert.strictEqual()` and `assert()`
- Use `beforeEach` to reset DB state (`deleteMany` + `insertMany`)
- Use `after(() => mongoose.connection.close())` for teardown
- Run with `--test-concurrency=1` (sequential)
- Do **NOT** use jest or vitest imports
