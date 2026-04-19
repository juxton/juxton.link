# juxton.link

juxton.link is a retro-first, open-source curated link navigator. The goal is to keep content contribution dead simple while preserving a consistent browsing experience in the app UI.

## Design intent

- **Retro-first UX:** a classic file-manager style interface with themed visuals.
- **Content-first architecture:** links are curated in Markdown files, not hardcoded JSON.
- **Clear contributor workflow:** anyone can add categories and links by editing `data/categories/*.md`.

## Theme behavior

The app supports two themes:

- `retro` (default)
- `modern`

Theme behavior:

1. Theme is read from `localStorage` key `juxton.theme`.
2. If no valid value exists, the app falls back to `retro`.
3. Theme is applied to `document.documentElement.dataset.theme` during boot and when toggled.
4. Theme selection persists across sessions.

## Directory map

- `app/` – Next.js App Router entry points and top-level page wiring.
- `components/` – UI pieces (window frame, folder tree, link list, theme selector).
- `data/categories/` – Markdown content source of truth.
- `lib/` – shared logic (theme helpers, markdown parsing, category/link loader + validation).

## Markdown content system

Each category is one file in `data/categories/<slug>.md`.

### Frontmatter schema

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

Required:

- `title`
- `slug`

Optional:

- `description`
- `order` (number used for stable category sorting; lower appears first)
- `visibility` (for curation visibility, e.g. `public`)
- `tags` (category-level list)

### Link line grammar (strict and deterministic)

After frontmatter, each link is one bullet line:

```md
- [Title](https://example.com) — Summary text #tag1 #tag2
```

Optional inline metadata can be appended at the end:

```md
- [MDN Web Docs](https://developer.mozilla.org) — Primary reference docs #reference #docs | level:beginner | status:active
```

Grammar notes:

- Must be a bullet starting with `- `.
- Must include markdown link syntax `[Title](https://...)`.
- Must include an em-dash separator ` — ` before summary.
- Summary hashtags become `tags[]`.
- Inline metadata supports `| key:value` pairs.
- Blank lines are ignored.
- **Non-bullet prose lines are ignored** (they do not break parsing).

### Real examples

Example category file:

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

- [Open Source 3D Assets](https://www.opensource3dassets.com/) — A curated collection of high-quality 3D assets for metaverse builders. #assets #glb #gltf #metaverse | status:active
- [Open Source Avatars](https://www.opensourceavatars.com/) — A curated collection of high-quality 3D avatars for VR and gaming projects. #avatars #vrm #gltf #metaverse | status:active
```

## Parser and normalization flow

All markdown access is centralized in `lib/links.ts`:

1. Read all `data/categories/*.md` files.
2. Parse frontmatter (`title`, `slug`, etc.).
3. Parse link bullet lines with a deterministic parser in `lib/markdownLinks.ts`.
4. Normalize to typed objects:
   - `category: { title, slug, description, order, visibility?, tags }`
   - `links: [{ title, url, summary, tags, level?, status?, metadata? }]`
5. Apply stable sort:
   - categories by `order` then `title`
   - links by file order (preserved)

UI components do not parse markdown directly. The page consumes normalized data from `lib/links.ts` only.

## Validation rules

Current validation enforces:

- Required frontmatter fields exist (`title`, `slug`).
- Frontmatter `slug` must match the filename.
- Link URLs must be valid `http` or `https` URLs.
- Duplicate URLs across all categories are rejected.
- Link format errors include file + line context.

### Common failure examples

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

## How to add a new category

1. Create a file: `data/categories/<slug>.md`.
2. Add frontmatter with required fields:
   - `title`
   - `slug` (must match filename)
3. Optionally add `description`, `order`, `visibility`, `tags`.
4. Add at least one valid bullet link.
5. Run validation checks locally (`npm run lint` and `npm run build`).
6. Start dev server and preview (`npm run dev`).

## How to add a new link

1. Open the target category markdown file in `data/categories/`.
2. Add one bullet line in this format:
   - `- [Title](https://example.com) — Summary #tag1 #tag2`
3. Optionally append metadata:
   - `| level:beginner | status:active`
4. Confirm URL is unique across repository categories.
5. Run `npm run lint` and `npm run build`.

## Local development

Install and run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to preview categories and links.

Recommended checks before opening a PR:

```bash
npm run lint
npm run build
```

## PR workflow expectations

- Keep PRs small and focused.
- Prefer one concern per PR (e.g., content update vs parser update).
- Include context for why links were added.
- Respect duplicate URL policy (global duplicates rejected).
- Ensure formatting, parsing, and build checks pass locally.

## Maintainer review notes

When reviewing link submissions:

1. Verify category file frontmatter correctness (`title`, `slug`, filename match).
2. Check link quality (relevance, clarity, summary usefulness).
3. Confirm no URL duplication and valid `http/https` schemes.
4. Ensure ordering and tags are consistent with nearby content.
5. Ask for smaller follow-up PRs when unrelated links are mixed together.
