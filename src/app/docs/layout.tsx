import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { getPageTreeRoots } from 'fumadocs-core/page-tree';
import type { Folder, Node } from 'fumadocs-core/page-tree';
import { baseOptions } from '@/lib/layout.shared';
import { SectionTheme } from '@/components/section-theme';

/** Base URL of a root folder = the shortest page URL in its subtree (its index). */
function baseUrl(folder: Folder): string | undefined {
  let min: string | undefined;
  const walk = (nodes: Node[]) => {
    for (const node of nodes) {
      if (node.type === 'page' && node.url) {
        if (min === undefined || node.url.length < min.length) min = node.url;
      } else if (node.type === 'folder') {
        walk(node.children);
      }
    }
  };
  walk(folder.children);
  return min;
}

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const tree = source.getPageTree();

  // Base URL of every tab (root folder), used to scope the per-section accent.
  const roots = getPageTreeRoots(tree)
    .filter((node): node is Folder => (node as Folder).type === 'folder')
    .map(baseUrl)
    .filter((url): url is string => Boolean(url));

  return (
    <SectionTheme roots={roots}>
      <DocsLayout tree={tree} {...baseOptions()}>
        {children}
      </DocsLayout>
    </SectionTheme>
  );
}
