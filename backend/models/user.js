/**
 * @module models/user
 * Mongoose model for User documents.
 *
 * Fields:
 *   - username (String, required, unique, 3-20 chars, alphanumeric + . _ -)
 *   - name (String)
 *   - passwordHash (String) — bcrypt hash, never exposed in JSON
 *   - blogs (Array of ObjectId refs -> Blog) — blogs created by this user
 *
 * IMPORTANT: Password validation (length, presence) must be done in the
 * controller BEFORE hashing, because Mongoose validators only see the
 * already-hashed value. This is by design — the plain-text password
 * should never reach the database layer.
 *
 * REFACTORING NOTES:
 * - The `name` field has no validation — consider adding minlength/maxlength.
 * - Consider extracting the username regex into a shared constants file
 *   so the same pattern can be reused for client-side validation.
 */

const mongoose = require("mongoose");

// Password validation must happen before hashing, as Mongoose validators only see the hashed value, not the plain-text password. This is by design for security reasons.

const userSchema = mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    maxlength: 20,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return /^[A-Za-z0-9_.-]+$/.test(value);
      },
      message: 'Username can only contain letters, numbers, ".", "_", and "-"',
    },
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

/**
 * Custom JSON serialization:
 * - Converts _id to a string `id`
 * - Strips internal fields (_id, __v)
 * - CRITICAL: Removes passwordHash to prevent leaking credentials in API responses
 */
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
