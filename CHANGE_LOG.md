# CHANGE LOGS

## 7.11: Redux, step2

Tämä ja seuraava kaksi osaa ovat kohtuullisen työläitä, mutta erittäin opettavaisia.

Siirrä blogien tietojen talletus Reduxiin. Tässä tehtävässä riittää, että sovellus näyttää olemassa olevat blogit ja, että uuden blogin luominen onnistuu.

Kirjautumisen ja uuden blogin luomisen lomakkeiden tilaa kannattaa hallita edelleen Reactin tilan avulla.

## feat: Refactor blog management and user authentication

- Implemented Redux for state management of blogs and notifications.
- Created blogReducer to handle blog-related actions and asynchronous operations.
- Added storage service for managing user data in localStorage.
- Refactored BlogForm to use Redux for creating new blogs and displaying notifications.
- Updated Bloglist to fetch blogs from Redux state.
- Enhanced App component to manage user login and logout with improved error handling.
- Added tests for blogReducer, notificationReducer, and services to ensure functionality.
- Improved Blog component tests to cover user interactions and state changes.
- Updated LoginForm to streamline user authentication process.
- Refactored services to handle API requests with proper authorization.

## Additional comments

- Blog voting and deletion are intentionally broken at this point.
- The token expiration is only discovered when making an API call. The frontend doesn't know the token is invalid until the backend rejects it.
