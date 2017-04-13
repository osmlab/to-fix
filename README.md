# to-fix

A task manager for OpenStreetMap which helps coordinate users on tasks and work down items in a queue one-by-one without getting in each other’s way.

This is the frontend component to `to-fix`. The server
component is at [to-fix-backend](https://github.com/osmlab/to-fix-backend).

## JOSM plugin

A JOSM plugin is available at [tofix-plugin](https://github.com/JOSM/tofix-plugin).

## Development

This is a React and Redux application built with [create-react-app](https://github.com/facebookincubator/create-react-app).

To start development, you will require node.js to be installed.

```sh
npm install && npm start
```

To build and publish to `gh-pages`, run

```
npm deploy
```

You can configure some details at [src/config](src/config).


## Usage

* [How to create a new to-fix task](https://github.com/osmlab/to-fix/wiki/Creating-and-updating-tasks)
* [How to work on an existing to-fix task](https://github.com/osmlab/to-fix/wiki/Working-on-a-task)
