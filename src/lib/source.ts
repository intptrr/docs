import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { icons } from 'lucide-react';
import { createElement } from 'react';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';

// Tint each section's icon with its accent so the section dropdown and sidebar
// reinforce the per-section color system (see global.css). Any other icon keeps
// the default foreground color.
const sectionIconAccent: Record<string, string> = {
  BookOpen: 'var(--color-general)',
  Code: 'var(--color-leetcode)',
  Network: 'var(--color-system-design)',
};

function resolveIcon(name: string | undefined) {
  if (!name) return;
  const Icon = icons[name as keyof typeof icons];
  if (!Icon) return;
  const color = sectionIconAccent[name];
  return createElement(Icon, color ? { style: { color } } : undefined);
}

// Drop `draft: true` pages from production; keep them visible in `next dev`.
const includeDrafts = process.env.NODE_ENV !== 'production';

const fumadocsSource = docs.toFumadocsSource();
const filteredSource = includeDrafts
  ? fumadocsSource
  : {
      ...fumadocsSource,
      files: fumadocsSource.files.filter(
        (file) => file.type !== 'page' || !file.data.draft,
      ),
    };

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: filteredSource,
  icon: resolveIcon,
});

export function getPageImage(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `${docsImageRoute}/${segments.join('/')}`,
  };
}

export function getPageMarkdownUrl(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'content.md'];

  return {
    segments,
    url: `${docsContentRoute}/${segments.join('/')}`,
  };
}

export async function getLLMText(page: (typeof source)['$inferPage']) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}
