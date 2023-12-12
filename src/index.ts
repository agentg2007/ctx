import _, { Dictionary } from "lodash";

const EmptyFunc = () => "";

type ParserMethod = (options: ParserMethodOptions) => string;
type ParserMethodOptions = {
    context: any;
    currentValue: string;
    data: string;
    matchKey: string;
};
const GlobalRegistry: Dictionary<ParserMethod> = {};
/**
 * Registers method globally.
 * @param name Name of the function.
 * @param action Method to register.
 */
export const globalFunc = (name: string, action: ParserMethod) => {
    GlobalRegistry[name] = action;
}

const ExtendCallbackRegistry: Dictionary<ParserMethod> = {};
/**
 * Registers an extension method that will be called if parsing starts with the prefix.
 * @param prefix Prefix to match.
 * @param callback Callback method to execute.
 * 
 * ---USAGE---
 * ```typescript
 * extend("My", (options) => options.data);
 * // Outputs:
 * // Calling you!
 * console.log(parser({ CallMe: "Calling you!" }, "${My:CallMe}"))
 * ```
 */
export function extend(prefix: string, callback: ParserMethod) {
    if (prefix === "Func") {
        throw new Error("Func is a reserved prefix. Please use globalFunc if you intend to register a function.");
    }
    ExtendCallbackRegistry[prefix] = callback;
}

type ParserOptions = {
    /**
     * Number of scan limit to re-scan the resulting value.
     * If no more matches before scan limit is reached, the re-scanning process will terminate.
     * If scans is greater than zero (0), onNotFound method will default return the matched key.
     */
    scans: number;
    /**
     * Method to execute if value is not found in the context.
     * @param options - Type of ParserMethodOptions.
     * @returns string - Default: Blank string if scans is zero, otherwise it will return matched key.
     */
    onNotFound: ParserMethod;
};
export default () => {
    const Funcs: Dictionary<ParserMethod> = {};
    const func = (name: string) => Funcs[name] ?? GlobalRegistry[name] ?? EmptyFunc;
    function register(name: string, action: ParserMethod) {
        Funcs[name] = action;
        return { register };
    }
    const rx = /\${(.*?)\}/gm;
    function parseInternal(context: any, text: string, { onNotFound }: ParserOptions) {
        const matches = []
        let m: any;
        const regex = new RegExp(rx);
        do {
            m = regex.exec(text);
            m != null && matches.push({
                Full: m[0],
                Data: m[1]
            })
        } while (m);
        let result = text;
        const extKeys = _.keys(ExtendCallbackRegistry);
        matches.forEach(({ Full, Data }) => {
            const options: ParserMethodOptions = {
                context,
                currentValue: result,
                data: _.split(Data, ':')[1],
                matchKey: Full
            }
            if (_.startsWith(Data, "Func:")) {
                const name = _.split(Data, ':')[1]
                result = result.replace(Full, func(name)(options));
            } else {
                const extension = extKeys.find(key => _.startsWith(Data, `${key}:`)) ?? "";
                if (_.isFunction(ExtendCallbackRegistry[extension])) {
                    const value = ExtendCallbackRegistry[extension](options);
                    result = result.replace(Full, value);
                } else {
                    result = result.replace(Full, _.at(context, [Data])[0] as any ?? onNotFound(options));
                }
            }
        });
        return result;
    }
    return {
        parser(context: any, text: string, options?: Partial<ParserOptions>) {
            const opts: ParserOptions = {
                scans: 0,
                onNotFound(opt) {
                    return Number(options?.scans) > 0 ? opt.matchKey : ""
                },
                ...options
            };
            let value = parseInternal(context, text, opts);
            for (let i = 1; i < opts.scans && rx.test(value); i++) {
                value = parseInternal(context, value, opts);
            }
            return value;
        },
        register,
    }
};
