require("dotenv").config();
const mongoose = require("mongoose");
const Blog = require("./models/blog");

mongoose
  .connect(process.env.TEST_MONGODB_URI)
  .then(async () => {
    console.log("✅ Connected");
    await Blog.deleteMany({});
    console.log("✅ deleteMany works");
    process.exit();
  })
  .catch((err) => console.log("❌ Error:", err.message));

// node test-write.js
