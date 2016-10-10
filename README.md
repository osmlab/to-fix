**Note**: This branch tracks the current development of `to-fix`. Check `gh-pages` for the production branch.

## to-fix

A task manager for OpenStreetMap which helps coordinate users on tasks and work down items in a queue one-by-one without getting in each other’s way.

This is a React.js / Flux application that is built with browserify: in order to develop it,
you'll need node.js installed.

This is the frontend component to to-fix, which is a pure JavaScript application - the server
component is [to-fix-backend](https://github.com/osmlab/to-fix-backend).

### JOSM plugin

A JOSM plugin is available at https://github.com/JOSM/tofix-plugin to quickly work on to-fix tasks.

#### Building

```sh
npm install
npm start & open http://localhost:3000/
# you can configure some details at `src/config.js`
```
