import 'server-only';

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { parseBulletLinkLine, parseFrontmatter, type FrontmatterValue } from '@/lib/markdownLinks';

const CATEGORIES_DIR = path.join(process.cwd(), 'data/categories');

type Category = {
  title: string;
  slug: string;
  description?: string;
  order: number;
  visibility?: string;
  tags: string[];
};

type Link = {
  title: string;
  url: string;
  summary: string;
  tags: string[];
  level?: string;
  status?: string;
  metadata?: Record<string, string>;
};

type LinkCategory = {
  category: Category;
  links: Link[];
};

type MarkdownValidationIssue = {
  file: string;
  line?: number;
  message: string;
};

function asString(value: FrontmatterValue | undefined, field: string, file: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Missing required frontmatter field '${field}' in ${file}.`);
  }

  return value.trim();
}

function asOptionalString(value: FrontmatterValue | undefined): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function asNumber(value: FrontmatterValue | undefined): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  return Number.MAX_SAFE_INTEGER;
}

function asStringList(value: FrontmatterValue | undefined): string[] {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === 'string').map((entry) => entry.trim()).filter(Boolean);
  }

  return [];
}

function validateUrl(url: string, context: string) {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`Invalid URL in ${context}: ${url}`);
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`URL must use http/https in ${context}: ${url}`);
  }
}

async function loadMarkdownFiles() {
  const dirEntries = await readdir(CATEGORIES_DIR, { withFileTypes: true });
  const files = dirEntries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  const payloads = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(CATEGORIES_DIR, file);
      const source = await readFile(filePath, 'utf8');
      return { file, source };
    }),
  );

  return payloads;
}

function parseCategoryFile(file: string, source: string): LinkCategory {
  const filenameSlug = file.replace(/\.md$/, '');
  const { data, body } = parseFrontmatter(source);

  const title = asString(data.title, 'title', file);
  const slug = asString(data.slug, 'slug', file);

  if (slug !== filenameSlug) {
    throw new Error(`Frontmatter slug '${slug}' does not match filename '${filenameSlug}' in ${file}.`);
  }

  const category: Category = {
    title,
    slug,
    description: asOptionalString(data.description),
    order: asNumber(data.order),
    visibility: asOptionalString(data.visibility),
    tags: asStringList(data.tags),
  };

  const links: Link[] = [];
  const lines = body.split('\n');

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      continue;
    }

    if (!trimmed.startsWith('- ')) {
      continue;
    }

    let parsed;
    try {
      parsed = parseBulletLinkLine(line);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid markdown link line.';
      throw new Error(`${file}:${index + 1} ${message}`);
    }

    if (!parsed) {
      continue;
    }

    validateUrl(parsed.url, `${file}:${index + 1}`);

    links.push({
      title: parsed.title,
      url: parsed.url,
      summary: parsed.summary,
      tags: parsed.tags,
      level: parsed.metadata.level,
      status: parsed.metadata.status,
      metadata: Object.keys(parsed.metadata).length > 0 ? parsed.metadata : undefined,
    });
  }

  return { category, links };
}

export async function getLinkCategories(): Promise<LinkCategory[]> {
  const files = await loadMarkdownFiles();
  const categories = files.map(({ file, source }) => parseCategoryFile(file, source));

  const seenUrls = new Map<string, string>();

  for (const entry of categories) {
    for (const link of entry.links) {
      const duplicateIn = seenUrls.get(link.url);
      if (duplicateIn) {
        throw new Error(
          `Duplicate URL detected: ${link.url} appears in both ${duplicateIn} and ${entry.category.slug}.`,
        );
      }

      seenUrls.set(link.url, entry.category.slug);
    }
  }

  return categories.sort((left, right) => {
    if (left.category.order !== right.category.order) {
      return left.category.order - right.category.order;
    }

    return left.category.title.localeCompare(right.category.title);
  });
}

export async function validateMarkdownLinks(): Promise<MarkdownValidationIssue[]> {
  const issues: MarkdownValidationIssue[] = [];

  try {
    await getLinkCategories();
  } catch (error) {
    issues.push({
      file: 'data/categories',
      message: error instanceof Error ? error.message : 'Unknown markdown parsing error.',
    });
  }

  return issues;
}

export type { Category, Link, LinkCategory, MarkdownValidationIssue };
