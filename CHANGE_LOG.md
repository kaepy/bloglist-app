# CHANGE LOGS

## 7.11: React Query ja context step2

Siirrä blogien tietojen hallinnointi tapahtumaan React Query ‑kirjastoa hyväksikäyttäen. Tässä tehtävässä riittää, että sovellus näyttää olemassa olevat blogit ja, että uuden blogin luominen onnistuu.

Kirjautumisen ja uuden blogin luomisen lomakkeiden tilaa kannattaa hallita edelleen Reactin tilan avulla.

## Small fixes

- Refactor blog management to use React Query for data fetching and mutation
- Update App, BlogForm and Bloglist components
- Refactor Blog service and BlogForm tests

## Known issues

- The token expiration is only discovered when making an API call. The frontend doesn't know the token is invalid until the backend rejects it.
- Voting doesn't update blog order instantly
