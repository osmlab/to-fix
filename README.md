## to-fix

A task manager for OpenStreetMap which helps coordinate users on tasks and work down items in a queue one-by-one without getting in each other’s way.

This is the frontend component to to-fix, which is a pure JavaScript application - the server
component is [to-fix-backend](https://github.com/osmlab/to-fix-backend).

### JOSM plugin

A JOSM plugin is available at https://github.com/JOSM/tofix-plugin to quickly work on to-fix tasks.

#### Development

This is a React and Redux application that is built with [create-react-app](https://github.com/facebookincubator/create-react-app).

To start development, you will require node.js to be installed.

```sh
npm install && npm start
```

To build and publish to `gh-pages`, follow these [instructions](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#github-pages).

You can configure some details at [src/config.js](src/config.js);
