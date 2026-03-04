# CHANGE LOGS

## 7.21: tyylit, step2

Jos käytät tyylien lisäämiseen noin tunnin aikaa, merkkaa myös tämä tehtävä tehdyksi.

## Changes

- Enhance security and validation across the application
- Added Helmet middleware for secure HTTP headers.
- Restricted CORS to known safe origins.
- Updated blog creation to ignore likes and comments from the request body.
- Implemented comment validation in the blog comments endpoint.
- Introduced rate limiting for login attempts to mitigate brute-force attacks.
- Increased minimum password length from 3 to 8 characters.
- Enhanced blog model validation for URLs and comments.
- Updated tests to reflect changes in URL handling and password validation.
- Fixed test files with JSX use .js extension
- Fixed Cypress commands.js hardcodes URLs
- Fixed React 19 introduced the use(Usercontext) hook which can replace useContext(Usercontext).
  - Nb! Unlike useContext, use() can be called conditionally or inside loops — but it still returns null/undefined when invoked outside a provider rather than throwing, which is why the explicit guard (if (!context) throw ...) is preserved. That guard is what gives the helpful error message.

## Known issues

- The token expiration is only discovered when making an API call. The frontend doesn't know the token is invalid until the backend rejects it.
- "Loading something..." Loading texts flash when any page is refreshed.

## Refactoring recommendations

- PropTypes depricated on React 19 and Typescript is the new recommended way to go. Project uses JavaScript for a legacy reason.
- CommonJS is a legacy choice for Node backend. CommonJS (require/module.exports) was the only option for Node.js for ~10 years. ESM (import/export) is the JavaScript standard and is now fully supported everywhere (browsers, Node, Deno, Bun, edge runtimes).
- Notification timer leak — NotificationContext.jsx. showNotification starts a new setTimeout each call but never cancels the previous one. Calling it twice in rapid succession (e.g., like then delete) causes the first timer to prematurely clear the second notification. Fix: store the timer in a useRef and call clearTimeout before each new setTimeout.
- NotificationDispatch is exposed in context — NotificationContext.jsx. Any consumer can call notificationDispatch directly, bypassing showNotification and its auto-clear timer entirely. It should be removed from the context value — showNotification is the only API consumers need.
- BrowserRouter inside a conditional — App.jsx. The unauthenticated view is rendered outside <BrowserRouter>, meaning useNavigate / Link / useParams would crash if used in LoginForm or Notification. The <BrowserRouter> should be moved to main.jsx to wrap the entire app unconditionally. Also: there is no nav link to users anywhere — users can't reach UserList without typing the URL.
- Like button has no pending guard — Blog.jsx. Rapid clicking sends multiple requests using the same stale blog.likes value from the cache snapshot. The like button should be disabled={voteBlogMutation.isPending}.
- request() helper is duplicated — services/blogs.js, services/users.js
- login.js uses axios — services/login.js. This is the only service not using native fetch with the request() pattern. It produces a different error shape (error.response.data.error) than all other services (error.message), which forces useAuth.js to use error.response?.data?.error || error.message to handle both shapes.
- JWT tallennetaan localStorage-muistiin → XSS-hyökkäys voi varastaa tokenin. Turvallisempi vaihtoehto olisi HttpOnly-keksi, mutta se vaatii isomman arkkitehtuurimuutoksen.
