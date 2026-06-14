import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { MemoryStick } from 'lucide-react';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2 font-brand text-base font-bold tracking-tight">
          <MemoryStick
            className="size-5 text-[var(--color-general)]"
            aria-hidden="true"
          />
          <span className="bg-gradient-to-r from-[var(--color-general)] to-fd-foreground bg-clip-text text-transparent">
            {appName}
          </span>
        </span>
      ),
    },
    links: [
      {
        type: 'menu',
        text: 'Resources',
        items: [
          {
            text: 'Algorithms',
            url: '/docs/resources/algorithms',
          },
          {
            text: 'System Design',
            url: '/docs/resources/system-design',
          },
        ],
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
