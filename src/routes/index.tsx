import React, { useState, type FC } from "react";
import { Link } from "wouter";
import { useAppState } from "@/lib/app-state";
import { useTheme } from "@/lib/theme-context";
import { useNotificationContext } from "@/lib/notification-context";
import { useDailyMissions } from "@/hooks/use-daily-missions";
import { useIsMobile } from "@/hooks/use-mobile";
import avatarHeroImg from "@/assets/avatar-hero.png";
import backyardImg from "@/assets/backyard.png";
import { PixelHeroSprite, getEmotionFromHealth } from "@/components/PixelHeroSprite";
import { PixelAvatar32, PixelEmotionType } from "@/components/PixelAvatar32";
import { CustomAvatar } from "@/components/CustomAvatar";
import {
  AlertCircle,
  Bell,
  Target,
  Trophy,
  ShoppingBag,
  Star,
  Pill,
  Droplets,
  Dumbbell,
  Utensils,
  ChevronRight,
  Sparkles,
  X,
  Info,
  Zap,
  Heart,
  Stethoscope,
  Building,
  Users,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getExamRequests } from "@/lib/database";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const TIER_DATA = [
  {
    name: "Madeira",
    emoji: "🪵",
    minLevel: 0,
    maxLevel: 8,
    bonus: 2.5,
    color: "bg-amber-100 border-amber-400 text-amber-900",
    xpNeeded: "0–800 XP total",
    desc: "Iniciante da saúde. Cada hábito vale muito aqui!",
  },
  {
    name: "Prata",
    emoji: "🥈",
    minLevel: 9,
    maxLevel: 15,
    bonus: 5,
    color: "bg-slate-100 border-slate-400 text-slate-800",
    xpNeeded: "800–2.500 XP total",
    desc: "Você está evoluindo! Hábitos mais consistentes.",
  },
  {
    name: "Ouro",
    emoji: "🥇",
    minLevel: 16,
    maxLevel: 25,
    bonus: 10,
    color: "bg-yellow-100 border-yellow-400 text-yellow-900",
    xpNeeded: "2.500–5.000 XP total",
    desc: "Herói dedicado. Rotina sólida de saúde!",
  },
  {
    name: "Platina",
    emoji: "💎",
    minLevel: 26,
    maxLevel: 35,
    bonus: 15,
    color: "bg-cyan-100 border-cyan-400 text-cyan-900",
    xpNeeded: "5.000–9.000 XP total",
    desc: "Mestre da prevenção. Referência em qualidade de vida.",
  },
  {
    name: "Diamante",
    emoji: "👑",
    minLevel: 36,
    maxLevel: 999,
    bonus: 20,
    color: "bg-purple-100 border-purple-400 text-purple-900",
    xpNeeded: "9.000+ XP total",
    desc: "Lendário! Você atingiu o ápice dos hábitos saudáveis.",
  },
];

const LEVEL_XP = [100, 150, 200, 250, 300, 400, 500, 600, 750, 900];

function getTierForLevel(level: number) {
  return TIER_DATA.find((t) => level >= t.minLevel && level <= t.maxLevel) ?? TIER_DATA[0];
}

