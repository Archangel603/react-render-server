# What is it?

It's a very simple nodejs server that render React app to HTML string.

# Features

* Render React bundle into HTML string;
* Uses [React Router V4](https://github.com/ReactTraining/react-router);
* [React Redux](https://github.com/reduxjs/react-redux) support;
* [JSS](http://cssinjs.org) support;
* [React Material UI](https://material-ui.com) support;
* Static files serving support;
* Made with [TypeScript](http://www.typescriptlang.org);
* Can be easily builded with [Babel](http://babeljs.io)
<!--
# Usage

Firstly, clone/download this repository.

Then run `npm i` command;

To build server, use `npm run build`;

Compiled files will be placed in the "dist" folder.

Put your bundled React app to dist/app folder.

By default, path to your server bundle must be `app/js/bundle.js` relatively to the `server.js`

To run the server, use `npm run start` or `node dist/index.js [arguments]`

Now you can just make requests to localhost:5001

# Work example

Let's imagine that user makes request to https://domain.com/home.

Then you need to make a request to http://localhost.com/home to get rendered React home route.

**IMPORTANT!** You need to specify HTTP Header `X-LOCAL-HOST: *your api server address*` to make possible api requests during rendering. All obtained data will be stored in redux store.
-->
# Arguments

Argument | Possible values | Description
---------|-----------------|--------------
`--mode ` | view, render | Sets the work mode of the server. view - server will work with static files and render React to the template. Render - server will only render react app. Default: render
`--mui` | | Adds React Material UI support
`--jss` | | Adds JSS support
`--no-redux` | | Removes redux support

<!--# Visual Studio Code-->

# License

MIT