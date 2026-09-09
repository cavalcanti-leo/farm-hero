import React, { createContext, useContext, useState, useEffect } from "react";
import { AppTheme, ThemeConfig, getThemeConfig, THEMES_LIST } from "./themes";

export type { AppTheme, ThemeConfig };

interface ThemeContextValue {
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
  config: ThemeConfig;
  isDark: boolean;
  isLight: boolean;
  isClassic: boolean;
  isEmerald: boolean;
  isSunset: boolean;
  isBrutalist: boolean;
  isOcean: boolean;
  isBerry: boolean;
  isRoseGold: boolean;

  // Dynamic CSS classes helper
  pageBgClass: string;
  cardBgClass: string;
  cardBorderClass: string;
  buttonClass: string;
  textPrimaryClass: string;
  textSecondaryClass: string;
  accentBadgeClass: string;
  bannerBgClass: string;
  bgStyle: React.CSSProperties;

  // Fully-synced UI Container themes (Web & Mobile)
  statusBarBg: string;
  statusBarText: string;
  bottomNavBg: string;
  bottomNavText: string;
  bottomNavActiveBg: string;
  bottomNavActiveText: string;
  desktopSidebarBg: string;
  desktopSidebarBorder: string;
  desktopSidebarText: string;
  desktopHeaderBg: string;
  desktopHeaderBorder: string;
  desktopHeaderText: string;
  desktopMainBg: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  inputPlaceholder: string;
  navItemActiveClass: string;
}

const defaultConfig = getThemeConfig("classic");

const ThemeContext = createContext<ThemeContextValue>({
  theme: "classic",
  setTheme: () => {},
  config: defaultConfig,
  isDark: false,
  isLight: false,
  isClassic: true,
  isEmerald: false,
  isSunset: false,
  isBrutalist: false,
  isOcean: false,
  isBerry: false,
  isRoseGold: false,

  pageBgClass: defaultConfig.pageBgClass,
  cardBgClass: defaultConfig.cardBgClass,
  cardBorderClass: defaultConfig.cardBorderClass,
  buttonClass: defaultConfig.buttonClass,
  textPrimaryClass: defaultConfig.textPrimaryClass,
  textSecondaryClass: defaultConfig.textSecondaryClass,
  accentBadgeClass: defaultConfig.accentBadgeClass,
  bannerBgClass: defaultConfig.bannerBgClass,
  bgStyle: defaultConfig.bgStyle,

  statusBarBg: defaultConfig.statusBarBg,
  statusBarText: defaultConfig.statusBarText,
  bottomNavBg: defaultConfig.bottomNavBg,
  bottomNavText: defaultConfig.bottomNavText,
  bottomNavActiveBg: defaultConfig.bottomNavActiveBg,
  bottomNavActiveText: defaultConfig.bottomNavActiveText,
  desktopSidebarBg: defaultConfig.desktopSidebarBg,
  desktopSidebarBorder: defaultConfig.desktopSidebarBorder,
  desktopSidebarText: defaultConfig.desktopSidebarText,
  desktopHeaderBg: defaultConfig.desktopHeaderBg,
  desktopHeaderBorder: defaultConfig.desktopHeaderBorder,
  desktopHeaderText: defaultConfig.desktopHeaderText,
  desktopMainBg: defaultConfig.desktopMainBg,
  inputBg: defaultConfig.inputBg,
  inputBorder: defaultConfig.inputBorder,
  inputText: defaultConfig.inputText,
  inputPlaceholder: defaultConfig.inputPlaceholder,
  navItemActiveClass: defaultConfig.navItemActiveClass,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    return (localStorage.getItem("farmhero_theme") as AppTheme) || "classic";
  });

  const setTheme = (t: AppTheme) => {
    setThemeState(t);
    localStorage.setItem("farmhero_theme", t);
  };

  const config = getThemeConfig(theme);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    if (config.isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme, config.isDark]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        config,
        isDark: config.isDark,
        isLight: theme === "light",
        isClassic: theme === "classic",
        isEmerald: theme === "emerald",
        isSunset: theme === "sunset",
        isBrutalist: theme === "brutalist",
        isOcean: theme === "ocean",
        isBerry: theme === "berry",
        isRoseGold: theme === "rose_gold",

        pageBgClass: config.pageBgClass,
        cardBgClass: config.cardBgClass,
        cardBorderClass: config.cardBorderClass,
        buttonClass: config.buttonClass,
        textPrimaryClass: config.textPrimaryClass,
        textSecondaryClass: config.textSecondaryClass,
        accentBadgeClass: config.accentBadgeClass,
        bannerBgClass: config.bannerBgClass,
        bgStyle: config.bgStyle,

        statusBarBg: config.statusBarBg,
        statusBarText: config.statusBarText,
        bottomNavBg: config.bottomNavBg,
        bottomNavText: config.bottomNavText,
        bottomNavActiveBg: config.bottomNavActiveBg,
        bottomNavActiveText: config.bottomNavActiveText,
        desktopSidebarBg: config.desktopSidebarBg,
        desktopSidebarBorder: config.desktopSidebarBorder,
        desktopSidebarText: config.desktopSidebarText,
        desktopHeaderBg: config.desktopHeaderBg,
        desktopHeaderBorder: config.desktopHeaderBorder,
        desktopHeaderText: config.desktopHeaderText,
        desktopMainBg: config.desktopMainBg,
        inputBg: config.inputBg,
        inputBorder: config.inputBorder,
        inputText: config.inputText,
        inputPlaceholder: config.inputPlaceholder,
        navItemActiveClass: config.navItemActiveClass,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export { THEMES_LIST, getThemeConfig };
