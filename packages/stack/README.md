# @cooud-ui/stack

Shared core for the Cooud Stack Builder.

It exports the catalog, resolver, CLI flag contract, stack snapshot schema, and
KICKOFF.md generators used by both the docs app and `create-cooud-stack`.

```ts
import { catalog, defaultSelection, generateKickoff, resolve } from "@cooud-ui/stack";

const config = resolve(catalog, defaultSelection(catalog)).selection;
console.log(generateKickoff(config, "my-app"));
```
