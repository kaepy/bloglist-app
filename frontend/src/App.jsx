import { useState, useEffect, useRef } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Error from "./components/Error";
import Bloglist from "./components/Bloglist";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  // Console: window.localStorage
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      handleNotificationChange(`Welcome ${user.username}!`);
      setUsername("");
      setPassword("");
    } catch {
      handleErrorChange("Ups! Wrong credentials. Try again :)");
    }
  };

  const logout = () => {
    // removeItem ottaa vastaan vaan keyn
    // ei palauta promisea nii ei oo mitään awaitattavaa
    // window. ei ole pakollinen perinteisissä react appeissa (esim. frontti app), mutta sitä tarvittasiin esimerkisksi server side renderingissä. Windowin käyttö on kuitenkin yleisesti ottaen yhteensopivampi tapa joten sen käytöstä ei ole haittaakaan.
    window.localStorage.removeItem("loggedBlogappUser");
    blogService.setToken(null);
    setUser(null);

    handleNotificationChange("See you again!");
  };

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));

      handleNotificationChange(
        `A new blog ${blogObject.title} by ${blogObject.author} added`,
      );
    } catch (error) {
      handleErrorChange(
        error.response?.data?.error || "Failed to add blog. Please try again.",
      );
    }
  };

  const updateBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.update(blogObject.id, blogObject);
      setBlogs(
        blogs.map((blog) => (blog.id !== blogObject.id ? blog : returnedBlog)),
      );

      handleNotificationChange(`New like added to blog ${blogObject.title}`);
    } catch (error) {
      handleErrorChange(
        error.response?.data?.error ||
          "Failed to update blog. Please try again.",
      );
    }
  };

  const removeBlog = async (blogObject) => {
    if (
      window.confirm(`Are you sure you want to remove ${blogObject.title} ?`)
    ) {
      try {
        await blogService.remove(blogObject.id);
        setBlogs(blogs.filter((blog) => blog.id !== blogObject.id));

        handleNotificationChange(`Blog ${blogObject.title} removed`);
      } catch (error) {
        handleErrorChange(
          error.response?.data?.error ||
            "Failed to remove blog. Please try again.",
        );
      }
    }
  };

  const handleNotificationChange = (notification) => {
    setNotificationMessage(notification);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 5000);
  };

  const handleErrorChange = (error) => {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={notificationMessage} />
      <Error message={errorMessage} />

      {!user && (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      )}

      {user && (
        <Bloglist
          blogFormRef={blogFormRef}
          user={user}
          blogs={blogs}
          logout={logout}
          createBlog={addBlog}
          updateBlog={updateBlog}
          removeBlog={removeBlog}
        />
      )}
    </div>
  );
};

export default App;
