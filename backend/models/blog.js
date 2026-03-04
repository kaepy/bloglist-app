/**
 * @module models/blog
 * Mongoose model for Blog documents.
 *
 * Fields:
 *   - title (String, required, 5-200 chars)
 *   - author (String, max 100 chars)
 *   - url (String, max 2000 chars, must be http/https)
 *   - likes (Number, default 0)
 *   - user (ObjectId ref -> User) — the creator of the blog
 *   - comments (Array of String, each max 500 chars)
 *
 * Security note: URL is validated to only allow http/https schemes to
 * prevent javascript: URI XSS attacks via rendered <a href> links.
 */

const mongoose = require("mongoose");

// Only allow safe URL schemes — blocks javascript:, data:, vbscript: etc.
const safeUrlValidator = (value) => {
  if (!value) return true; // field is optional, let required handle absence
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 5,
    maxlength: 60,
    required: true,
  },
  author: {
    type: String,
    maxlength: 100,
  },
  url: {
    type: String,
    maxlength: 100,
    validate: {
      validator: safeUrlValidator,
      message: "URL must start with http:// or https://",
    },
  },
  likes: { type: Number, default: 0 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  comments: {
    type: [
      {
        type: String,
        maxlength: [100, "Comment cannot exceed 100 characters"],
        minlength: [1, "Comment cannot be empty"],
      },
    ],
    default: [],
  },
});

/**
 * Custom JSON serialization:
 * - Converts MongoDB's _id (ObjectId) to a string `id` property
 * - Removes internal MongoDB fields (_id, __v) from API responses
 */
blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Blog", blogSchema);
