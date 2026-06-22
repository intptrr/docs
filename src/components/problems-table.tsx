import Link from 'fumadocs-core/link';
import { source } from '@/lib/source';
import { cn } from '@/lib/cn';
import type { Node, Root } from 'fumadocs-core/page-tree';

const difficultyStyles: Record<string, string> = {
  Easy: 'border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400',
  Medium:
    'border-amber-600/30 bg-amber-600/10 text-amber-700 dark:text-amber-400',
  Hard: 'border-rose-600/30 bg-rose-600/10 text-rose-700 dark:text-rose-400',
};

const difficultyOrder: Record<string, number> = { Easy: 0, Medium: 1, Hard: 2 };

/** Map every page URL to the title of its nearest enclosing folder. */
function buildCategoryMap(root: Root): Map<string, string> {
  const map = new Map<string, string>();

  const walk = (nodes: Node[], category: string) => {
    for (const node of nodes) {
      if (node.type === 'folder') {
        const name = typeof node.name === 'string' ? node.name : category;
        walk(node.children, name);
      } else if (node.type === 'page' && node.url) {
        map.set(node.url, category);
      }
    }
  };

  walk(root.children, 'LeetCode');
  return map;
}

/**
 * Build-time table of every LeetCode problem, sourced from page frontmatter.
 * New problems appear automatically once their page has an `id`.
 */
export function ProblemsTable() {
  const categories = buildCategoryMap(source.pageTree as Root);

  const problems = source
    .getPages()
    .filter((page) => page.slugs[0] === 'leetcode' && typeof page.data.id === 'number')
    .sort((a, b) => (a.data.id ?? 0) - (b.data.id ?? 0));

  if (problems.length === 0) return null;

  return (
    <div className="not-prose my-6 overflow-x-auto rounded-lg border border-fd-border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-fd-border bg-fd-muted/50 text-left">
            <th className="px-4 py-2.5 font-medium text-fd-muted-foreground">#</th>
            <th className="px-4 py-2.5 font-medium text-fd-muted-foreground">Problem</th>
            <th className="px-4 py-2.5 font-medium text-fd-muted-foreground">Difficulty</th>
            <th className="px-4 py-2.5 font-medium text-fd-muted-foreground">Category</th>
            <th className="px-4 py-2.5 font-medium text-fd-muted-foreground">Tags</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((page) => {
            const { id, difficulty, tags, title } = page.data;
            // Strip the leading "<id>. " so the table's # column isn't duplicated.
            const name = title.replace(/^\d+\.\s*/, '');

            return (
              <tr
                key={page.url}
                className="border-b border-fd-border/60 last:border-0 hover:bg-fd-muted/30"
              >
                <td className="px-4 py-2.5 tabular-nums text-fd-muted-foreground">{id}</td>
                <td className="px-4 py-2.5">
                  <Link href={page.url} className="font-medium text-fd-foreground hover:text-fd-primary">
                    {name}
                  </Link>
                </td>
                <td className="px-4 py-2.5">
                  {difficulty ? (
                    <span
                      className={cn(
                        'inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium',
                        difficultyStyles[difficulty],
                      )}
                    >
                      {difficulty}
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-2.5 text-fd-muted-foreground">
                  {categories.get(page.url)}
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    {tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-fd-border px-2 py-0.5 text-xs text-fd-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
