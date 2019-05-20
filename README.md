# News API app

This application serves up a front-end, written in [Vue.js](https://vuejs.org/), and a backend written in Node.js using the [Serverless Framework](https://serverless.com/). It allows you to see the latest UK news and filter articles by keywords


##  Quickstart dev

Use the latest Node version as it's recommended.
You can use [Homebrew] to get [nvm](https://github.com/nvm-sh/nvm) to manage your version, then:
- `nvm install node`
- `nvm use node`

1. To run the backend service - written using the Serverless framework:
   1. If you haven't installed the serverless CLI tool, do so by using a package manager, like this: `npm install serverless -g`
   2. `cd news-service`
   3. set up your API key in the `.env` file `NEWS_API_KEY={{ your api key }}`
   4. `yarn install`
   5. Run `sls offline start --stage dev`
2. To run the front-end app - written in VueJS:
   1. `cd news-app`
   2. In `news-app` - `.env`:
        ```
        NODE_ENV=development
        VUE_APP_SERVICE_URL_development=http://localhost:3000
        VUE_APP_SERVICE_KEY_development={{ TBA API key for serverless when closer to deploy }}
        ```
   3. `yarn install`
   4. Run `yarn serve`

###  Main App Files

In `news-app` front-end: `App.vue` renders different views (in `src/views`) through the router, and pulls in data from the backend endpoint to load each into its own article componenet (`src/components/Article.vue`).
Wanted to add articles to the store, or filtering options, but didn't have the time

In `news-service` backend: 
- `serverless.yml` defines how the endpoints will be declared for the provider, as well as doing some basic request validation / handling. Written in the context of an AWS Lambda service, as that can be easily deployed, basically free and is still scalable
- `handler.js` contains AWS-specific event handler logic
- `newsapi.js` contains "business" / user-focused logic 
- `test-data.js` is meant for mocking the API for testing, but we didn't have time for that yet

Both apps  have [Jest](https://jestjs.io/) set up for testing in `/tests`, and use ESLint & Prettier for code formatting. The front-end app has Cypress set up for E2E, but no E2E test has been written yet

'