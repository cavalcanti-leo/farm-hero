import React, { createContext, useContext, useState, useEffect } from "react";

export type AppTheme = "classic" | "light" | "dark";

interface ThemeContextValue {
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
  isDark: boolean;
  isLight: boolean;
  isClassic: boolean;
  // Dynamic CSS classes helper
  pageBgClass: string;
  cardBgClass: string;
  cardBorderClass: string;
  buttonClass: string;
  textPrimaryClass: string;
  textSecondaryClass: string;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "classic",
  setTheme: () => {},
  isDark: false,
  isLight: false,
  isClassic: true,
  pageBgClass: "bg-gradient-to-b from-cyan-300 via-cyan-200 to-purple-50 text-slate-900",
  cardBgClass: "bg-white",
  cardBorderClass: "border-4 border-indigo-950 shadow-[4px_4px_0px_#1e1b4b]",
  buttonClass: "bg-white text-purple-700 border-4 border-indigo-950 shadow-[3px_3px_0px_#1e1b4b]",
  textPrimaryClass: "text-slate-900",
  textSecondaryClass: "text-slate-500",
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    return (localStorage.getItem("farmhero_theme") as AppTheme) || "classic";
  });

  const setTheme = (t: AppTheme) => {
    setThemeState(t);
    localStorage.setItem("farmhero_theme", t);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const isDark = theme === "dark";
  const isLight = theme === "light";
  const isClassic = theme === "classic";

  const pageBgClass = isDark
    ? "bg-slate-950 text-white min-h-full"
    : isLight
    ? "bg-slate-100 text-slate-900 min-h-full"
    : "bg-gradient-to-b from-cyan-300 via-cyan-200 to-purple-50 text-slate-900 min-h-full";

  const cardBgClass = isDark
    ? "bg-slate-900 text-white"
    : isLight
    ? "bg-white text-slate-900"
    : "bg-white text-slate-900";

  const cardBorderClass = isDark
    ? "border-2 border-slate-800 shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
    : isLight
    ? "border-2 border-slate-200 shadow-md"
    : "border-4 border-indigo-950 shadow-[4px_4px_0px_#1e1b4b]";

  const buttonClass = isDark
    ? "bg-purple-600 hover:bg-purple-500 text-white border-2 border-purple-800 shadow-md"
    : isLight
    ? "bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-700 shadow-sm"
    : "bg-white hover:bg-purple-50 text-purple-700 border-4 border-indigo-950 shadow-[3px_3px_0px_#1e1b4b]";

  const textPrimaryClass = isDark ? "text-white" : "text-indigo-950";
  const textSecondaryClass = isDark ? "text-slate-400" : isLight ? "text-slate-500" : "text-slate-600";

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        isDark,
        isLight,
        isClassic,
        pageBgClass,
        cardBgClass,
        cardBorderClass,
        buttonClass,
        textPrimaryClass,
        textSecondaryClass,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
