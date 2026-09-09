import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTheme, AppTheme } from "@/lib/theme-context";
import { useAppState } from "@/lib/app-state";
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
  ChevronRight,
  Check,
  Info,
  HelpCircle,
  Eye,
  EyeOff,
  Droplets,
  Pill,
  Dumbbell,
} from "lucide-react";
import { toast } from "sonner";

const THEME_OPTIONS: { id: AppTheme; label: string; desc: string; icon: React.ReactNode; preview: string }[] = [
  {
    id: "classic",
    label: "Clássico",
    desc: "Visual vibrante FarmHero com ciano, roxo e estilo 3D neo-brutalista.",
    icon: <Palette className="w-5 h-5" />,
    preview: "from-cyan-300 via-purple-300 to-indigo-400",
  },
  {
    id: "light",
    label: "Claro",
    desc: "Cores suaves e fundo branco limpo para uso diurno confortável.",
    icon: <Sun className="w-5 h-5" />,
    preview: "from-white via-slate-100 to-purple-100",
  },
  {
    id: "dark",
    label: "Escuro",
    desc: "Modo noturno com tons escuros elegantes para descansar os olhos.",
    icon: <Moon className="w-5 h-5" />,
    preview: "from-slate-900 via-indigo-950 to-slate-800",
  },
];

