# CHANGE LOGS

## 7.20: tyylit, step1

Tee sovelluksesi ulkoasusta tyylikkäämpi jotain kurssilla esiteltyä tapaa käyttäen

## Changes

- Integrate Material-UI components for improved UI consistency
- Added Material-UI dependencies for styling and components.
- Refactored App component to use Material-UI's AppBar, Toolbar, and Container for layout.
- Updated Blog component to utilize Material-UI's Card, Typography, and Button for a more modern look.
- Enhanced BlogForm with Material-UI's TextField and Button for better input handling.
- Improved BlogList and BlogListItem to use Material-UI's List and ListItem for better presentation.
- Updated User and UserList components to use Material-UI's Card and Table for structured data display.
- Refined Notification component to use Material-UI's Alert for consistent messaging.
- Adjusted Togglable component to use Material-UI's Collapse for animated visibility.
- Updated tests to reflect changes in component structure and styling.

## Known issues

- The token expiration is only discovered when making an API call. The frontend doesn't know the token is invalid until the backend rejects it.

## Refactoring recommendations

- PropTypes depricated on React 19 and Typescript is the new recommended way to go. Project uses JavaScript for a legacy reason.
- CommonJS is a legacy choice for Node backend. CommonJS (require/module.exports) was the only option for Node.js for ~10 years. ESM (import/export) is the JavaScript standard and is now fully supported everywhere (browsers, Node, Deno, Bun, edge runtimes).
- React 19 introduced the use() hook which can replace useContext.

  ```js
  // Legacy (still works)
  const user = useContext(UserContext);

  // React 19 idiomatic
  const user = use(UserContext);
  ```

- Notification timer leak — NotificationContext.jsx. showNotification starts a new setTimeout each call but never cancels the previous one. Calling it twice in rapid succession (e.g., like then delete) causes the first timer to prematurely clear the second notification. Fix: store the timer in a useRef and call clearTimeout before each new setTimeout.
- NotificationDispatch is exposed in context — NotificationContext.jsx. Any consumer can call notificationDispatch directly, bypassing showNotification and its auto-clear timer entirely. It should be removed from the context value — showNotification is the only API consumers need.
- BrowserRouter inside a conditional — App.jsx. The unauthenticated view is rendered outside <BrowserRouter>, meaning useNavigate / Link / useParams would crash if used in LoginForm or Notification. The <BrowserRouter> should be moved to main.jsx to wrap the entire app unconditionally. Also: there is no nav link to users anywhere — users can't reach UserList without typing the URL.
- Like button has no pending guard — Blog.jsx. Rapid clicking sends multiple requests using the same stale blog.likes value from the cache snapshot. The like button should be disabled={voteBlogMutation.isPending}.
- Cypress commands.js hardcodes URLs
- request() helper is duplicated — services/blogs.js, services/users.js
- login.js uses axios — services/login.js. This is the only service not using native fetch with the request() pattern. It produces a different error shape (error.response.data.error) than all other services (error.message), which forces useAuth.js to use error.response?.data?.error || error.message to handle both shapes.
- Test files with JSX use .js extension: BlogForm.test.js, BlogListItem.test.js
