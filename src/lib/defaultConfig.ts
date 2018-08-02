import { IServerConfig } from "./IServerConfig";

export const defaultConfig: IServerConfig = {

    baseDir: __dirname,

    mode: "render",

    pathToApp: "app/js/bundle.js",

    pathToLog: "log.txt",

    useMui: false,

    useJss: false,

    disableRedux: false,

    publicFolder: "public",

};