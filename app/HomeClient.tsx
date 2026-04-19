'use client';

import { useMemo, useState } from 'react';

import FolderTree, { type TreeNode } from '@/components/FolderTree';
import LinkList, { type LinkItem } from '@/components/LinkList';
import RetroWindow from '@/components/RetroWindow';
import type { LinkCategory } from '@/lib/links';

type HomeClientProps = {
  categories: LinkCategory[];
};

const menuItems = ['File', 'Edit', 'View', 'Go', 'Bookmarks', 'Help'];
const toolbarItems = ['Back', 'Forward', 'Up', 'Reload', 'Home'];

function toLinkItem(categorySlug: string, index: number, link: LinkCategory['links'][number]): LinkItem {
  return {
    id: `${categorySlug}:${index}`,
    title: link.title,
    url: link.url,
    note: link.summary,
  };
}

export default function HomeClient({ categories }: HomeClientProps) {
  const treeNodes: TreeNode[] = useMemo(
    () => [
      {
        id: 'all-categories',
        label: 'Categories',
        children: categories.map((entry) => ({ id: entry.category.slug, label: entry.category.title })),
      },
    ],
    [categories],
  );

  const linkIndex = useMemo(() => {
    return Object.fromEntries(
      categories.map((entry) => [
        entry.category.slug,
        entry.links.map((link, index) => toLinkItem(entry.category.slug, index, link)),
      ]),
    ) as Record<string, LinkItem[]>;
  }, [categories]);

  const categoryLabels = useMemo(
    () => Object.fromEntries(categories.map((entry) => [entry.category.slug, entry.category.title])) as Record<string, string>,
    [categories],
  );

  const defaultCategory = categories[0]?.category.slug ?? 'all-categories';
  const [selectedCategoryId, setSelectedCategoryId] = useState(defaultCategory);
  const [expandedIds, setExpandedIds] = useState<string[]>(['all-categories']);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('Ready');

  const activeLinks = linkIndex[selectedCategoryId] ?? [];
  const activeLabel = categoryLabels[selectedCategoryId] ?? 'Category';

  function handleToggle(id: string) {
    setExpandedIds((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );
  }

  return (
    <RetroWindow
      title='juxton.link navigator'
      menuItems={menuItems}
      toolbarItems={toolbarItems}
      statusText={statusText}
      leftPane={
        <FolderTree
          nodes={treeNodes}
          expandedIds={expandedIds}
          selectedId={selectedCategoryId}
          onSelect={(id) => {
            if (id === 'all-categories') {
              return;
            }

            setSelectedCategoryId(id);
            setSelectedLinkId(null);
            setStatusText(`Selected category: ${categoryLabels[id] ?? id}`);
          }}
          onToggle={handleToggle}
        />
      }
      rightPane={
        <LinkList
          categoryLabel={activeLabel}
          items={activeLinks}
          selectedLinkId={selectedLinkId}
          onFocusLink={(url) => {
            setStatusText(url);
          }}
          onSelectLink={(id, url) => {
            setSelectedLinkId(id);
            setStatusText(url);
          }}
        />
      }
    />
  );
}
