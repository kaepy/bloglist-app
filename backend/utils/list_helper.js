/**
 * @module list_helper
 * Pure utility functions for blog statistics and analytics.
 * Used by unit tests and potentially by API endpoints that need
 * aggregated blog data.
 */

const _ = require("lodash");

/**
 * Calculate the total number of likes across all blogs.
 * @param {Array} blogs - Array of blog objects, each with a `likes` property
 * @returns {number} Sum of all likes (0 for an empty array)
 */
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

/**
 * Find the blog with the most likes.
 * @param {Array} blogs - Non-empty array of blog objects
 * @returns {Object} Object with title, author, and likes of the top blog
 */
const favoriteBlog = (blogs) => {
  const mostVotes = blogs.reduce((prev, current) =>
    +prev.likes > +current.likes ? prev : current,
  );

  return {
    title: mostVotes.title,
    author: mostVotes.author,
    likes: mostVotes.likes,
  };
};

/**
 * Find the author who has written the most blogs.
 * Groups blogs by author, counts unique titles per author,
 * then returns the author with the highest count.
 * @param {Array} blogs - Non-empty array of blog objects
 * @returns {Object} { author: string, blogs: number }
 */
const mostBlogs = (blogs) => {
  const byAuthors = _.groupBy(blogs, "author");


  const result = Object.keys(byAuthors).map((author) => {
    // Group by title to count only unique blog entries per author
    const byUniqueBlogs = _.groupBy(byAuthors[author], "title");

    return {
      author: author,
      blogs: Object.keys(byUniqueBlogs).length,
    };
  });

  return result.reduce((max, current) =>
    max.blogs > current.blogs ? max : current,
  );
};

/**
 * Find the author whose blogs have the most total likes.
 * Groups blogs by author, sums likes per author, then
 * returns the author with the highest total.
 * @param {Array} blogs - Non-empty array of blog objects
 * @returns {Object} { author: string, likes: number }
 */
const mostLikes = (blogs) => {
  const byAuthors = _.groupBy(blogs, "author");

  const result = Object.keys(byAuthors).map((author) => {
    const totalLikes = byAuthors[author].reduce(
      (sum, current) => sum + current.likes,
      0,
    );

    return {
      author: author,
      likes: totalLikes,
    };
  });

  return result.reduce((max, current) =>
    max.likes > current.likes ? max : current,
  );
};

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
