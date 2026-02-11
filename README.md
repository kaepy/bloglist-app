# bloglist-app

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
npm test -- --coverage --collectCoverageFrom='src/\*_/_.{jsx,js}'

// Uloskirjautuminen userilta:
// window.localStorage.removeItem('loggedNoteappUser')

// Local storagen tilan nollaus kokonaan:
// window.localStorage.clear()
