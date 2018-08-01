
import * as fs from "fs";
const util = require("util");

export default class Logger {
    
    private _logPath: string;
    
    public isInitialized = false;
    
    constructor(logPath: string) {
        this._logPath = logPath;
    }
    
    public init() {
        if (!fs.existsSync(this._logPath))
            fs.writeFileSync(this._logPath, "");
        
        this.isInitialized = true;
    }
    
    public logToFile(message: any) {
        
        let date = new Date(Date.now());
        
        let output = `[${date.toLocaleString()}] ${message}`;
        
        fs.appendFileSync(this._logPath, output);
    }
    
}