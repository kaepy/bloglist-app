# CHANGE LOGS

## 7.15: yksittäisen käyttäjän näkymä

Tee sovellukseen yksittäisen käyttäjän näkymä, jolta selviää mm. käyttäjän lisäämät blogit

## Changes

- Add user profile page and enhance user-related features
- Implemented User component to display user details and their blogs.
- Updated UserList to link usernames to their respective profile pages.
- Enhanced Blog component to link to user profiles.
- Added getUserById service function for fetching user data by ID.
- Refactored login and users controllers to supoprt user.id
- Updates Blog.test.js
- Added tests for User and UserList components

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
