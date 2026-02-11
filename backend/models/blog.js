/**
 * @module models/blog
 * Mongoose model for Blog documents.
 *
 * Fields:
 *   - title (String, required, min 5 chars)
 *   - author (String)
 *   - url (String)
 *   - likes (Number)
 *   - user (ObjectId ref -> User) — the creator of the blog
 *
 * REFACTORING NOTES:
 * - `url` should have a required constraint and/or a URL format validator
 *   (e.g., using `match` with a regex, or the `validator` npm package).
 * - `likes` should default to 0 at the schema level:
 *       likes: { type: Number, default: 0 }
 *   Currently the default is only set in the controller, which leaves
 *   the model inconsistent when used elsewhere.
 * - Consider adding timestamps: true for automatic createdAt/updatedAt.
 */

const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 5,
    required: true
  },
  author: String,
  url: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

/**
 * Custom JSON serialization:
 * - Converts MongoDB's _id (ObjectId) to a string `id` property
 * - Removes internal MongoDB fields (_id, __v) from API responses
 */
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)