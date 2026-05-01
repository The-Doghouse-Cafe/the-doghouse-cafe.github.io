import { getCollection, type CollectionEntry } from "astro:content";

type PostAuthor = CollectionEntry<"posts">["data"]["author"];

export type ResolvedPostAuthor = {
  name: string;
  role?: string;
  avatar?: string;
  linkedin?: string;
};

let authorsPromise: Promise<CollectionEntry<"authors">[]> | undefined;

function normalizeAuthorName(name: string) {
  return name
    .trim()
    .toLocaleLowerCase()
    .replace(/\s+/g, " ");
}

async function getAuthors() {
  authorsPromise ??= getCollection("authors", ({ data }) => !data.draft);
  return authorsPromise;
}

export async function resolvePostAuthor(author: PostAuthor): Promise<ResolvedPostAuthor> {
  const authors = await getAuthors();
  const authorName = normalizeAuthorName(author.name);
  const matchedAuthor = authors.find(
    (profile) => normalizeAuthorName(profile.data.name) === authorName
  );

  if (!matchedAuthor) {
    return {
      ...author,
      role: author.role ?? "Author (Guest)",
    };
  }

  return {
    name: matchedAuthor.data.name,
    role: matchedAuthor.data.role,
    avatar: matchedAuthor.data.avatar,
    linkedin: matchedAuthor.data.link,
  };
}
