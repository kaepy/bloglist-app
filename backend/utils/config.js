//Ympäristömuuttujien käsittely

require("dotenv").config();

const SECRET = process.env.SECRET;
const PORT = process.env.PORT;

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI // if test environment, use test database URI
    : process.env.MONGODB_URI; // otherwise, use production database URI

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET,
};
