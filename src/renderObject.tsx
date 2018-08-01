import * as React from "react";
import { renderToString } from 'react-dom/server';
import { SheetsRegistry } from 'react-jss/lib/jss';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName, MuiThemeProvider, Theme } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import { Store } from '../node_modules/redux';

const utils         = require("util");
const compressor    = require('yuicompressor');

compressor.compress = utils.promisify(compressor.compress);
let css = "";

/**
 *
 *
 * @export
 * @class RenderObject
 */
export default class RenderObject {

    //#region private properties

    private _result = "";
    private _content: JSX.Element;
    private _pipeline = new Map<string, IterableIterator<this | Promise<string>>>();

    //#endregion

    constructor(content: JSX.Element) {
        this._content = content;
    }

    //#region generators

    private *_withJss() {

        const sheetsRegistry = new SheetsRegistry();
    
        const generateClassName = createGenerateClassName();
    
        this._content = (
            <JssProvider registry={ sheetsRegistry } generateClassName={ generateClassName }>
                { this._content }
            </JssProvider>
        );

        yield this;
    
        if (typeof css === "undefined" || css === "")
            return compressor.compress(sheetsRegistry.toString(), {
                charset: 'utf8',
                type: 'css',
                'line-break': 80
            }).then((result) => {
                css = result;
                return this._result + `<style id="jss-server-side">${css}</style>`
            });
        else
            return Promise.resolve(this._result + `<style id="jss-server-side">${css}</style>`);
    }
    
    private *_withMui(theme: any) {

        this._content = (
            <MuiThemeProvider theme={ theme } sheetsManager={ new Map() } >
                { this._content }
            </MuiThemeProvider>
        );

        yield this;

        return Promise.resolve(this._result);
    }
    
    private *_withRedux(store: Store) {
        
        this._content = (
            <Provider store={store}>
                { this._content }
            </Provider>
        );

        let initialState = `<script>window.__INITIAL_STATE__ = ${ JSON.stringify( store.getState() ) }</script>`;

        yield this;

        return Promise.resolve(this._result + initialState);
    }
    
    private *_withTemplate(template: string) {

        yield this;

        let inserted = template.replace(/\{\{.+\}\}/, this._result);

        return Promise.resolve(inserted);
    }

    //#endregion

    //#region private methods

    private _addToPipeline(gen: Function, ...args: any[]) {
        
        let generator = gen.call(this, ...args);

        this._pipeline.set(gen.name, generator);

        return { 
            execute: () => (generator as IterableIterator<this>).next().value 
        };
    }

    //#endregion

    //#region pipeline methods

    /**
     * Adds JSS support, ie rendering JSS to CSS string
     * 
     * @returns
     * @memberof RenderObject
     */
    public withJss() {
        return this._addToPipeline(this._withJss).execute();
    }

    /**
     * Adds React Material UI support including theming and rendering JSS to CSS string.
     * See https://material-ui.com for more info
     * @param {Theme} theme
     * @returns
     * @memberof RenderObject
     */
    public withMui(theme: Theme) {
        if (this._pipeline.has("_withJss"))
            this._pipeline.delete("_withJss");

        return this._addToPipeline(this._withMui, theme).execute().withJss();
    }

    /**
     * Adds redux support, ie provides store to React app and then renders it to window.\_\_INITIAL_STATE__ as JSON 
     *
     * @param {Store} store
     * @returns
     * @memberof RenderObject
     */
    public withRedux(store: Store) {
        return this._addToPipeline(this._withRedux, store).execute();
    }

    /**
     * Inserts rendered html to the provided template to the place marked with {{  }}
     *
     * @param {string} template
     * @returns
     * @memberof RenderObject
     */
    public withTemplate(template: string) {
        return this._addToPipeline(this._withTemplate, template).execute();
    }

    //#endregion

    //#region public methods
    
    /**
     * Renders React components into HTML string
     *
     * @returns {string} rendered HTML string
     * @memberof RenderObject
     */
    public async render() {

        this._result = renderToString(this._content);

        for (const kv of this._pipeline) {
            this._result = await kv[1].next().value as string;
        }

        return this._result;
    }
    
    //#endregion
}