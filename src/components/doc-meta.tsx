import { SquareArrowOutUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';

const difficultyStyles: Record<string, string> = {
  Easy: 'border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400',
  Medium: 'border-amber-600/30 bg-amber-600/10 text-amber-700 dark:text-amber-400',
  Hard: 'border-rose-600/30 bg-rose-600/10 text-rose-700 dark:text-rose-400',
};

export interface DocMetaProps {
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  id?: number;
  url?: string;
  tags?: string[];
}

/**
 * Renders structured metadata (difficulty, problem number, tags, and
 * a link to the problem) as a compact badge row. Returns nothing when no
 * metadata is present, so it's safe to render on every docs page.
 */
export function SolutionMeta({
  difficulty,
  id,
  url,
  tags,
}: DocMetaProps) {
  const hasMeta =
    Boolean(difficulty) ||
    Boolean(url) ||
    typeof id === 'number' ||
    (tags?.length ?? 0) > 0;

  if (!hasMeta) return null;

  return (
    <div className="not-prose flex flex-wrap items-center gap-2 text-sm">
      {difficulty ? (
        <span
          className={cn(
            'rounded-full border px-2.5 py-0.5 text-xs font-medium',
            difficultyStyles[difficulty],
          )}
        >
          {difficulty}
        </span>
      ) : null}

      {typeof id === 'number' ? (
        <span className="rounded-full border border-fd-border bg-fd-muted/50 px-2.5 py-0.5 text-xs font-medium text-fd-muted-foreground">
          #{id}
        </span>
      ) : null}

      {tags?.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-fd-border px-2.5 py-0.5 text-xs text-fd-muted-foreground"
        >
          {tag}
        </span>
      ))}

      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-fd-primary hover:underline"
        >
          LeetCode
          <SquareArrowOutUpRight className="size-3.5" />
        </a>
      ) : null}
    </div>
  );
}
