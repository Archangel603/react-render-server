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
* Can be easily builded with [Babel](http://babeljs.io);
* Supports Axios on client

# Usage example

**IMPORTANT!** This package requires `babel-polyfill` for correct work!

1. Install package with `npm i --save @archangel63/react-render-server` command
2. Create your `server.js` file with the following content:
`
    require("babel-polyfill");

    require("@archangel63/react-render-server").run(5001, {
        baseDir: __dirname,
        mode: "render"
    });
`
3. Run it with `node server.js`
4. Pass requests to the `http://localhost:5001` with HTTP header `X-LOCAL-HOST: *your api server address*`
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
# Options

Option | Possible values | Description
---------|-----------------|--------------
`mode ` | view, render | Sets the work mode of the server. view - server will work with static files and render React to the template. Render - server will only render react app. **Default**: render
`baseDir` | string | Your app path. **Required!**
`pathToApp` | string | Path to your app build. **Default**: \*baseDir\*/app/js/bundle.js
`useMui` | boolean | Adds React Material UI support. **Defailt**: false
`useJss` | boolean| Adds JSS support. **Default**: false
`disableRedux` | boolean | Removes redux support. **Default**: false
`publicFolder` | string | Path to public folder in case you will use this server in `view` mode.
`pathToLog` | string | Path to log file. **Default**: \*baseDir\*/log.txt

<!--# Visual Studio Code-->

# License

MIT