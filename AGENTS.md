# AGENTS.md

Personal docs site (CORE.DUMP): Next.js + Fumadocs, MDX content under `content/docs/`.
See `README.md` for section layout and how to add a new docs section.

## Commands

- Package manager is **pnpm** (see `pnpm-lock.yaml`).
- Verify changes with `pnpm types:check` then `pnpm lint`. There is **no test suite**.
- `pnpm types:check` runs `fumadocs-mdx && next typegen && tsc --noEmit` — it regenerates
  code before typechecking, so run it (not bare `tsc`) after editing content or config.

## Codegen (important)

- Fumadocs generates `.source/` from `source.config.ts` and `content/`. The TS alias
  `collections/*` -> `.source/*` (e.g. `import { docs } from 'collections/server'`).
- `.source/` is build output. Run `pnpm fumadocs-mdx` (or `pnpm types:check`) to regenerate
  after changing `source.config.ts` or adding/removing content; never hand-edit `.source/`.
- `fumadocs-mdx` also runs on `postinstall`.

## Conventions

- Path alias `@/*` -> `src/*`.
- Content frontmatter is validated by `docsSchema` in `source.config.ts`. LeetCode pages add
  `difficulty`/`id`/`url`/`tags`; other pages omit them (all optional).
- Each root section folder (`leetcode/`, `system-design/`, `(general)/`) has a `meta.json`
  with `"root": true` to isolate its sidebar. `(general)` is a route group, so its pages keep
  `/docs/...` URLs.
- Math (KaTeX) and Mermaid are enabled via remark/rehype plugins in `source.config.ts`.

## Build / deploy quirks

- Static export: `next.config.mjs` sets `output: 'export'` + `trailingSlash: true`; output
  goes to `out/`. No server runtime — API routes must be static (`force-static`).
- Routing uses Next 16 **`proxy.ts`** (not `middleware.ts`) for markdown content negotiation.
- CI deploys `out/` to Azure Static Web Apps on push to `main`
  (`.github/workflows/azure-static-web-apps-*.yml`).
