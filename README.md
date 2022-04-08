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

#### V2.1.0

- Added global method registration.

```typescript
import ctx, { globalFunc } from "parse-context";

const { parse, register } = ctx();

globalFunc("MyGlobalMethod", () => "My global method.");
register("MyLocalMethod", () => "This is a local method.");
```

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
