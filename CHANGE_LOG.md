# CHANGE LOGS

## 7.14: käyttäjien näkymä

Tee sovellukseen näkymä, joka näyttää kaikkiin käyttäjiin liittyvät perustiedot.

## Changes

- Add routing and user management features
- Integrated react-router-dom
- Created UserList component to display users
- Added user service for fetching users from the backend
- Enhanced error handling in request function
- Added user service tests

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