export const SettingsRoute: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { waterLogs, medications, activities } = useAppState();

  // Selected tab from URL query params
  const [activeTab, setActiveTab] = useState<string>("todos");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
      const element = document.getElementById(`section-${tab}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  // Profile state
  const [name, setName] = useState(() => localStorage.getItem("farmhero_name") || "");
  const [bio, setBio] = useState(() => localStorage.getItem("farmhero_bio") || "");
  const [email, setEmail] = useState(() => localStorage.getItem("farmhero_email") || "usuario@farmhero.app");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    () => localStorage.getItem("farmhero_avatar_url") || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Privacy toggles
  const [hideProfile, setHideProfile] = useState(
    () => localStorage.getItem("farmhero_hide_profile") === "true"
  );
  const [dataAnalytics, setDataAnalytics] = useState(
    () => localStorage.getItem("farmhero_analytics") !== "false"
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
    };
    reader.readAsDataURL(file);
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
      toast.success("Backup baixado com sucesso!");
    } catch {
      toast.error("Erro ao exportar dados.");
    }
  };

  const handleResetData = () => {
    if (confirm("Tem certeza que deseja redefinir todo o progresso do aplicativo?")) {
      localStorage.removeItem("vita_hero_app_state_v1");
      window.location.reload();
    }
  };

  // Theme-aware styles
  const isDark = theme === "dark";
  const isLight = theme === "light";

  const pageBg = isDark
    ? "bg-slate-900 text-white"
    : isLight
    ? "bg-slate-50 text-slate-900"
    : "bg-gradient-to-b from-cyan-100 to-purple-50 text-slate-900";

  const cardBg = isDark
    ? "bg-slate-800 border-slate-700 text-white shadow-[3px_3px_0px_#0f172a]"
    : isLight
    ? "bg-white border-slate-200 text-slate-900 shadow-md"
    : "bg-white border-indigo-950 text-slate-900 shadow-[3px_3px_0px_#1e1b4b]";

  const inputCls = isDark
    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
    : isLight
    ? "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
    : "bg-slate-50 border-indigo-950 text-slate-900 placeholder-slate-400";

  const textSub = isDark ? "text-slate-400" : isLight ? "text-slate-500" : "text-slate-600";

  const sectionTitle = isDark
    ? "text-slate-400 uppercase tracking-widest text-[10px] font-black"
    : isLight
    ? "text-slate-400 uppercase tracking-widest text-[10px] font-black"
    : "text-indigo-400 uppercase tracking-widest text-[10px] font-black";

  const buttonPrimary = isDark
    ? "bg-purple-600 hover:bg-purple-700 text-white border-slate-700"
    : isLight
    ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-700"
    : "bg-purple-600 hover:bg-purple-700 text-white border-indigo-950 shadow-[2px_2px_0px_#1e1b4b]";

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
    <div className={`p-4 space-y-5 pb-10 min-h-full ${pageBg}`}>
      {/* Top Header */}
      <div className="flex items-center gap-3 pt-1">
        <Link href="/mais">
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
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-black shrink-0 transition-all border ${
              activeTab === t.id
                ? "bg-purple-600 text-white border-indigo-950 shadow-[1px_1px_0px_#1e1b4b]"
                : isDark
                ? "bg-slate-800 text-slate-400 border-slate-700"
                : "bg-white text-slate-600 border-slate-200"
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
                    <User className={`w-9 h-9 ${isDark ? "text-slate-400" : "text-slate-300"}`} />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center shadow"
                >
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black">Foto de Perfil</p>
                <p className={`text-[10px] font-bold ${textSub}`}>
                  Toque na câmera para carregar uma imagem
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <label className={`text-xs font-black block ${textSub}`}>Nome Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className={`w-full rounded-xl border-2 px-3 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-400 ${inputCls}`}
              />
            </div>

            <div className="space-y-1">
              <label className={`text-xs font-black block ${textSub}`}>E-mail de Contato</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className={`w-full rounded-xl border-2 px-3 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-400 ${inputCls}`}
              />
            </div>

            <div className="space-y-1">
              <label className={`text-xs font-black block ${textSub}`}>Biografia / Meta de Saúde</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Ex: Focado em beber 2L de água e manter exames em dia..."
                rows={2}
                className={`w-full rounded-xl border-2 px-3 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none ${inputCls}`}
              />
            </div>

            <button
              onClick={handleSaveProfile}
              className={`w-full py-2.5 font-black text-sm rounded-xl border-2 transition-all active:scale-[.98] ${buttonPrimary}`}
            >
              Salvar Dados do Perfil
            </button>
          </div>
        </div>
      )}

      {/* ── 2. APARÊNCIA & TEMA ── */}
      {shouldShow("tema") && (
        <div id="section-tema" className="space-y-2">
          <p className={sectionTitle}>🎨 Aparência & Tema</p>
          <div className={`rounded-3xl border-2 p-4 space-y-3 ${cardBg}`}>
            <p className={`text-[11px] font-bold ${textSub}`}>
              Alterne o tema do aplicativo. As cores dos botões, menus e fundos se adaptam automaticamente.
            </p>

            <div className="space-y-2.5">
              {THEME_OPTIONS.map((opt) => {
                const active = theme === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTheme(opt.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all active:scale-[.98] ${
                      active
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-950/40 shadow-[2px_2px_0px_#7c3aed]"
                        : isDark
                        ? "border-slate-600 bg-slate-700 hover:border-slate-500"
                        : "border-slate-200 bg-slate-50 hover:border-purple-200 hover:bg-purple-50"
                    }`}
                  >
                    <div
                      className={`w-12 h-9 rounded-xl bg-gradient-to-br ${opt.preview} border-2 ${
                        active ? "border-purple-400" : "border-slate-300"
                      } shrink-0`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={active ? "text-purple-500 font-bold" : isDark ? "text-white" : "text-slate-800"}>
                          {opt.icon}
                        </span>
                        <span className={`text-sm font-black ${active ? "text-purple-500" : isDark ? "text-white" : "text-slate-800"}`}>
                          {opt.label}
                        </span>
                      </div>
                      <p className={`text-[10px] font-bold leading-snug mt-0.5 ${textSub}`}>
                        {opt.desc}
                      </p>
                    </div>
                    {active && (
                      <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── 3. NOTIFICAÇÕES DESEJADAS ── */}
      {shouldShow("notificacoes") && (
        <div id="section-notificacoes" className="space-y-2">
          <p className={sectionTitle}>🔔 Notificações Desejadas</p>
          <div className={`rounded-3xl border-2 p-4 space-y-3 ${cardBg}`}>
            <p className={`text-[11px] font-bold ${textSub}`}>
              Escolha quais lembretes você deseja receber ao longo do dia:
            </p>
            {[
              { label: "💧 Lembretes de Água", desc: "Avisar no horário de beber água", key: "notif_water" },
              { label: "💊 Alertas de Medicamento", desc: "Lembretes pontuais de remédios", key: "notif_meds" },
              { label: "🎯 Missões Diárias", desc: "Alertas para concluir suas missões", key: "notif_missions" },
              { label: "🏆 Conquistas do Ranking", desc: "Avisar quando subir de tier ou ultrapassar ranks", key: "notif_ranking" },
            ].map((item) => {
              const stored = localStorage.getItem(item.key) !== "false";
              const [on, setOn] = useState(stored);
              return (
                <div key={item.key} className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-xs font-black">{item.label}</p>
                    <p className={`text-[10px] font-bold ${textSub}`}>{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !on;
                      setOn(next);
                      localStorage.setItem(item.key, String(next));
                      toast.success(`${item.label}: ${next ? "Ativado" : "Desativado"}`);
                    }}
                    className={`relative w-11 h-6 rounded-full border-2 transition-colors ${
                      on
                        ? "bg-purple-600 border-purple-700"
                        : isDark
                        ? "bg-slate-600 border-slate-500"
                        : "bg-slate-200 border-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                        on ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 4. PRIVACIDADE & SEGURANÇA ── */}
      {shouldShow("privacidade") && (
        <div id="section-privacidade" className="space-y-2">
          <p className={sectionTitle}>🛡️ Privacidade & Segurança</p>
          <div className={`rounded-3xl border-2 p-4 space-y-3 ${cardBg}`}>
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-xs font-black">Ocultar Perfil no Ranking público</p>
                <p className={`text-[10px] font-bold ${textSub}`}>Exibir seu nome como Anônimo</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = !hideProfile;
                  setHideProfile(next);
                  localStorage.setItem("farmhero_hide_profile", String(next));
                }}
                className={`relative w-11 h-6 rounded-full border-2 transition-colors ${
                  hideProfile ? "bg-purple-600 border-purple-700" : isDark ? "bg-slate-600 border-slate-500" : "bg-slate-200 border-slate-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                    hideProfile ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-xs font-black">Coleta Local de Métricas de Saúde</p>
                <p className={`text-[10px] font-bold ${textSub}`}>Guardar histórico estritamente no dispositivo</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = !dataAnalytics;
                  setDataAnalytics(next);
                  localStorage.setItem("farmhero_analytics", String(next));
                }}
                className={`relative w-11 h-6 rounded-full border-2 transition-colors ${
                  dataAnalytics ? "bg-purple-600 border-purple-700" : isDark ? "bg-slate-600 border-slate-500" : "bg-slate-200 border-slate-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                    dataAnalytics ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. HISTÓRICO DE SAÚDE ── */}
      {shouldShow("historico") && (
        <div id="section-historico" className="space-y-2">
          <p className={sectionTitle}>📜 Histórico de Saúde</p>
          <div className={`rounded-3xl border-2 p-4 space-y-2.5 ${cardBg}`}>
            <p className={`text-[11px] font-bold ${textSub}`}>
              Resumo dos seus registros mais recentes no FarmHero:
            </p>
            <div className="space-y-2 text-xs font-bold">
              <div className="flex items-center justify-between p-2.5 bg-cyan-50 dark:bg-slate-700/60 rounded-xl border border-cyan-200 dark:border-slate-600">
                <span className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-cyan-500" /> Copos de Água Registrados
                </span>
                <span className="font-black text-cyan-600 dark:text-cyan-300">{waterLogs.length} registros</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-pink-50 dark:bg-slate-700/60 rounded-xl border border-pink-200 dark:border-slate-600">
                <span className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-pink-500" /> Medicamentos Cadastrados
                </span>
                <span className="font-black text-pink-600 dark:text-pink-300">{medications.length} remédios</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-amber-50 dark:bg-slate-700/60 rounded-xl border border-amber-200 dark:border-slate-600">
                <span className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-amber-500" /> Sessões de Exercício
                </span>
                <span className="font-black text-amber-600 dark:text-amber-300">{activities.length} sessões</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. DADOS & BACKUP ── */}
      {shouldShow("dados") && (
        <div id="section-dados" className="space-y-2">
          <p className={sectionTitle}>💾 Dados & Backup Local</p>
          <div className={`rounded-3xl border-2 p-1.5 ${cardBg}`}>
            <button
              onClick={handleExportData}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center shrink-0">
                <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-black">Exportar Dados (JSON)</p>
                <p className={`text-[10px] font-bold ${textSub}`}>Baixar cópia de segurança completa</p>
              </div>
              <ChevronRight className={`w-4 h-4 ${textSub}`} />
            </button>

            <div className={`mx-4 h-px ${isDark ? "bg-slate-700" : "bg-slate-100"}`} />

            <button
              onClick={handleResetData}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-black text-rose-600 dark:text-rose-400">Resetar Progresso</p>
                <p className={`text-[10px] font-bold ${textSub}`}>Zerar XP, moedas e histórico do app</p>
              </div>
              <ChevronRight className="w-4 h-4 text-rose-400" />
            </button>
          </div>
        </div>
      )}

      {/* ── 7. AJUDA & SOBRE ── */}
      {shouldShow("sobre") && (
        <div id="section-sobre" className="space-y-2">
          <p className={sectionTitle}>ℹ️ Sobre & Informações</p>
          <div className={`rounded-3xl border-2 p-4 space-y-2 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black">FarmHero App</span>
              <span className="text-[10px] font-black bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                v1.0.0 Stable
              </span>
            </div>
            <p className={`text-[11px] font-bold ${textSub}`}>
              Plataforma de saúde preventiva gamificada com acompanhamento de hábitos e suporte farmacêutico.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
