/**
 * @module controllers/testing
 * Test-only router that provides a database reset endpoint.
 * Only loaded when NODE_ENV === 'test' (see app.js).
 *
 * POST /reset - Wipes all Blog and User documents from the test database.
 * Used by Cypress E2E tests to ensure a clean state before each test run.
 *
 * IMPORTANT: This route must NEVER be available in production.
 */

const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

/** Reset the test database by removing all blogs and users */
router.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router