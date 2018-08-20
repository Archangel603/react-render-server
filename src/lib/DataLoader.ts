import { Request } from "express";
import { matchRoutes } from "react-router-config";
import { IReactPage, IPageMetaData } from "./IReactPage";
import { IServerConfig } from "./IServerConfig";
import * as pathToRegexp from "path-to-regexp";

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

    private parseUrl(pattern: string) {
        let params;
        let keys = new Array<pathToRegexp.Key>(); 
        let urlData = new Map<string, string>();

        if (pattern && pattern !== "") {
            params = pathToRegexp(pattern, keys).exec(this._url);

            for (let i = 1; i < params.length; i++) {
                urlData.set(keys[0].name as string, params[i]);
            }
        }

        return urlData;
    }

    public async load(store: any): Promise<{ store: any, metaData: IPageMetaData }> {

        if (typeof this._host === "undefined" || this._host === "")
            return { store, metaData: { title: "", keywords: "", description: "" } };

        const branch = matchRoutes(this._routes, this._url);

        let metaData: IPageMetaData;

        const promises = branch.map(({ route }) => {

            console.log(route);

            let component = route.component as any as IReactPage;

            if (component.configure) {
                
                component.configure(this._host);
                
                return Promise.resolve();
            }

            let model = component.getModel();
            let fillStore   = model.fillStore;
            let urlPattern  = model.getRequisites().urlPattern;

            metaData = model.getMetaData();

            if (!(fillStore instanceof Function) || !this._useRedux)
                return Promise.resolve();

            let url = this.parseUrl(urlPattern);            

            return fillStore(store, { url, query: this._query });

        }) as Promise<IPageMetaData>[];

        await Promise.all(promises);

        return { store, metaData };
    }

}