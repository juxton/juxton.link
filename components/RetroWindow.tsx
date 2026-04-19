import type { ReactNode } from 'react';

import ThemeSelector from '@/components/ThemeSelector';
import type { LinkOpenMode, SiteLink } from '@/lib/site';

type RetroWindowProps = {
  title: string;
  menuItems: readonly SiteLink[];
  openLinksIn: LinkOpenMode;
  toolbarItems: string[];
  onToolbarAction: (action: 'back' | 'forward' | 'up' | 'reload' | 'home') => void;
  toolbarState: { canBack: boolean; canForward: boolean; canUp: boolean };
  statusText: string;
  leftPane: ReactNode;
  rightPane: ReactNode;
};

export default function RetroWindow({
  title,
  menuItems,
  openLinksIn,
  toolbarItems,
  onToolbarAction,
  toolbarState,
  statusText,
  leftPane,
  rightPane,
}: RetroWindowProps) {
  const toolbarActions: Record<string, 'back' | 'forward' | 'up' | 'reload' | 'home'> = {
    Back: 'back',
    Forward: 'forward',
    Up: 'up',
    Reload: 'reload',
    Home: 'home',
  };

  const isEnabled = (action: 'back' | 'forward' | 'up' | 'reload' | 'home') => {
    if (action === 'back') return toolbarState.canBack;
    if (action === 'forward') return toolbarState.canForward;
    if (action === 'up') return toolbarState.canUp;
    return true;
  };

  const opensInNewTab = openLinksIn === 'new-tab';

  return (
    <main className="retro-shell">
      <section className="retro-window" aria-label="Juxton browser window">
        <header className="window-titlebar">
          <div className="titlebar-leading-wrap">
            <button
              type="button"
              className="titlebar-leading-button"
              aria-label="Window menu"
              title="Window menu"
            >
              <span className="titlebar-leading-icon" aria-hidden="true" />
            </button>
          </div>
          <h1>{title}</h1>
          <ThemeSelector />
        </header>

        <nav className="window-menubar" aria-label="Window menu">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={opensInNewTab ? '_blank' : undefined}
              rel={opensInNewTab ? 'noopener noreferrer' : undefined}
              className="chrome-button menu-button"
            >
              {item.label}
            </a>
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
