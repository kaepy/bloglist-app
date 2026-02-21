/**
 * @module models/blog
 * Mongoose model for Blog documents.
 *
 * Fields:
 *   - title (String, required, min 5 chars)
 *   - author (String)
 *   - url (String)
 *   - likes (Number, default 0)
 *   - user (ObjectId ref -> User) — the creator of the blog
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
  likes: { type: Number, default: 0 },
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