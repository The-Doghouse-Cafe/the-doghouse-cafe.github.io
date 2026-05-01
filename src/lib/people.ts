import { getCollection, type CollectionEntry } from "astro:content";

type PersonEntry = CollectionEntry<"people">;
type AuthorData = {
  name: string;
  slug?: string;
  role?: string;
  roleShort?: string;
  group?: string;
  priority?: number;
  affiliations?: (string | PersonAffiliation)[];
  image?: string;
  avatar?: string;
  bioShort?: string;
  bio?: string;
  links?: PersonLink[];
  link?: string;
  cardRole?: Person["cardRole"];
  draft?: boolean;
};

type AuthorEntry = {
  id: string;
  data: AuthorData;
};

type AuthorMarkdownModule = {
  frontmatter: AuthorData;
};

export type PersonLink = {
  label: string;
  href: string;
  type: "primary" | "affiliation";
};

export type PersonAffiliation = {
  label: string;
  href?: string;
};

export type Person = {
  id: string;
  name: string;
  slug?: string;
  role?: string;
  roleShort?: string;
  group: string;
  image?: string;
  affiliations: PersonAffiliation[];
  bioShort?: string;
  bio?: string;
  links: PersonLink[];
  cardRole: "founder" | "dev" | "author";
  priority: number;
  draft: boolean;
};

const DISPLAY_FIELDS = [
  "name",
  "slug",
  "role",
  "roleShort",
  "group",
  "image",
  "affiliations",
  "bioShort",
  "bio",
  "links",
  "cardRole",
  "priority",
  "draft",
] as const;

const authorModules = import.meta.glob<AuthorMarkdownModule>(
  "../blog-content/authors/**/*.md"
);

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function entrySlug(entry: { id: string; data: { name?: string; slug?: string } }) {
  return entry.data.slug ?? entry.id.replace(/\.md$/, "");
}

function fileSlug(entry: { id: string }) {
  return entry.id.replace(/\.md$/, "");
}

function isTemplateEntry(entry: { id: string; data: { slug?: string } }) {
  return entry.id.startsWith("_") || entry.data.slug === "_template";
}

function markdownPathToId(path: string) {
  return path.split("/").pop()?.replace(/\.md$/, "") ?? path;
}

function normalizeGroup(group: string | undefined) {
  const normalized = (group ?? "contributors").trim().toLowerCase();

  if (normalized === "founder") return "founders";
  if (normalized === "guest") return "guests";

  return normalized || "contributors";
}

export function formatPeopleGroup(group: string) {
  const labels: Record<string, string> = {
    founders: "Founders",
    core: "Core",
    contributors: "Contributors",
    guests: "Guests",
  };

  return labels[group] ?? group.replace(/(^|-)(\w)/g, (_, prefix, letter) => {
    return `${prefix ? " " : ""}${letter.toUpperCase()}`;
  });
}

function normalizeAuthor(author: AuthorEntry): Person {
  const explicitSlug = author.data.slug?.trim() || undefined;
  const authorLinks = author.data.links ?? [];
  const links = authorLinks.length > 0
    ? authorLinks
    : author.data.link
      ? [
          {
            label: "LinkedIn",
            href: author.data.link,
            type: "primary" as const,
          },
        ]
      : [];
  const affiliations = (author.data.affiliations ?? []).map((affiliation) =>
    typeof affiliation === "string" ? { label: affiliation } : affiliation
  );
  const image = author.data.image ?? author.data.avatar;
  const roleShort = author.data.roleShort ?? author.data.role;
  const bioShort = author.data.bioShort ?? roleShort;
  const bio = author.data.bio ?? bioShort;
  const cardRole = author.data.cardRole ?? (author.data.role?.includes("Founder") ? "founder" : "author");

  return {
    id: fileSlug(author),
    name: author.data.name,
    slug: explicitSlug,
    role: author.data.role,
    roleShort,
    group: normalizeGroup(author.data.group ?? "guests"),
    image,
    affiliations,
    bioShort,
    bio,
    links,
    cardRole,
    priority: author.data.priority ?? 999,
    draft: author.data.draft ?? false,
  };
}

async function getFallbackAuthors() {
  const entries = await Promise.all(
    Object.entries(authorModules).map(async ([path, load]) => {
      const module = await load();
      return {
        id: markdownPathToId(path),
        data: module.frontmatter,
      };
    })
  );

  return entries.filter((entry) => !isTemplateEntry(entry));
}

