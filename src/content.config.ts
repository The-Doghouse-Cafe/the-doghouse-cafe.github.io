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
  loader: glob({ pattern: "**/*.md", base: "./src/blog-content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    teaser: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.object({
      name: z.string(),
      role: z.string().optional(),
      avatar: z.string().optional(),
      linkedin: linkedinUrl.optional(),
    }).default({
      name: "Doghouse Cafe",
    }),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/blog-content/authors" }),
  schema: z.object({
    name: z.string(),
    role: z.string().optional(),
    group: z.string().default("Guests"),
    priority: z.number().default(999),
    affiliations: z.array(z.string()).default([]),
    avatar: z.string().optional(),
    link: linkedinUrl.optional(),
    draft: z.boolean().default(false),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/team" }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    image: z.string(),
    bio: z.string(),
    links: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
          type: z.enum(["primary", "affiliation"]).default("primary"),
        })
      )
      .default([]),
    cardRole: z.enum(["founder", "dev", "author"]).default("author"),
    priority: z.number().default(999),
    draft: z.boolean().default(false),
  }),
});

export const collections = { authors, posts, team };
