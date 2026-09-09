export type AppTheme =
  | "classic"
  | "light"
  | "dark"
  | "emerald"
  | "sunset"
  | "brutalist"
  | "ocean"
  | "berry"
  | "rose_gold";

export interface ThemeConfig {
  id: AppTheme;
  label: string;
  desc: string;
  swatches: string[];
  isDark: boolean;

  // Visual Aesthetics & Background Patterns
  patternName: string;
  bgStyle: React.CSSProperties;
  pageBgClass: string;
  cardBgClass: string;
  cardBorderClass: string;
  buttonClass: string;
  textPrimaryClass: string;
  textSecondaryClass: string;
  accentBadgeClass: string;
  bannerBgClass: string;

  // Fully-synced UI Container Themes (Web & Mobile)
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

// High-definition SVG Topographic, Smoke, Wave and Grid Pattern Data URIs inspired by user reference images
const oceanTopoSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280' viewBox='0 0 280 280'><path d='M0 40 C 50 10, 100 80, 150 40 C 200 10, 240 70, 280 40 M0 95 C 60 60, 110 130, 170 95 C 220 60, 250 120, 280 95 M0 150 C 40 115, 100 185, 160 150 C 210 115, 240 175, 280 150 M0 205 C 70 170, 120 240, 180 205 C 220 170, 250 225, 280 205 M0 260 C 50 230, 100 275, 150 255 T 280 260' fill='none' stroke='%235483B3' stroke-width='2.2' stroke-opacity='0.4'/><path d='M 20 120 Q 80 190, 160 120 T 260 120' fill='none' stroke='%23C1E8FF' stroke-width='1.5' stroke-opacity='0.25'/></svg>`;

const darkSmokeSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320' viewBox='0 0 320 320'><path d='M 30 120 C 80 50, 180 60, 220 130 C 260 200, 190 280, 110 270 C 30 260, -20 180, 30 120 Z M 140 50 C 210 -10, 290 30, 300 100 C 310 170, 250 240, 180 220 Z' fill='none' stroke='%23a855f7' stroke-width='2.5' stroke-opacity='0.18'/><path d='M 60 180 C 110 130, 200 140, 230 210 T 110 280 Z' fill='none' stroke='%23818cf8' stroke-width='1.8' stroke-opacity='0.14'/></svg>`;

const brutalistTopoSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'><path d='M10 25 Q 60 90, 110 25 T 210 25 M10 70 Q 70 140, 120 70 T 210 70 M10 115 Q 50 175, 100 115 T 210 115 M10 160 Q 80 210, 130 160 T 210 160 M10 200 Q 60 235, 110 200 T 210 200' fill='none' stroke='%23ffffff' stroke-width='1.8' stroke-opacity='0.3'/><circle cx='65' cy='55' r='18' fill='none' stroke='%23CBFB45' stroke-width='2' stroke-opacity='0.4'/><circle cx='155' cy='145' r='24' fill='none' stroke='%23ffffff' stroke-width='1.5' stroke-opacity='0.25'/></svg>`;

const emeraldTopoSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260' viewBox='0 0 260 260'><path d='M0 35 Q 65 105, 130 35 T 260 35 M0 90 Q 75 160, 140 90 T 260 90 M0 145 Q 55 205, 110 145 T 260 145 M0 200 Q 85 255, 150 200 T 260 200' fill='none' stroke='%238EB69B' stroke-width='2.2' stroke-opacity='0.3'/><path d='M30 65 Q 95 135, 160 65 T 260 65' fill='none' stroke='%23DAF1DE' stroke-width='1.4' stroke-opacity='0.2'/></svg>`;

const sunsetWaveSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280' viewBox='0 0 280 280'><path d='M0 55 C 80 25, 140 115, 200 45 C 240 15, 260 80, 280 55 M0 125 C 70 90, 150 180, 210 115 C 250 80, 270 145, 280 125 M0 195 C 90 160, 130 245, 190 180 C 230 145, 260 215, 280 195' fill='none' stroke='%23FFA586' stroke-width='2.2' stroke-opacity='0.3'/><path d='M 10 90 Q 100 160, 190 90' fill='none' stroke='%23B51A2B' stroke-width='1.5' stroke-opacity='0.25'/></svg>`;

const berrySmokeSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'><path d='M10 45 Q 90 135, 170 45 T 290 45 M10 115 Q 80 190, 150 115 T 290 115 M10 185 Q 100 255, 180 185 T 290 185 M10 250 Q 70 295, 140 250 T 290 250' fill='none' stroke='%23DFB6B2' stroke-width='2.2' stroke-opacity='0.32'/><circle cx='100' cy='120' r='40' fill='none' stroke='%23854F6C' stroke-width='1.8' stroke-opacity='0.25'/></svg>`;

const roseGoldSilkSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260' viewBox='0 0 260 260'><path d='M0 40 C 60 10, 110 90, 170 35 C 210 5, 240 60, 260 40 M0 105 C 70 75, 100 155, 180 95 C 220 65, 240 125, 260 105 M0 170 C 50 140, 120 220, 190 155 C 230 125, 250 185, 260 170 M0 235 C 80 205, 110 270, 170 225 T 260 235' fill='none' stroke='%23FFBB94' stroke-width='2.2' stroke-opacity='0.35'/><path d='M 20 80 Q 110 160, 200 80' fill='none' stroke='%23FB9590' stroke-width='1.5' stroke-opacity='0.2'/></svg>`;

// Pixel art blue grid — exact style from Imagem 1 (light blue #C8D8E8, fine dark lines)
const classicPixelGridSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><rect width='24' height='24' fill='none'/><path d='M 24 0 L 0 0 0 24' fill='none' stroke='%23000080' stroke-width='0.6' stroke-opacity='0.25'/></svg>`;

const lightSoftWaveSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'><path d='M0 45 Q 55 15, 110 45 T 220 45 M0 100 Q 55 70, 110 100 T 220 100 M0 155 Q 55 125, 110 155 T 220 155 M0 210 Q 55 180, 110 210 T 220 210' fill='none' stroke='%239333ea' stroke-width='1.6' stroke-opacity='0.16'/></svg>`;

export const THEMES_MAP: Record<AppTheme, ThemeConfig> = {
  classic: {
    id: "classic",
    label: "Pixel Art Classic",
    desc: "Estética pixel art retro Win95 — grade azul, bordas pretas, fontes bitmap e janelas clássicas.",
    swatches: ["#c8d8e8", "#000080", "#c0c0c0"],
    isDark: false,
    patternName: "Pixel Grid Azul Retro",
    bgStyle: {
      backgroundImage: `url("${classicPixelGridSvg}"), linear-gradient(to bottom, #c8d8e8, #d8e8f0)`,
      backgroundSize: "24px 24px, 100% 100%",
    },
    pageBgClass: "bg-[#c8d8e8] text-black min-h-full",
    cardBgClass: "bg-[#f0f0f0] text-black",
    cardBorderClass: "border-2 border-black shadow-[4px_4px_0px_#000000] rounded-none",
    buttonClass: "bg-[#c0c0c0] hover:bg-[#d4d4d4] text-black border-2 border-t-white border-l-white border-b-black border-r-black shadow-[2px_2px_0px_#000]",
    textPrimaryClass: "text-black",
    textSecondaryClass: "text-[#444444]",
    accentBadgeClass: "bg-[#000080] text-white border border-black",
    bannerBgClass: "bg-[#000080] text-white border-2 border-black shadow-[4px_4px_0px_#000]",
    statusBarBg: "bg-[#c0c0c0]",
    statusBarText: "text-black",
    bottomNavBg: "bg-[#c0c0c0] border-t-2 border-t-white border-x-0 border-b-0 text-black",
    bottomNavText: "text-[#444]",
    bottomNavActiveBg: "bg-[#000080] text-white border border-black shadow-[1px_1px_0px_#000]",
    bottomNavActiveText: "text-[#000080]",
    desktopSidebarBg: "bg-[#c0c0c0] text-black",
    desktopSidebarBorder: "border-[#808080]",
    desktopSidebarText: "text-black",
    desktopHeaderBg: "bg-[#000080]",
    desktopHeaderBorder: "border-black",
    desktopHeaderText: "text-white",
    desktopMainBg: "bg-[#c8d8e8]",
    inputBg: "bg-white",
    inputBorder: "border-black",
    inputText: "text-black",
    inputPlaceholder: "placeholder-[#808080]",
    navItemActiveClass: "bg-[#000080] text-white font-black border border-black",
  },

  light: {
    id: "light",
    label: "Claro Minimalista",
    desc: "Cores suaves com pontilhado orgânico e fundo limpo para leitura agradável.",
    swatches: ["#ffffff", "#f1f5f9", "#9333ea"],
    isDark: false,
    patternName: "Ondas Topográficas Soft",
    bgStyle: {
      backgroundImage: `url("${lightSoftWaveSvg}"), linear-gradient(to bottom, #ffffff, #f8fafc)`,
      backgroundSize: "220px 220px, 100% 100%",
    },
    pageBgClass: "bg-slate-50 text-slate-900 min-h-full",
    cardBgClass: "bg-white text-slate-900",
    cardBorderClass: "border-2 border-slate-200 shadow-md rounded-3xl",
    buttonClass: "bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-700 shadow-sm",
    textPrimaryClass: "text-slate-900",
    textSecondaryClass: "text-slate-500",
    accentBadgeClass: "bg-purple-600 text-white",
    bannerBgClass: "bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-700 text-white",
    statusBarBg: "bg-slate-100",
    statusBarText: "text-slate-800",
    bottomNavBg: "bg-white border-t border-slate-200 text-slate-600",
    bottomNavText: "text-slate-600",
    bottomNavActiveBg: "bg-purple-600 text-white border border-purple-700 shadow-sm",
    bottomNavActiveText: "text-purple-700",
    desktopSidebarBg: "bg-white text-slate-900",
    desktopSidebarBorder: "border-slate-200",
    desktopSidebarText: "text-slate-800",
    desktopHeaderBg: "bg-white",
    desktopHeaderBorder: "border-slate-200",
    desktopHeaderText: "text-slate-900",
    desktopMainBg: "bg-slate-50",
    inputBg: "bg-slate-100",
    inputBorder: "border-slate-200",
    inputText: "text-slate-900",
    inputPlaceholder: "placeholder-slate-400",
    navItemActiveClass: "bg-purple-50 text-purple-700 font-black border border-purple-200",
  },

  dark: {
    id: "dark",
    label: "Escuro Deep Slate",
    desc: "Modo noturno moderno com névoa de fumaça e tom de ardósia escura (Imagem 2).",
    swatches: ["#0f172a", "#1e1b4b", "#a855f7"],
    isDark: true,
    patternName: "Névoa de Fumaça Noturna",
    bgStyle: {
      backgroundImage: `url("${darkSmokeSvg}"), radial-gradient(circle at 50% 30%, rgba(168, 85, 247, 0.25), transparent 70%), linear-gradient(to bottom, #090d16, #0f172a)`,
      backgroundSize: "320px 320px, 100% 100%, 100% 100%",
    },
    pageBgClass: "bg-slate-950 text-white min-h-full",
    cardBgClass: "bg-slate-900 text-white",
    cardBorderClass: "border-2 border-slate-700 shadow-[0_4px_15px_rgba(0,0,0,0.5)] rounded-3xl",
    buttonClass: "bg-purple-600 hover:bg-purple-500 text-white border-2 border-purple-400 shadow-md",
    textPrimaryClass: "text-white",
    textSecondaryClass: "text-slate-400",
    accentBadgeClass: "bg-purple-500 text-white",
    bannerBgClass: "bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 border-2 border-purple-500/40 text-white",
    statusBarBg: "bg-slate-900",
    statusBarText: "text-white",
    bottomNavBg: "bg-slate-900 border-t border-slate-800 text-slate-400",
    bottomNavText: "text-slate-400",
    bottomNavActiveBg: "bg-purple-600 text-white border border-purple-400 shadow",
    bottomNavActiveText: "text-purple-300",
    desktopSidebarBg: "bg-[#0f172a] text-slate-200",
    desktopSidebarBorder: "border-slate-800",
    desktopSidebarText: "text-slate-200",
    desktopHeaderBg: "bg-[#0f172a]",
    desktopHeaderBorder: "border-slate-800",
    desktopHeaderText: "text-white",
    desktopMainBg: "bg-[#0b0e14]",
    inputBg: "bg-slate-800",
    inputBorder: "border-slate-700",
    inputText: "text-white",
    inputPlaceholder: "placeholder-slate-400",
    navItemActiveClass: "bg-purple-900/40 text-purple-300 font-black border border-purple-500/40",
  },

  emerald: {
    id: "emerald",
    label: "Verde Esmeralda & Menta",
    desc: "Inspirado em farmácias premium (MediNova). Contornos topográficos botânicos e menta.",
    swatches: ["#051F20", "#0B2B26", "#163832", "#235347", "#8EB69B", "#DAF1DE"],
    isDark: true,
    patternName: "Contornos Topográficos Botânicos",
    bgStyle: {
      backgroundImage: `url("${emeraldTopoSvg}"), radial-gradient(circle at 60% 20%, rgba(142, 182, 155, 0.25), transparent 60%), linear-gradient(135deg, #051F20 0%, #0B2B26 50%, #163832 100%)`,
      backgroundSize: "260px 260px, 100% 100%, 100% 100%",
    },
    pageBgClass: "bg-[#051F20] text-[#DAF1DE] min-h-full",
    cardBgClass: "bg-[#0B2B26] text-[#DAF1DE]",
    cardBorderClass: "border-2 border-[#235347] shadow-[0_4px_16px_rgba(5,31,32,0.6)] rounded-3xl",
    buttonClass: "bg-[#235347] hover:bg-[#163832] text-[#DAF1DE] border-2 border-[#8EB69B]/50 shadow-md",
    textPrimaryClass: "text-[#DAF1DE]",
    textSecondaryClass: "text-[#8EB69B]",
    accentBadgeClass: "bg-[#8EB69B] text-[#051F20] font-black",
    bannerBgClass: "bg-gradient-to-r from-[#0B2B26] via-[#163832] to-[#235347] border-2 border-[#8EB69B]/40 text-[#DAF1DE]",
    statusBarBg: "bg-[#0B2B26]",
    statusBarText: "text-[#DAF1DE]",
    bottomNavBg: "bg-[#0B2B26] border-t border-[#235347] text-[#8EB69B]",
    bottomNavText: "text-[#8EB69B]",
    bottomNavActiveBg: "bg-[#235347] text-[#DAF1DE] border border-[#8EB69B]",
    bottomNavActiveText: "text-[#8EB69B]",
    desktopSidebarBg: "bg-[#0B2B26] text-[#DAF1DE]",
    desktopSidebarBorder: "border-[#235347]",
    desktopSidebarText: "text-[#DAF1DE]",
    desktopHeaderBg: "bg-[#0B2B26]",
    desktopHeaderBorder: "border-[#235347]",
    desktopHeaderText: "text-[#DAF1DE]",
    desktopMainBg: "bg-[#051F20]",
    inputBg: "bg-[#051F20]",
    inputBorder: "border-[#235347]",
    inputText: "text-[#DAF1DE]",
    inputPlaceholder: "placeholder-[#8EB69B]",
    navItemActiveClass: "bg-[#235347] text-[#DAF1DE] font-black border border-[#8EB69B]",
  },

  sunset: {
    id: "sunset",
    label: "Pôr do Sol & Carmesim",
    desc: "Inspirado na paleta Sunset. Ondas crepusculares fluídas em coral aquecido e carmesim.",
    swatches: ["#161E2F", "#242F49", "#384358", "#FFA586", "#B51A2B", "#541A2E"],
    isDark: true,
    patternName: "Ondas Crepúsculo & Linhas Coral",
    bgStyle: {
      backgroundImage: `url("${sunsetWaveSvg}"), radial-gradient(circle at 40% 70%, rgba(255, 165, 134, 0.22), transparent 65%), linear-gradient(160deg, #161E2F 0%, #242F49 45%, #541A2E 100%)`,
      backgroundSize: "280px 280px, 100% 100%, 100% 100%",
    },
    pageBgClass: "bg-[#161E2F] text-slate-100 min-h-full",
    cardBgClass: "bg-[#242F49] text-white",
    cardBorderClass: "border-2 border-[#384358] shadow-[0_4px_16px_rgba(22,30,47,0.8)] rounded-3xl",
    buttonClass: "bg-[#B51A2B] hover:bg-[#541A2E] text-white border-2 border-[#FFA586]/40 shadow-md",
    textPrimaryClass: "text-[#FFA586]",
    textSecondaryClass: "text-slate-300",
    accentBadgeClass: "bg-[#FFA586] text-[#161E2F] font-black",
    bannerBgClass: "bg-gradient-to-r from-[#242F49] via-[#384358] to-[#541A2E] border-2 border-[#FFA586]/40 text-white",
    statusBarBg: "bg-[#242F49]",
    statusBarText: "text-[#FFA586]",
    bottomNavBg: "bg-[#242F49] border-t border-[#384358] text-slate-300",
    bottomNavText: "text-slate-300",
    bottomNavActiveBg: "bg-[#B51A2B] text-white border border-[#FFA586]",
    bottomNavActiveText: "text-[#FFA586]",
    desktopSidebarBg: "bg-[#242F49] text-white",
    desktopSidebarBorder: "border-[#384358]",
    desktopSidebarText: "text-slate-100",
    desktopHeaderBg: "bg-[#242F49]",
    desktopHeaderBorder: "border-[#384358]",
    desktopHeaderText: "text-[#FFA586]",
    desktopMainBg: "bg-[#161E2F]",
    inputBg: "bg-[#161E2F]",
    inputBorder: "border-[#384358]",
    inputText: "text-[#FFA586]",
    inputPlaceholder: "placeholder-slate-400",
    navItemActiveClass: "bg-[#B51A2B] text-white font-black border border-[#FFA586]",
  },

  brutalist: {
    id: "brutalist",
    label: "Tech Lime & Brutalista",
    desc: "Inspirado na estética SD/GAZU. Linhas de mapa topográfico branco/neon de alto contraste (Imagem 3).",
    swatches: ["#0d0e12", "#F4F4EB", "#CBFB45"],
    isDark: false,
    patternName: "Topografia Contorno Brutalista",
    bgStyle: {
      backgroundImage: `url("${brutalistTopoSvg}"), linear-gradient(to bottom, #0d0e12, #181a20)`,
      backgroundSize: "220px 220px, 100% 100%",
    },
    pageBgClass: "bg-[#0d0e12] text-white min-h-full",
    cardBgClass: "bg-[#181a20] text-white",
    cardBorderClass: "border-3 border-[#CBFB45] shadow-[4px_4px_0px_#CBFB45] rounded-2xl",
    buttonClass: "bg-[#CBFB45] hover:bg-[#b7ed2a] text-[#0d0e12] font-black border-2 border-[#0d0e12] shadow-[3px_3px_0px_#0d0e12]",
    textPrimaryClass: "text-[#CBFB45]",
    textSecondaryClass: "text-slate-300",
    accentBadgeClass: "bg-[#CBFB45] text-[#0d0e12] border border-[#0d0e12] font-black",
    bannerBgClass: "bg-[#0d0e12] text-white border-3 border-[#CBFB45]",
    statusBarBg: "bg-[#0d0e12]",
    statusBarText: "text-[#CBFB45]",
    bottomNavBg: "bg-[#0d0e12] border-t-2 border-[#CBFB45] text-white",
    bottomNavText: "text-white",
    bottomNavActiveBg: "bg-[#CBFB45] text-[#0d0e12] border-2 border-[#0d0e12]",
    bottomNavActiveText: "text-[#CBFB45]",
    desktopSidebarBg: "bg-[#0d0e12] text-white",
    desktopSidebarBorder: "border-[#CBFB45]",
    desktopSidebarText: "text-white",
    desktopHeaderBg: "bg-[#0d0e12]",
    desktopHeaderBorder: "border-[#CBFB45]",
    desktopHeaderText: "text-[#CBFB45]",
    desktopMainBg: "bg-[#0d0e12]",
    inputBg: "bg-[#181a20]",
    inputBorder: "border-2 border-[#CBFB45]",
    inputText: "text-[#CBFB45]",
    inputPlaceholder: "placeholder-slate-400",
    navItemActiveClass: "bg-[#CBFB45] text-[#0d0e12] font-black border-2 border-[#0d0e12]",
  },

  ocean: {
    id: "ocean",
    label: "Oceano Azul Profundo",
    desc: "Inspirado na paleta Ocean Deep Blue. Camadas fluídas de contorno topográfico marinho (Imagem 1).",
    swatches: ["#021024", "#052659", "#5483B3", "#7DA0CA", "#C1E8FF"],
    isDark: true,
    patternName: "Camadas Topográficas Oceânicas",
    bgStyle: {
      backgroundImage: `url("${oceanTopoSvg}"), radial-gradient(circle at 50% 40%, rgba(84, 131, 179, 0.35), transparent 70%), linear-gradient(180deg, #021024 0%, #052659 60%, #1e3a8a 100%)`,
      backgroundSize: "280px 280px, 100% 100%, 100% 100%",
    },
    pageBgClass: "bg-[#021024] text-[#C1E8FF] min-h-full",
    cardBgClass: "bg-[#052659] text-white",
    cardBorderClass: "border-2 border-[#5483B3] shadow-[0_4px_18px_rgba(2,16,36,0.9)] rounded-3xl",
    buttonClass: "bg-[#5483B3] hover:bg-[#7DA0CA] text-white border-2 border-[#C1E8FF]/50 shadow-md",
    textPrimaryClass: "text-[#C1E8FF]",
    textSecondaryClass: "text-[#7DA0CA]",
    accentBadgeClass: "bg-[#C1E8FF] text-[#021024] font-black",
    bannerBgClass: "bg-gradient-to-r from-[#021024] via-[#052659] to-[#5483B3] border-2 border-[#C1E8FF]/40 text-[#C1E8FF]",
    statusBarBg: "bg-[#052659]",
    statusBarText: "text-[#C1E8FF]",
    bottomNavBg: "bg-[#052659] border-t border-[#5483B3] text-[#7DA0CA]",
    bottomNavText: "text-[#7DA0CA]",
    bottomNavActiveBg: "bg-[#5483B3] text-white border border-[#C1E8FF]",
    bottomNavActiveText: "text-[#C1E8FF]",
    desktopSidebarBg: "bg-[#052659] text-white",
    desktopSidebarBorder: "border-[#5483B3]",
    desktopSidebarText: "text-[#C1E8FF]",
    desktopHeaderBg: "bg-[#052659]",
    desktopHeaderBorder: "border-[#5483B3]",
    desktopHeaderText: "text-[#C1E8FF]",
    desktopMainBg: "bg-[#021024]",
    inputBg: "bg-[#021024]",
    inputBorder: "border-[#5483B3]",
    inputText: "text-[#C1E8FF]",
    inputPlaceholder: "placeholder-[#7DA0CA]",
    navItemActiveClass: "bg-[#5483B3] text-white font-black border border-[#C1E8FF]",
  },

  berry: {
    id: "berry",
    label: "Violeta Místico & Berry",
    desc: "Inspirado na paleta Dark Purple Berry. Fumaça mística aveludada com linhas rosa champanhe (Imagem 2 & 3).",
    swatches: ["#190019", "#2B124C", "#522B5B", "#854F6C", "#DFB6B2", "#FBE4D8"],
    isDark: true,
    patternName: "Fumaça Mística & Linhas Rosa Dourado",
    bgStyle: {
      backgroundImage: `url("${berrySmokeSvg}"), radial-gradient(circle at 30% 60%, rgba(223, 182, 178, 0.28), transparent 65%), linear-gradient(135deg, #190019 0%, #2B124C 45%, #522B5B 100%)`,
      backgroundSize: "300px 300px, 100% 100%, 100% 100%",
    },
    pageBgClass: "bg-[#190019] text-[#FBE4D8] min-h-full",
    cardBgClass: "bg-[#2B124C] text-white",
    cardBorderClass: "border-2 border-[#854F6C] shadow-[0_4px_18px_rgba(25,0,25,0.9)] rounded-3xl",
    buttonClass: "bg-[#854F6C] hover:bg-[#522B5B] text-[#FBE4D8] border-2 border-[#DFB6B2]/40 shadow-md",
    textPrimaryClass: "text-[#DFB6B2]",
    textSecondaryClass: "text-[#FBE4D8]/80",
    accentBadgeClass: "bg-[#DFB6B2] text-[#190019] font-black",
    bannerBgClass: "bg-gradient-to-r from-[#2B124C] via-[#522B5B] to-[#854F6C] border-2 border-[#DFB6B2]/40 text-[#FBE4D8]",
    statusBarBg: "bg-[#2B124C]",
    statusBarText: "text-[#DFB6B2]",
    bottomNavBg: "bg-[#2B124C] border-t border-[#854F6C] text-[#DFB6B2]",
    bottomNavText: "text-[#DFB6B2]",
    bottomNavActiveBg: "bg-[#854F6C] text-[#FBE4D8] border border-[#DFB6B2]",
    bottomNavActiveText: "text-[#DFB6B2]",
    desktopSidebarBg: "bg-[#2B124C] text-[#FBE4D8]",
    desktopSidebarBorder: "border-[#854F6C]",
    desktopSidebarText: "text-[#FBE4D8]",
    desktopHeaderBg: "bg-[#2B124C]",
    desktopHeaderBorder: "border-[#854F6C]",
    desktopHeaderText: "text-[#DFB6B2]",
    desktopMainBg: "bg-[#190019]",
    inputBg: "bg-[#190019]",
    inputBorder: "border-[#854F6C]",
    inputText: "text-[#FBE4D8]",
    inputPlaceholder: "placeholder-[#DFB6B2]",
    navItemActiveClass: "bg-[#854F6C] text-white font-black border border-[#DFB6B2]",
  },

  rose_gold: {
    id: "rose_gold",
    label: "Pôr do Sol Rosa Dourado",
    desc: "Inspirado na paleta Rose Gold. Seda topográfica em linhas fluídas pêssego e framboesa (Imagem 3).",
    swatches: ["#FFBB94", "#FB9590", "#DC586D", "#A33757", "#852E4E", "#4C1D3D"],
    isDark: true,
    patternName: "Seda Topográfica Rosa Dourado",
    bgStyle: {
      backgroundImage: `url("${roseGoldSilkSvg}"), radial-gradient(circle at 70% 30%, rgba(255, 187, 148, 0.3), transparent 60%), linear-gradient(150deg, #4C1D3D 0%, #852E4E 50%, #A33757 100%)`,
      backgroundSize: "260px 260px, 100% 100%, 100% 100%",
    },
    pageBgClass: "bg-[#4C1D3D] text-[#FFBB94] min-h-full",
    cardBgClass: "bg-[#852E4E] text-white",
    cardBorderClass: "border-2 border-[#DC586D] shadow-[0_4px_18px_rgba(76,29,61,0.9)] rounded-3xl",
    buttonClass: "bg-[#DC586D] hover:bg-[#A33757] text-white border-2 border-[#FFBB94]/50 shadow-md",
    textPrimaryClass: "text-[#FFBB94]",
    textSecondaryClass: "text-[#FB9590]",
    accentBadgeClass: "bg-[#FFBB94] text-[#4C1D3D] font-black",
    bannerBgClass: "bg-gradient-to-r from-[#852E4E] via-[#A33757] to-[#DC586D] border-2 border-[#FFBB94]/40 text-white",
    statusBarBg: "bg-[#852E4E]",
    statusBarText: "text-[#FFBB94]",
    bottomNavBg: "bg-[#852E4E] border-t border-[#DC586D] text-[#FFBB94]",
    bottomNavText: "text-[#FFBB94]",
    bottomNavActiveBg: "bg-[#DC586D] text-white border border-[#FFBB94]",
    bottomNavActiveText: "text-[#FFBB94]",
    desktopSidebarBg: "bg-[#852E4E] text-[#FFBB94]",
    desktopSidebarBorder: "border-[#DC586D]",
    desktopSidebarText: "text-[#FFBB94]",
    desktopHeaderBg: "bg-[#852E4E]",
    desktopHeaderBorder: "border-[#DC586D]",
    desktopHeaderText: "text-[#FFBB94]",
    desktopMainBg: "bg-[#4C1D3D]",
    inputBg: "bg-[#4C1D3D]",
    inputBorder: "border-[#DC586D]",
    inputText: "text-[#FFBB94]",
    inputPlaceholder: "placeholder-[#FB9590]",
    navItemActiveClass: "bg-[#DC586D] text-white font-black border border-[#FFBB94]",
  },
};

export const THEMES_LIST: ThemeConfig[] = Object.values(THEMES_MAP);

export function getThemeConfig(themeId: AppTheme): ThemeConfig {
  return THEMES_MAP[themeId] || THEMES_MAP.classic;
}
