import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/lib/theme-context";
import { THEMES_LIST } from "@/lib/themes";
import { useAuth } from "@/lib/auth-context";
import { useDevView } from "@/hooks/use-mobile";
import { useNotificationContext } from "@/lib/notification-context";
import { VersionUpdateModal } from "@/components/VersionUpdateModal";
import {
  Home,
  User,
  Heart,
  Gamepad2,
  Menu,
  Wifi,
  Battery,
  X,
  LogOut,
  ShieldCheck,
  Bell,
  Search,
  ChevronDown,
  Activity,
  BarChart2,
  Download,
  Target,
  Syringe,
  TrendingUp,
  ListChecks,
  Trophy,
  Settings,
  Smartphone,
  Laptop,
  Palette,
  Check,
  Users,
  Stethoscope,
  Briefcase,
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

// ─── Nav structure for desktop sidebar (Paciente) ──────────────────────────
const NAV_SECTIONS = [
  {
    label: "ACOMPANHAMENTO",
    items: [
      { href: "/", label: "Visão Geral", icon: Home },
      { href: "/avatar", label: "Personagem", icon: User },
      { href: "/saude", label: "Saúde", icon: Heart },
      { href: "/jogos", label: "Jogos", icon: Gamepad2 },
    ],
  },
  {
    label: "ATIVIDADES",
    items: [
      { href: "/recompensas", label: "Recompensas", icon: Trophy },
      { href: "/saude/medicamentos", label: "Medicamentos", icon: Syringe },
      { href: "/historico", label: "Histórico", icon: ListChecks },
    ],
  },
  {
    label: "RELATÓRIOS & CONFIGURAÇÕES",
    items: [
      { href: "/desempenho", label: "Desempenho", icon: TrendingUp },
      { href: "/indicadores", label: "Indicadores", icon: BarChart2 },
      { href: "/exportar-dados", label: "Exportar Receitas", icon: Download },
      { href: "/settings", label: "Configurações", icon: Settings },
    ],
  },
];

// ─── Nav structure for desktop sidebar (Farmacêutico) ──────────────────────
const PHARMACIST_NAV_SECTIONS = [
  {
    label: "CLÍNICA FARMACÊUTICA",
    items: [
      { href: "/", label: "Painel Clínico", icon: Activity },
      { href: "/indicadores", label: "Pacientes & Filiais", icon: Users },
      { href: "/saude", label: "Atendimento & Exames", icon: Stethoscope },
      { href: "/saude/medicamentos", label: "Guia Farmacêutico", icon: Syringe },
    ],
  },
  {
    label: "FIDELIZAÇÃO & SERVIÇOS",
    items: [
      { href: "/recompensas", label: "Gestão de Cupons", icon: Trophy },
      { href: "/historico", label: "Histórico de Atendimentos", icon: ListChecks },
      { href: "/exportar-dados", label: "Exportar Relatórios", icon: Download },
    ],
  },
  {
    label: "RELATÓRIOS & CONFIGURAÇÕES",
    items: [
      { href: "/desempenho", label: "Desempenho", icon: TrendingUp },
      { href: "/settings", label: "Configurações", icon: Settings },
    ],
  },
];

const MOBILE_NAV = [
  { href: "/", label: "Início", icon: Home },
  { href: "/saude", label: "Saúde", icon: Heart },
  { href: "/indicadores", label: "Indicação", icon: Briefcase },
  { href: "/jogos", label: "Jogos", icon: Gamepad2 },
  { href: "/mais", label: "Mais", icon: Menu },
];

const PHARMACIST_MOBILE_NAV = [
  { href: "/", label: "Início", icon: Home },
  { href: "/indicadores", label: "Indicação", icon: Briefcase },
  { href: "/saude", label: "Avaliar", icon: Stethoscope },
  { href: "/recompensas", label: "Cupons", icon: Trophy },
  { href: "/mais", label: "Mais", icon: Menu },
];

/**
 * Central de Notificações Pop-over / Drawer
 */
const NotificationDrawer: React.FC = () => {
  const {
    notifications,
    unreadCount,
    isDrawerOpen,
    setIsDrawerOpen,
    markAsRead,
    markAllAsRead,
    clearAll,
    hasPermission,
    requestPermission,
  } = useNotificationContext();
  const [, setLocation] = useLocation();

  if (!isDrawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex justify-end animate-in fade-in duration-200"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && setIsDrawerOpen(false)}
    >
      <div className="w-full max-w-sm bg-slate-900 border-l border-slate-700 text-white flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/90">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-400" />
            <span className="font-black text-sm">Central de Notificações</span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {unreadCount} nova(s)
              </span>
            )}
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Permissão nativa banner */}
        {!hasPermission && (
          <div className="p-3 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold text-amber-300">Ativar avisos no navegador?</p>
            <button
              onClick={requestPermission}
              className="text-[10px] font-black bg-amber-500 text-indigo-950 px-2.5 py-1 rounded-lg hover:bg-amber-400 transition-colors"
            >
              Ativar 🔔
            </button>
          </div>
        )}

        {/* Ações superiores */}
        <div className="px-4 py-2 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={markAllAsRead}
            className="font-bold text-emerald-400 hover:underline text-[11px]"
          >
            Marcar todas como lidas
          </button>
          <button
            onClick={clearAll}
            className="font-bold text-rose-400 hover:underline text-[11px]"
          >
            Limpar histórico
          </button>
        </div>

        {/* Lista de Notificações */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <Bell className="w-10 h-10 mx-auto opacity-30" />
              <p className="text-xs font-bold">Nenhuma notificação por aqui!</p>
              <p className="text-[11px] text-slate-500">
                Seus avisos de saúde e conquistas aparecerão nesta central.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  markAsRead(notif.id);
                  if (notif.actionUrl) {
                    setLocation(notif.actionUrl);
                    setIsDrawerOpen(false);
                  }
                }}
                className={`p-3 rounded-xl cursor-pointer transition-all flex items-start gap-3 ${
                  notif.read
                    ? "bg-slate-900/40 opacity-70"
                    : "bg-slate-800/90 border border-slate-700/60 shadow-sm"
                } hover:bg-slate-800`}
              >
                <span className="text-xl shrink-0">{notif.icon || "🔔"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-black text-white truncate">{notif.title}</h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] font-semibold text-slate-300 mt-0.5 leading-snug">
                    {notif.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Drawer / Popover de Escolha de Tema para Celular
 */
const MobileThemeDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center p-0 animate-in fade-in duration-200"
      style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-slate-900 border-t border-slate-700 text-white rounded-t-3xl p-4 flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎨</span>
            <h3 className="font-black text-sm text-white">Escolher Tema (Celular)</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5 my-3 max-h-[60vh] overflow-y-auto pr-1">
          {THEMES_LIST.map((opt) => {
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setTheme(opt.id);
                  onClose();
                }}
                className={`w-full p-3 rounded-2xl border-2 flex items-center justify-between text-left transition-all active:scale-95 ${
                  isSelected
                    ? "bg-purple-600/20 border-purple-500 ring-2 ring-purple-500/40"
                    : "bg-slate-800/80 border-slate-700 hover:border-slate-600"
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white">{opt.label}</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">{opt.desc}</p>
                  <p className="text-[9px] font-extrabold text-purple-400 mt-0.5">✨ {opt.patternName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center -space-x-1">
                    {opt.swatches.map((c, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full border border-slate-800 shadow-sm"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 text-xs font-black">
                      ✓
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [location] = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showThemeDrawer, setShowThemeDrawer] = useState(false);
  const {
    theme,
    statusBarBg,
    statusBarText,
    bottomNavBg,
    bottomNavText,
    bottomNavActiveBg,
    bottomNavActiveText,
    desktopSidebarBg,
    desktopSidebarBorder,
    desktopSidebarText,
    desktopHeaderBg,
    desktopHeaderBorder,
    desktopHeaderText,
    desktopMainBg,
    inputBg,
    inputBorder,
    inputText,
    inputPlaceholder,
    navItemActiveClass,
    bgStyle,
    isDark,
    isClassic,
  } = useTheme();
  const { currentUser, logout, switchDevRole } = useAuth();
  const { deviceType, isMobile, devViewMode, setDevViewMode } = useDevView();
  const { unreadCount, toggleDrawer } = useNotificationContext();

  const isPharm = currentUser?.role === "farmaceutico";
  const navSections = isPharm ? PHARMACIST_NAV_SECTIONS : NAV_SECTIONS;
  const mobileNav = isPharm ? PHARMACIST_MOBILE_NAV : MOBILE_NAV;

  // Padrão de cruzes médicas sutis para reforçar a estética de saúde sem alterar as cores de fundo
  const medicalCrossBgOverlay = (
    <div
      className="absolute inset-0 pointer-events-none opacity-40 z-0 select-none"
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='70' height='70' viewBox='0 0 70 70'><path d='M 30 16 h 10 v 14 h 14 v 10 h -14 v 14 h -10 v -14 h -14 v -10 h 14 z' fill='%2300b09b' fill-opacity='0.055'/></svg>")`,
        backgroundSize: "70px 70px",
      }}
    />
  );

  // Current page title from nav
  const currentNav = navSections.flatMap((s) => s.items).find(
    (n) => n.href === location || (n.href !== "/" && location.startsWith(n.href)),
  );
  const pageTitle = currentNav?.label ?? (isPharm && location === "/indicadores" ? "Pacientes" : "Visão Geral");
  const getRoleLabel = () => {
    if (!currentUser) return "Paciente";
    if (currentUser.isDev) return "Desenvolvedor";
    if (currentUser.role === "farmaceutico") return "Farmacêutico";
    return "Paciente";
  };

  // ════════════════════════════════════════════════════════════════════
  //  LAYOUT MOBILE — APK nativo / Formato de Celular (Smartphone Frame)
  // ════════════════════════════════════════════════════════════════════
  if (isMobile) {
    const phoneContent = (
      <div
        className={`flex-1 flex flex-col font-sans ${desktopMainBg} relative overflow-hidden`}
        style={{ ...bgStyle, WebkitTapHighlightColor: "transparent" }}
      >
        {medicalCrossBgOverlay}

        {/* Dynamic Island / Top notch on simulated phone */}
        <div className="w-full flex justify-center shrink-0 pt-2 pb-1 bg-inherit z-40 select-none">
          <div className="w-24 sm:w-28 h-4 sm:h-4.5 bg-slate-950 rounded-full flex items-center justify-between px-3 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-indigo-950" />
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
          </div>
        </div>

        {/* Status bar */}
        <div
          className={`${statusBarBg} shrink-0 px-4 pt-1 pb-1 flex items-center justify-between ${statusBarText} text-xs font-black select-none z-30`}
        >
          {currentUser ? (
            <div className="flex items-center gap-1">
              {currentUser.isDev ? (
                <span className="text-[10px]">⚙️</span>
              ) : currentUser.role === "farmaceutico" ? (
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
              ) : (
                <span className="text-[10px]">🦸</span>
              )}
              <span className="text-[10px] font-black truncate max-w-[80px]">
                {currentUser.nome}
              </span>
              {currentUser.isDev && (
                <span className="text-[8px] font-black bg-emerald-800 text-emerald-300 px-1 rounded">
                  DEV
                </span>
              )}
            </div>
          ) : (
            <span className="text-[10px]">09:41</span>
          )}

          <div className="flex items-center gap-2">
            {/* Theme switcher button mobile */}
            <button
              type="button"
              onClick={() => setShowThemeDrawer(true)}
              className="relative p-1 rounded-lg active:scale-95 transition-transform"
              title="Trocar Tema de Cores"
            >
              <Palette className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Bell button mobile */}
            <button
              onClick={toggleDrawer}
              className="relative p-1 rounded-lg active:scale-95 transition-transform"
            >
              <Bell className="w-4 h-4 stroke-[2.5]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[8px] font-black flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <Wifi className="w-3.5 h-3.5 stroke-[3]" />
            <Battery className="w-4 h-4 stroke-[3]" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-2 scrollbar-none z-10">{children}</div>

        {/* Bottom nav */}
        <div className={`shrink-0 px-4 pb-safe pt-2 z-40 backdrop-blur ${bottomNavBg}`}>
          <div className="flex items-center justify-around">
            {mobileNav.map((item) => {
              const Icon = item.icon;
              const isActive =
                location === item.href || (item.href !== "/" && location.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center justify-center gap-0.5 py-1 active:scale-95 transition-transform"
                >
                  <div
                    className={`${
                      isClassic ? "w-10 h-10 flex items-center justify-center" : "w-10 h-10 rounded-2xl flex items-center justify-center"
                    } transition-all ${
                      isActive ? bottomNavActiveBg : bottomNavText
                    }`}
                    style={isClassic && isActive ? { border: "2px solid #000", boxShadow: "2px 2px 0 #000" } : {}}
                  >
                    <Icon className="w-5 h-5 stroke-[2.5]" style={isClassic ? { imageRendering: "pixelated" } as React.CSSProperties : {}} />
                  </div>
                  <span
                    className={`${
                      isClassic ? "font-pixel" : "font-extrabold"
                    } text-[9px] ${
                      isActive ? bottomNavActiveText : bottomNavText
                    }`}
                    style={isClassic ? { fontSize: 7 } : {}}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Home indicator bar at bottom */}
          <div className="w-32 h-1 bg-slate-950/30 dark:bg-white/20 rounded-full mx-auto mt-2 mb-1" />
        </div>

        <VersionUpdateModal />
        <NotificationDrawer />
        <MobileThemeDrawer isOpen={showThemeDrawer} onClose={() => setShowThemeDrawer(false)} />
      </div>
    );

    return (
      <div className="fixed inset-0 bg-[#050b14] flex flex-col items-center justify-center overflow-y-auto p-2 sm:p-4 z-50">
        {/* Top Control Bar in Preview */}
        <div className="w-full max-w-[420px] flex items-center justify-between mb-2 text-xs font-black text-white px-2 select-none shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-black tracking-wider text-emerald-400 uppercase">
              FARMHERO APK MODELAÇÃO MÓVEL
            </span>
          </div>

          {currentUser?.isDev && (
            <div className="flex items-center gap-1.5">
              {/* Alternar perfil DEV: Paciente ⇄ Farmacêutico */}
              <button
                type="button"
                onClick={() =>
                  switchDevRole(
                    currentUser.role === "farmaceutico" ? "cliente" : "farmaceutico",
                  )
                }
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-emerald-400 border border-emerald-500/40 font-black text-[11px] shadow-sm transition-all"
                title="Alternar perfil DEV entre Paciente e Farmacêutico"
              >
                <span>
                  {currentUser.role === "farmaceutico"
                    ? "🩺 Farmacêutico"
                    : "🦸 Paciente"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setDevViewMode("desktop")}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-black text-xs shadow-md transition-all"
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>Ver no PC</span>
              </button>
            </div>
          )}
        </div>

        {/* Realistic Smartphone Mockup Frame */}
        <div className="relative w-full max-w-[390px] h-[820px] max-h-[92vh] rounded-[48px] bg-slate-950 p-[10px] shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_25px_rgba(0,176,155,0.2)] border-2 border-slate-700/60 ring-4 ring-slate-900 flex flex-col shrink-0">
          <div className="relative w-full h-full rounded-[38px] overflow-hidden flex flex-col bg-slate-900">
            {phoneContent}
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════
  //  LAYOUT DESKTOP — Dashboard FarmaHero
  // ════════════════════════════════════════════════════════════════════
  return (
    <div
      className={`fixed inset-0 w-full h-full min-h-screen flex font-sans overflow-hidden ${desktopMainBg}`}
      style={bgStyle}
    >
      {medicalCrossBgOverlay}
      {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
      <aside
        className={`w-[220px] shrink-0 flex flex-col border-r shadow-sm overflow-y-auto z-40 ${desktopSidebarBg} ${desktopSidebarBorder}`}
      >
        {/* Logo */}
        <div className={`px-5 py-5 flex items-center gap-2.5 border-b ${desktopSidebarBorder}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00b09b] to-[#1a7a4a] flex items-center justify-center shadow-md shrink-0">
            <span className="text-white font-black text-base leading-none">F</span>
          </div>
          <div>
            <div className={`font-black text-[15px] leading-tight ${desktopSidebarText}`}>
              FarmaHero
            </div>
            <div className="text-[10px] font-semibold text-[#00b09b] leading-tight">
              Cuidar, orientar e transformar.
            </div>
          </div>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 py-4 px-3 space-y-5">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className={`text-[10px] font-black tracking-widest px-2 mb-1.5 opacity-70 ${desktopSidebarText}`}>
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    location === item.href || (item.href !== "/" && location.startsWith(item.href));
                  return (
                    <Link
                      key={`${section.label}-${item.label}`}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all group ${
                        isActive
                          ? navItemActiveClass
                          : `${desktopSidebarText} opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10`
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}
                        style={{ width: 16, height: 16 }}
                      />
                      <span
                        className={`text-[13px] font-semibold truncate flex-1 ${isActive ? "font-black" : ""}`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar bottom promo banner */}
        <div className="m-3 rounded-2xl overflow-hidden bg-gradient-to-br from-[#00b09b] to-[#1a7a4a] p-4 text-white">
          <div className="flex items-end gap-2">
            <div className="text-4xl leading-none select-none">🦸</div>
            <div>
              <div className="font-black text-sm leading-tight">FarmaHero</div>
              <div className="text-[11px] font-semibold text-green-100 leading-snug mt-0.5">
                Sua missão é<br />
                transformar vidas!
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN AREA ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP BAR */}
        <header
          className={`shrink-0 flex items-center px-4 gap-4 z-30 border-b ${desktopHeaderBg} ${desktopHeaderBorder}`}
          style={isClassic ? { height: 32, background: "linear-gradient(to right, #000080, #1084d0)", borderBottom: "2px solid #000" } : { height: 64 }}
        >
          {isClassic ? (
            /* Win95 style title bar */
            <>
              <div className="flex items-center gap-2 flex-1">
                <span style={{ fontSize: 12 }}>🎮</span>
                <span className="font-pixel text-white" style={{ fontSize: 9 }}>FARMHERO — {pageTitle}</span>
              </div>
              {/* Search bar Win95 style */}
              <div className="relative" style={{ width: 200 }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-2 pr-2 py-0.5 text-black bg-white border border-black font-pixel"
                  style={{ fontSize: 8, height: 18, fontFamily: "'Press Start 2P', monospace" }}
                />
              </div>
              {/* Win95 window buttons */}
              <div className="flex items-center gap-0.5">
                <span className="pixel-title-btn">_</span>
                <span className="pixel-title-btn">□</span>
                <span className="pixel-title-btn">×</span>
              </div>
            </>
          ) : (
            <>
              {/* Page title */}
              <div className="shrink-0">
                <h1 className={`text-xl font-black leading-tight ${desktopHeaderText}`}>
                  {pageTitle}
                </h1>
                <p className={`text-xs font-medium leading-none mt-0.5 opacity-70 ${desktopHeaderText}`}>
                  {currentUser?.role === "farmaceutico"
                    ? "Visão geral da sua prática farmacêutica"
                    : "Acompanhe sua saúde e seus hábitos"}
                </p>
              </div>

              {/* Search bar */}
              <div className="flex-1 max-w-md mx-4">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60 ${desktopHeaderText}`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar (nome, CPF ou telefone)..."
                    className={`w-full pl-9 pr-4 py-2 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/30 ${inputBg} ${inputBorder} ${inputText} ${inputPlaceholder}`}
                  />
                </div>
              </div>
            </>
          )}

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-3">
            {/* Dev Mode Switcher (Exclusivo para Desenvolvedor) */}
            {currentUser?.isDev && (
              <div
                className={`flex items-center rounded-xl p-1 gap-1 text-xs font-black border-2 transition-all ${
                  isDark
                    ? "bg-slate-900 border-emerald-500/60 shadow-inner"
                    : "bg-emerald-50/80 border-emerald-400 shadow-sm"
                }`}
              >
                <div className="px-2 py-0.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1 border-r border-emerald-500/30">
                  <span>⚙️</span> DEV
                </div>

                {/* Alternância de Papel: Paciente vs Farmacêutico */}
                <button
                  type="button"
                  onClick={() => switchDevRole("cliente")}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all text-xs ${
                    currentUser.role !== "farmaceutico"
                      ? "bg-emerald-500 text-slate-950 shadow font-black"
                      : isDark
                        ? "text-slate-400 hover:text-white"
                        : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Atuar como Paciente"
                >
                  <span>🦸</span>
                  <span>Paciente</span>
                </button>
                <button
                  type="button"
                  onClick={() => switchDevRole("farmaceutico")}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all text-xs ${
                    currentUser.role === "farmaceutico"
                      ? "bg-emerald-500 text-slate-950 shadow font-black"
                      : isDark
                        ? "text-slate-400 hover:text-white"
                        : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Atuar como Farmacêutico"
                >
                  <span>🩺</span>
                  <span>Farmacêutico</span>
                </button>

                <div className="w-px h-5 bg-emerald-500/30 mx-0.5" />

                {/* Alternância de Visualização: Web (PC) vs Celular */}
                <button
                  type="button"
                  onClick={() => setDevViewMode("desktop")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all text-xs ${
                    devViewMode !== "mobile"
                      ? "bg-purple-600 text-white shadow font-black"
                      : isDark
                        ? "text-slate-400 hover:text-white"
                        : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Visualizar no modo Website (PC)"
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Web</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDevViewMode("mobile")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all text-xs ${
                    devViewMode === "mobile"
                      ? "bg-purple-600 text-white shadow font-black"
                      : isDark
                        ? "text-slate-400 hover:text-white"
                        : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Visualizar no modo Aplicativo (Mobile / Celular)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Celular</span>
                </button>
              </div>
            )}

            {/* Notifications Bell Button */}
            <button
              onClick={toggleDrawer}
              className={`relative w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                  : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Bell className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Divider */}
            <div className={`w-px h-8 ${isDark ? "bg-slate-800" : "bg-gray-200"}`} />

            {/* User profile */}
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`relative flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl transition-all ${
                isDark ? "hover:bg-slate-800" : "hover:bg-gray-50"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00b09b] to-[#1a7a4a] flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm">
                {currentUser?.nome?.charAt(0) ?? "U"}
              </div>
              <div className="text-left">
                <div
                  className={`text-sm font-black leading-tight ${isDark ? "text-white" : "text-gray-800"}`}
                >
                  {currentUser
                    ? `${currentUser.nome} ${currentUser.sobrenome ?? ""}`.trim()
                    : "Usuário"}
                </div>
                <div className="text-[11px] font-semibold text-[#00b09b] leading-none">
                  {getRoleLabel()}
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 shrink-0 ${isDark ? "text-slate-400" : "text-gray-400"}`}
              />

              {/* Dropdown */}
              {showUserMenu && (
                <div
                  className={`absolute right-0 top-full mt-2 w-44 rounded-xl border shadow-xl z-50 overflow-hidden ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "bg-white border-gray-100 text-gray-700"
                  }`}
                >
                  <Link
                    href="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className={`flex items-center gap-2.5 px-4 py-3 text-sm font-semibold transition-colors ${
                      isDark ? "hover:bg-slate-700" : "hover:bg-gray-50"
                    }`}
                  >
                    <Settings className="w-4 h-4 text-gray-400" /> Configurações
                  </Link>
                  <Link
                    href="/avatar"
                    onClick={() => setShowUserMenu(false)}
                    className={`flex items-center gap-2.5 px-4 py-3 text-sm font-semibold transition-colors ${
                      isDark ? "hover:bg-slate-700" : "hover:bg-gray-50"
                    }`}
                  >
                    <User className="w-4 h-4 text-gray-400" /> Meu Perfil
                  </Link>
                  <div className={`border-t ${isDark ? "border-slate-700" : "border-gray-100"}`} />
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sair
                  </button>
                </div>
              )}
            </button>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main
          className="flex-1 overflow-y-auto"
          onClick={() => showUserMenu && setShowUserMenu(false)}
        >
          <div className="p-6 min-h-full flex flex-col">{children}</div>
        </main>
      </div>

      <VersionUpdateModal />
      <NotificationDrawer />
    </div>
  );
};
