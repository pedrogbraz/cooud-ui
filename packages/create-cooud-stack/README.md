# create-cooud-stack

CLI generator for the Cooud Stack Builder.

```sh
bun create cooud-stack@latest my-app --yes --web next --ui cooud
```

The generator always writes `stack.json` and `KICKOFF.md`. The default stack
creates a runnable Next.js + Cooud UI app. Non-default framework/backend choices
are captured honestly in those artifacts and in the generated README so the next
developer or agent knows what remains to implement.
