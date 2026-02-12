# CHANGE LOGS

## Tilan hallinta: React Query ja context

## Small fixes

- Unified blog service to async/await.
- Improve documentation and comments across tests and services.
- Update dependencies to include @tanstack/react-query.

## Known issues

- The token expiration is only discovered when making an API call. The frontend doesn't know the token is invalid until the backend rejects it.
