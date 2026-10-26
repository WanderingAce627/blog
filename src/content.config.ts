import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** tech = 技术笔记，essay = 随笔 */
    category: z.enum(['tech', 'essay']).default('tech'),
    tags: z.array(z.string()).default([]),
    /** true 时只在本地 npm run dev 可见，不会发布 */
    draft: z.boolean().default(false),
    /** 附件：PDF、压缩包等，会在文章末尾列出下载链接 */
    attachments: z
      .array(z.object({ name: z.string(), url: z.string() }))
      .default([]),
  }),
});

export const collections = { blog };
