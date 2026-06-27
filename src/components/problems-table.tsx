import { source } from '@/lib/source';
import type { Node, Root } from 'fumadocs-core/page-tree';
import { ProblemsDataTable, type Problem } from './problems-data-table';

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
 * Build-time data source for the LeetCode problems table. Collects problem
 * metadata from page frontmatter and hands it to a client table (TanStack
 * Table) for sorting, searching, and filtering.
 *
 * Pass `category` (a pattern folder slug, e.g. "trees") to scope the table to a
 * single category; the redundant Category column/filter is hidden in that case.
 */
export function ProblemsTable({ category }: { category?: string }) {
  const categories = buildCategoryMap(source.pageTree as Root);

  const problems: Problem[] = source
    .getPages()
    .filter(
      (page) =>
        page.slugs[0] === 'leetcode' &&
        typeof page.data.id === 'number' &&
        (category === undefined || page.slugs[1] === category),
    )
    .map((page) => ({
      id: page.data.id as number,
      // Strip the leading "<id>. " so the table's # column isn't duplicated.
      name: page.data.title.replace(/^\d+\.\s*/, ''),
      url: page.url,
      difficulty: page.data.difficulty,
      category: categories.get(page.url) ?? 'LeetCode',
      tags: page.data.tags ?? [],
    }))
    .sort((a, b) => a.id - b.id);

  if (problems.length === 0) return null;

  return (
    <ProblemsDataTable data={problems} showCategory={category === undefined} />
  );
}
