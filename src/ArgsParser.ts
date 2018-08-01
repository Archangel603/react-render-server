export default class ArgsParser {

    public static parse(rawArgs: string[]) {
        let args = new Map<string, any>();

        for (let i = 0; i < rawArgs.length; i++) {
            rawArgs[i] = rawArgs[i].startsWith("--") ? rawArgs[i].substr(2) : rawArgs[i];

            if (["mode"].includes(rawArgs[i])) {
                if (i == rawArgs.length - 1 || rawArgs[i + 1].startsWith("--"))
                    throw new Error(`Missing value for ${rawArgs[i]} argument`);
                
                args.set(rawArgs[i], rawArgs[i + 1]);
                i++;
                continue;
            }

            args.set(rawArgs[i], true);
        }

        return args;
    }

}