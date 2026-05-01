# Doghouse Cafe Agent Notes

## Site Structure

- The root site is an Astro app.
- Root pages live at `src/pages/index.astro` and `src/pages/about/index.astro`.
- Blog pages live under `src/pages/blog/`.
- Shared static styling is authored in `src/styles/base.css` and served from `public/styles/base.css`.
- Theme variants are authored in separate CSS files under `src/styles/` and served from `public/styles/`.
- Theme switching behavior lives in `public/scripts/theme.js`.

## Theme System

The site uses token-based themes:

- `src/styles/base.css` contains shared layout, components, page styles, and theme switcher styling.
- `src/styles/ember.css` is the default warm dark theme.
- `src/styles/ocean.css` is the darker ocean-inspired theme.

When changing colors, shadows, gradients, or role palette values, update the theme files rather than hard-coding visual values in `base.css`.

Each theme should define the full token set used by `base.css`, including:

- `--bg`
- `--panel`
- `--text`
- `--muted`
- `--accent`
- `--accent-soft`
- `--border`
- `--body-bg`
- `--logo-shadow`
- `--button-hover-border`
- `--button-primary-text`
- `--profile-bg-start`
- `--profile-bg-mid`
- `--profile-bg-deep`
- `--founder-bg-end`
- `--founder-glow-color`
- `--dev-bg-end`
- `--dev-glow-color`
- `--author-bg-end`
- `--author-glow-color`
- `--card-overlay`
- `--footer-border`
- `--footer-text`
- `--footer-link-hover`

Role cards use these classes:

- `team-card founder`
- `team-card dev`
- `team-card author`

The role classes set local `--bg-end` and `--glow-color` values, which drive the profile card gradient and avatar ring.

## Theme Switcher

Pages that support themes should include:

- A stylesheet link with `data-theme-link`, defaulting to `/styles/ember.css`.
- A `.theme-switcher` control with a `[data-theme-select]` select.
- `/scripts/theme.js` near the end of the body.

The switcher currently supports `ember` and `ocean`, persists the selected theme in `localStorage` under `doghouse-theme`, and swaps the active stylesheet to `/styles/{theme}.css`.

When adding a new theme:

1. Create `src/styles/{theme}.css`.
2. Import `./base.css`.
3. Define the full token set.
4. Run `.tools/sync-styles.sh` so the theme is available from `public/styles/`.
5. Add the theme name to `themes` in `public/scripts/theme.js`.
6. Add an option to each `[data-theme-select]` control.

## Blog Work

Use the root Astro project for blog-related work.

- Astro config: `astro.config.mjs`
- Astro base layout: `src/layouts/BaseLayout.astro`
- Blog post layout: `src/layouts/PostLayout.astro`
- Blog post content: `src/content/posts/`
- Astro source pages: `src/pages/`
- Package scripts are defined in `package.json`.
- Run commands from the repository root, such as `npm run dev`, `npm run build`, or `npm run preview`.

Keep blog UI, routes, content, and Astro-specific assets inside `src/`.

Astro pages should use `src/layouts/BaseLayout.astro`. It loads the root site theme stylesheet and theme switcher markup so pages stay visually aligned.

Blog posts should be Markdown files in `src/content/posts/` with frontmatter matching `src/content.config.ts`. The blog index lists non-draft posts, and `src/pages/blog/posts/[slug].astro` renders individual post pages with `PostLayout.astro`.

Post frontmatter should include an `author` object with `name`, plus optional `role`, `avatar`, and `linkedin` fields. Author LinkedIn links must be HTTPS LinkedIn URLs.

Blog contributor profiles live in `src/content/authors/` and power the `/blog/contributors/` page. Author profile links must be HTTPS LinkedIn URLs.

For blog author avatars, put images in `public/assets/team/` and reference them by filename, for example `avatar: "matt.webp"`. Run `.tools/sync-people-images.sh` to copy those files to `public/assets/people/`; the blog templates resolve filename avatars to `/assets/people/{filename}`.

## Editing Guidance

- Preserve the token contract between `base.css` and each theme file.
- Prefer extending existing classes and tokens over adding one-off styles.
- Use named theme files such as `ember.css` and `ocean.css`; do not add a generic `dark.css` shim.
- If a new root page is added, include the theme switcher pattern so theme selection remains consistent across the static site.
