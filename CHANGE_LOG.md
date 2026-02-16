# CHANGE LOGS

## 7.12: React Query ja context step3

Laajenna ratkaisua siten, että blogien "liketys" ja poisto toimivat.

## Small fixes

- Implement blog like and delete functionality using React Query
- Refactor Blog and BlogForm components for improved notification handling

## Known issues

- The token expiration is only discovered when making an API call. The frontend doesn't know the token is invalid until the backend rejects it.
- Redux is still in use with user/login management.
