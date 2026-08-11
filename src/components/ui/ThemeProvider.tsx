"use client";

import { useEffect } from "react";
import { useSettings } from "@/src/hooks/useSettings";
import { THEMES } from "@/src/lib/themes";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { prefs } = useSettings();

  useEffect(() => {
    const theme = THEMES.find((t) => t.id === prefs.themeId) || THEMES[0];
    const root = document.documentElement;
    root.style.setProperty("--accent-dawn", theme.dawn);
    root.style.setProperty("--accent-gold", theme.gold);
    root.style.setProperty("--accent-dusk", theme.dusk);
    root.style.setProperty(
      "--dawn-gradient",
      `linear-gradient(90deg, ${theme.dawn}, ${theme.gold}, ${theme.dusk})`
    );
  }, [prefs.themeId]);

  return <>{children}</>;
}