function normalizePeopleEntry(entry: PersonEntry): Partial<Person> & Pick<Person, "id" | "name"> {
  const slug = entrySlug(entry);

  return {
    id: slug,
    name: entry.data.name,
    slug,
    role: entry.data.role,
    roleShort: entry.data.roleShort,
    group: normalizeGroup(entry.data.group),
    image: entry.data.image,
    affiliations: entry.data.affiliations,
    bioShort: entry.data.bioShort,
    bio: entry.data.bio,
    links: entry.data.links,
    cardRole: entry.data.cardRole,
    priority: entry.data.priority,
    draft: entry.data.draft,
  };
}

function mergePerson(base: Person, override: Partial<Person>): Person {
  const merged = { ...base };

  for (const field of DISPLAY_FIELDS) {
    const value = override[field];

    if (value !== undefined) {
      Object.assign(merged, { [field]: value });
    }
  }

  merged.id = merged.slug ?? base.id;
  return merged;
}

function personKey(person: { name?: string; slug?: string }) {
  return person.slug ? `slug:${person.slug}` : `name:${slugify(person.name ?? "")}`;
}

function setIndexes(
  indexes: {
    nameKeys: Map<string, string>;
    slugKeys: Map<string, string>;
  },
  person: Person,
  key: string
) {
  indexes.nameKeys.set(slugify(person.name), key);

  if (person.slug) {
    indexes.slugKeys.set(person.slug, key);
  }
}

function deleteIndexes(
  indexes: {
    nameKeys: Map<string, string>;
    slugKeys: Map<string, string>;
  },
  person: Person
) {
  indexes.nameKeys.delete(slugify(person.name));

  if (person.slug) {
    indexes.slugKeys.delete(person.slug);
  }
}

export async function getPeople({ includeDrafts = false } = {}) {
  const [authors, peopleEntries] = await Promise.all([
    getFallbackAuthors(),
    getCollection("people", (entry) => !isTemplateEntry(entry)),
  ]);

  const peopleByKey = new Map<string, Person>();
  const nameKeys = new Map<string, string>();
  const slugKeys = new Map<string, string>();

  for (const author of authors) {
    const person = normalizeAuthor(author);
    const key = personKey(person);

    peopleByKey.set(key, person);
    setIndexes({ nameKeys, slugKeys }, person, key);
  }

  for (const entry of peopleEntries) {
    const override = normalizePeopleEntry(entry);
    const overrideKey = personKey(override);
    const slugKey = override.slug ? slugKeys.get(override.slug) : undefined;
    const nameKey = nameKeys.get(slugify(override.name));
    const existingKey = slugKey ?? nameKey;

    if (existingKey) {
      const current = peopleByKey.get(existingKey)!;
      const merged = mergePerson(current, override);
      const mergedKey = personKey(merged);

      if (mergedKey !== existingKey) {
        peopleByKey.delete(existingKey);
        deleteIndexes({ nameKeys, slugKeys }, current);
      }

      peopleByKey.set(mergedKey, merged);
      setIndexes({ nameKeys, slugKeys }, merged, mergedKey);
      continue;
    }

    const person: Person = {
      id: override.slug ?? override.id,
      name: override.name,
      slug: override.slug,
      role: override.role,
      roleShort: override.roleShort,
      group: override.group ?? "contributors",
      image: override.image,
      affiliations: override.affiliations ?? [],
      bioShort: override.bioShort,
      bio: override.bio,
      links: override.links ?? [],
      cardRole: override.cardRole ?? "author",
      priority: override.priority ?? 999,
      draft: override.draft ?? false,
    };

    peopleByKey.set(overrideKey, person);
    setIndexes({ nameKeys, slugKeys }, person, overrideKey);
  }

  return [...peopleByKey.values()]
    .filter((person) => includeDrafts || !person.draft)
    .sort((a, b) => {
      const priorityDiff = a.priority - b.priority;

      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      return a.name.localeCompare(b.name);
    });
}

export async function getPersonBySlug(slug: string) {
  const people = await getPeople();
  return people.find((person) => person.slug === slug);
}

export function resolvePeopleImage(src: string | undefined) {
  if (!src) {
    return undefined;
  }

  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }

  return `/assets/people/${src}`;
}
