```
 ____  __       ____  __  _  _
(_  _)/  \  ___(  __)(  )( \/ )
  )( (  O )(___)) _)  )(  )  (
 (__) \__/     (__)  (__)(_/\_)
```

A task manager for OpenStreetMap.  

Coordinate with other users and work down a queue of tasks without getting in each other’s way.

![to-fix](https://user-images.githubusercontent.com/11095038/28570267-09741cb0-715b-11e7-805c-361a28607e26.png)

## Related tools

- A JOSM plugin is available at [tofix-plugin](https://github.com/JOSM/tofix-plugin).
- A CLI for creating and updating tasks is available at [tofix-cli](https://github.com/Rub21/tofix-cli).

## Workflow

This is the frontend component to `to-fix`. The server
component is at [to-fix-backend](https://github.com/osmlab/to-fix-backend).

This is a React + Redux application bootstrapped with [create-react-app](https://github.com/facebookincubator/create-react-app).

To start development, you will require node.js to be installed.

```sh
npm install && npm start
```

To build and publish to `gh-pages`, run

```
npm deploy
```

You can configure some details at [src/config](src/config).


## Wiki

* [How to create a new to-fix task](https://github.com/osmlab/to-fix/wiki/Creating-and-updating-tasks)
* [How to work on an existing to-fix tasks](https://github.com/osmlab/to-fix/wiki/Working-on-a-task)
* [List of open tasks](https://github.com/osmlab/to-fix/wiki/List-of-open-tasks)
