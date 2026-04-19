import type { ReactNode } from "react";

import ThemeSelector from "@/components/ThemeSelector";

type RetroWindowProps = {
  title: string;
  menuItems: string[];
  toolbarItems: string[];
  onToolbarAction: (action: "back" | "forward" | "up" | "reload" | "home") => void;
  toolbarState: { canBack: boolean; canForward: boolean; canUp: boolean };
  statusText: string;
  leftPane: ReactNode;
  rightPane: ReactNode;
};

export default function RetroWindow({
  title,
  menuItems,
  toolbarItems,
  onToolbarAction,
  toolbarState,
  statusText,
  leftPane,
  rightPane,
}: RetroWindowProps) {
  const toolbarActions: Record<string, "back" | "forward" | "up" | "reload" | "home"> = {
    Back: "back",
    Forward: "forward",
    Up: "up",
    Reload: "reload",
    Home: "home",
  };

  const isEnabled = (action: "back" | "forward" | "up" | "reload" | "home") => {
    if (action === "back") return toolbarState.canBack;
    if (action === "forward") return toolbarState.canForward;
    if (action === "up") return toolbarState.canUp;
    return true;
  };

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
            <button
              key={item}
              type="button"
              className="chrome-button toolbar-button"
              aria-label={item}
              onClick={() => {
                onToolbarAction(toolbarActions[item]);
              }}
              disabled={!isEnabled(toolbarActions[item])}
              aria-disabled={!isEnabled(toolbarActions[item])}
            >
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
