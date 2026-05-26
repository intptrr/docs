import Link from 'next/link';
import { ArrowRight, Code, Network, BookOpen } from 'lucide-react';
import { appName } from '@/lib/shared';

const sections = [
  {
    title: 'General',
    description: 'Overview, notes, and miscellaneous topics.',
    href: '/docs',
    icon: BookOpen,
  },
  {
    title: 'LeetCode',
    description: 'Problem walkthroughs, patterns, and solutions.',
    href: '/docs/leetcode',
    icon: Code,
  },
  {
    title: 'System Design',
    description: 'Architectures, trade-offs, and case studies.',
    href: '/docs/system-design',
    icon: Network,
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-20">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <span className="rounded-full border border-fd-border bg-fd-muted/50 px-3 py-1 text-xs font-medium uppercase tracking-widest text-fd-muted-foreground">
            Personal knowledge base
          </span>
          <h1 className="font-brand bg-gradient-to-br from-fd-foreground to-fd-muted-foreground bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-7xl">
            {appName}
          </h1>
          <p className="max-w-xl text-balance text-base text-fd-muted-foreground sm:text-lg">
            A personal knowledge base — notes, deep dives, and brain debug logs
            across whatever I happen to be exploring.
          </p>
          <Link
            href="/docs"
            className="group mt-2 inline-flex items-center gap-2 rounded-full bg-fd-foreground px-5 py-2.5 text-sm font-medium text-fd-background transition-transform hover:-translate-y-0.5"
          >
            Open the docs
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid w-full gap-3 sm:grid-cols-3">
          {sections.map(({ title, description, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-start gap-3 rounded-xl border border-fd-border bg-fd-card p-4 text-left transition-colors hover:border-fd-foreground/30 hover:bg-fd-muted/50"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-fd-border bg-fd-muted/40 text-fd-foreground">
                <Icon className="size-4" />
              </div>
              <div className="flex min-w-0 flex-col gap-0.5">
                <h2 className="flex items-center gap-1 text-sm font-semibold">
                  {title}
                  <ArrowRight className="size-3 -translate-x-0.5 text-fd-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </h2>
                <p className="text-xs leading-snug text-fd-muted-foreground">
                  {description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
