"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";
interface ThemeContextType {
  theme: Theme;
  toggle: () => void;
}

const ThemeCtx = createContext<ThemeContextType>({
  theme: "dark",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      document.body.style.background =
        "linear-gradient(135deg, #0a0f14 0%, #0d1a12 50%, #0a0f14 100%)";
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      document.body.style.background =
        "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdf4 100%)";
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  return useContext(ThemeCtx);
}
