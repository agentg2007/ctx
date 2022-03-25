"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const lodash_1 = __importDefault(require("lodash"));
const Funcs = {};
const EmptyFunc = () => "";
const register = (name, action) => {
    Funcs[name] = action;
    return { register: exports.register };
};
exports.register = register;
exports.default = (context, str) => {
    const rx = /\${(.*?)\}/gm;
    const keys = [];
    let m;
    do {
        m = rx.exec(str);
        m != null && keys.push({
            Full: m[0],
            Data: m[1]
        });
    } while (m);
    let result = str;
    keys.forEach(({ Full, Data }) => {
        var _a, _b;
        if (lodash_1.default.startsWith(Data, "Func:")) {
            const name = lodash_1.default.split(Data, ':')[1];
            result = result.replace(Full, ((_a = Funcs[name]) !== null && _a !== void 0 ? _a : EmptyFunc)());
        }
        else {
            result = result.replace(Full, (_b = lodash_1.default.at(context, [Data])[0]) !== null && _b !== void 0 ? _b : "");
        }
    });
    return result;
};
