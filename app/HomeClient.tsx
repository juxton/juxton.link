'use client';

import { useMemo, useState } from 'react';

import FolderTree, { type TreeNode } from '@/components/FolderTree';
import LinkList, { type LinkItem } from '@/components/LinkList';
import RetroWindow from '@/components/RetroWindow';
import type { LinkCategory } from '@/lib/links';
import { siteConfig } from '@/lib/site';

type HomeClientProps = {
  categories: LinkCategory[];
};

type Location = { categoryId: string; linkId: string | null };
type ToolbarAction = 'back' | 'forward' | 'up' | 'reload' | 'home';

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
  const defaultLocation: Location = { categoryId: defaultCategory, linkId: null };
  const [selectedCategoryId, setSelectedCategoryId] = useState(defaultCategory);
  const [expandedIds, setExpandedIds] = useState<string[]>(['all-categories']);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('Ready');
  const [historyStack, setHistoryStack] = useState<Location[]>([defaultLocation]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const activeLinks = linkIndex[selectedCategoryId] ?? [];
  const activeLabel = categoryLabels[selectedCategoryId] ?? 'Category';
  const currentLocation: Location = { categoryId: selectedCategoryId, linkId: selectedLinkId };

  function normalizeLocation(location: Location): Location {
    const categoryId = linkIndex[location.categoryId] ? location.categoryId : defaultCategory;
    const links = linkIndex[categoryId] ?? [];
    const linkId = links.some((link) => link.id === location.linkId) ? location.linkId : null;
    return { categoryId, linkId };
  }

  function locationStatus(location: Location): string {
    if (location.linkId) {
      const link = (linkIndex[location.categoryId] ?? []).find((entry) => entry.id === location.linkId);
      if (link) {
        return link.url;
      }
    }
    return `Selected category: ${categoryLabels[location.categoryId] ?? location.categoryId}`;
  }

  function applyLocation(location: Location, source: 'navigate' | 'restore' | 'reload') {
    const nextLocation = normalizeLocation(location);
    setSelectedCategoryId(nextLocation.categoryId);
    setSelectedLinkId(nextLocation.linkId);
    if (source === 'reload') {
      setStatusText(`Reloaded: ${locationStatus(nextLocation)}`);
      return;
    }
    setStatusText(locationStatus(nextLocation));
  }

  function commitNavigation(nextLocation: Location, source: string) {
    void source;
    const normalizedNext = normalizeLocation(nextLocation);
    if (
      currentLocation.categoryId === normalizedNext.categoryId &&
      currentLocation.linkId === normalizedNext.linkId
    ) {
      return;
    }

    const truncated = historyStack.slice(0, historyIndex + 1);
    const last = truncated[truncated.length - 1];
    if (last && last.categoryId === normalizedNext.categoryId && last.linkId === normalizedNext.linkId) {
      return;
    }

    const nextStack = [...truncated, normalizedNext];
    const nextIndex = nextStack.length - 1;
    setHistoryStack(nextStack);
    setHistoryIndex(nextIndex);
    applyLocation(normalizedNext, 'navigate');
  }

  function handleToolbarAction(action: ToolbarAction) {
    switch (action) {
      case 'back': {
        if (historyIndex <= 0) return;
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        applyLocation(historyStack[nextIndex], 'restore');
        return;
      }
      case 'forward': {
        if (historyIndex >= historyStack.length - 1) return;
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        applyLocation(historyStack[nextIndex], 'restore');
        return;
      }
      case 'up': {
        if (currentLocation.linkId === null) return;
        commitNavigation({ categoryId: currentLocation.categoryId, linkId: null }, 'toolbar:up');
        return;
      }
      case 'reload': {
        applyLocation(currentLocation, 'reload');
        return;
      }
      case 'home': {
        commitNavigation(defaultLocation, 'toolbar:home');
      }
    }
  }

  function handleToggle(id: string) {
    setExpandedIds((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );
  }

  return (
    <RetroWindow
      title={siteConfig.title}
      menuItems={siteConfig.menubarLinks}
      openLinksIn={siteConfig.openLinksIn}
      toolbarItems={toolbarItems}
      onToolbarAction={handleToolbarAction}
      toolbarState={{
        canBack: historyIndex > 0,
        canForward: historyIndex < historyStack.length - 1,
        canUp: selectedLinkId !== null,
      }}
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

            commitNavigation({ categoryId: id, linkId: null }, 'tree');
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
          openLinksIn={siteConfig.openLinksIn}
          onSelectLink={(id, _url) => {
            void _url;
            commitNavigation({ categoryId: selectedCategoryId, linkId: id }, 'link-list');
          }}
        />
      }
    />
  );
}
