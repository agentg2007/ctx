# parse-context

Context based parsing.
Gets the value of your object based on the string format.

### Install with npm

```bash
$ npm install parse-context --save
```

### Usage:

```typescript
import f, { register } from "parse-context";

const now = new Date(Date.now());
const data = {
  Date: {
    Now: now.toLocaleString(),
  },
  CurrentUser: {
    Salutation: "Mr.",
    Name: "Oscar",
  },
};
register(
  "today",
  () =>
    [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][now.getDay()]
);
console.log(
  f(
    data,
    "Hello, ${CurrentUser.Salutation} ${CurrentUser.Name}. Today is ${Func:today} (${Date.Now})."
  )
);
```
