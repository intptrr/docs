import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { remarkMdxMermaid } from 'fumadocs-core/mdx-plugins';
import lastModified from 'fumadocs-mdx/plugins/last-modified';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { z } from 'zod';

// Frontmatter schema shared by all docs. The fields are all
// optional, so non-Leetcode pages simply omit them.
// see https://fumadocs.dev/docs/mdx/collections
const docsSchema = pageSchema.extend({
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  id: z.number().int().positive().optional(),
  url: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: docsSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  plugins: [lastModified()],
  mdxOptions: {
    remarkPlugins: [remarkMath, remarkMdxMermaid],
    rehypePlugins: (v) => [[rehypeKatex, { strict: false }], ...v],
  },
});
