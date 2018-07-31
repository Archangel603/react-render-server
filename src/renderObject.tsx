import { renderToString } from 'react-dom/server';
import { SheetsRegistry } from 'react-jss/lib/jss';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName, MuiThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';

const utils         = require("util");
const compressor    = require('yuicompressor');

compressor.compress = utils.promisify(compressor.compress);
let css = "";

export default class RenderObject {

    private _result = "";
    private _content: JSX.Element;
    private _pipeline = new Map<string, IterableIterator<this | Promise<string>>>();

    constructor(content: JSX.Element) {
        this._content = content;
    }

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
                return `<style id="jss-server-side">${css}</style>`
            });
        else
            return Promise.resolve(`<style id="jss-server-side">${css}</style>`);
    }
    
    private *_withMui(theme: any) {

        this._content = (
            <MuiThemeProvider theme={ theme } sheetsManager={ new Map() } >
                { this._content }
            </MuiThemeProvider>
        );

        yield this;

        return Promise.resolve("");
    }
    
    private *_withRedux(store: any) {
        
        this._content = (
            <Provider store={store}>
                { this._content }
            </Provider>
        );

        let initialState = `<script>window.__INITIAL_STATE__ = ${ JSON.stringify( store.getState() ) }</script>`;

        yield this;

        return Promise.resolve(initialState);
    }
    
    private *_withTemplate(template: string) {

        yield this;

        let inserted = template.replace(/\{\{.+\}\}/, this._result);

        return Promise.resolve(inserted);
    }

    private _addToPipeline(gen: Function, ...args: any[]) {
        
        let generator = gen(...args);

        this._pipeline.set(gen.name, generator);

        return { 
            execute: () => (generator as IterableIterator<this>).next().value 
        };
    }

    public withJss() {

        if (this._pipeline.has("_withMui"))
            return;

        return this._addToPipeline(this._withJss).execute();
    }

    public withMui(theme: any) {
        if (this._pipeline.has("_withJss"))
            this._pipeline.delete("_withJss");

        return this._addToPipeline(this._withMui, theme).execute().withJss();
    }

    public withRedux(store: any) {
        return this._addToPipeline(this._withRedux, store).execute();
    }

    public withTemplate(template: string) {
        return this._addToPipeline(this._withTemplate, template).execute();
    }

    public async render() {

        this._result = renderToString(this._content);

        for (const kv of this._pipeline) {
            this._result += await kv[1].next();
        }

        return this._result;
    }

}