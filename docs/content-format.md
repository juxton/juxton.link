# Content format and validation

This document defines the Markdown category format and parser/validation behavior used by juxton.link.

## Category file location

Each category is one file in:

- `data/categories/<slug>.md`

## Frontmatter schema

Every category file starts with YAML-like frontmatter:

```md
---
title: 3D Assets
slug: 3d-assets
description: Open-source avatars, props, environments, and structures for metaverse and web3 development workflows.
order: 30
visibility: public
tags:
  - 3d
  - metaverse
  - web3
  - gltf
  - glb
  - vrm
---
```

Required keys:

- `title`
- `slug`

Optional keys:

- `description`
- `order` (number used for stable category sorting; lower appears first)
- `visibility` (e.g. `public`)
- `tags` (category-level list)

## Link line grammar (strict)

After frontmatter, each link is one bullet line:

```md
- [Title](https://example.com) — Summary text #tag1 #tag2
```

Optional inline metadata can be appended:

```md
- [MDN Web Docs](https://developer.mozilla.org) — Primary reference docs #reference #docs | level:beginner | status:active
```

Grammar rules:

- Must be a bullet starting with `- `.
- Must include Markdown link syntax `[Title](https://...)`.
- Must include an em-dash separator ` — ` before summary.
- Summary hashtags become `tags[]`.
- Inline metadata supports `| key:value` pairs.
- Blank lines are ignored.
- Non-bullet prose lines are ignored.

## Parser and normalization flow

Markdown access is centralized in `lib/links.ts`:

1. Read all `data/categories/*.md` files.
2. Parse frontmatter (`title`, `slug`, etc.).
3. Parse link bullet lines with deterministic parsing in `lib/markdownLinks.ts`.
4. Normalize to typed objects:
   - `category: { title, slug, description, order, visibility?, tags }`
   - `links: [{ title, url, summary, tags, level?, status?, metadata? }]`
5. Apply stable sorting:
   - categories by `order` then `title`
   - links by file order

UI components do not parse markdown directly; pages consume normalized data from `lib/links.ts`.

## Validation rules

Validation enforces:

- Required frontmatter fields exist (`title`, `slug`).
- Frontmatter `slug` matches filename slug.
- Link URLs are valid `http`/`https` URLs.
- Duplicate URLs across all categories are rejected.
- Link format errors include file + line context.

## Common failure examples

Invalid slug mismatch:

```md
# file: data/categories/3d-assets.md
slug: avatars # ❌ does not match filename slug 3d-assets
```

Invalid link format:

```md
- MDN https://developer.mozilla.org # ❌ missing [Title](url) and em-dash summary
```

Invalid URL scheme:

```md
- [Internal](ftp://example.com) — Not allowed # ❌ only http/https accepted
```

Duplicate URL across categories:

- Same `https://example.com` appears in multiple category files.

## Reviewer checklist

1. Verify frontmatter correctness (`title`, `slug`, filename match).
2. Check link quality (relevance, clarity, summary usefulness).
3. Confirm no URL duplication and valid `http/https` schemes.
4. Ensure ordering and tags are consistent with nearby content.
5. Request split follow-ups if unrelated link batches are mixed.
