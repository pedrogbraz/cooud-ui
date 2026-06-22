export type DocNavItem = {
  label: string;
  href: string;
  description: string;
  status?: "new" | "beta";
  indicator?: boolean;
};

export type PackageManagerId = "pnpm" | "npm" | "yarn" | "bun";

export type PackageManagerCommand = {
  id: PackageManagerId;
  label: string;
  init: string;
  add: string;
};

export const DOC_NAV_SECTIONS: { heading: string; items: DocNavItem[] }[] = [
  {
    heading: "Sections",
    items: [
      {
        label: "Introduction",
        href: "/docs",
        description: "Project shape, distribution modes, and design-system contract.",
      },
      {
        label: "Components",
        href: "/components",
        description: "Browse the production component catalog.",
      },
      {
        label: "Installation",
        href: "/docs/installation",
        description: "Start from Create, the CLI, or an existing app.",
      },
      {
        label: "Theming",
        href: "/docs/theming",
        description: "Tokens, presets, runtime overrides, and dark mode.",
      },
      {
        label: "CLI",
        href: "/docs/cli",
        description: "Install, add, diff, and inspect registry components.",
      },
      {
        label: "RTL",
        href: "/docs/rtl",
        description: "Direction, spacing, keyboard behavior, and locale checks.",
      },
      {
        label: "Registry",
        href: "/docs/registry",
        description: "How registry items are generated, resolved, and copied.",
      },
      {
        label: "Forms",
        href: "/docs/forms",
        description: "React Hook Form, Zod, accessible fields, and validation states.",
      },
      {
        label: "Accessibility",
        href: "/docs/accessibility",
        description: "Keyboard, focus, screen reader, contrast, and framework notes.",
      },
      {
        label: "Frameworks",
        href: "/docs/frameworks",
        description: "Next.js, Vite, TanStack Start, React Router, Astro, and Laravel.",
        status: "new",
      },
      {
        label: "Changelog",
        href: "/changelog",
        description: "Released, in-development, and planned changes.",
        indicator: true,
      },
    ],
  },
];

export const PACKAGE_MANAGERS: PackageManagerCommand[] = [
  {
    id: "pnpm",
    label: "pnpm",
    init: "pnpm dlx cooud-ui@latest init",
    add: "pnpm dlx cooud-ui@latest add button card dialog",
  },
  {
    id: "npm",
    label: "npm",
    init: "npx cooud-ui@latest init",
    add: "npx cooud-ui@latest add button card dialog",
  },
  {
    id: "yarn",
    label: "yarn",
    init: "yarn dlx cooud-ui@latest init",
    add: "yarn dlx cooud-ui@latest add button card dialog",
  },
  {
    id: "bun",
    label: "bun",
    init: "bunx cooud-ui@latest init",
    add: "bunx cooud-ui@latest add button card dialog",
  },
];

export const INSTALL_OPTIONS = [
  {
    title: "Use Cooud Create",
    description:
      "Build a preset visually, save it, and generate the setup snippets for your stack.",
    href: "/create",
    action: "Open Create",
  },
  {
    title: "Use the CLI",
    description: "Run init inside your project to wire tokens, providers, and config.",
    href: "/docs/cli",
    action: "Read CLI docs",
  },
  {
    title: "Choose your framework",
    description: "Add tokens, providers, and components to an app you already created.",
    href: "/docs/frameworks",
    action: "Choose framework",
  },
] as const;

