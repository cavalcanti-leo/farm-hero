import React, { useState, useRef } from "react";
import { Link } from "wouter";
import { useTheme, AppTheme } from "@/lib/theme-context";
import { useAppState } from "@/lib/app-state";
import {
  MoreHorizontal,
  User,
  Palette,
  ShieldCheck,
  History,
  Bell,
  Download,
  HelpCircle,
  ChevronRight,
  Sparkles,
  Info,
  Check,
  Camera,
  Sun,
  Moon,
  Trash2,
  AlertCircle,
  Droplets,
  Pill,
  Dumbbell,
  X,
} from "lucide-react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

const THEME_OPTIONS: { id: AppTheme; label: string; desc: string; icon: React.ReactNode; preview: string }[] = [
  {
    id: "classic",
    label: "Clássico",
    desc: "Estilo vibrante FarmHero com ciano, roxo e neo-brutalismo 3D.",
    icon: <Palette className="w-5 h-5" />,
    preview: "from-cyan-300 via-purple-300 to-indigo-400",
  },
  {
    id: "light",
    label: "Claro",
    desc: "Fundo branco e cores suaves para uso diurno limpo e agradável.",
    icon: <Sun className="w-5 h-5" />,
    preview: "from-white via-slate-100 to-purple-100",
  },
  {
    id: "dark",
    label: "Escuro",
    desc: "Modo noturno elegante em tons escuros para descansar a vista.",
    icon: <Moon className="w-5 h-5" />,
    preview: "from-slate-900 via-indigo-950 to-slate-800",
  },
];

