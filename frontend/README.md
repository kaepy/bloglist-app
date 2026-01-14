# How to update old project?!!

## Initialize Vite project

Remove react-scripts, install Vite + React plugin, update package.json scripts (dev, build, preview), create vite.config.js.

Steps:

- npm install --save-dev vite @vitejs/plugin-react
- npm uninstall react-scripts
- update package.json scripts
- create vite.config.js to root

## Create Vite entry point

Create index.html with root div, update index.js to use createRoot() with modern React API, verify public assets path.

## Migrate ESLint to flat config

Replace .eslintrc.js with eslint.config.js using flat format, install @eslint/js, reconfigure rules and environments, remove old eslintrc file.

## Setup Vitest + Testing Library

Install vitest, @vitest/ui, jsdom, update test scripts in package.json, create vitest.config.js, verify existing tests run with Vitest.

## Update & wire Cypress with jsdom

Upgrade Cypress, update cypress.config.js with jsdom preset, verify e2e tests still pass, check backend proxy settings.

## Add Prop-types validation

Install prop-types, add propTypes to all components (Blog, BlogForm, Togglable, Notification, Error, LoginForm), validate against current usage.

Upgrade React & Axios — Update React to latest, update Axios to latest, verify no breaking changes in service files (services/blogs.js, services/login.js), test full app flow.
