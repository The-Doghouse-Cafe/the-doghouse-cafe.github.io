# Blog Post Structure

Blog posts now live under `src/blog-content/posts/YYYY-MM/`.

Use frontmatter `slug` as the canonical public slug and `date` as the canonical publish date:

```md
---
title: "Post title"
slug: "post-slug"
author: "Matt McGowan"
date: 2026-05-01
description: "Short summary here."
tags:
  - Example
type: post
updated: 2026-05-02
status: published
---
```

Notes:

- Canonical public post URLs stay under `/blog/[slug]/`.
- Dated aliases under `/blog/YYYY/MM/[slug]/` redirect permanently to the canonical post URL.
- Filenames are no longer the source of truth for routing; set `slug` explicitly.
- Publish date comes only from frontmatter `date`; filesystem timestamps are ignored for routing, sorting, and display.
- Files whose basename starts with `_template` are ignored by blog loading, so `_template.md` and `_template-post.md` are safe to keep beside content.
