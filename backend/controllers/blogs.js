const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  //const blogs = await Blog.find({})
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.json(blogs);
});

// Yksittäisen blogin näyttäminen
blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

/* refaktoroidaan middlewareksi
// Eristää tokenin headerista authorizationin
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}
*/

// Blogin luominen
blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  //console.log('request: ', request)

  // poimitaan lisättävän blogin tiedot requestista
  const body = request.body;
  //console.log('body: ', body) // { author: 'HHHHHH', title: 'HHHHHH', url: 'HHHHHH', likes: 1 }

  // get user from request object
  const user = request.user;
  //console.log('blogs/user: ', user)
  //console.log('user._id: ', user._id) // undefined
  //console.log('user._id: ', user.blogs) // undefined

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });
  //console.log('blog', blog)

  // Mitä tässä tapahtuu?
  // To save the current state of the blog object to the database
  const savedBlog = await blog.save();
  await savedBlog.populate("user", { username: 1, name: 1 });

  //console.log('savedBlog ', savedBlog)

  // lisää blogin käyttäjän tietoihin muiden blogien seuraksi
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

// Blogin poistaminen
blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    // haetaan requestin id:n perusteella blogin tiedot
    const blog = await Blog.findById(request.params.id);

    // tarkistetaan että blogi löytyy
    if (!blog) {
      return response.status(404).json({ error: "blog not found" });
    }

    // poimitaan blogin tiedoista blogin luojan id
    const blogCreator = blog.user.toString();

    // get user from request object
    const user = request.user;

    // poimitaan kirjautuneen käyttäjän id
    const loggedUser = user._id.toString();

    // tarkastellaan onko blogin luonut käyttäjä ja kirjautunut käyttäjä sama
    if (loggedUser === blogCreator) {
      await Blog.findByIdAndDelete(request.params.id);
      return response.status(204).end();
    }

    response.status(401).json({ error: "unauthorized to delete this blog" });
  },
);

// Blogin muokkaaminen
blogsRouter.put("/:id", middleware.userExtractor, async (request, response) => {
  const body = request.body;

  // Fetch the existing blog to check ownership
  const existingBlog = await Blog.findById(request.params.id);

  if (!existingBlog) {
    return response.status(404).json({ error: "blog not found" });
  }

  const user = request.user;
  const isOwner = existingBlog.user.toString() === user._id.toString();

  // Anyone can update likes, but only owner can modify content
  const blog = {
    likes: body.likes,
    // Only allow content changes if user is the owner
    title: isOwner ? body.title : existingBlog.title,
    author: isOwner ? body.author : existingBlog.author,
    url: isOwner ? body.url : existingBlog.url,
    user: existingBlog.user, // Never allow changing the owner
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  }).populate("user", { username: 1, name: 1 });

  response.json(updatedBlog);
});

module.exports = blogsRouter;
