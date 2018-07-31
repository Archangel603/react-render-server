
const fs = require("fs");
const util = require("util");

fs.exists = util.promisify(fs.exists);
fs.writeFile = util.promisify(fs.writeFile);
fs.appendFile = util.promisify(fs.appendFile);

export default class Logger {
    
    private _logPath: string;
    
    public isInitialized = false;
    
    constructor(logPath: string) {
        this._logPath = logPath;
    }
    
    public async init() {
        if (!await fs.exists(this._logPath))
            await fs.writeFile(this._logPath, "");
        
        this.isInitialized = true;
    }
    
    public log(message: any) {
        
        let date = new Date(Date.now());
        
        let output = `[${date.toLocaleString()}] ${message}`;
        
        fs.appendFile(this._logPath, output);
        console.log(output);
    }
    
}