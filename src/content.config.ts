import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const linkedinUrl = z
  .string()
  .trim()
  .transform((val) => (val === "" ? undefined : val)) // 👈 key
  .refine((value) => {
    if (!value) return true;

    try {
      const url = new URL(value);

      return (
        url.protocol === "https:" &&
        (url.hostname === "linkedin.com" ||
          url.hostname.endsWith(".linkedin.com"))
      );
    } catch {
      return false;
    }
  }, "Author LinkedIn URL must use https and point to linkedin.com")
  .optional();

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/blog-content/posts" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    teaser: z.string().optional(),
    author: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    type: z.string(),
    status: z.string(),
    draft: z.boolean().default(false),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/blog-content/authors" }),
  schema: z.object({
    name: z.string(),
    slug: z.string().optional(),
    role: z.string().optional(),
    roleShort: z.string().optional(),
    group: z.string().default("guests"),
    priority: z.number().default(999),
    affiliations: z
      .array(
        z.union([
          z.string(),
          z.object({
            label: z.string(),
            href: z.string().optional(),
          }),
        ]),
      )
      .default([]),
    image: z.string().optional(),
    avatar: z.string().optional(),
    bioShort: z.string().optional(),
    bio: z.string().optional(),
    links: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
          type: z.enum(["primary", "affiliation"]).default("primary"),
        }),
      )
      .default([]),
    link: linkedinUrl.optional(),
    cardRole: z.enum(["founder", "dev", "author"]).default("author"),
    draft: z.boolean().default(false),
  }),
});

const people = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/people" }),
  schema: z.object({
    name: z.string(),
    slug: z.string().optional(),
    role: z.string().optional(),
    roleShort: z.string().optional(),
    group: z.string().default("contributors"),
    image: z.string().optional(),
    affiliations: z
      .array(
        z.object({
          label: z.string(),
          href: z.string().optional(),
        }),
      )
      .default([]),
    bioShort: z.string().optional(),
    bio: z.string().optional(),
    links: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
          type: z.enum(["primary", "affiliation"]).default("primary"),
        }),
      )
      .default([]),
    cardRole: z.enum(["founder", "dev", "author"]).default("author"),
    priority: z.number().default(999),
    draft: z.boolean().default(false),
  }),
});

export const collections = { authors, posts, people };
