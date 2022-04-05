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
