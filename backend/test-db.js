require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.TEST_MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ Connection failed:", err.message))
  .finally(() => process.exit());

// node test-db.js
