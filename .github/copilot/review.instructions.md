---
applyTo: "**"
---

Flag any of the following during code review:

1. **Redux patterns** (`useSelector`, `useDispatch`, `createSlice`) — project uses React Query + `useReducer`/Context instead
2. **try/catch in Express route handlers** — Express 5 auto-propagates async errors, these are unnecessary
3. **axios in new service files** — new services must use native `fetch` with the `request()` helper pattern from `frontend/src/services/blogs.js`
4. **React components missing PropTypes** — all components must have PropTypes defined
5. **New hooks, context providers, or service modules missing JSDoc comments**
6. **Frontend tests missing required provider wrappers** (`QueryClientProvider`, `UserContextProvider`, `NotificationContextProvider`)
7. **Backend tests using jest or vitest imports** instead of `node:test`
8. **Passwords, passwordHash, or JWT tokens** logged or returned in API responses
9. **Mongoose models missing the `toJSON` transform** that renames `_id` to `id` and strips `__v`
10. **ESM `import`/`export` syntax in backend files** — backend uses CommonJS only
11. **`console.log` left in committed code** — use `logger.info`/`logger.error` in backend, remove debug logs in frontend
12. **Inconsistent React Query cache keys** — always use array form `["blogs"]`, never bare string `"blogs"` — mixed forms cause silent cache misses
