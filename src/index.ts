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

export default () => {
    const Funcs: Dictionary<ParserMethod> = {};
    const func = (name: string) => Funcs[name] ?? GlobalRegistry[name] ?? EmptyFunc;
    const register = (name: string, action: ParserMethod) => {
        Funcs[name] = action;
        return { register };
    }
    const parser = (context: any, str: string) => {
        const rx = /\${(.*?)\}/gm;
        const matches = []
        let m: any;
        do {
            m = rx.exec(str);
            m != null && matches.push({
                Full: m[0],
                Data: m[1]
            })
        } while (m)
        let result = str;
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
                    result = result.replace(Full, _.at(context, [Data])[0] as any ?? "");
                }
            }
        });
        return result;
    };

    return {
        parser,
        register,
    }
};
