// Customize your installation branding and link behavior here.

export type LinkOpenMode = 'new-tab' | 'same-tab';

export type SiteLink = {
  label: string;
  href: string;
};

export type SiteConfig = {
  title: string;
  description: string;
  faviconEmoji: string;
  openLinksIn: LinkOpenMode;
  menubarLinks: readonly SiteLink[];
};

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
} as const satisfies SiteConfig;