export const Home: FC = () => {
  const {
    level,
    xp,
    maxXp,
    coins,
    medications,
    waterLogs,
    activities,
    gainXpAndCoins,
    pharmacistActive,
    setPharmacistActive,
    items,
    equippedHat,
    equippedOutfit,
    equippedPet,
    equippedBackground,
    pixelAvatarConfig,
    customAvatarConfig,
    femaleLog,
    moodLogs,
  } = useAppState();

  const { currentUser } = useAuth();
  const isMobile = useIsMobile();

  const hatItem = items.find((i) => i.id === equippedHat);
  const petItem = items.find((i) => i.id === equippedPet);
  const bgItem = items.find((i) => i.id === equippedBackground);

  const {
    pageBgClass,
    cardBgClass,
    cardBorderClass,
    buttonClass,
    textPrimaryClass,
    textSecondaryClass,
    bgStyle,
    isClassic,
  } = useTheme();

  const lucasXp = Math.round(maxXp * 0.8);
  const isTop1 = xp > lucasXp;
  const currentTier = getTierForLevel(level);

  const { toggleDrawer, unreadCount } = useNotificationContext();
  const [showMissionsModal, setShowMissionsModal] = useState(false);
  const [showRankingInfoModal, setShowRankingInfoModal] = useState(false);
  const [showPharmacistModal, setShowPharmacistModal] = useState(false);
  const [pharmacistUsername, setPharmacistUsername] = useState("");
  const [pharmacistPending, setPharmacistPending] = useState(false);

  const {
    todaysMissions,
    claimedIds,
    claimReward,
    claimedCount,
    totalCount,
    progressPct,
    appState,
  } = useDailyMissions();

  const totalWaterCopos = Math.round(waterLogs.reduce((acc, curr) => acc + curr.amountMl, 0) / 250);
  const medsTomados = medications.filter((m) => m.taken).length;
  const totalMeds = medications.length || 3;
  const minsAtividade = activities.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  // ════════════════════════════════════════════════════════════════════
  //  CÁLCULO DO ESTADO DO PERSONAGEM (COMPARAÇÃO COM SAÚDE DO USUÁRIO)
  // ════════════════════════════════════════════════════════════════════
  const waterProgress = Math.min(1, totalWaterCopos / 8);
  const medsProgress = totalMeds > 0 ? medsTomados / totalMeds : 1;
  const activityProgress = Math.min(1, minsAtividade / 30);
  const healthScore = Math.round(waterProgress * 35 + medsProgress * 45 + activityProgress * 20);

  let heroStatus = {
    badge: "✨ Radiante",
    color: "bg-emerald-500 text-white border-emerald-950",
    bubble: "E aí, Herói! Você está com a saúde impecável hoje! Bora continuar assim? 🚀",
    moodEmoji: "🌟",
    vitality: healthScore,
  };

  if (medsProgress < 1 && totalMeds > 0) {
    heroStatus = {
      badge: `💊 ${medsTomados}/${totalMeds} Remédios`,
      color: "bg-rose-500 text-white border-rose-950 animate-pulse",
      bubble: "Lembre-se de tomar seus medicamentos no horário para manter seu Herói forte! 💊",
      moodEmoji: "🛡️",
      vitality: healthScore,
    };
  } else if (waterProgress < 0.4) {
    heroStatus = {
      badge: `💧 ${totalWaterCopos}/8 Copos`,
      color: "bg-cyan-500 text-white border-cyan-950",
      bubble: "Nosso Herói está precisando de hidratação! Que tal beber um copo d'água agora? 💧",
      moodEmoji: "🥤",
      vitality: healthScore,
    };
  } else if (healthScore >= 80) {
    heroStatus = {
      badge: `⚡ ${healthScore}% Forte`,
      color: "bg-amber-400 text-indigo-950 border-indigo-950",
      bubble: "E aí, Herói! Bora upar de nível hoje? Seus hábitos estão voando! 🚀",
      moodEmoji: "⚡",
      vitality: healthScore,
    };
  } else {
    heroStatus = {
      badge: `🌱 ${healthScore}% Em Progresso`,
      color: "bg-purple-600 text-white border-indigo-950",
      bubble: "Novo dia, novos hábitos! Registre suas atividades para encher a energia do seu herói! 🌟",
      moodEmoji: "🌱",
      vitality: healthScore,
    };
  }

  // ── Painel do Farmacêutico: Status profissional e atendimento aos pacientes ──
  if (currentUser?.role === "farmaceutico") {
    const examReqs = getExamRequests().filter(
      (r) => currentUser.isDev || r.pharmacistId === currentUser.id,
    );
    const pending = examReqs.filter((r) => r.status === "pendente").length;
    heroStatus = {
      badge: `🧑‍⚕️ Dr(a). ${currentUser.nome}`,
      color: "bg-emerald-600 text-white border-emerald-950",
      bubble:
        pending > 0
          ? `Dr(a). ${currentUser.nome}, você tem ${pending} paciente(s) com solicitação de exame pendente na sua filial! 🩺`
          : `Bem-vindo Dr(a). ${currentUser.nome}! Painel de atendimento da ${
              currentUser.pharmacyName || "sua farmácia"
            }. 💊`,
      moodEmoji: "🩺",
      vitality: 100,
    };
  }

  // ── REAÇÃO EMOCIONAL PIXEL 32X32 DE ACORDO COM A SAÚDE DO PERSONAGEM ──
  // 1. TPM / Irritado (nariz vermelho e símbolo 💢):
  //    Ativado quando há sintomas de TPM registrados no femaleLog ou se medicamentos estão atrasados
  const isTPM = femaleLog?.symptoms?.includes("TPM / Irritabilidade") || (medsProgress < 1 && totalMeds > 0);
  
  // 2. Ansiedade Alta / Triste (pálpebras roxas + lágrima 💧):
  //    Ativado se o último registro de humor for "Estressado" / "Cansado" ou saúde geral estiver abaixo de 60
  const lastMood = moodLogs.length > 0 ? moodLogs[moodLogs.length - 1].mood : null;
  const isAnxious = lastMood === "Estressado" || lastMood === "Cansado" || (healthScore < 60 && !isTPM);

  let healthEmotionType: PixelEmotionType = "normal";
  if (isTPM) {
    healthEmotionType = "tpmAngry"; // 💢 Rosto Irritado / TPM (Row 4)
  } else if (isAnxious) {
    healthEmotionType = "anxious";  // 💧 Rosto Triste / Ansioso (Row 2)
  } else if (waterProgress < 0.4) {
    healthEmotionType = "confused"; // 💦 Rosto Tonto / Desidratado (Row 3)
  } else if (healthScore < 30) {
    healthEmotionType = "frozen";   // 🥶 Rosto Congelado / Pavor (Row 3)
  } else if (healthScore >= 80) {
    healthEmotionType = "radiant";  // 🌸 Rosto Feliz / Saúde em Dia (Row 1)
  }

  // Common Dialogs & Modals shared across App and Web
  const renderModals = () => (
    <>
      {/* ===================== MISSÕES MODAL ===================== */}
      <Dialog open={showMissionsModal} onOpenChange={setShowMissionsModal}>
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-indigo-950 flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-600" /> Missões Diárias (Comprovante Real)
          </DialogTitle>
          <DialogDescription className="text-xs font-bold text-slate-500">
            {claimedCount} / {totalCount} recompensas resgatadas · Faça o registro no app como
            comprovante!
          </DialogDescription>
        </DialogHeader>

        {/* Progress bar no modal */}
        <div className="mt-3 mb-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black text-purple-600">{progressPct}% completo</span>
            {progressPct === 100 && (
              <span className="text-[10px] font-black text-emerald-600 animate-pulse">
                🎉 Todas moedas resgatadas!
              </span>
            )}
          </div>
          <div className="h-2.5 w-full bg-slate-100 border border-indigo-950/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="space-y-2.5 my-3 max-h-[55vh] overflow-y-auto pr-1">
          {todaysMissions.map((mission) => {
            const isClaimed = claimedIds.has(mission.id);
            const proof = mission.checkProof(appState);

            return (
              <div
                key={mission.id}
                className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-2 transition-all ${
                  isClaimed
                    ? "bg-emerald-50 border-emerald-400 opacity-75"
                    : proof.isSatisfied
                      ? "bg-amber-50 border-amber-400"
                      : "bg-purple-50 border-indigo-950"
                }`}
              >
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <span className="text-xl shrink-0">{mission.emoji}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p
                        className={`text-xs font-black leading-tight ${isClaimed ? "text-emerald-800 line-through" : "text-indigo-950"}`}
                      >
                        {mission.title}
                      </p>
                      {proof.isSatisfied && !isClaimed && (
                        <span className="text-[9px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
                          ✓ Comprovado!
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">{mission.desc}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                        +{mission.xp} XP | +{mission.coins} Moedas 🪙
                      </span>
                      <span className="text-[9px] font-extrabold text-slate-500">
                        {proof.currentText} / {proof.targetText}
                      </span>
                    </div>
                  </div>
                </div>

                {isClaimed ? (
                  <span className="shrink-0 text-[10px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-xl border border-emerald-300">
                    ✓ Resgatada
                  </span>
                ) : proof.isSatisfied ? (
                  <Button
                    onClick={() => claimReward(mission)}
                    size="sm"
                    variant="emerald"
                    className="shrink-0 border-2 border-indigo-950 font-black text-xs animate-bounce"
                  >
                    Resgatar 🪙
                  </Button>
                ) : (
                  <Link
                    href={mission.actionUrl}
                    onClick={() => setShowMissionsModal(false)}
                    className="shrink-0 flex items-center gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-[11px] px-3 py-1.5 rounded-xl border-2 border-indigo-950 shadow-sm active:scale-95 transition-all"
                  >
                    {mission.actionLabel} ➔
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </Dialog>

      {/* ===================== RANKING INFO / PATENTE MODAL ===================== */}
      <Dialog open={showRankingInfoModal} onOpenChange={setShowRankingInfoModal}>
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-indigo-950 flex items-center gap-2">
            <Info className="w-6 h-6 text-amber-500" /> Como Funciona a Patente
          </DialogTitle>
          <DialogDescription className="text-xs font-bold text-slate-500">
            Tudo sobre XP, Níveis e Patentes do FarmHero!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4 max-h-[65vh] overflow-y-auto pr-1">
          {/* Como ganhar XP */}
          <div className="bg-indigo-50 border-2 border-indigo-300 rounded-2xl p-3 space-y-2">
            <h3 className="text-sm font-black text-indigo-950 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-600" /> Como Ganhar XP
            </h3>
            <div className="space-y-1.5 text-[11px] font-bold text-indigo-900">
              <div className="flex items-center justify-between bg-white rounded-xl px-3 py-1.5 border border-indigo-200">
                <span>💧 Beber água (meta diária)</span>
                <span className="text-indigo-600 font-black">+XP</span>
              </div>
              <div className="flex items-center justify-between bg-white rounded-xl px-3 py-1.5 border border-indigo-200">
                <span>💊 Tomar medicamentos no horário</span>
                <span className="text-indigo-600 font-black">+XP</span>
              </div>
              <div className="flex items-center justify-between bg-white rounded-xl px-3 py-1.5 border border-indigo-200">
                <span>🏋️ Registrar atividade física</span>
                <span className="text-indigo-600 font-black">+XP</span>
              </div>
              <div className="flex items-center justify-between bg-white rounded-xl px-3 py-1.5 border border-indigo-200">
                <span>🎯 Completar missões diárias</span>
                <span className="text-purple-700 font-black">+60 a +100 XP</span>
              </div>
              <div className="flex items-center justify-between bg-white rounded-xl px-3 py-1.5 border border-indigo-200">
                <span>🩺 Orientação de farmacêutico ativa</span>
                <span className="text-emerald-600 font-black">+5% XP extra</span>
              </div>
            </div>
          </div>

          {/* Níveis de XP */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 space-y-2">
            <h3 className="text-sm font-black text-amber-950 flex items-center gap-1.5">
              🚀 Níveis e XP Necessário
            </h3>
            <div className="space-y-1 text-[11px] font-bold">
              {LEVEL_XP.map((xpNeeded, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-xl px-3 py-1.5 border ${
                    level === i
                      ? "bg-amber-200 border-amber-400 text-amber-950"
                      : "bg-white border-amber-200 text-amber-900"
                  }`}
                >
                  <span>
                    {level === i ? "⭐ " : ""}Nível {i} → {i + 1}
                  </span>
                  <span className="font-black">{xpNeeded} XP</span>
                </div>
              ))}
              <div
                className={`flex items-center justify-between rounded-xl px-3 py-1.5 border ${
                  level >= 9
                    ? "bg-amber-200 border-amber-400 text-amber-950"
                    : "bg-white border-amber-200 text-amber-900"
                }`}
              >
                <span>Nível 9+</span>
                <span className="font-black">900+ XP/nível</span>
              </div>
            </div>
          </div>

          {/* Tiers */}
          <div className="bg-purple-50 border-2 border-purple-300 rounded-2xl p-3 space-y-2">
            <h3 className="text-sm font-black text-purple-950 flex items-center gap-1.5">
              🏆 Tiers e Recompensas
            </h3>
            <p className="text-[10px] font-bold text-purple-700">
              Cada tier aumenta o bônus permanente nas moedas ganhas em todas as atividades.
            </p>
            <div className="space-y-1.5">
              {TIER_DATA.map((tier) => (
                <div
                  key={tier.name}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 border-2 ${tier.color} ${
                    currentTier.name === tier.name ? "ring-2 ring-indigo-950 ring-offset-1" : ""
                  }`}
                >
                  <div>
                    <span className="text-xs font-black">
                      {tier.emoji} {tier.name}
                      {currentTier.name === tier.name ? " ← Você" : ""}
                    </span>
                    <p className="text-[9px] font-bold opacity-80">
                      Níveis {tier.minLevel}–{tier.maxLevel === 999 ? "∞" : tier.maxLevel} •{" "}
                      {tier.xpNeeded}
                    </p>
                    <p className="text-[9px] font-bold opacity-70">{tier.desc}</p>
                  </div>
                  <span className="text-xs font-black shrink-0 ml-2 bg-white/60 px-2 py-0.5 rounded-full border border-current">
                    +{tier.bonus}% 💰
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Dialog>

      {/* ===================== PHARMACIST MODAL ===================== */}
      <Dialog open={showPharmacistModal} onOpenChange={setShowPharmacistModal}>
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-indigo-950 flex items-center gap-2">
            🩺 Orientação Farmacêutica
          </DialogTitle>
          <DialogDescription className="text-xs font-bold text-slate-500">
            Conecte-se com seu farmacêutico e ganhe +5% de XP em todas as atividades do app!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3 text-xs font-bold text-emerald-900 leading-relaxed">
            ✨ <span className="font-black">Vantagens de ter um farmacêutico:</span>
            <ul className="list-disc list-inside mt-1.5 space-y-1 text-[11px]">
              <li>Bônus permanente de +5% XP</li>
              <li>Acompanhamento da adesão aos medicamentos</li>
              <li>Orientações personalizadas pelo chat</li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-indigo-950 block">
              Nome de Usuário do Farmacêutico:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={pharmacistUsername}
                onChange={(e) => setPharmacistUsername(e.target.value)}
                placeholder="Ex: farm.marcos"
                className="flex-1 px-3 py-2 border-2 border-indigo-950 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <Button
                onClick={() => {
                  if (!pharmacistUsername.trim()) return;
                  setPharmacistPending(true);
                  setShowPharmacistModal(false);
                }}
                disabled={!pharmacistUsername.trim()}
                variant="purple"
                size="sm"
                className="border-2 border-indigo-950 font-black text-xs"
              >
                Solicitar
              </Button>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              O farmacêutico receberá a solicitação e precisará confirmar.
            </p>
          </div>
        </div>
      </Dialog>
    </>
  );

  // ════════════════════════════════════════════════════════════════════
  // 1. LAYOUT DO APP (MOBILE / CELULAR) — Versão Original Clássica
  // ════════════════════════════════════════════════════════════════════
  if (isMobile) {
    return (
      <div className={`p-4 space-y-4 font-sans animate-in fade-in duration-200 ${pageBgClass}`} style={bgStyle}>
        {/* Top Bar: Pill Logo + Notification Bell */}
        {isClassic ? (
          /* Pixel Win95 title bar */
          <div className="pixel-title-bar w-full" style={{ borderBottom: "2px solid #000" }}>
            <div className="flex items-center gap-1">
              <span style={{ fontSize: 8 }}>🎮</span>
              <span className="font-pixel" style={{ fontSize: 7 }}>FARMHERO v1.0</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={toggleDrawer}
                className="pixel-title-btn relative"
              >
                🔔
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white font-black text-[9px] flex items-center justify-center border border-black"
                    style={{ lineHeight: 1 }}>
                    {unreadCount}
                  </span>
                )}
              </button>
              <span className="pixel-title-btn">_</span>
              <span className="pixel-title-btn">□</span>
              <span className="pixel-title-btn">×</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            {/* Pill Logo */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-base font-black px-6 py-2.5 rounded-full border-4 border-indigo-950 shadow-[3px_3px_0px_#1e1b4b] uppercase tracking-wider">
              FARMHERO
            </div>

            {/* Right side: Notification Bell */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDrawer}
                className={`relative w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform ${cardBgClass} ${cardBorderClass}`}
              >
                <Bell className="w-6 h-6 stroke-[2.5] text-purple-600 dark:text-purple-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-500 text-white font-black text-xs flex items-center justify-center border-2 border-indigo-950 shadow animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Top Gamified Hero Area (Avatar with Backyard Scene + Health State Badge + Speech Bubble + Action Buttons) */}
        <div className="grid grid-cols-12 gap-2.5 items-center pt-2">
          {/* Left Column: Character Avatar (Visão Geral Mobile / App) */}
          <div className="col-span-5 flex flex-col items-center justify-center relative">
            <Link href="/avatar" className="block active:scale-95 transition-all">
              <div className="relative rounded-2xl overflow-hidden" style={{ width: 135, aspectRatio: "693/985" }}>
                <CustomAvatar
                  config={customAvatarConfig}
                  showShadow={false}
                  className="w-full h-full"
                />
              </div>
            </Link>
          </div>

          {/* Right Column: Speech Bubble + Stack of Buttons */}
          <div className="col-span-7 space-y-2.5">
            {/* Speech Bubble with dynamic reactive message */}
            <div className={`relative p-3 ${isClassic ? "pixel-card bg-[#fffef0]" : `rounded-2xl ${cardBgClass} ${cardBorderClass}`}`}>
              <p className={`text-xs font-black leading-snug ${isClassic ? "text-black font-pixel" : textPrimaryClass}`} style={isClassic ? { fontSize: 7 } : {}}>
                {heroStatus.bubble}
              </p>
            </div>

            {/* Buttons Stack */}
            <div className="space-y-2">
              {/* MISSÕES */}
              <button
                onClick={() => setShowMissionsModal(true)}
                className={`w-full py-2 px-4 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider rounded-full active:translate-y-1 transition-all ${buttonClass}`}
              >
                <Target className="w-4 h-4 stroke-[3]" /> MISSÕES
              </button>

              {/* RANKING */}
              <button
                onClick={() => setShowRankingInfoModal(true)}
                className={`w-full py-2 px-4 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider rounded-full active:translate-y-1 transition-all ${buttonClass}`}
              >
                <Trophy className="w-4 h-4 stroke-[3]" /> RANKING
              </button>

              {/* LOJA */}
              <Link href="/avatar" className="block w-full">
                <div
                  className={`w-full py-2 px-4 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider rounded-full active:translate-y-1 transition-all ${buttonClass}`}
                >
                  <ShoppingBag className="w-4 h-4 stroke-[3]" /> LOJA
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Row Below Avatar: Level & Points Cards */}
        <div className="grid grid-cols-12 gap-3 pt-1">
          {/* NÍVEL Card */}
          <div
            className={`col-span-7 rounded-3xl p-3 flex flex-col justify-between ${cardBgClass} ${cardBorderClass}`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-black uppercase tracking-wide ${textPrimaryClass}`}>
                NÍVEL {level} 🚀
              </span>
            </div>
            {/* Progress Bar */}
            <div className="my-2 h-3.5 w-full bg-slate-200 dark:bg-slate-800 border-2 border-indigo-950/20 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (xp / maxXp) * 100)}%` }}
              />
            </div>
            <span className={`text-[10px] font-extrabold ${textSecondaryClass}`}>
              {xp} / {maxXp} XP
            </span>
          </div>

          {/* PONTOS Card (Orange Gradient 3D) */}
          <div className="col-span-5 bg-gradient-to-br from-amber-400 via-orange-400 to-orange-500 border-4 border-indigo-950 rounded-3xl p-3 shadow-[4px_4px_0px_#1e1b4b] text-center flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-indigo-950 leading-none drop-shadow-sm">
              {coins.toLocaleString("pt-BR")}
            </span>
            <span className="text-[10px] font-black text-indigo-950 uppercase tracking-widest mt-1">
              PONTOS
            </span>
          </div>
        </div>

        {/* CARD DE RANKING DE SAÚDE */}
        <div className={`rounded-3xl p-4 space-y-2 ${cardBgClass} ${cardBorderClass}`}>
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-black uppercase tracking-wide flex items-center gap-1.5 ${textPrimaryClass}`}
            >
              🏆 Ranking de Saúde
              <button
                type="button"
                onClick={() => setShowRankingInfoModal(true)}
                className="text-amber-500 hover:text-amber-600 transition-colors"
                title="Como funciona o Ranking?"
              >
                <AlertCircle className="w-4 h-4 stroke-[2.5]" />
              </button>
            </span>
            <span
              className={`text-[9px] font-black px-2 py-0.5 rounded-full border-2 border-indigo-950 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400`}
            >
              🥈 2º Lugar
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 border-2 border-indigo-950/20 p-2.5 rounded-xl">
            <div>
              <span className={`font-black block ${textPrimaryClass}`}>
                {currentTier.emoji} Tier: {currentTier.name}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 font-extrabold">
                Bônus de +{currentTier.bonus}% nas moedas ganhas
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowRankingInfoModal(true)}
              className="text-[10px] font-black text-purple-600 dark:text-purple-400 hover:text-purple-800 flex items-center gap-0.5"
            >
              Ver Leaderboard <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>

          {/* Farmacêutico */}
          {pharmacistActive ? (
            <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-400 rounded-xl">
              <div className="flex items-center gap-1.5">
                <span className="text-base">🩺</span>
                <div>
                  <p className="text-[10px] font-black text-emerald-800 dark:text-emerald-300">
                    Farmacêutico Ativo
                  </p>
                  <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                    +5% XP em todas as atividades
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPharmacistActive(false);
                  setPharmacistPending(false);
                  setPharmacistUsername("");
                }}
                className="text-[9px] font-black text-rose-600 border border-rose-300 rounded-lg px-2 py-0.5 hover:bg-rose-50"
              >
                Remover
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowPharmacistModal(true)}
              className="w-full flex items-center gap-2 p-2.5 bg-purple-50 dark:bg-purple-950/40 border-2 border-purple-300 dark:border-purple-800 rounded-xl hover:bg-purple-100 transition-colors text-left"
            >
              <span className="text-base">🩺</span>
              <div>
                <p className="text-[10px] font-black text-purple-800 dark:text-purple-300">
                  Solicitar Orientação de Farmacêutico
                </p>
                <p className="text-[9px] font-bold text-purple-500 dark:text-purple-400">
                  +5% XP — necessário usuário do farmacêutico
                </p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 stroke-[3] text-purple-400 ml-auto" />
            </button>
          )}
        </div>

        {/* Middle Section: Purple Banner MISSÃO DIÁRIA */}
        <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 border-4 border-indigo-950 rounded-3xl p-4 shadow-[4px_4px_0px_#1e1b4b] text-white space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
              <div>
                <h3 className="text-sm font-black uppercase tracking-wide leading-none">
                  MISSÃO DIÁRIA
                </h3>
                <p className="text-[11px] font-bold text-purple-200 mt-1">
                  {claimedCount} / {totalCount} concluídas — {progressPct >= 50 ? "quase lá!" : "vamos nessa!"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowMissionsModal(true)}
              className="text-[10px] font-black bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-all"
            >
              Ver todas
            </button>
          </div>
          {/* Banner Progress Bar */}
          <div className="h-3.5 w-full bg-indigo-950/50 border-2 border-indigo-950 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Quick Metrics Grid 2x2 */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Medicamentos */}
          <Link href="/saude/medicamentos">
            <div
              className={`rounded-3xl p-4 flex flex-col items-center justify-center text-center space-y-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer ${cardBgClass} ${cardBorderClass}`}
            >
              <div className="w-12 h-12 rounded-full bg-pink-500 border-3 border-indigo-950 shadow flex items-center justify-center text-white">
                <Pill className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h4 className={`text-sm font-black ${textPrimaryClass}`}>Medicamentos</h4>
                <p className={`text-xs font-extrabold ${textSecondaryClass}`}>
                  {medsTomados} / {totalMeds} tomados
                </p>
              </div>
            </div>
          </Link>

          {/* Água */}
          <Link href="/saude/agua">
            <div
              className={`rounded-3xl p-4 flex flex-col items-center justify-center text-center space-y-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer ${cardBgClass} ${cardBorderClass}`}
            >
              <div className="w-12 h-12 rounded-full bg-cyan-400 border-3 border-indigo-950 shadow flex items-center justify-center text-white">
                <Droplets className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h4 className={`text-sm font-black ${textPrimaryClass}`}>Água</h4>
                <p className={`text-xs font-extrabold ${textSecondaryClass}`}>
                  {totalWaterCopos} / 8 copos
                </p>
              </div>
            </div>
          </Link>

          {/* Atividade */}
          <Link href="/saude/atividade">
            <div
              className={`rounded-3xl p-4 flex flex-col items-center justify-center text-center space-y-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer ${cardBgClass} ${cardBorderClass}`}
            >
              <div className="w-12 h-12 rounded-full bg-amber-400 border-3 border-indigo-950 shadow flex items-center justify-center text-white">
                <Dumbbell className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h4 className={`text-sm font-black ${textPrimaryClass}`}>Atividade</h4>
                <p className={`text-xs font-extrabold ${textSecondaryClass}`}>
                  {minsAtividade} / 60 min
                </p>
              </div>
            </div>
          </Link>

          {/* Alimentação */}
          <Link href="/saude/alimentacao">
            <div
              className={`rounded-3xl p-4 flex flex-col items-center justify-center text-center space-y-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer ${cardBgClass} ${cardBorderClass}`}
            >
              <div className="w-12 h-12 rounded-full bg-emerald-400 border-3 border-indigo-950 shadow flex items-center justify-center text-white">
                <Utensils className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h4 className={`text-sm font-black ${textPrimaryClass}`}>Alimentação</h4>
                <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                  Mandou bem!
                </p>
              </div>
            </div>
          </Link>
        </div>

        {renderModals()}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════
  // 2. LAYOUT DO WEBSITE (DESKTOP / PC)
  // ════════════════════════════════════════════════════════════════════
  return (
    <div className={`p-4 space-y-4 font-sans animate-in fade-in duration-200 ${pageBgClass}`} style={bgStyle}>
      {/* Top Bar: Pill Logo + Round Points Badge + Notification Bell */}
      <div className="flex items-center justify-between gap-2">
        {/* Pill Logo */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm sm:text-base font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-full border-4 border-indigo-950 shadow-[3px_3px_0px_#1e1b4b] uppercase tracking-wider">
          FARMHERO
        </div>

        {/* Right side: Round Points Badge + Notification Bell */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Round Points Coin Badge */}
          <Link href="/avatar">
            <div
              className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-orange-500 border-3 sm:border-4 border-indigo-950 shadow-[3px_3px_0px_#1e1b4b] flex flex-col items-center justify-center active:scale-95 transition-transform cursor-pointer group"
              title={`Seus Pontos: ${coins.toLocaleString("pt-BR")} (Ir para Loja)`}
            >
              <span className="text-xs sm:text-sm font-black text-indigo-950 leading-none drop-shadow-sm">
                {coins > 9999 ? `${(coins / 1000).toFixed(0)}k` : coins}
              </span>
              <span className="text-[7px] sm:text-[8px] font-black text-indigo-950/90 uppercase tracking-tighter leading-none mt-0.5">
                PONTOS
              </span>
            </div>
          </Link>

          {/* Circular Notification Bell Button */}
          <button
            onClick={toggleDrawer}
            className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform ${cardBgClass} ${cardBorderClass}`}
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] text-purple-600 dark:text-purple-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-rose-500 text-white font-black text-[10px] sm:text-xs flex items-center justify-center border-2 border-indigo-950 shadow animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Main Grid: Left (Character & Dialogue) + Right (Gamified Level, Missões & Metrics) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
        {/* Left Side (Desktop): Character Showcase with Backyard Scene & Reactive Dialogue */}
        <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-center gap-3">
          {/* Avatar Container with Backyard Scene */}
          <Link href="/avatar" className="block w-full max-w-[260px] sm:max-w-[280px] active:scale-95 transition-all">
            <div className="relative w-full flex flex-col items-center group cursor-pointer">
              {/* CustomAvatar (personagem personalizado) */}
              <CustomAvatar
                config={customAvatarConfig}
                showShadow={true}
                className="w-full drop-shadow-[0_8px_18px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:scale-105"
              />

              {/* Character Health / Mood Status Badge */}
              <div className="mt-2 flex justify-center">
                <span
                  className={`text-[9px] sm:text-[10px] font-black px-3 py-1 rounded-full border shadow ${heroStatus.color}`}
                >
                  {heroStatus.badge}
                </span>
              </div>
            </div>
          </Link>

          {/* Speech Bubble (Desktop) */}
          <div
            className={`w-full max-w-[260px] sm:max-w-[280px] relative rounded-2xl p-3.5 ${cardBgClass} ${cardBorderClass}`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs">💬</span>
              <span className={`text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400`}>
                Fala do Herói
              </span>
            </div>
            <p className={`text-xs font-black leading-snug ${textPrimaryClass}`}>
              {heroStatus.bubble}
            </p>
          </div>
        </div>

        {/* Right Side (Desktop): Gamified Level Circle & Actions + Missão Diária & Square Metrics */}
        <div className="lg:col-span-7 space-y-4">
          {/* Top Gamified Hero Area (Level circle + Compact action buttons) */}
          <div className="flex items-center justify-end">
            <div className="relative flex items-center w-full max-w-md">
              {/* Left: BIG Circular Level & XP Progress Widget (z-10 in front) */}
              <div className="relative z-10 shrink-0 -mr-7 sm:-mr-9 drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
                  {/* SVG Circular XP Ring */}
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    {/* Background Track */}
                    <circle
                      cx="60"
                      cy="60"
                      r="49"
                      className="stroke-slate-800 dark:stroke-slate-900"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    {/* XP Progress Arc */}
                    <circle
                      cx="60"
                      cy="60"
                      r="49"
                      className="stroke-amber-400 transition-all duration-700 ease-out drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]"
                      strokeWidth="10"
                      strokeDasharray={2 * Math.PI * 49}
                      strokeDashoffset={2 * Math.PI * 49 * (1 - Math.min(1, Math.max(0, xp / maxXp)))}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>

                  {/* Inner Circle Content */}
                  <div
                    className={`absolute inset-2.5 sm:inset-3.5 rounded-full flex flex-col items-center justify-center bg-slate-900 text-white border-3 sm:border-4 border-indigo-950 shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)]`}
                  >
                    <span className="text-[9px] sm:text-xs font-black uppercase text-amber-400 tracking-widest leading-none">
                      NÍVEL
                    </span>
                    <span className="text-2xl sm:text-4xl font-black leading-none my-1 text-white drop-shadow">
                      {level}
                    </span>
                    <span className="text-[8px] sm:text-[11px] font-extrabold leading-none text-slate-400">
                      {xp} / {maxXp} XP
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Purple Action Buttons (saindo de trás do nível) */}
              <div className="flex-1 space-y-2 pl-9 sm:pl-11 min-w-0">
                {/* MISSÕES */}
                <button
                  onClick={() => setShowMissionsModal(true)}
                  className="w-full h-9 sm:h-10 px-4 sm:px-5 flex items-center justify-center gap-2 font-black text-xs sm:text-sm uppercase tracking-wider rounded-r-full rounded-l-full bg-purple-600 hover:bg-purple-500 active:scale-[0.98] text-white border-2 sm:border-3 border-indigo-950 shadow-[3px_3px_0px_#1e1b4b] transition-all"
                >
                  <Target className="w-4 h-4 stroke-[2.5] shrink-0" />
                  <span className="truncate">MISSÕES</span>
                </button>

                {/* PATENTE */}
                <button
                  onClick={() => setShowRankingInfoModal(true)}
                  className="w-full h-9 sm:h-10 px-4 sm:px-5 flex items-center justify-center gap-2 font-black text-xs sm:text-sm uppercase tracking-wider rounded-r-full rounded-l-full bg-purple-600 hover:bg-purple-500 active:scale-[0.98] text-white border-2 sm:border-3 border-indigo-950 shadow-[3px_3px_0px_#1e1b4b] transition-all"
                >
                  <Trophy className="w-4 h-4 stroke-[2.5] shrink-0" />
                  <span className="truncate">PATENTE</span>
                </button>

                {/* LOJA */}
                <Link href="/avatar" className="block w-full">
                  <div
                    className="w-full h-9 sm:h-10 px-4 sm:px-5 flex items-center justify-center gap-2 font-black text-xs sm:text-sm uppercase tracking-wider rounded-r-full rounded-l-full bg-purple-600 hover:bg-purple-500 active:scale-[0.98] text-white border-2 sm:border-3 border-indigo-950 shadow-[3px_3px_0px_#1e1b4b] transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 stroke-[2.5] shrink-0" />
                    <span className="truncate">LOJA</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

      {/* Middle Section: Vertical Missão Diária (Slimmer) + Stacked Square Cards (Patente, Meds, Água, Ativ, Alim) */}
      <div className="flex items-stretch justify-end gap-3 pt-1">
        {/* Vertical Missão Diária Card (Slimmer) */}
        <div
          onClick={() => setShowMissionsModal(true)}
          className="flex-1 max-w-[130px] sm:max-w-[155px] bg-gradient-to-b from-purple-600 via-indigo-600 to-purple-900 border-4 border-indigo-950 rounded-3xl p-3 shadow-[4px_4px_0px_#1e1b4b] text-white flex flex-col items-center justify-between text-center relative overflow-hidden cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all group"
        >
          {/* Confetti / Celebration explosion background when 100% */}
          {progressPct === 100 && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              <div className="absolute top-2 left-2 text-base animate-ping">✨</div>
              <div className="absolute top-4 right-2 text-base animate-bounce">🎉</div>
              <div className="absolute top-10 left-4 text-xs animate-pulse">⭐</div>
              <div className="absolute top-12 right-4 text-sm animate-spin">💥</div>
              <div className="absolute inset-0 bg-amber-400/15 animate-pulse" />
            </div>
          )}

          {/* Top: Star Header with celebration animation */}
          <div className="flex flex-col items-center z-10 space-y-1 w-full">
            <div className="relative">
              {progressPct === 100 ? (
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-amber-400/50 rounded-full blur-md animate-ping" />
                  <Star className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300 fill-amber-300 drop-shadow-[0_0_16px_rgba(251,191,36,0.95)] animate-bounce" />
                  <span className="absolute -top-1 -right-1 text-xs animate-spin">✨</span>
                </div>
              ) : (
                <Star className="w-9 h-9 sm:w-10 sm:h-10 text-amber-300 fill-amber-300 drop-shadow-[0_4px_8px_rgba(251,191,36,0.5)] animate-pulse" />
              )}
            </div>

            <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-wider leading-tight mt-0.5">
              MISSÃO DIÁRIA
            </h3>

            <p className="text-[9px] sm:text-[10px] font-bold text-purple-200">
              {claimedCount} / {totalCount}
            </p>
          </div>

          {/* Middle: Vertical Progress Bar & Percentage */}
          <div className="flex-1 flex flex-col items-center justify-center my-2.5 w-full z-10">
            {/* Vertical Progress Bar */}
            <div className="h-24 sm:h-32 w-3.5 sm:w-4 bg-indigo-950/70 border-2 border-indigo-950 rounded-full overflow-hidden p-0.5 flex flex-col justify-end shadow-inner">
              <div
                className="w-full bg-gradient-to-t from-amber-500 via-yellow-300 to-amber-200 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(251,191,36,0.7)]"
                style={{ height: `${progressPct}%` }}
              />
            </div>

            <span className="text-xs sm:text-sm font-black text-amber-300 mt-1.5">
              {progressPct}%
            </span>
          </div>

          {/* Bottom: Bonus + CTA */}
          <div className="w-full z-10 space-y-1">
            {progressPct === 100 ? (
              <div className="bg-amber-400 text-indigo-950 font-black text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full border-2 border-indigo-950 shadow animate-pulse">
                🏆 +2% ATIVO!
              </div>
            ) : (
              <div className="bg-indigo-950/50 text-purple-200 text-[7px] sm:text-[8px] font-bold px-1 py-0.5 rounded-lg border border-purple-400/30">
                +2% ao finalizar
              </div>
            )}

            <button
              type="button"
              className="w-full text-[8px] sm:text-[9px] font-black bg-white/20 hover:bg-white/30 active:scale-95 py-1 rounded-full transition-all uppercase tracking-wider"
            >
              Ver Todas
            </button>
          </div>
        </div>

        {/* Right: Stacked Square Cards (Patente, Medicamentos, Água, Atividade, Alimentação) */}
        <div className="w-full max-w-[130px] sm:max-w-[150px] space-y-2.5">
          {/* Patente (Square Card) */}
          <button
            type="button"
            onClick={() => setShowRankingInfoModal(true)}
            className={`aspect-square w-full rounded-2xl sm:rounded-3xl p-2.5 flex flex-col items-center justify-center text-center space-y-1 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer ${cardBgClass} ${cardBorderClass}`}
            title="Clique para saber como funciona a Patente"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 sm:border-3 border-indigo-950 shadow flex items-center justify-center text-lg sm:text-xl shrink-0">
              {currentTier.emoji}
            </div>
            <div>
              <div className="flex items-center justify-center gap-1">
                <h4 className={`text-[11px] sm:text-xs font-black leading-tight ${textPrimaryClass}`}>
                  Patente
                </h4>
                <AlertCircle className="w-3 h-3 text-amber-500 stroke-[2.5]" />
              </div>
              <p className="text-[10px] sm:text-[11px] font-black text-amber-600 dark:text-amber-400 leading-tight mt-0.5">
                {currentTier.name}
              </p>
              <p className={`text-[8px] sm:text-[9px] font-extrabold leading-tight ${textSecondaryClass}`}>
                +{currentTier.bonus}% moedas
              </p>
            </div>
          </button>

          {/* Medicamentos */}
          <Link href="/saude/medicamentos" className="block w-full">
            <div
              className={`aspect-square w-full rounded-2xl sm:rounded-3xl p-2.5 flex flex-col items-center justify-center text-center space-y-1 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer ${cardBgClass} ${cardBorderClass}`}
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-pink-500 border-2 sm:border-3 border-indigo-950 shadow flex items-center justify-center text-white shrink-0">
                <Pill className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </div>
              <div>
                <h4 className={`text-[11px] sm:text-xs font-black leading-tight ${textPrimaryClass}`}>
                  Medicamentos
                </h4>
                <p className={`text-[9px] sm:text-[10px] font-extrabold mt-0.5 leading-tight ${textSecondaryClass}`}>
                  {medsTomados} / {totalMeds}
                </p>
              </div>
            </div>
          </Link>

          {/* Água */}
          <Link href="/saude/agua" className="block w-full">
            <div
              className={`aspect-square w-full rounded-2xl sm:rounded-3xl p-2.5 flex flex-col items-center justify-center text-center space-y-1 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer ${cardBgClass} ${cardBorderClass}`}
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-cyan-400 border-2 sm:border-3 border-indigo-950 shadow flex items-center justify-center text-white shrink-0">
                <Droplets className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </div>
              <div>
                <h4 className={`text-[11px] sm:text-xs font-black leading-tight ${textPrimaryClass}`}>
                  Água
                </h4>
                <p className={`text-[9px] sm:text-[10px] font-extrabold mt-0.5 leading-tight ${textSecondaryClass}`}>
                  {totalWaterCopos} / 8 copos
                </p>
              </div>
            </div>
          </Link>

          {/* Atividade */}
          <Link href="/saude/atividade" className="block w-full">
            <div
              className={`aspect-square w-full rounded-2xl sm:rounded-3xl p-2.5 flex flex-col items-center justify-center text-center space-y-1 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer ${cardBgClass} ${cardBorderClass}`}
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-amber-400 border-2 sm:border-3 border-indigo-950 shadow flex items-center justify-center text-white shrink-0">
                <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </div>
              <div>
                <h4 className={`text-[11px] sm:text-xs font-black leading-tight ${textPrimaryClass}`}>
                  Atividade
                </h4>
                <p className={`text-[9px] sm:text-[10px] font-extrabold mt-0.5 leading-tight ${textSecondaryClass}`}>
                  {minsAtividade} / 60 min
                </p>
              </div>
            </div>
          </Link>

          {/* Alimentação */}
          <Link href="/saude/alimentacao" className="block w-full">
            <div
              className={`aspect-square w-full rounded-2xl sm:rounded-3xl p-2.5 flex flex-col items-center justify-center text-center space-y-1 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer ${cardBgClass} ${cardBorderClass}`}
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-emerald-400 border-2 sm:border-3 border-indigo-950 shadow flex items-center justify-center text-white shrink-0">
                <Utensils className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </div>
              <div>
                <h4 className={`text-[11px] sm:text-xs font-black leading-tight ${textPrimaryClass}`}>
                  Alimentação
                </h4>
                <p className="text-[9px] sm:text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 leading-tight">
                  Mandou bem!
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  </div>

      {renderModals()}
    </div>
  );
};

export { Home as HomeRoute, Home as default };
