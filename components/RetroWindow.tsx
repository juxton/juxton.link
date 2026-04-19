import type { ReactNode } from "react";

import ThemeSelector from "@/components/ThemeSelector";

type RetroWindowProps = {
  title: string;
  menuItems: string[];
  toolbarItems: string[];
  statusText: string;
  leftPane: ReactNode;
  rightPane: ReactNode;
};

export default function RetroWindow({
  title,
  menuItems,
  toolbarItems,
  statusText,
  leftPane,
  rightPane,
}: RetroWindowProps) {
  return (
    <main className="retro-shell">
      <section className="retro-window" aria-label="Juxton browser window">
        <header className="window-titlebar">
          <div className="titlebar-leading" aria-hidden="true" />
          <h1>{title}</h1>
          <ThemeSelector />
        </header>

        <nav className="window-menubar" aria-label="Window menu">
          {menuItems.map((item) => (
            <button key={item} type="button" className="chrome-button menu-button">
              {item}
            </button>
          ))}
        </nav>

        <div className="window-toolbar" role="toolbar" aria-label="Navigation toolbar">
          {toolbarItems.map((item) => (
            <button key={item} type="button" className="chrome-button toolbar-button" aria-label={item}>
              <span className="toolbar-icon" aria-hidden="true" />
              <span>{item}</span>
            </button>
          ))}
        </div>

        <div className="window-main">
          <section className="pane pane-left" aria-label="Categories pane">
            {leftPane}
          </section>
          <section className="pane pane-right" aria-label="Links pane">
            {rightPane}
          </section>
        </div>

        <footer className="window-statusbar" aria-live="polite">
          <span>Status:</span>
          <span className="status-text">{statusText}</span>
        </footer>
      </section>
    </main>
  );
}
