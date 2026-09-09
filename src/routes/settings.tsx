import React, { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { useTheme, AppTheme } from "@/lib/theme-context";
import { THEMES_LIST } from "@/lib/themes";
import { useAppState } from "@/lib/app-state";
import {
  requestBrowserNotificationPermission,
  addAppNotification,
  useNotifications,
  NOTIFICATION_CONFIG_OPTIONS,
  isNotificationTypeEnabled,
  setNotificationTypeEnabled,
  NotificationConfigOption,
} from "@/lib/notifications";
import {
  ChevronLeft,
  User,
  Camera,
  Sun,
  Moon,
  Palette,
  Bell,
  Lock,
  ShieldCheck,
  History,
  Download,
  Trash2,
  Check,
  Info,
  Droplets,
  Pill,
  Dumbbell,
  Sparkles,
  Zap,
  TestTube,
  Clock,
  Target,
  Trophy,
  Smile,
  Activity,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

export const SettingsRoute: React.FC = () => {
  const {
    theme,
    setTheme,
    pageBgClass,
    cardBgClass,
    cardBorderClass,
    textPrimaryClass,
    textSecondaryClass,
    inputBg,
    inputBorder,
    inputText,
    inputPlaceholder,
    bgStyle,
    isDark,
  } = useTheme();
  const { waterLogs, medications, activities } = useAppState();
  const { addAppNotification: triggerNotif } = useNotifications();

  // Selected tab state
  const [activeTab, setActiveTab] = useState<string>("todos");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, []);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId !== "todos") {
      setTimeout(() => {
        const el = document.getElementById(`section-${tabId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    }
  };

  // Profile state
  const [name, setName] = useState(() => localStorage.getItem("farmhero_name") || "");
  const [bio, setBio] = useState(() => localStorage.getItem("farmhero_bio") || "");
  const [email, setEmail] = useState(
    () => localStorage.getItem("farmhero_email") || "usuario@farmhero.app",
  );
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    () => localStorage.getItem("farmhero_avatar_url") || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notifications state driven by NOTIFICATION_CONFIG_OPTIONS
  const [notifSettings, setNotifSettings] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    NOTIFICATION_CONFIG_OPTIONS.forEach((opt) => {
      const stored = localStorage.getItem(opt.storageKey);
      initial[opt.storageKey] = stored === null ? opt.defaultEnabled : stored === "true";
    });
    return initial;
  });

  const handleToggleSetting = (storageKey: string, val: boolean) => {
    setNotifSettings((prev) => ({ ...prev, [storageKey]: val }));
    setNotificationTypeEnabled(storageKey, val);
    if (storageKey === "notif_daily_reminder" && val) {
      localStorage.removeItem("farmhero_last_daily_reminder_date");
    }
    toast.success("Preferência de notificação salva!");
  };

  const handleEnableAllNotifs = () => {
    const next: Record<string, boolean> = {};
    NOTIFICATION_CONFIG_OPTIONS.forEach((opt) => {
      next[opt.storageKey] = true;
      setNotificationTypeEnabled(opt.storageKey, true);
    });
    setNotifSettings(next);
    toast.success("Todas as notificações foram ativadas!");
  };

  const handleDisableAllNotifs = () => {
    const next: Record<string, boolean> = {};
    NOTIFICATION_CONFIG_OPTIONS.forEach((opt) => {
      next[opt.storageKey] = false;
      setNotificationTypeEnabled(opt.storageKey, false);
    });
    setNotifSettings(next);
    toast.success("Todas as notificações foram desativadas!");
  };

  // Privacy toggles
  const [hideProfile, setHideProfile] = useState(
    () => localStorage.getItem("farmhero_hide_profile") === "true",
  );
  const [dataAnalytics, setDataAnalytics] = useState(
    () => localStorage.getItem("farmhero_analytics") !== "false",
  );

  const handleSaveProfile = () => {
    localStorage.setItem("farmhero_name", name);
    localStorage.setItem("farmhero_bio", bio);
    localStorage.setItem("farmhero_email", email);
    if (avatarPreview) localStorage.setItem("farmhero_avatar_url", avatarPreview);
    toast.success("✅ Perfil atualizado com sucesso!");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setAvatarPreview(result);
      localStorage.setItem("farmhero_avatar_url", result);
      toast.success("Foto de perfil carregada!");
    };
    reader.readAsDataURL(file);
  };

  const handleRequestBrowserNotifs = async () => {
    const granted = await requestBrowserNotificationPermission();
    if (granted) {
      toast.success("🔔 Notificações do navegador ativadas!");
    } else {
      toast.error("Permissão de notificação negada ou não suportada no navegador.");
    }
  };

  const handleTestNotification = () => {
    // Envia um teste para o primeiro tipo que estiver ativado
    const activeOpt = NOTIFICATION_CONFIG_OPTIONS.find((opt) => notifSettings[opt.storageKey]);
    if (!activeOpt) {
      toast.warning("Todas as notificações estão desativadas. Ative pelo menos uma para testar!");
      return;
    }

    const testNotif = triggerNotif({
      type: activeOpt.type,
      title: `${activeOpt.icon} Teste: ${activeOpt.label}`,
      message: `Esta é uma notificação de teste confirmando que a categoria "${activeOpt.label}" está ativa e configurada corretamente!`,
      actionUrl: "/settings?tab=notificacoes",
      icon: activeOpt.icon,
    });

    if (testNotif) {
      toast.success(`Notificação de teste enviada (${activeOpt.label})!`);
    }
  };

  const handleExportData = () => {
    try {
      const data = localStorage.getItem("vita_hero_app_state_v1");
      if (!data) {
        toast.error("Nenhum dado encontrado.");
        return;
      }
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `farmhero_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      toast.success("Backup de dados exportado com sucesso!");
    } catch {
      toast.error("Erro ao exportar dados.");
    }
  };

  const handleResetData = () => {
    if (confirm("⚠️ Tem certeza que deseja redefinir todo o progresso do aplicativo?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Theme-aware styles from central theme context
  const cardBg = `${cardBgClass} ${cardBorderClass}`;
  const inputCls = `${inputBg} ${inputBorder} ${inputText} ${inputPlaceholder}`;
  const textSub = textSecondaryClass;
  const sectionTitle = `uppercase tracking-widest text-[11px] font-black ${textPrimaryClass} opacity-80`;

  const filterTabs = [
    { id: "todos", label: "Todos" },
    { id: "perfil", label: "Perfil" },
    { id: "tema", label: "Tema" },
    { id: "notificacoes", label: "Notificações" },
    { id: "privacidade", label: "Privacidade" },
    { id: "historico", label: "Histórico" },
    { id: "dados", label: "Dados" },
  ];

  const shouldShow = (id: string) => activeTab === "todos" || activeTab === id;

  return (
    <div className={`p-4 space-y-5 pb-10 min-h-full ${pageBgClass}`} style={bgStyle}>
      {/* Top Header */}
      <div className="flex items-center gap-3 pt-1">
        <Link href="/">
          <button
            className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center active:scale-95 transition-transform ${
              isDark
                ? "border-slate-600 bg-slate-700 text-white"
                : "border-indigo-950 bg-white text-indigo-950 shadow-[2px_2px_0px_#1e1b4b]"
            }`}
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-black">Configurações</h1>
          <p className={`text-xs font-bold ${textSub}`}>Personalize sua experiência</p>
        </div>
      </div>

      {/* Filter Tabs horizontal scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filterTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTabClick(t.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black shrink-0 transition-all border ${
              activeTab === t.id
                ? "bg-purple-600 text-white border-indigo-950 shadow-[2px_2px_0px_#1e1b4b]"
                : isDark
                  ? "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-gray-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── 1. PERFIL DO USUÁRIO ── */}
      {shouldShow("perfil") && (
        <div id="section-perfil" className="space-y-2">
          <p className={sectionTitle}>👤 Perfil do Usuário</p>
          <div className={`rounded-3xl border-2 p-4 space-y-4 ${cardBg}`}>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className={`w-20 h-20 rounded-full border-4 overflow-hidden flex items-center justify-center ${
                    isDark ? "border-slate-600 bg-slate-700" : "border-indigo-950 bg-slate-100"
                  }`}
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-slate-400" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-purple-600 text-white border-2 border-white flex items-center justify-center shadow hover:bg-purple-700 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-black">{name || "Usuário FarmHero"}</p>
                <p className={`text-xs font-semibold ${textSub}`}>{email}</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-black text-purple-500 hover:underline"
                >
                  Alterar foto de perfil
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-black block">Nome de Exibição</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome ou apelido de Herói"
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold border ${inputCls}`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black block">E-mail de Contato</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold border ${inputCls}`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black block">Bio / Lema de Saúde</label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Ex: Focado em beber 2L de água todo dia! 🚀"
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold border ${inputCls}`}
                />
              </div>

              <button
                type="button"
                onClick={handleSaveProfile}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl border-2 border-indigo-950 shadow-sm active:scale-95 transition-all"
              >
                Salvar Alterações de Perfil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. SELEÇÃO DE TEMA ── */}
      {shouldShow("tema") && (
        <div id="section-tema" className="space-y-2">
          <p className={sectionTitle}>🎨 Aparência & Tema</p>
          <div className={`rounded-3xl border-2 p-4 space-y-3 ${cardBg}`}>
            <p className={`text-xs font-bold ${textSub}`}>
              Escolha a paleta de cores que melhor combina com você.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {THEMES_LIST.map((opt) => {
                const isSelected = theme === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setTheme(opt.id);
                      toast.success(`Tema ${opt.label} ativado!`);
                    }}
                    className={`w-full p-3.5 rounded-2xl border-2 flex flex-col justify-between text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? "bg-purple-500/10 border-purple-500 ring-2 ring-purple-500/50 shadow-md"
                        : isDark
                          ? "bg-slate-800/80 border-slate-700 hover:border-slate-500"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 w-full">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                            isSelected
                              ? "bg-purple-600 text-white"
                              : isDark
                                ? "bg-slate-700 text-slate-300"
                                : "bg-white text-slate-700 border border-slate-200"
                          }`}
                        >
                          🎨
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-black leading-tight">{opt.label}</p>
                          </div>
                          <p className={`text-[10px] font-semibold ${textSub} leading-snug mt-0.5`}>
                            {opt.desc}
                          </p>
                          <span className="inline-block text-[9px] font-extrabold text-purple-500 dark:text-purple-300 mt-1 bg-purple-500/10 px-2 py-0.5 rounded-md">
                            ✨ Fundo: {opt.patternName}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                    </div>

                    {/* Color Swatches Palette Preview Pill */}
                    <div className="mt-3 pt-2.5 border-t border-gray-200/20 flex items-center justify-between">
                      <span className="text-[10px] font-bold opacity-70">Paleta de cores:</span>
                      <div className="flex items-center -space-x-1.5 overflow-hidden p-0.5">
                        {opt.swatches.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── 3. NOTIFICAÇÕES REAIS E CONFIGURÁVEIS ── */}
      {shouldShow("notificacoes") && (
        <div id="section-notificacoes" className="space-y-3">
          <div className="flex items-center justify-between">
            <p className={sectionTitle}>🔔 Central de Notificações</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleEnableAllNotifs}
                className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Ativar Todas
              </button>
              <span className="text-slate-400 text-xs">•</span>
              <button
                type="button"
                onClick={handleDisableAllNotifs}
                className="text-[10px] font-black text-rose-500 hover:underline"
              >
                Desativar Todas
              </button>
            </div>
          </div>

          <div className={`rounded-3xl border-2 p-4 space-y-4 ${cardBg}`}>
            {/* Permissões do Navegador */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <p className="text-xs font-black">Notificações Nativas do Navegador</p>
                </div>
                <p className={`text-[10px] font-semibold ${textSub}`}>
                  Receba alertas diretamente no sistema operacional mesmo com a aba fechada.
                </p>
              </div>
              <button
                type="button"
                onClick={handleRequestBrowserNotifs}
                className="shrink-0 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl border border-indigo-950 shadow-sm transition-all"
              >
                Ativar 🔔
              </button>
            </div>

            {/* Lista das 10 Categorias de Notificação */}
            <div className="divide-y divide-gray-200/20 space-y-3 pt-1">
              {NOTIFICATION_CONFIG_OPTIONS.map((opt, idx) => {
                const isEnabled = notifSettings[opt.storageKey] ?? opt.defaultEnabled;

                return (
                  <div key={opt.id} className={`pt-3 first:pt-0 ${idx > 0 ? "pt-3" : ""}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <span className="text-xl shrink-0 mt-0.5">{opt.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-xs font-black truncate">{opt.label}</p>
                            {!opt.defaultEnabled && (
                              <span className="text-[9px] font-black px-1.5 py-0.2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full">
                                Opcional
                              </span>
                            )}
                            {opt.id === "daily_reminder" && (
                              <span className="text-[9px] font-black px-1.5 py-0.2 bg-emerald-500 text-white rounded-full">
                                1x ao dia
                              </span>
                            )}
                          </div>
                          <p className={`text-[10px] font-semibold ${textSub} leading-snug mt-0.5`}>
                            {opt.description}
                          </p>
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={(e) => handleToggleSetting(opt.storageKey, e.target.checked)}
                        className="w-4 h-4 accent-purple-600 rounded cursor-pointer shrink-0"
                      />
                    </div>

                    {opt.id === "daily_reminder" && isEnabled && (
                      <div
                        className={`mt-2 p-2.5 rounded-xl text-[10px] font-semibold leading-relaxed ${
                          isDark
                            ? "bg-emerald-900/20 border border-emerald-800/40 text-emerald-300"
                            : "bg-emerald-50 border border-emerald-200 text-emerald-700"
                        }`}
                      >
                        ✅ Ativado! Seu resumo de saúde será gerado com dados reais no máximo uma vez ao dia, sem repetições contínuas.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Testar Notificação */}
            <div className="pt-2 border-t border-gray-200/20 space-y-2">
              <button
                type="button"
                onClick={handleTestNotification}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-white font-black text-xs rounded-xl border border-slate-300 dark:border-slate-600 flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
              >
                <TestTube className="w-4 h-4 text-purple-500" /> Testar Notificação Ativa Agora
              </button>
              <p className="text-[10px] font-semibold text-center text-slate-400">
                Apenas as categorias marcadas com checkbox ativo receberão alertas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. PRIVACIDADE ── */}
      {shouldShow("privacidade") && (
        <div id="section-privacidade" className="space-y-2">
          <p className={sectionTitle}>🔒 Privacidade & Segurança</p>
          <div className={`rounded-3xl border-2 p-4 space-y-3 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black">Ocultar Perfil do Ranking Público</p>
                <p className={`text-[10px] font-semibold ${textSub}`}>
                  Não exibir seu nome publicamente nos líderes
                </p>
              </div>
              <input
                type="checkbox"
                checked={hideProfile}
                onChange={(e) => {
                  setHideProfile(e.target.checked);
                  localStorage.setItem("farmhero_hide_profile", String(e.target.checked));
                  toast.success("Privacidade atualizada!");
                }}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200/20">
              <div>
                <p className="text-xs font-black">Telemetria e Melhorias</p>
                <p className={`text-[10px] font-semibold ${textSub}`}>
                  Permitir dados de uso anônimos para o FarmHero
                </p>
              </div>
              <input
                type="checkbox"
                checked={dataAnalytics}
                onChange={(e) => {
                  setDataAnalytics(e.target.checked);
                  localStorage.setItem("farmhero_analytics", String(e.target.checked));
                  toast.success("Preferência de dados atualizada!");
                }}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 5. HISTÓRICO DE SAÚDE ── */}
      {shouldShow("historico") && (
        <div id="section-historico" className="space-y-2">
          <p className={sectionTitle}>📜 Histórico Registrado</p>
          <div className={`rounded-3xl border-2 p-4 space-y-3 ${cardBg}`}>
            <p className={`text-xs font-bold ${textSub}`}>
              Resumo dos hábitos e dados salvos neste dispositivo:
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-cyan-50 dark:bg-slate-700 border border-cyan-200 dark:border-slate-600">
                <span className="text-base font-black text-cyan-700 dark:text-cyan-300">
                  {waterLogs.length}
                </span>
                <p className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400">
                  Água
                </p>
              </div>
              <div className="p-2.5 rounded-2xl bg-pink-50 dark:bg-slate-700 border border-pink-200 dark:border-slate-600">
                <span className="text-base font-black text-pink-700 dark:text-pink-300">
                  {medications.length}
                </span>
                <p className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400">
                  Remédios
                </p>
              </div>
              <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-slate-700 border border-amber-200 dark:border-slate-600">
                <span className="text-base font-black text-amber-700 dark:text-amber-300">
                  {activities.length}
                </span>
                <p className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400">
                  Treinos
                </p>
              </div>
            </div>
            <Link href="/historico">
              <button
                type="button"
                className="w-full py-2 bg-purple-600 text-white font-black text-xs rounded-xl border border-indigo-950 shadow-sm"
              >
                Abrir Histórico Completo ➔
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* ── 6. DADOS E BACKUP ── */}
      {shouldShow("dados") && (
        <div id="section-dados" className="space-y-2">
          <p className={sectionTitle}>💾 Gerenciamento de Dados</p>
          <div className={`rounded-3xl border-2 p-4 space-y-3 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black">Fazer Backup de Dados</p>
                <p className={`text-[10px] font-semibold ${textSub}`}>
                  Baixar arquivo JSON com seu progresso
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportData}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white font-black text-xs rounded-xl border border-green-800 shadow-sm flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Baixar
              </button>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200/20">
              <div>
                <p className="text-xs font-black text-rose-500">Resetar Todo o Progresso</p>
                <p className={`text-[10px] font-semibold ${textSub}`}>
                  Apaga todos os dados salvos localmente
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetData}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl border border-rose-800 shadow-sm flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Resetar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
