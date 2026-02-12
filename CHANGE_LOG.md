# CHANGE LOGS

## 7.10: React Query ja context step1

Muuta tässä tehtävässä notifikaation tilanhallinta tapahtumaan käyttäen useReducer-hookia ja contextia.

## Small fixes

- Refactor notification handling to use NotificationContext and custom hook
- Remove Redux dependency for notifications

## Known issues

- The token expiration is only discovered when making an API call. The frontend doesn't know the token is invalid until the backend rejects it.
- Voting and removing blog doesn't work
