# Bloglist App

## Use of AI

AI has been used in this project to...

- mentoring without writing a course task related code
- add JSDoc comments to learn more about good and bad commenting
- update and add new frontend and backend tests
- add extra features that is not mention in the course material
- learn more about MaterialUI
- improve security as this project runs also on production
- learn how to use Copilot, Claude and MCPs

## Testing

Testikattavuus:

- npm test -- --coverage

Aja kaikki testit:

- npm test

Filteröi tiedoston perusteella:

- npm test src/reducers/blogReducer.test.js

Filteröi testin descriptionin perusteella:

- npm test -- -t "createBlog"
- npm test -- --testNamePattern "createBlog"

CI=true npm test
npm test -- --coverage
npm test -- --coverage --collectCoverageFrom='src/\*_/_.{jsx,js}'

## Local Storage

// Uloskirjautuminen userilta:
// window.localStorage.removeItem('loggedNoteappUser')

// Local storagen tilan nollaus kokonaan:
// window.localStorage.clear()

## Outdated dependencies

- `better-npm-audit audit` parempi tapa tarkistaa riippuvuuksien ajantasaisuus
- tarkista paketit yksitellen ja päätä mitä niille tehdä

- `npm outdated --depth 0` toinen tapa tarkistaa riippuvuuksien ajantasaisuus

- `npm-check-updates` tarkista riippuvuuksien ajantasaisuus
- `ncu -u` pakettien päivitys

## Manual testing

- login
- refresh (user persisted)
- logout
- open blog details
- hide blog details
- open multiple blog details same time
- vote blog
- vote other blog no change the blog list's order
- remove-button visibility (only shown for own blogs)
- remove blog
- multiple notifications
