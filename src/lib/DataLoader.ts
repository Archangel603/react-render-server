import { Request } from "express";
import { matchRoutes } from "react-router-config";
import { IReactPage } from './IReactPage';
import { IServerConfig } from "./IServerConfig";

const pathToRegexp  = require("path-to-regexp");

export default class DataLoader {

    private _useRedux = true;
    private _title = "";
    private _routes: any;
    private _url: string;
    private _query: Map<string, string>;
    private _host: string;

    constructor(routes: any, req: Request, config: IServerConfig) {
        this._routes = routes;
        this._url = req.url;
        this._useRedux = !config.disableRedux;
        this._query = this.parseQuery(req.query);
        this._host = req.get("X-LOCAL-HOST");
        
        if (typeof this._host === "undefined" || this._host === "")
            console.warn("Header X-LOCAL-HOST is not specified! No initial data will be loaded.")
    }

    private parseQuery(query: any) {
        let res = new Map<string, string>();

        for (let key in query)
            res.set(key, query[key]);

        return res;
    }

    public async load(store: any) {

        if (typeof this._host === "undefined" || this._host === "")
            return { store, title: this._title };

        const branch = matchRoutes(this._routes, this._url);

        const promises = branch.map(({ route }) => {

            let component = route.component as IReactPage;

            if (component.configure) {
                
                component.configure(this._host);
                
                return Promise.resolve();
            }

            let fetchData   = component.fetchData;
            let urlTemplate = component.urlTemplate;

            if (component.title && this._title === "")
                this._title = component.title;

            if (!(fetchData instanceof Function) || !this._useRedux)
                return Promise.resolve();

            let params, keys = [], url = new Map<string, string>();

            if (urlTemplate && urlTemplate !== "") {
                params = pathToRegexp(urlTemplate, keys).exec(this._url);

                for (let i = 1; i < params.length; i++) {
                    url.set(keys[0].name, params[i]);
                }
            }

            return fetchData(store, { url, query: this._query });
        });

        await Promise.all(promises);

        return { store, title: this._title };
    }

}