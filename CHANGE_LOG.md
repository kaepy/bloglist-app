# CHANGE LOGS

## 7.13: Redux, step4

Siirrä myös kirjautuneen käyttäjän tietojen talletus Reduxiin.

## Implement user authentication with Redux: add userReducer, integrate login/logout functionality, and update components to use Redux state

- Created userReducer.js with setUser action and initializeUser, loginUser, logoutUser thunks
- Created userReducer.test.js with tests for the action, all three thunks, and error path
- Added user: userReducer to the Redux store in store.js
- Refactored App.jsx to use useSelector and dispatch user thunks instead of useState/storage/loginService
- Removed user prop from Bloglist.jsx and its PropTypes
- Removed user prop from Blog.jsx; reads user via useSelector instead
- Fixed stale PropTypes in LoginForm.jsx
- Updated Blog.test.js to include userReducer in test store and use store.dispatch(setUser(...)) instead of prop
- Updated BlogForm.test.js to include userReducer in test store
- Added detailed JSDoc comments for better documentation
- Refactored notification handling in reducers and services
- Refactored blog service methods to use consistent async/await syntax

## Known issues

- The token expiration is only discovered when making an API call. The frontend doesn't know the token is invalid until the backend rejects it.
