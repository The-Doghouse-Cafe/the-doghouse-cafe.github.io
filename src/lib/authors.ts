import type { CollectionEntry } from "astro:content";
import { getPeople, type Person } from "./people";

type PostAuthor = CollectionEntry<"posts">["data"]["author"];

export type ResolvedPostAuthor = {
  name: string;
  role?: string;
  avatar?: string;
  linkedin?: string;
};

let peoplePromise: Promise<Person[]> | undefined;

function normalizeAuthorName(name: string) {
  return name
    .trim()
    .toLocaleLowerCase()
    .replace(/\s+/g, " ");
}

async function getNormalizedPeople() {
  peoplePromise ??= getPeople();
  return peoplePromise;
}

export async function resolvePostAuthor(author: PostAuthor): Promise<ResolvedPostAuthor> {
  const people = await getNormalizedPeople();
  const authorName = normalizeAuthorName(author.name);
  const matchedAuthor = people.find(
    (profile) => normalizeAuthorName(profile.name) === authorName
  );

  if (!matchedAuthor) {
    return {
      ...author,
      role: author.role ?? "Author (Guest)",
    };
  }

  const linkedin = matchedAuthor.links.find((link) => link.label === "LinkedIn");

  return {
    name: matchedAuthor.name,
    role: matchedAuthor.roleShort ?? matchedAuthor.role,
    avatar: matchedAuthor.image,
    linkedin: linkedin?.href,
  };
}
