"use client";

import { useState } from "react";

import FolderTree, { type TreeNode } from "@/components/FolderTree";
import LinkList, { type LinkItem } from "@/components/LinkList";
import RetroWindow from "@/components/RetroWindow";

const MOCK_TREE: TreeNode[] = [
  {
    id: "sample-links",
    label: "Sample Links",
    children: [{ id: "juxton", label: "juxton" }],
  },
];

const JUXTON_LINKS: LinkItem[] = [
  { id: "juxton-com", title: "juxton.com", url: "https://juxton.com", note: "sample" },
  { id: "juxton-land", title: "juxton.land", url: "https://juxton.land", note: "sample" },
];

const MOCK_LINKS: Record<string, LinkItem[]> = {
  "sample-links": JUXTON_LINKS,
  juxton: JUXTON_LINKS,
};

const CATEGORY_LABELS: Record<string, string> = {
  "sample-links": "Sample Links",
  juxton: "juxton",
};

const menuItems = ["File", "Edit", "View", "Go", "Bookmarks", "Help"];
const toolbarItems = ["Back", "Forward", "Up", "Reload", "Home"];

export default function Home() {
  const [selectedCategoryId, setSelectedCategoryId] = useState("juxton");
  const [expandedIds, setExpandedIds] = useState<string[]>(["sample-links"]);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("Ready");

  const activeLinks = MOCK_LINKS[selectedCategoryId] ?? [];
  const activeLabel = CATEGORY_LABELS[selectedCategoryId] ?? "Category";

  function handleToggle(id: string) {
    setExpandedIds((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );
  }

  return (
    <RetroWindow
      title="juxton.link navigator"
      menuItems={menuItems}
      toolbarItems={toolbarItems}
      statusText={statusText}
      leftPane={
        <FolderTree
          nodes={MOCK_TREE}
          expandedIds={expandedIds}
          selectedId={selectedCategoryId}
          onSelect={(id) => {
            setSelectedCategoryId(id);
            setSelectedLinkId(null);
            setStatusText(`Selected category: ${CATEGORY_LABELS[id] ?? id}`);
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
