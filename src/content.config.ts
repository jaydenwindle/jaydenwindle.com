import { defineCollection, z } from 'astro:content';

const writing = defineCollection({
  type: "content",
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
  type: "content",
  schema: z.object({
    startYear: z.number(),
    endYear: z.number().optional(),
    role: z.string(),
    company: z.string().optional(),
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
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    url: z.string().url().optional(),
    tags: z.array(z.string()),
    linkStyle: z.string().optional(),
    order: z.number(),
  }),
});

const contributions = defineCollection({
  type: "content",
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
  type: "content",
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
