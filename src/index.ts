import _, { Dictionary } from "lodash";

const EmptyFunc = () => "";

const GlobalRegistry: Dictionary<() => any> = {};
/**
 * Registers method globally.
 * @param name Name of the function.
 * @param action Method to register.
 */
export const globalFunc = (name: string, action: () => any) => {
    GlobalRegistry[name] = action;
}

export default () => {
    const Funcs: Dictionary<() => any> = {};
    const func = (name: string) => Funcs[name] ?? GlobalRegistry[name] ?? EmptyFunc;
    const register = (name: string, action: () => any) => {
        Funcs[name] = action;
        return { register };
    }
    const parser = (context: any, str: string) => {
        const rx = /\${(.*?)\}/gm;
        const keys = []
        let m: any;
        do {
            m = rx.exec(str);
            m != null && keys.push({
                Full: m[0],
                Data: m[1]
            })
        } while (m)
        let result = str;
        keys.forEach(({ Full, Data }) => {
            if (_.startsWith(Data, "Func:")) {
                const name = _.split(Data, ':')[1]
                result = result.replace(Full, func(name)());
            } else {
                result = result.replace(Full, _.at(context, [Data])[0] as any ?? "");
            }
        });
        return result;
    };

    return {
        parser,
        register
    }
};
