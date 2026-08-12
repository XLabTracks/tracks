"use client";

import { useEffect, useState } from "react";
import { Contrast, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The header's theme switch — three states side by side: light, dark, high
 * contrast. It writes the classes THEME_BOOT (layout.tsx) reads before first
 * paint and remembers the choice under the same storage key — keep the two
 * in step: same key, same values, and contrast always means BOTH `dark` and
 * `contrast` on <html> (contrast is dark-plus; see globals.css).
 *
 * The server can't know the theme (it lives in localStorage), so the first
 * render marks no option checked; a mount effect reads the classes the boot
 * script already set and checks the right one. That brief unchecked frame is
 * the whole hydration story — no suppressed warnings, no flash, and the
 * selected styling keys off aria-checked so state and presentation can't
 * disagree.
 *
 * Until a visitor touches it, THEME_BOOT follows the system preference
 * (light/dark only — contrast is always an explicit choice); the first click
 * stores a choice, which outranks the OS from then on.
 */
type Theme = "light" | "dark" | "contrast";

const OPTIONS: { key: Theme; label: string; Icon: typeof Sun }[] = [
  { key: "light", label: "Light theme", Icon: Sun },
  { key: "dark", label: "Dark theme", Icon: Moon },
  { key: "contrast", label: "High contrast theme", Icon: Contrast },
];

function currentTheme(): Theme {
  const c = document.documentElement.classList;
  if (c.contains("contrast")) return "contrast";
  return c.contains("dark") ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(currentTheme());
  }, []);

  const apply = (t: Theme) => {
    const c = document.documentElement.classList;
    c.toggle("dark", t !== "light");
    c.toggle("contrast", t === "contrast");
    try {
      localStorage.setItem("tracks-theme", t);
    } catch {
      // Private mode: the switch still applies for this page's lifetime.
    }
    setTheme(t);
  };

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className="border-border flex items-center gap-0.5 rounded-md border p-0.5"
    >
      {OPTIONS.map(({ key, label, Icon }) => (
        <button
          key={key}
          type="button"
          role="radio"
          aria-checked={theme === key}
          aria-label={label}
          title={label}
          onClick={() => apply(key)}
          className={cn(
            "text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded p-1 transition-colors focus-visible:ring-2 focus-visible:outline-none",
            "aria-checked:bg-muted aria-checked:text-foreground",
          )}
        >
          <Icon className="size-4" aria-hidden />
        </button>
      ))}
    </div>
  );
}
