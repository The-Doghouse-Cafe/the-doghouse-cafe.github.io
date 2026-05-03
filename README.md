# Dog House Cafe

Where systems fail—and people figure out why.

Dog House Cafe is a community focused on real-world engineering.

Not ideal architectures.  
Not polished write-ups.  
Not “in theory.”

This is where people share what actually happens in production:
- failures and partial failures  
- edge cases and weird behavior  
- debugging paths without clean answers  

If it should work… but doesn’t—it belongs here.

---

## What this repo is

This repository backs the Dog House Cafe site and content.

Blog posts live under `src/blog-content/posts/YYYY-MM/` and should declare an explicit frontmatter `slug` plus canonical `date`. Public post URLs use `/blog/[slug]/`; dated paths are aliases only. Files whose basename starts with `_template` are ignored by the blog loader.

Over time, it may include:
- blog posts and incident writeups  
- shared debugging notes  
- lightweight tooling or examples  

---

## Community

Dog House Cafe is community-first.

The goal is to create a space where real-world experiences can be shared openly—regardless of platform.

Join here:  
👉 https://doghouse.cafe

---

## Contributing

This is evolving.

Right now, the focus is on building the community and capturing real-world experiences.  
Contribution guidelines may be added as things take shape.

---

## Licensing

Licensing is intentionally not defined at this stage.

As the community evolves, different parts of this repository (code, content, contributions) may be licensed separately.

---

## Guiding idea

Most systems don’t fail randomly.  
They fail in ways that *almost* make sense.

This is a place to figure out why.