export const MaisRoute: React.FC = () => {
  const { theme, setTheme, isDark, isLight } = useTheme();
  const { waterLogs, medications, activities } = useAppState();

  // Modals state
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Profile local state
  const [name, setName] = useState(() => localStorage.getItem("farmhero_name") || "");
  const [bio, setBio] = useState(() => localStorage.getItem("farmhero_bio") || "");
  const [email, setEmail] = useState(() => localStorage.getItem("farmhero_email") || "usuario@farmhero.app");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    () => localStorage.getItem("farmhero_avatar_url") || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Privacy states
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
    setActiveModal(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string);
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
      toast.success("Backup baixado!");
    } catch {
      toast.error("Erro ao exportar.");
    }
  };

  const handleResetData = () => {
    if (confirm("Tem certeza? Todo o progresso será perdido!")) {
      localStorage.removeItem("vita_hero_app_state_v1");
      window.location.reload();
    }
  };

  const pageBg = isDark
    ? "bg-slate-900 text-white"
    : isLight
    ? "bg-slate-50 text-slate-900"
    : "bg-gradient-to-b from-cyan-100 to-purple-50 text-slate-900";

  const cardBg = isDark
    ? "bg-slate-800 border-slate-700 text-white hover:border-slate-500 shadow-[3px_3px_0px_#0f172a]"
    : isLight
    ? "bg-white border-slate-200 text-slate-900 hover:border-purple-300 shadow-md"
    : "bg-white border-indigo-950 text-slate-900 hover:border-purple-600 shadow-[3px_3px_0px_#1e1b4b]";

  const textSub = isDark ? "text-slate-400" : isLight ? "text-slate-500" : "text-slate-500";

  const settingsButtons = [
    {
      id: "perfil",
      title: "Perfil do Usuário",
      desc: "Foto, nome, bio e dados pessoais",
      icon: <User className="w-5 h-5 text-purple-500" />,
      badge: null,
      bgIcon: "bg-purple-100 dark:bg-purple-950/40",
    },
    {
      id: "tema",
      title: "Aparência & Tema",
      desc: "Claro, Escuro e Clássico FarmHero",
      icon: <Palette className="w-5 h-5 text-amber-500" />,
      badge: "Trocar",
      bgIcon: "bg-amber-100 dark:bg-amber-950/40",
    },
    {
      id: "notificacoes",
      title: "Notificações Desejadas",
      desc: "Lembretes de água, remédios e missões",
      icon: <Bell className="w-5 h-5 text-rose-500" />,
      badge: null,
      bgIcon: "bg-rose-100 dark:bg-rose-950/40",
    },
    {
      id: "privacidade",
      title: "Privacidade & Segurança",
      desc: "Permissões de dados e proteção local",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      badge: null,
      bgIcon: "bg-emerald-100 dark:bg-emerald-950/40",
    },
    {
      id: "historico",
      title: "Histórico de Saúde",
      desc: "Resumo dos registros e hábitos",
      icon: <History className="w-5 h-5 text-cyan-500" />,
      badge: null,
      bgIcon: "bg-cyan-100 dark:bg-cyan-950/40",
    },
    {
      id: "dados",
      title: "Dados & Backup",
      desc: "Exportação em JSON e reset de dados",
      icon: <Download className="w-5 h-5 text-blue-500" />,
      badge: null,
      bgIcon: "bg-blue-100 dark:bg-blue-950/40",
    },
    {
      id: "sobre",
      title: "Ajuda & Sobre",
      desc: "Versão do app, termos e informações",
      icon: <Info className="w-5 h-5 text-indigo-500" />,
      badge: null,
      bgIcon: "bg-indigo-100 dark:bg-indigo-950/40",
    },
  ];

  return (
    <div className={`p-4 space-y-5 animate-in fade-in duration-200 min-h-full ${pageBg}`}>
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <MoreHorizontal className="w-7 h-7 text-purple-500" /> Central de Ajustes
          </h1>
          <p className={`text-xs font-bold ${textSub}`}>
            Gerencie seu perfil, temas, privacidade e preferências
          </p>
        </div>
      </div>

      {/* Hero Banner — Mudar Tema Instantâneo */}
      <div
        onClick={() => setActiveModal("tema")}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl border-4 border-indigo-950 p-4 text-white shadow-[4px_4px_0px_#1e1b4b] cursor-pointer hover:scale-[1.01] active:scale-[.98] transition-all flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span className="text-xs font-black uppercase tracking-wider bg-amber-400 text-indigo-950 px-2.5 py-0.5 rounded-full">
              Tema Atual: {theme.toUpperCase()}
            </span>
          </div>
          <h2 className="text-base font-black mt-1">Mudar Aparência & Tema</h2>
          <p className="text-[11px] font-bold text-purple-200">
            Alterne entre Claro, Escuro e Clássico instantaneamente!
          </p>
        </div>
        <ChevronRight className="w-6 h-6 stroke-[3] shrink-0" />
      </div>

      {/* Grid de Botões Únicos e Separados de Configuração */}
      <div className="space-y-2.5">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
          Opções de Configuração
        </p>

        {settingsButtons.map((btn) => (
          <button
            key={btn.id}
            type="button"
            onClick={() => setActiveModal(btn.id)}
            className={`w-full flex items-center justify-between p-3.5 rounded-3xl border-3 transition-all text-left active:scale-[.98] cursor-pointer ${cardBg}`}
          >
            <div className="flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-2xl border-2 border-indigo-950/20 flex items-center justify-center ${btn.bgIcon} shrink-0`}>
                {btn.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black">{btn.title}</h3>
                  {btn.badge && (
                    <span className="text-[9px] font-black px-2 py-0.5 bg-amber-400 text-indigo-950 rounded-full">
                      {btn.badge}
                    </span>
                  )}
                </div>
                <p className={`text-[10px] font-bold ${textSub}`}>{btn.desc}</p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 stroke-[2.5] ${textSub}`} />
          </button>
        ))}
      </div>

      {/* Link de atalho para página completa de Settings */}
      <div className="pt-2 text-center">
        <Link href="/settings">
          <button className="text-xs font-black text-purple-600 dark:text-purple-400 hover:underline">
            Ver todas as configurações em página cheia →
          </button>
        </Link>
      </div>

      {/* ===================== MODAL DE APARÊNCIA & TEMA ===================== */}
      <Dialog open={activeModal === "tema"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-indigo-950 dark:text-white flex items-center gap-2">
            <Palette className="w-6 h-6 text-amber-500" /> Aparência & Tema
          </DialogTitle>
          <DialogDescription className="text-xs font-bold text-slate-500">
            Escolha o visual do aplicativo FarmHero. A alteração é instantânea em todas as telas!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-4">
          {THEME_OPTIONS.map((opt) => {
            const active = theme === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setTheme(opt.id);
                  toast.success(`🎨 Tema alterado para ${opt.label}!`);
                }}
                className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all active:scale-[.98] ${
                  active
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-950/50 shadow-[2px_2px_0px_#7c3aed]"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-purple-300"
                }`}
              >
                <div
                  className={`w-12 h-10 rounded-xl bg-gradient-to-br ${opt.preview} border-2 ${
                    active ? "border-purple-500" : "border-slate-300"
                  } shrink-0`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={active ? "text-purple-600 font-bold" : "text-slate-800 dark:text-white"}>
                      {opt.icon}
                    </span>
                    <span className={`text-sm font-black ${active ? "text-purple-600 dark:text-purple-300" : "text-slate-800 dark:text-white"}`}>
                      {opt.label}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
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
      </Dialog>

      {/* ===================== MODAL DE PERFIL ===================== */}
      <Dialog open={activeModal === "perfil"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-indigo-950 dark:text-white flex items-center gap-2">
            <User className="w-6 h-6 text-purple-600" /> Meu Perfil
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 my-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-indigo-950 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 overflow-hidden flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-9 h-9 text-slate-400" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center shadow"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div>
              <p className="text-xs font-black">Alterar Foto</p>
              <p className="text-[10px] font-bold text-slate-500">Toque na câmera para carregar imagem</p>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black block">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className="w-full rounded-xl border-2 border-indigo-950 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black block">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Metas de saúde..."
              rows={2}
              className="w-full rounded-xl border-2 border-indigo-950 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-bold resize-none"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            className="w-full py-2.5 bg-purple-600 text-white font-black text-sm rounded-xl border-2 border-indigo-950 shadow-[2px_2px_0px_#1e1b4b]"
          >
            Salvar Perfil
          </button>
        </div>
      </Dialog>

      {/* ===================== MODAL DE NOTIFICAÇÕES ===================== */}
      <Dialog open={activeModal === "notificacoes"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-indigo-950 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-rose-500" /> Notificações Desejadas
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 my-4">
          {[
            { label: "💧 Lembretes de Água", desc: "Avisar horário de beber água", key: "notif_water" },
            { label: "💊 Alertas de Remédio", desc: "Avisar hora dos medicamentos", key: "notif_meds" },
            { label: "🎯 Missões Diárias", desc: "Lembrar missões pendentes", key: "notif_missions" },
          ].map((item) => {
            const stored = localStorage.getItem(item.key) !== "false";
            const [on, setOn] = useState(stored);
            return (
              <div key={item.key} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-xs font-black">{item.label}</p>
                  <p className="text-[10px] font-bold text-slate-500">{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !on;
                    setOn(next);
                    localStorage.setItem(item.key, String(next));
                  }}
                  className={`relative w-11 h-6 rounded-full border-2 transition-colors ${
                    on ? "bg-purple-600 border-purple-700" : "bg-slate-300 border-slate-400"
                  }`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
                </button>
              </div>
            );
          })}
        </div>
      </Dialog>

      {/* ===================== MODAL DE PRIVACIDADE ===================== */}
      <Dialog open={activeModal === "privacidade"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-indigo-950 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-500" /> Privacidade & Segurança
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 my-4 text-xs font-bold">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-300">
            🔒 Seus dados de saúde estão salvos com segurança diretamente no seu dispositivo.
          </div>
          <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200">
            <div>
              <p className="font-black">Ocultar Perfil no Ranking Público</p>
              <p className="text-[10px] text-slate-500">Exibir como Anônimo no Leaderboard</p>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !hideProfile;
                setHideProfile(next);
                localStorage.setItem("farmhero_hide_profile", String(next));
              }}
              className={`relative w-11 h-6 rounded-full border-2 transition-colors ${hideProfile ? "bg-purple-600 border-purple-700" : "bg-slate-300"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${hideProfile ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>
        </div>
      </Dialog>

      {/* ===================== MODAL DE HISTÓRICO ===================== */}
      <Dialog open={activeModal === "historico"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-indigo-950 dark:text-white flex items-center gap-2">
            <History className="w-6 h-6 text-cyan-500" /> Histórico de Registros
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 my-4 text-xs font-bold">
          <div className="flex justify-between p-2.5 bg-cyan-50 dark:bg-slate-800 rounded-xl">
            <span>💧 Registros de Água</span>
            <span className="font-black">{waterLogs.length} copo(s)</span>
          </div>
          <div className="flex justify-between p-2.5 bg-pink-50 dark:bg-slate-800 rounded-xl">
            <span>💊 Medicamentos Registrados</span>
            <span className="font-black">{medications.length} remédio(s)</span>
          </div>
          <div className="flex justify-between p-2.5 bg-amber-50 dark:bg-slate-800 rounded-xl">
            <span>🏋️ Sessões de Exercício</span>
            <span className="font-black">{activities.length} sessão(ões)</span>
          </div>
        </div>
      </Dialog>

      {/* ===================== MODAL DE DADOS ===================== */}
      <Dialog open={activeModal === "dados"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-indigo-950 dark:text-white flex items-center gap-2">
            <Download className="w-6 h-6 text-blue-500" /> Dados e Backup
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 my-4">
          <button
            onClick={handleExportData}
            className="w-full py-2.5 bg-emerald-600 text-white font-black text-xs rounded-xl border-2 border-indigo-950 shadow"
          >
            📥 Exportar Backup (JSON)
          </button>
          <button
            onClick={handleResetData}
            className="w-full py-2.5 bg-rose-600 text-white font-black text-xs rounded-xl border-2 border-indigo-950 shadow"
          >
            🗑️ Resetar Progresso
          </button>
        </div>
      </Dialog>

      {/* ===================== MODAL SOBRE ===================== */}
      <Dialog open={activeModal === "sobre"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-indigo-950 dark:text-white flex items-center gap-2">
            <Info className="w-6 h-6 text-indigo-500" /> Sobre o FarmHero
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 my-4 text-xs font-bold text-slate-600 dark:text-slate-300">
          <p>FarmHero v1.0.0 — Saúde Preventiva Gamificada.</p>
          <p>Desenvolvido com React 18, TypeScript e Tailwind CSS.</p>
        </div>
      </Dialog>
    </div>
  );
};
