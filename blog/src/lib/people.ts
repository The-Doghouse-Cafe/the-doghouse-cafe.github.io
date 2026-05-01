export function resolvePeopleImage(src: string | undefined, basePath: string) {
  if (!src) {
    return undefined;
  }

  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }

  return `${basePath}assets/people/${src}`;
}
