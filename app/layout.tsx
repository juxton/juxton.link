import type { Metadata } from "next";
import Script from "next/script";

import { siteConfig } from "@/lib/site";
import { DEFAULT_THEME, THEME_STORAGE_KEY } from "@/lib/theme";

import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

const themeBootstrapScript = `(function(){
  var key=${JSON.stringify(THEME_STORAGE_KEY)};
  var fallback=${JSON.stringify(DEFAULT_THEME)};
  var valid={ retro: true, modern: true };
  try {
    var stored=window.localStorage.getItem(key);
    var nextTheme=valid[stored] ? stored : fallback;
    document.documentElement.dataset.theme=nextTheme;
  } catch (error) {
    document.documentElement.dataset.theme=fallback;
  }
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme={DEFAULT_THEME} suppressHydrationWarning>
      <body>
        <Script
          id="theme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
        />
        {children}
      </body>
    </html>
  );
}
