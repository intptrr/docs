import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { MemoryStick } from 'lucide-react';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2 font-brand text-base font-bold tracking-tight">
          <MemoryStick className="size-5" aria-hidden="true" />
          {appName}
        </span>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
