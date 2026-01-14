# How to update old project?!!

## Take remote repo in use with local repo

- git status
- git init
- git status
- git add .
- git commit -m "Initial commit"
- git remote add origin git@github.com:kaepy/bloglist-app.git // add github repo as origin
- git remote -v // check it
- git branch -M main
- git push -u origin main

## Initialize Vite project

Remove react-scripts, install Vite + React plugin, update package.json scripts (dev, build, preview), create vite.config.js.

Steps:

- npm install --save-dev vite @vitejs/plugin-react
- npm uninstall react-scripts
- update package.json scripts
- create vite.config.js to root

## Create Vite entry point

Create index.html with root div, update index.js to use createRoot() with modern React API, verify public assets path.

Steps:

- create index.html
- update main.js
- npm run dev
- update all .js files to .jsx if the file contains JSX rendering

## Migrate ESLint to flat config

Replace .eslintrc.js with eslint.config.js using flat format, install @eslint/js, reconfigure rules and environments, remove old eslintrc file.

Steps:

- npm install --save-dev eslint @eslint/js eslint-plugin-react eslint-plugin-jest eslint-plugin-cypress
- create eslint.config.js at the root
- delete old .eslintrc.js
- npm run lint
- fix issue where jest plugin tries to detect Jest, but cant find it.
- fix issue where jest plugin doesn't know which version to use since Jest isn't installed anymore.
- npm run lint

## Setup Vitest + Testing Library

Install vitest, @vitest/ui, jsdom, update test scripts in package.json, create vitest.config.js, verify existing tests run with Vitest.

Steps:

- npm install --save-dev vitest @vitest/ui jsdom
- create vitest.config.js
- update package.json
- update test.js files from jest to vitest
- update eslint cinfig to support vitest

## Update & wire Cypress with jsdom

Upgrade Cypress, update cypress.config.js with jsdom preset, verify e2e tests still pass, check backend proxy settings.

Steps:

- npm install --save-dev cypress@latest
- update cypress.config.js
- fix test files
- update eslint config to support cypress
- npx cypress open

## Add Prop-types validation

Install prop-types, add propTypes to all components (Blog, BlogForm, Togglable, Notification, Error, LoginForm), validate against current usage.

Steps:

- update prop-types
- add missing prop types to components

## Upgrade React & Axios

Update React to latest, update Axios to latest, verify no breaking changes in service files (services/blogs.js, services/login.js), test full app flow.

Steps:

- THIS should have been done at the beginning as it effected to lint config a lot and other library versions!
- update react
- update axios
- update everything else that still missing update
