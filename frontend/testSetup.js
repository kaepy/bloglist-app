/**
 * @file testSetup.js
 * Loaded before every test file via vitest.config.js `setupFiles`.
 *
 * Registers @testing-library/jest-dom matchers (toBeInTheDocument, toHaveValue, etc.)
 * globally so test files don't need to import them individually.
 *
 * cleanup() after each test is handled automatically by @testing-library/react v13+,
 * and afterEach/beforeEach globals come from vitest.config.js `globals: true` —
 * neither needs to be imported or called here.
 */
import "@testing-library/jest-dom/vitest";
