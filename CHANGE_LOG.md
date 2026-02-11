# CHANGE LOGS

## 7.11: Redux, step2

## chore: update dependencies and add audit script

- Updated axios from 1.13.2 to 1.13.5
- Updated @vitest/ui from 4.0.17 to 4.0.18
- Updated vitest from 4.0.17 to 4.0.18
- Update lodash from 4.17.21 to 4.17.23
- Added audit script using better-npm-audit

## Additional comments

- Blog voting and deletion are intentionally broken at this point.
- The token expiration is only discovered when making an API call. The frontend doesn't know the token is invalid until the backend rejects it.
