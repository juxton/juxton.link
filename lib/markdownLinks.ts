export type FrontmatterValue = string | number | string[];

export type ParsedFrontmatter = {
  data: Record<string, FrontmatterValue>;
  body: string;
};

export type ParsedBulletLink = {
  title: string;
  url: string;
  summary: string;
  tags: string[];
  metadata: Record<string, string>;
};

const LINK_LINE_PATTERN = /^\s*-\s*\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)\s+—\s+(.+)$/;
const TAG_PATTERN = /(^|\s)#([a-zA-Z0-9_-]+)/g;

function parseScalar(rawValue: string): string | number {
  const value = rawValue.trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  if (/^-?\d+$/.test(value)) {
    return Number(value);
  }

  return value;
}

export function parseFrontmatter(source: string): ParsedFrontmatter {
  if (!source.startsWith('---\n')) {
    throw new Error("Missing frontmatter delimiter '---' at top of file.");
  }

  const endDelimiterIndex = source.indexOf('\n---\n', 4);
  if (endDelimiterIndex === -1) {
    throw new Error("Missing closing frontmatter delimiter '---'.");
  }

  const rawFrontmatter = source.slice(4, endDelimiterIndex);
  const body = source.slice(endDelimiterIndex + 5);
  const lines = rawFrontmatter.split('\n');
  const data: Record<string, FrontmatterValue> = {};

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim()) {
      continue;
    }

    const keyMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (!keyMatch) {
      throw new Error(`Invalid frontmatter line: ${line}`);
    }

    const [, key, value] = keyMatch;

    if (value === '') {
      const items: string[] = [];
      let cursor = index + 1;
      while (cursor < lines.length) {
        const listLine = lines[cursor];
        const listMatch = listLine.match(/^\s*-\s+(.+)$/);
        if (!listMatch) {
          break;
        }

        items.push(String(parseScalar(listMatch[1])));
        cursor += 1;
      }

      if (items.length === 0) {
        throw new Error(`Frontmatter key '${key}' must have a value or non-empty list.`);
      }

      data[key] = items;
      index = cursor - 1;
      continue;
    }

    data[key] = parseScalar(value);
  }

  return { data, body };
}

function parseMetadataSegment(segment: string): Record<string, string> {
  const metadata: Record<string, string> = {};
  const parts = segment
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean);

  for (const part of parts) {
    const separatorIndex = part.indexOf(':');
    if (separatorIndex === -1) {
      continue;
    }

    const key = part.slice(0, separatorIndex).trim();
    const value = part.slice(separatorIndex + 1).trim();

    if (key && value) {
      metadata[key] = value;
    }
  }

  return metadata;
}

export function parseBulletLinkLine(line: string): ParsedBulletLink | null {
  const trimmed = line.trim();
  if (!trimmed || !trimmed.startsWith('- ')) {
    return null;
  }

  const match = line.match(LINK_LINE_PATTERN);
  if (!match) {
    throw new Error('Invalid link bullet format. Expected `- [Title](https://url) — Summary`');
  }

  const [, title, url, tail] = match;
  const metadataStart = tail.indexOf(' | ');
  const summary = (metadataStart === -1 ? tail : tail.slice(0, metadataStart)).trim();
  const metadataPart = metadataStart === -1 ? '' : tail.slice(metadataStart);
  const tags = Array.from(summary.matchAll(TAG_PATTERN), (result) => result[2].toLowerCase());
  const cleanSummary = summary.replace(TAG_PATTERN, ' ').replace(/\s{2,}/g, ' ').trim();
  const metadata = parseMetadataSegment(metadataPart);

  return {
    title: title.trim(),
    url: url.trim(),
    summary: cleanSummary,
    tags,
    metadata,
  };
}
