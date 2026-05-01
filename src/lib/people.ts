export function resolvePeopleImage(src: string | undefined) {
  if (!src) {
    return undefined;
  }

  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }

  return `/assets/people/${src}`;
}
