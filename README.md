# parse-context

Context based parsing.
Gets the value of your object based on the string format.

### Install with npm

```bash
$ npm install parse-context --save
```

### Usage:

```typescript
import ctx from "parse-context";

const { parser, register } = ctx();
const now = new Date(Date.now());
const data = {
  Date: {
    Now: now.toLocaleString(),
  },
  CurrentUser: {
    Salutation: "Mr.",
    Name: "Anderson",
  },
};
register("sayHello", () => "Hello world!");
const stringFormat =
  "Hello, ${CurrentUser.Salutation} ${CurrentUser.Name}. ${Func:sayHello}.";

//Returns:
//Hello, Mr. Anderson. Hello world!
console.log(parser(data, stringFormat));
```

### Release Note:

### V2.3.0

- Added ParserOptions.

```typescript
const context = {
  Data: {
    Found: "This is existing.",
  },
};
///Result: This is existing. Value of '${Data.Missing}' is missing!
console.log(
  parser(context, "${Data.Found} ${Data.Missing}", {
    onContextNotFound(options) {
      return `Value of '${options.matchKey}' is missing!`;
    },
  })
);
```

- Added rescan feature. Ability to rescan the result for more matches.

```typescript
const context = {
  Data1: "Data#1 ==>> ${Data2}",
  Data2: "Data#2 ==>> ${Data3}",
  Data3: "Data#3 ==>> ${Data4}",
  Data4: "Data#4 ==>> ${Data5}",
  Data5: "Data#5 ==>> ${Data6}",
};
//returns: Data#1 ==>> Data#2 ==>> Data#3 ==>> ${Data4}
console.log(parser(context, "${Data1}", { scans: 3 }));
```

---

#### V2.2.1

- Added extension method registration.

```typescript
import ctx, { extend } from "parse-context";

extend("Ext", function (args) {
  return args.context[args.data];
});

const { parser } = ctx();
const data = {
  Word: "Foobar",
  Hello: "Hello",
};
// Result: Hello Foobar.
console.log(parser(data, "${Ext:Hello} ${Ext:Word}."));
```

- **register** method has now ParserMethodOptions.

##### ParserMethodOptions

| Property     | Data Type | Description                                         |
| ------------ | --------- | --------------------------------------------------- |
| context      | object    | Object context of the parser.                       |
| currentValue | string    | Current parser value before ParserMethod is called. |
| data         | string    | Data of the parsed key.                             |
| matchKey     | string    | Full parser regex match value.                      |

---

#### V2.1.0

- Added global method registration.

```typescript
import ctx, { globalFunc } from "parse-context";

const { parse, register } = ctx();

globalFunc("MyGlobalMethod", () => "My global method.");
register("MyLocalMethod", () => "This is a local method.");
```

---

#### V2.0.0

- **<span style='color: red'>Breaking Change:</span>** Parse and register are now generated using default.

```typescript
import ctx from "parse-context";

const { parse, register } = ctx();
```

- **<span style='color: red'>Breaking Change:</span>** Parsing using default is not supported anymore.

```typescript
import parse from "parse-context";

//WRONG - will generate error.
parse({ Data: "Test data" }, "${Data}");
```
