Authors / People Data Guide

This project uses a unified “people” schema for:

* team members
* contributors
* blog authors

Primary source:

* src/content/people/

Fallback source:

* blog-content/authors/

⸻

Creating or Updating a Person

There are two sources of people data depending on the type of contributor:

Internal (team, founders, core contributors)

Create a new file in:

src/content/people/<slug>.md

Use _template.md as the base.

⸻

External (blog-only authors)

Create or update a file in:

src/blog-content/authors/<slug>.md

These are used as fallback data and do not require the full schema unless the person is being surfaced on the /people page.

⸻

Required Fields

* name
* slug
* role
* roleShort
* group
* image
* bioShort
* bio
* priority
* draft

⸻

Optional Fields

* affiliations
* links
* cardRole

⸻

Field Guidelines

role vs roleShort

* role is the formatted role and can be multi-line.
* roleShort is the single-line version used for cards, lists, and compact layouts.

group

Used to organize the /people page.

Allowed values:

* founders
* core
* contributors
* guest

affiliations

Use affiliations for organizations, companies, or projects connected to the person.

Example:

affiliations:
  - label: "Organization"
    href: "https://example.com"

The href field is optional.

links

Use links for primary profile links or related external pages.

Example:

links:
  - label: "LinkedIn"
    href: "https://example.com"
    type: "primary"

priority

Lower number means higher placement.

Example:

* priority: 0 appears before priority: 10

draft

Use draft: true to prevent a person from appearing on the public site.

⸻

Data Merge Behavior

People data is merged from two sources:

1. blog-content/authors/
2. src/content/people/

If a matching slug or name exists, the file in src/content/people/ takes priority.

This allows existing blog author metadata to remain as a fallback while newer people files control public display fields.

⸻

Rendering Rules

* /people uses bioShort.
* /people/[slug] uses the full bio.
* Cards use roleShort when available.
* Profile pages use the full formatted role.
* Files with draft: true should not render publicly.
* _template.md should not render as a real person.

⸻

Notes

* Keep slugs consistent and kebab-case.
* Prefer adding or updating data in src/content/people/ instead of hardcoding people in components.
* Use _template.md as the base for new people files.
* Keep bios practical, clear, and aligned with the Dog House Cafe tone.