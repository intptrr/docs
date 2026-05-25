# CORE.DUMP

A personal knowledge base — notes, deep dives, and brain debug logs across
whatever I happen to be exploring. Built with [Next.js](https://nextjs.org) and
[Fumadocs](https://fumadocs.dev).

## Development

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

## Structure

Docs are organized into root sections that appear in the sidebar tabs dropdown:

| Section       | Path                              | Folder                        |
| ------------- | --------------------------------- | ----------------------------- |
| General       | `/docs`, `/docs/test`             | `content/docs/(general)/`     |
| LeetCode      | `/docs/leetcode/...`              | `content/docs/leetcode/`      |
| System Design | `/docs/system-design/...`         | `content/docs/system-design/` |

Each section folder has a `meta.json` with `"root": true` so its sidebar is
isolated from the others. `(general)` is a folder group (parentheses) so its
pages keep the top-level `/docs/...` URLs.

To add a new section (e.g. Finance):

1. Create `content/docs/finance/` with an `index.mdx` and a
   `meta.json` containing `{ "title": "Finance", "root": true }`.
2. Add the tab entry in [`src/app/docs/layout.tsx`](src/app/docs/layout.tsx).
3. Add a card in [`src/app/(home)/page.tsx`](src/app/(home)/page.tsx).

## Key files

- [`src/lib/source.ts`](src/lib/source.ts) — Fumadocs content source loader.
- [`src/lib/layout.shared.tsx`](src/lib/layout.shared.tsx) — Shared layout options.
- [`src/lib/shared.ts`](src/lib/shared.ts) — App name and route constants.
- [`src/app/docs/layout.tsx`](src/app/docs/layout.tsx) — Docs layout with tabs config.
- [`source.config.ts`](source.config.ts) — Fumadocs MDX config.

## Scripts

| Script             | Purpose                     |
| ------------------ | --------------------------- |
| `pnpm dev`         | Start the dev server.       |
| `pnpm build`       | Build the static site.      |
| `pnpm start`       | Serve the production build. |
| `pnpm types:check` | Run typegen and `tsc`.      |
| `pnpm lint`        | Run ESLint.                 |

## References

- [Next.js docs](https://nextjs.org/docs)
- [Fumadocs docs](https://fumadocs.dev/docs)
- [Page Conventions](https://fumadocs.dev/docs/page-conventions)
