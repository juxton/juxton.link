# juxton.link

juxton.link is a retro-first, open-source curated link navigator. It keeps content contribution simple (Markdown files) while preserving a consistent browsing experience in the app UI.

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Recommended checks before opening a PR:

```bash
npm run lint
npm run build
```

## Customize your installation

Branding is centralized in **one file**: `lib/site.ts`.

Update this file to control:

- `title`
- `description`
- `faviconEmoji`

Default branding values:

```ts
export const siteConfig = {
  title: 'Juxton.Link Navigator',
  description: 'juxton.link is a retro-first, open-source curated link navigator.',
  faviconEmoji: '🔗',
} as const;
```

This one config file drives the window title, page metadata, and share metadata. Do not treat branding as a component- or layout-level change; use `lib/site.ts` as the single branding entry point.

## Content authoring workflow

Content lives in `data/categories/*.md`.

1. Create or edit a category file (`data/categories/<slug>.md`).
2. Add required frontmatter (`title`, `slug`) and optional category metadata.
3. Add link bullets using the project format.
4. Run `npm run lint` and `npm run build`.

For complete format details (frontmatter schema, link grammar, validation behavior, and troubleshooting), see [`docs/content-format.md`](docs/content-format.md).

## Customization entry points

- **Branding:** `lib/site.ts`
- **Content:** `data/categories/*.md`
- **Theme behavior/UI implementation:** `app/`, `components/`, `lib/`

If you are installing for your own deployment, start with branding + content updates first.

## Project purpose

- **Retro-first UX:** classic file-manager style interface with themed visuals.
- **Content-first architecture:** curated links are authored in Markdown.
- **Clear contributor workflow:** categories and links are updated through content files, then validated by lint/build.

## Contributing

- Keep PRs focused (one concern per PR when possible).
- Include context for major content additions.
- Ensure lint/build checks pass locally.

## License

This project is licensed under the [MIT License](./LICENSE).
