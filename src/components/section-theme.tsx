'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { docsRoute } from '@/lib/shared';

/**
 * Derives a section key from a root folder's base URL.
 * The General tab is the docs route group (its index lives at `docsRoute`),
 * every other tab is a root folder with its own path segment.
 */
function keyFromUrl(url: string): string {
  if (url === docsRoute) return 'general';
  const segment = url.slice(docsRoute.length + 1).split('/')[0];
  return segment || 'general';
}

/** Finds the most specific (longest) root URL that contains `pathname`. */
function activeSection(pathname: string, roots: string[]): string | undefined {
  let best: string | undefined;
  for (const url of roots) {
    const matches = pathname === url || pathname.startsWith(`${url}/`);
    if (matches && (best === undefined || url.length > best.length)) best = url;
  }
  return best ? keyFromUrl(best) : undefined;
}

/**
 * Applies a per-section accent theme by exposing a `data-section` attribute
 * that scoped CSS variables in `global.css` hook into. Sections without a
 * matching rule (e.g. newly added tabs) fall back to the default accent.
 *
 * Uses `display: contents` so it adds no box of its own and the variables still
 * cascade to both the sidebar and the page content.
 */
export function SectionTheme({
  roots,
  children,
}: {
  roots: string[];
  children: ReactNode;
}) {
  const section = activeSection(usePathname(), roots);
  return (
    <div className="contents" data-section={section}>
      {children}
    </div>
  );
}
