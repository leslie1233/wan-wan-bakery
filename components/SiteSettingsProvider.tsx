"use client";

import { createContext, useContext } from "react";
import type { SiteContactSettings } from "../lib/phone";

const SiteSettingsContext = createContext<SiteContactSettings | null>(null);

export function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: SiteContactSettings;
  children: React.ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): SiteContactSettings {
  const settings = useContext(SiteSettingsContext);

  if (!settings) {
    throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  }

  return settings;
}
