# Contributing to juxton.link

Thanks for contributing.

## Scope

This project uses Markdown files in `data/categories/` as the source of truth for curated links.

## Quick contribution checklist

1. Use one category file per slug: `data/categories/<slug>.md`.
2. Include required frontmatter fields: `title`, `slug`.
3. Keep `slug` equal to filename.
4. Add links with the required bullet grammar:
   - `- [Title](https://example.com) — Summary #tag1 #tag2`
5. Optional metadata:
   - `| level:beginner | status:active`
6. Avoid duplicate URLs across categories.
7. Run:
   - `npm run lint`
   - `npm run build`

## PR expectations

- Keep PRs focused and small.
- Explain why each new link is useful.
- Maintain quality summaries and clear tags.
- Resolve parser/validation failures before requesting review.

For full documentation, see `README.md`.
