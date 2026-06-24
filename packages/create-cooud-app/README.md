# create-cooud-app

Scaffold a production-ready **Next.js + Cooud UI** app in one command.

```sh
npx create-cooud-app my-app
```

That's it. You get a Next.js 15 (App Router) + React 19 + Tailwind v4 starter with
[`@cooud-ui/ui`](https://www.npmjs.com/package/@cooud-ui/ui), `@cooud-ui/tokens`, and
`@cooud-ui/theme` already wired — themeable, accessible components, an anti-flash theme
script, and a polished landing page out of the box.

## Usage

```sh
create-cooud-app [project-name] [options]
```

If you omit the project name, you'll be prompted for one (default: `my-cooud-app`).

### Options

| Flag | Description |
| --- | --- |
| `--pm <bun\|npm\|pnpm\|yarn>` | Package manager to install with (auto-detected otherwise). |
| `--no-install` | Skip installing dependencies. |
| `-h`, `--help` | Show help. |
| `-v`, `--version` | Show the version. |

### Examples

```sh
# Interactive — prompts for a name, then installs with the detected package manager.
npx create-cooud-app

# Named app, install with pnpm.
npx create-cooud-app my-dashboard --pm pnpm

# Just scaffold the files, install later yourself.
npx create-cooud-app my-app --no-install
```

## What you get

```
my-app/
├─ app/
│  ├─ globals.css      # Tailwind v4 + Cooud tokens + the @source opt-in
│  ├─ layout.tsx       # <CooudUIProvider> + anti-flash <CooudThemeScript>
│  └─ page.tsx         # a polished landing/dashboard using Cooud components
├─ cooud-ui.json       # so `npx cooud-ui add <component>` works here
├─ next.config.mjs
├─ postcss.config.mjs
├─ tsconfig.json
└─ package.json
```

After scaffolding:

```sh
cd my-app
npm install   # if you used --no-install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Add more components

The starter ships a `cooud-ui.json`, so you can pull additional components from the
registry at any time:

```sh
npx cooud-ui add dialog table tabs
```

## License

MIT
