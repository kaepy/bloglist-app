/**
 * @module tests/teardown
 * Global teardown hook for Node.js test runner.
 * Forces the process to exit after all tests complete, ensuring
 * that open handles (e.g., MongoDB connections) don't keep the
 * process alive indefinitely.
 */
module.exports = () => {
  process.exit(0);
};
