import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAppState } from "@/lib/app-state";
import { useTheme } from "@/lib/theme-context";
import {
  Home,
  User,
  Heart,
  Gamepad2,
  Menu,
  Wifi,
  Battery,
  Maximize2,
  Minimize2,
  Sparkles
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [location] = useLocation();
  const [fullWidthMode, setFullWidthMode] = useState(false);
  const { theme } = useTheme();

  const isDark = theme === "dark";
  const isLight = theme === "light";

  // Shell background colors per theme
  const shellBg = isDark
    ? "bg-slate-900"
    : isLight
    ? "bg-white"
    : "bg-gradient-to-b from-cyan-300 via-cyan-200 to-purple-50";

  const statusBarBg = isDark ? "bg-slate-800" : isLight ? "bg-slate-100" : "bg-cyan-400";
  const statusBarText = isDark ? "text-white" : isLight ? "text-slate-700" : "text-indigo-950";

  const mainNavItems = [
    { href: "/", label: "Início", icon: Home },
    { href: "/avatar", label: "Avatar", icon: User },
    { href: "/saude", label: "Saúde", icon: Heart },
    { href: "/jogos", label: "Jogos", icon: Gamepad2 },
    { href: "/mais", label: "Mais", icon: Menu },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-0 sm:p-4 font-sans text-slate-900">
      {/* Top Desktop Controls */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md mb-2 px-2 text-slate-400 text-xs font-bold">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-semibold uppercase tracking-wider">FarmHero APK Modelação Móvel</span>
        </div>
        <button
          onClick={() => setFullWidthMode(!fullWidthMode)}
          className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-300 hover:text-white hover:border-slate-700 transition-all"
        >
          {fullWidthMode ? (
            <>
              <Minimize2 className="w-3.5 h-3.5" /> Modo APK Celular
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5" /> Tela Cheia
            </>
          )}
        </button>
      </div>

      {/* Main Smartphone Shell Container */}
      <div
        className={`relative w-full transition-all duration-300 bg-cyan-300 ${
          fullWidthMode
            ? "max-w-4xl rounded-none sm:rounded-3xl border-0 sm:border-4 border-indigo-950 shadow-2xl min-h-screen"
            : "max-w-[430px] rounded-none sm:rounded-[48px] border-0 sm:border-[8px] border-indigo-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] h-[912px]"
        } flex flex-col overflow-hidden`}
      >
        {/* Smartphone Top Notch & Status Bar */}
        <div className={`${statusBarBg} shrink-0 px-6 pt-3 pb-1 flex items-center justify-between ${statusBarText} text-xs font-black select-none z-30`}>
          <span>09:41</span>
          {/* Dynamic Island / Notch */}
          <div className="w-24 h-4 bg-indigo-950 rounded-full mx-auto hidden sm:block shadow-inner" />
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 stroke-[3]" />
            <Battery className="w-4 h-4 stroke-[3]" />
          </div>
        </div>

        {/* Scrollable APK Screen Body */}
        <div className={`flex-1 overflow-y-auto ${shellBg} pb-28 text-slate-900 scrollbar-none`}>
          {children}
        </div>

        {/* APK Bottom Navigation Bar */}
        <div className="absolute bottom-4 left-4 right-4 z-40">
          <div
            className={`rounded-3xl border-4 p-2 flex items-center justify-around transition-all ${
              isDark
                ? "bg-slate-800 border-slate-700 shadow-[0_6px_0px_#0f172a]"
                : isLight
                ? "bg-white border-slate-200 shadow-lg"
                : "bg-white border-indigo-950 shadow-[0_6px_0px_#1e1b4b]"
            }`}
          >
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location === item.href ||
                (item.href !== "/" && location.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center justify-center gap-0.5 group transition-transform active:scale-95"
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white border-2 border-indigo-950 shadow-[2px_2px_0px_#1e1b4b]"
                        : isDark
                        ? "text-slate-400 hover:text-white hover:bg-slate-700"
                        : "text-slate-500 hover:text-purple-600 hover:bg-purple-50"
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <span
                    className={`text-[11px] font-extrabold tracking-tight ${
                      isActive
                        ? "text-purple-500"
                        : isDark
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
