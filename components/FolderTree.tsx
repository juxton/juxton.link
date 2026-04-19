"use client";

type TreeNode = {
  id: string;
  label: string;
  children?: TreeNode[];
};

type FolderTreeProps = {
  nodes: TreeNode[];
  expandedIds: string[];
  selectedId: string;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
};

function renderNodes({
  nodes,
  expandedIds,
  selectedId,
  onSelect,
  onToggle,
  depth = 0,
}: FolderTreeProps & { depth?: number }) {
  return (
    <ul className="folder-branch" role={depth === 0 ? "tree" : "group"}>
      {nodes.map((node) => {
        const hasChildren = Boolean(node.children?.length);
        const isExpanded = expandedIds.includes(node.id);
        const isSelected = selectedId === node.id;

        return (
          <li key={node.id} role="none">
            <div className="tree-row" style={{ paddingInlineStart: `${depth * 14}px` }}>
              {hasChildren ? (
                <button
                  type="button"
                  className="tree-expander"
                  aria-label={isExpanded ? `Collapse ${node.label}` : `Expand ${node.label}`}
                  onClick={() => {
                    onToggle(node.id);
                  }}
                >
                  {isExpanded ? "−" : "+"}
                </button>
              ) : (
                <span className="tree-expander tree-spacer" aria-hidden="true" />
              )}

              <button
                type="button"
                role="treeitem"
                className="tree-item"
                aria-expanded={hasChildren ? isExpanded : undefined}
                aria-selected={isSelected}
                data-selected={isSelected}
                onClick={() => {
                  onSelect(node.id);
                }}
              >
                {node.label}
              </button>
            </div>

            {hasChildren && isExpanded
              ? renderNodes({ nodes: node.children ?? [], expandedIds, selectedId, onSelect, onToggle, depth: depth + 1 })
              : null}
          </li>
        );
      })}
    </ul>
  );
}

export default function FolderTree(props: FolderTreeProps) {
  return <div className="folder-tree">{renderNodes(props)}</div>;
}

export type { TreeNode };
