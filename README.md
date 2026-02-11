# bloglist-app

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
