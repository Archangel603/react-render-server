export interface IServerConfig {

    /**
     * 
     *
     * @type {string}
     * @memberof IServerConfig
     */
    baseDir: string;

    mode: "render" | "view";

    pathToApp: string;

    useMui?: boolean;

    useJss?: boolean;

    disableRedux?: boolean;

    publicFolder?: string;

    pathToLog?: string;
}