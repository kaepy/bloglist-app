/**
 * @module controllers/blogs
 * Express router for blog CRUD operations.
 *
 * Routes:
 *   GET    /           - List all blogs (public)
 *   GET    /:id        - Get a single blog by ID (public)
 *   POST   /           - Create a new blog (authenticated)
 *   DELETE /:id        - Delete a blog (authenticated, owner only)
 *   PUT    /:id        - Update a blog (authenticated; only owner can edit content)
 *
 * Authentication is handled by the userExtractor middleware, which
 * verifies the JWT token and attaches the user to the request.
 */

const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

/** GET / - Retrieve all blogs with populated user info (username, name) */
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

/** GET /:id - Retrieve a single blog by its MongoDB ID */
blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate("user", { username: 1, name: 1 });
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

/**
 * POST / - Create a new blog.
 * Requires authentication (userExtractor middleware).
 * Associates the blog with the authenticated user and adds the
 * blog's ID to the user's blogs array.
 */
blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
    comments: body.comments || [],
  });

  // Save blog and populate user info for the response
  const savedBlog = await blog.save();
  await savedBlog.populate("user", { username: 1, name: 1 });

  // Add this blog to the user's list of blogs
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

/**
 * DELETE /:id - Remove a blog.
 * Requires authentication. Only the blog's creator can delete it.
 * Returns 204 No Content on success, 401 if the user is not the owner.
 */
blogsRouter.delete("/:id", middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).json({ error: "blog not found" });
  }

  const blogCreator = blog.user.toString();
  const user = request.user;
  const loggedUser = user._id.toString();

  // Only allow deletion if the authenticated user is the blog's creator
  if (loggedUser === blogCreator) {
    await Blog.findByIdAndDelete(request.params.id);
    return response.status(204).end();
  }

  response.status(401).json({ error: "unauthorized to delete this blog" });
});

/**
 * PUT /:id - Update a blog.
 * Requires authentication. Anyone can update likes (for the "like" feature),
 * but only the owner can modify the blog content (title, author, url).
 * The user field (owner) can never be changed.
 */
blogsRouter.put("/:id", middleware.userExtractor, async (request, response) => {
  const body = request.body;

  const existingBlog = await Blog.findById(request.params.id);

  if (!existingBlog) {
    return response.status(404).json({ error: "blog not found" });
  }

  const user = request.user;
  const isOwner = existingBlog.user.toString() === user._id.toString();

  // Build update object: likes are always writable, content only by owner
  const blog = {
    likes: body.likes,
    title: isOwner ? body.title : existingBlog.title,
    author: isOwner ? body.author : existingBlog.author,
    url: isOwner ? body.url : existingBlog.url,
    user: existingBlog.user, // Ownership is immutable
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  }).populate("user", { username: 1, name: 1 });

  response.json(updatedBlog);
});

blogsRouter.post("/:id/comments", middleware.userExtractor, async (request, response) => {
  const { comment } = request.body;
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).json({ error: "blog not found" });
  }

  blog.comments = blog.comments.concat(comment);
  const updatedBlog = await blog.save();
  await updatedBlog.populate("user", { username: 1, name: 1 });

  response.json(updatedBlog);
});

module.exports = blogsRouter;
