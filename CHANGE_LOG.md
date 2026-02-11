# CHANGE LOGS

## 7.12: Redux, step3

Laajenna ratkaisua siten, että blogien "liketys" ja poisto toimivat.

## Refactor blog management and notification handling; Implement voting and deletion features, update error messages, and remove unused components

- Added updateBlog and deleteBlog reducers to blogReducer
- Added voteBlog and destroyBlog async thunks to blogReducer
- Refactored initializeBlogs and appendBlog to use showNotification for error handling
- Unified notification state to { message, type } for styled success/error messages
- Blog component dispatches voteBlog/destroyBlog directly via useDispatch
- Removed updateBlog/removeBlog prop drilling from Bloglist and App
- Removed dead code: handleCreate, handleErrorChange, errorMessage state, Error component
- Simplified BlogForm to dispatch appendBlog thunk only
- Notification component reads from Redux store with red/green styling based on type
- Fixed Togglable auto-collapse after blog creation via ref
- Removed stale message prop from <Notification> and unused useSelector/notificationMessage from App
- Relaxed blog.user PropTypes from .isRequired to optional
- Updated tests: blogReducer.test.js, Blog.test.js, notificationReducer.test.js, BlogForm.test.js
- Handle overlapping notifications
- Fix Cypress tests

## Additional comments

- User login/authentication doesn't use Redux yet
- The token expiration is only discovered when making an API call. The frontend doesn't know the token is invalid until the backend rejects it.