export const FRAMEWORKS = [
  {
    slug: "next",
    name: "Next.js",
    command: "npx create-next-app@latest app && cd app && npx cooud-ui@latest init",
    description: "App Router, RSC-safe provider placement, metadata, and route-level themes.",
    checks: [
      "Provider in app/layout.tsx",
      "tokens imported in globals.css",
      "focus restores on navigation",
    ],
  },
  {
    slug: "vite",
    name: "Vite",
    command: "npm create vite@latest app && cd app && npx cooud-ui@latest init",
    description: "SPA setup with a root provider, CSS token import, and fast registry adds.",
    checks: ["Provider wraps <App />", "semantic tokens in src/index.css", "keyboard traps tested"],
  },
  {
    slug: "tanstack-start",
    name: "TanStack Start",
    command: "npm create @tanstack/start@latest app && cd app && npx cooud-ui@latest init",
    description:
      "File routes, server functions, and persistent theme state across route transitions.",
    checks: [
      "Root route owns provider",
      "pending UI keeps accessible names",
      "router focus handoff",
    ],
  },
  {
    slug: "react-router",
    name: "React Router",
    command: "npx create-react-router@latest app && cd app && npx cooud-ui@latest init",
    description: "Framework mode with route modules, loader-friendly forms, and progressive UX.",
    checks: ["Root.tsx owns provider", "forms expose field errors", "links keep visible focus"],
  },
  {
    slug: "astro",
    name: "Astro",
    command: "npm create astro@latest app && cd app && npx cooud-ui@latest init",
    description: "Island components with shared CSS tokens and isolated interactive surfaces.",
    checks: [
      "client islands import UI only where needed",
      "no duplicate provider trees",
      "static content remains semantic",
    ],
  },
  {
    slug: "laravel",
    name: "Laravel",
    command: "laravel new app && cd app && npx cooud-ui@latest init",
    description: "Blade or Inertia setup with Vite, shared token CSS, and server-rendered forms.",
    checks: [
      "Vite entry imports tokens",
      "Blade/Inertia root owns provider",
      "server errors map to FieldError",
    ],
  },
] as const;

export const ACCESSIBILITY_CHECKS = [
  {
    title: "Keyboard",
    description:
      "Every interactive primitive has a visible focus state and expected arrow-key behavior.",
  },
  {
    title: "Screen readers",
    description:
      "Dialogs, sheets, command menus, forms, and toasts expose names, descriptions, and live states.",
  },
  {
    title: "Contrast",
    description:
      "Theme presets are validated against semantic foreground/background pairs before release.",
  },
  {
    title: "Framework handoff",
    description:
      "Each adapter documents where focus should move after navigation, submit, and dismiss actions.",
  },
] as const;

export const CHANGELOG_ENTRIES = [
  {
    date: "2026-06-22",
    version: "v0.2.0",
    status: "Released",
    title: "Create studio and preset system",
    summary:
      "Added the Create route with live preview, preset save/export, shuffle controls, framework setup output, and runtime token overrides.",
    items: [
      "Nova, Aurora, Minimal, Brutalist, Editorial, and Terminal presets",
      "Get Code dialog with install, provider, CSS vars, and JSON tabs",
      "Chart, radius, font, and color overrides mapped to tokens",
    ],
  },
  {
    date: "2026-06-22",
    version: "v0.2.1",
    status: "In development",
    title: "Documentation sections and changelog",
    summary:
      "Expanded the docs IA with installation, CLI, registry, framework, forms, RTL, accessibility, and release notes surfaces.",
    items: [
      "Package-manager tabs for npm, pnpm, yarn, and bun",
      "Framework cards with setup commands and accessibility checks",
      "Clean changelog timeline for released and upcoming work",
    ],
  },
  {
    date: "2026-06-21",
    version: "v0.1.0",
    status: "Released",
    title: "Foundation component waves",
    summary:
      "Published the initial component catalog, token package, theme provider, registry generator, and showcase app.",
    items: [
      "Foundation, forms, overlays, navigation, data, display, and premium components",
      "CLI registry generated from source components",
      "Semantic token contract for runtime theming",
    ],
  },
  {
    date: "Next",
    version: "v0.3.0",
    status: "Planned",
    title: "Framework adapters and examples",
    summary:
      "Add framework-specific examples, install smoke tests, and migration recipes for production Cooud apps.",
    items: [
      "Per-framework starter snapshots",
      "Registry diff reports in docs",
      "Accessibility snapshots for complex primitives",
    ],
  },
] as const;
