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

Branding + global link behavior are centralized in **one file**: `lib/site.ts`.

Update this file to control:

- `title`
- `description`
- `faviconEmoji`
- `openLinksIn` (`"new-tab" | "same-tab"`)
- `menubarLinks` (`{ label, href }[]`)
  - Placeholder `href` values (`"#"` or empty/whitespace) are treated as non-navigating menu labels.

Default config values:

```ts
export const siteConfig = {
  title: 'Juxton.Link Navigator',
  description: 'juxton.link is a retro-first, open-source curated link navigator.',
  faviconEmoji: '🔗',
  openLinksIn: 'new-tab',
  menubarLinks: [
    { label: 'File', href: '#' },
    { label: 'Edit', href: '#' },
    { label: 'View', href: '#' },
    { label: 'Go', href: '#' },
    { label: 'Bookmarks', href: '#' },
    { label: 'Help', href: '#' },
  ],
} as const;
```

### Global link behavior

`openLinksIn` applies to both:

- main content links in the right pane
- menubar links in the top chrome

Use `"new-tab"` to keep the current default behavior, or `"same-tab"` to open links in the current tab.

### Example configuration

```ts
export const siteConfig = {
  title: 'Avery Link Navigator',
  description: 'A compact bookmark hub for personal and team resources.',
  faviconEmoji: '🧭',
  openLinksIn: 'same-tab',
  menubarLinks: [
    { label: 'Personal Site', href: 'https://juxton.com' },
    { label: 'Repo', href: 'https://github.com/juxton/juxton.link' },
  ],
} as const;
```

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
