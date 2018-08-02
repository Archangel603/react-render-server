import * as React from 'react';

import { Request, Response, Application } from "express";
import { StaticRouter } from 'react-router';
import { renderRoutes } from "react-router-config";

const express       = require("express");
const path          = require("path");

import Logger from "./Logger";
import RenderObject from './RenderObject';
import DataLoader from "./DataLoader";
import { IServerConfig } from './IServerConfig';
import { defaultConfig } from "./defaultConfig";

(global as any).XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

exports = module.exports = function(port: number, config: IServerConfig) {

    config = Object.assign({}, defaultConfig, config);

    const app    = express() as Application;
    const logger = new Logger(path.join(config.baseDir, config.pathToLog));

    logger.init();

    const appData    = require(path.join(config.baseDir, config.pathToApp)).default;
    const routes     = appData.routes;
    const emptyStore = appData.store;
    const theme      = appData.theme;

    if (config.mode === "view")
        app.use(express.static(path.join(config.baseDir, config.publicFolder)));

    app.get("ping", (req: Request, res: Response) => {
        res.status(200).end();
    });

    app.get("*", async (req: Request, res: Response) => {
        
        console.log("Starting request " + req.url);
        
        let startMoment = Date.now();

        try {

            let loader = new DataLoader(routes, req, config);

            let store = Object.assign({}, emptyStore);

            let data = await loader.load(store);

            let context = {} as any;

            let content = (
                <StaticRouter location={req.url} context={context}>
                    { renderRoutes(routes) }
                </StaticRouter>
            );

            let renderObject = new RenderObject(content);

            if (config.useMui)
                renderObject.withMui(theme)
            else if (config.useMui)
                renderObject.withJss();

            if (!config.disableRedux)
                renderObject.withRedux(data.store);

            if (config.mode === "view")
                renderObject.withTemplate(`
                    <!DOCTYPE html>
                    <html>
                        <head>
                            <meta charset="utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                            <meta name="theme-color" content="#000000">
                            <link rel="shortcut icon" href="/static/favicon.ico">
                            <link rel="stylesheet" type="text/css" href="/static/css/bundle.css">
                            <title>${data.title}</title>
                        </head>
                        <body>
                            <div id="root">{{insertPoint}}</div>
                            <script type="text/javascript" src="/static/js/bundle.js" defer></script>
                        </body>
                    </html>
                `);

            let resData = await renderObject.render();

            res.status(context.status === 404 ? 404 : 200);

            res.append("Content-Type", "text/html; charset=utf-8");

            while (resData.length > 0) {
                var chunk = resData.slice(0, resData.length > 4096 ? 4096 : resData.length);
                res.write(chunk);
                resData = resData.slice(chunk.length);
            }

            res.end();
        }
        catch(e) {

            logger.logToFile(e);
            console.error(e);

            res.status(500);
            res.append("Content-Type", "text/plain; charset=utf-8");
            res.end(e.message);
        }
        finally {
            console.log(`Request "${req.url}" finished in ${Date.now() - startMoment} ms`);
        }
    });

    app.listen(port, () => {
        console.log(`Render server listening on: ${port}`);
    });
}