import { getCollection, type CollectionEntry } from "astro:content";

export type PostEntry = CollectionEntry<"posts">;

function postBasename(post: PostEntry) {
  const segments = post.id.split("/");
  return segments[segments.length - 1] ?? post.id;
}

export function isTemplatePost(post: PostEntry) {
  return postBasename(post).startsWith("_template");
}

export function getPostSlug(post: PostEntry) {
  return post.data.slug.trim();
}

export function getPostDate(post: PostEntry) {
  return post.data.date;
}

export function getPostUpdatedDate(post: PostEntry) {
  return post.data.updated;
}

export function shouldDisplayPostUpdatedDate(post: PostEntry) {
  const updated = getPostUpdatedDate(post);

  return Boolean(updated && updated.valueOf() !== getPostDate(post).valueOf());
}

export function isDraftPost(post: PostEntry) {
  return post.data.draft || post.data.status?.trim().toLowerCase() === "draft";
}

export function isPublishedPost(post: PostEntry) {
  return (
    post.data.status.trim().toLowerCase() === "published" && !post.data.draft
  );
}

export function shouldIncludePost(post: PostEntry, includeDrafts = false) {
  if (isTemplatePost(post)) {
    return false;
  }

  return includeDrafts ? !isDraftPost(post) : isPublishedPost(post);
}

export function comparePostsByDateDesc(a: PostEntry, b: PostEntry) {
  return getPostDate(b).valueOf() - getPostDate(a).valueOf();
}

export function normalizeTagSlug(tag: string) {
  return tag.trim().toLowerCase();
}

export function getNormalizedPostTags(post: PostEntry) {
  return post.data.tags.map((tag) => ({
    label: tag,
    slug: normalizeTagSlug(tag),
  }));
}

export function getPostUrl(post: PostEntry) {
  return `/blog/${getPostSlug(post)}/`;
}

export function getPostDatedUrl(post: PostEntry) {
  const date = getPostDate(post);
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `/blog/${year}/${month}/${getPostSlug(post)}/`;
}

export async function getSortedPosts(options?: { includeDrafts?: boolean }) {
  const includeDrafts = options?.includeDrafts ?? false;
  const posts = await getCollection("posts");

  return posts
    .filter((post) => shouldIncludePost(post, includeDrafts))
    .sort(comparePostsByDateDesc);
}
