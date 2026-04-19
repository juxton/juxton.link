"use client";

type LinkItem = {
  id: string;
  title: string;
  url: string;
  note: string;
};

type LinkListProps = {
  categoryLabel: string;
  items: LinkItem[];
  selectedLinkId: string | null;
  onFocusLink: (url: string) => void;
  onSelectLink: (id: string, url: string) => void;
};

export default function LinkList({
  categoryLabel,
  items,
  selectedLinkId,
  onFocusLink,
  onSelectLink,
}: LinkListProps) {
  return (
    <div className="link-list-wrap">
      <h2>{categoryLabel}</h2>
      <ul className="link-list" aria-label={`${categoryLabel} links`}>
        {items.map((item) => {
          const isSelected = item.id === selectedLinkId;
          return (
            <li key={item.id}>
              <a
                href={item.url}
                className="link-item"
                data-selected={isSelected}
                onMouseEnter={() => {
                  onFocusLink(item.url);
                }}
                onFocus={() => {
                  onFocusLink(item.url);
                }}
                onClick={() => {
                  onSelectLink(item.id, item.url);
                }}
              >
                <span className="link-title">{item.title}</span>
                <span className="link-note">{item.note}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export type { LinkItem };
