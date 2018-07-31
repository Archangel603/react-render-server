import * as React from 'react';

import { StaticRouter } from 'react-router';
import { renderRoutes, matchRoutes } from "react-router-config";

import { SheetsRegistry } from 'react-jss/lib/jss';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName, MuiThemeProvider } from '@material-ui/core/styles';

import express      = require('express');
const path          = require("path");

const pathToRegexp  = require("path-to-regexp");

import Logger from "./Logger";
import RenderObject from './renderObject';

const appData   = require('./app/js/bundle.js').default;
const routes    = appData.routes;
const store     = appData.store;
const theme     = appData.theme;
const app       = express();
const args      = process.argv.splice(2);
const logger    = new Logger(path.join(__dirname, "log.txt"));

app.use(express.static(__dirname + '/public'));

app.get("ping", (req: express.Request, res: express.Response) => {
    res.status(200).end();
});

app.get("*", async (req: express.Request, res: express.Response) => {

    if (!logger.isInitialized)
        await logger.init();
    
    logger.log("Starting request " + req.url);
    
    let title = "";

    const branch = matchRoutes(routes, req.url);

    const promises = branch.map(({ route }) => {

        let fetchData   = route.component.fetchData;
        let urlTemplate = route.component.urlTemplate;
        let host = req.get("X-LOCAL-HOST");

        if (route.component.title && title === "")
            title = route.component.title;

        if (!(fetchData instanceof Function))
            return Promise.resolve();

        let params, keys = [], url = {}, query = req.query;

        if (urlTemplate && urlTemplate !== "") {
            params = pathToRegexp(urlTemplate, keys).exec(req.url);

            for (let i = 1; i < params.length; i++) {
                url[keys[0].name] = params[i];
            }
        }

        return fetchData(store, { url, query, host }).catch(e => logger.log(e));
    });

    try {

        let data = await Promise.all(promises);

        let context = {};

        let content = (
            <StaticRouter location={req.url} context={context}>
                { renderRoutes(routes) }
            </StaticRouter>
        );

        let renderObject = new RenderObject(content);

        if (args.includes("-mui"))
            renderObject.withMui(theme)
        else if (args.includes("-jss"))
            renderObject.withJss();

        if (args.includes("--mode") && args["--mode"] === "view")
            renderObject.withTemplate(`
                <!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                        <meta name="theme-color" content="#000000">
                        <link rel="shortcut icon" href="/static/favicon.ico">
                        <link rel="stylesheet" type="text/css" href="/static/css/bundle.css">
                        <title>${title}</title>
                    </head>
                    <body>
                        <div id="root">{{insertPoint}}</div>
                        <script type="text/javascript" src="/static/js/bundle.js" defer></script>
                    </body>
                </html>
            `);

        let resData = await renderObject.render();

        res.status(200);

        res.append("Content-Type", "text/html; charset=utf-8");

        while (resData.length > 0) {
            var chunk = resData.slice(0, resData.length > 4096 ? 4096 : resData.length);
            res.write(chunk);
            resData = resData.slice(chunk.length);
        }

        res.end();
    }
    catch(e) {
        logger.log(e);
        res.status(500);
        res.append("Content-Type", "text/plain; charset=utf-8");
        res.end(e.message);
    }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server listening on: ${PORT}`);
});