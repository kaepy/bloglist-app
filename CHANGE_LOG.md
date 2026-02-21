# CHANGE LOGS

## 7.13: React Query ja context step4

Siirrä myös kirjautuneen käyttäjän tietojen hallinnointi tapahtumaan useReducer-hookin ja contextin avulla.

## Changes

- Developed UserContext for managing user authentication state and actions.
- Added useAuth and useUser hooks for streamlined authentication logic and context access.
- Removed redundant Redux store configuration file in favor of context-based state management.
- Refactored login service documentation for better understanding of axios usage.
- Implemented new Bloglist, LoginForm, Notification, Togglable, and UserContext tests to ensure component functionality and state management.
- Updated blog service tests to improve clarity and coverage.
- Added error handling notes in storage service documentation.
- Introduced Copilot instructions for consistent development practices and code reviews.
- Created detailed test instructions for frontend and backend to standardize testing approach.

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
