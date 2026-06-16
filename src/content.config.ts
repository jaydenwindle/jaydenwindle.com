import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const writing = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writing" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      image: image().optional(),
      description: z.string(),
      date: z.coerce.date(),
      draft: z.boolean().optional(),
    }),
});

const work = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/work" }),
  schema: ({ image }) => z.object({
    startYear: z.number(),
    endYear: z.number().optional(),
    role: z.string(),
    company: z.string().optional(),
    companyIcon: image().optional(),
    companyURL: z.string().optional(),
    companyBackgroundColor: z.string().optional(),
    companyTextColor: z.string().optional(),
    companyDescription: z.string().optional(),
    companyStyle: z.string().optional(),
    rowStyle: z.string().optional(),
    order: z.number(),
  })
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    url: z.string().url().optional(),
    icon: image().optional(),
    tags: z.array(z.string()),
    linkStyle: z.string().optional(),
    order: z.number(),
  }),
});

const contributions = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/contributions" }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    url: z.string().url().optional(),
    additions: z.number(),
    deletions: z.number(),
    prs: z.number(),
    linkStyle: z.string().optional(),
    order: z.number(),
  }),
});

const talks = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/talks" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    event: z.string(),
    year: z.number(),
    url: z.string().url().optional(),
    image: image().optional(),
    order: z.number(),
  }),
});

export const collections = { work, writing, projects, contributions, talks };
