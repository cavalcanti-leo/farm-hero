import React, { useState } from "react";
import { Link } from "wouter";
import { useAppState } from "@/lib/app-state";
import { useTheme } from "@/lib/theme-context";
import avatarHeroImg from "@/assets/avatar-hero.png";
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
} from "lucide-react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const TIER_DATA = [
  { name: "Madeira", emoji: "🪵", minLevel: 0, maxLevel: 8, bonus: 2.5, color: "bg-amber-100 border-amber-400 text-amber-900", xpNeeded: "0–800 XP total", desc: "Iniciante da saúde. Cada hábito vale muito aqui!" },
  { name: "Prata", emoji: "🥈", minLevel: 9, maxLevel: 15, bonus: 5, color: "bg-slate-100 border-slate-400 text-slate-800", xpNeeded: "800–2.500 XP total", desc: "Você está evoluindo! Hábitos mais consistentes." },
  { name: "Ouro", emoji: "🥇", minLevel: 16, maxLevel: 25, bonus: 10, color: "bg-yellow-100 border-yellow-400 text-yellow-900", xpNeeded: "2.500–5.000 XP total", desc: "Herói dedicado. Rotina sólida de saúde!" },
  { name: "Platina", emoji: "💎", minLevel: 26, maxLevel: 49, bonus: 15, color: "bg-cyan-100 border-cyan-400 text-cyan-900", xpNeeded: "5.000–15.000 XP total", desc: "Elite da saúde. Disciplina exemplar!" },
  { name: "Diamante", emoji: "💠", minLevel: 50, maxLevel: 80, bonus: 25, color: "bg-blue-100 border-blue-500 text-blue-900", xpNeeded: "15.000–40.000 XP total", desc: "Lenda viva! Hábitos impecáveis todos os dias." },
  { name: "Hero", emoji: "🦸", minLevel: 81, maxLevel: 999, bonus: 35, color: "bg-purple-100 border-purple-500 text-purple-950", xpNeeded: "40.000+ XP total", desc: "O ápice da saúde. Inspiração para todos!" },
];

const LEVEL_XP = [100, 100, 225, 280, 335, 500, 580, 700, 800];

const getTierForLevel = (lvl: number) =>
  TIER_DATA.find((t) => lvl >= t.minLevel && lvl <= t.maxLevel) ?? TIER_DATA[0];

export const HomeRoute: React.FC = () => {
  const {
    level,
    xp,
    maxXp,
    coins,
    waterLogs,
    medications,
    activities,
    meals,
    toggleMedication,
    addWater,
    gainXpAndCoins,
    pharmacistActive,
    setPharmacistActive,
  } = useAppState();

  const { isDark, isLight, isClassic, pageBgClass, cardBgClass, cardBorderClass, buttonClass, textPrimaryClass, textSecondaryClass } = useTheme();

  const lucasXp = Math.round(maxXp * 0.8);
  const isTop1 = xp > lucasXp;
  const currentTier = getTierForLevel(level);

  const [showMissionsModal, setShowMissionsModal] = useState(false);
  const [showRankingModal, setShowRankingModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showRankingInfoModal, setShowRankingInfoModal] = useState(false);
  const [showPharmacistModal, setShowPharmacistModal] = useState(false);
  const [pharmacistUsername, setPharmacistUsername] = useState("");
  const [pharmacistPending, setPharmacistPending] = useState(false);

  const totalWaterCopos = Math.round(
    waterLogs.reduce((acc, curr) => acc + curr.amountMl, 0) / 250
  );
  const medsTomados = medications.filter((m) => m.taken).length;
  const totalMeds = medications.length || 3;
  const minsAtividade = activities.reduce(
    (acc, curr) => acc + curr.durationMinutes,
    0
  );

  return (
    <div className={`p-4 space-y-4 font-sans animate-in fade-in duration-200 ${pageBgClass}`}>
      {/* Top Bar: Pill Logo + Notification Bell */}
      <div className="flex items-center justify-between">
        {/* Pill Logo */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-base font-black px-6 py-2.5 rounded-full border-4 border-indigo-950 shadow-[3px_3px_0px_#1e1b4b] uppercase tracking-wider">
          FARMHERO
        </div>

        {/* Right side: Notification Bell only */}
        <div className="flex items-center gap-2">
          {/* Circular Notification Bell Button */}
          <button
            onClick={() => setShowNotificationModal(true)}
            className={`relative w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform ${cardBgClass} ${cardBorderClass}`}
          >
            <Bell className="w-6 h-6 stroke-[2.5] text-purple-600 dark:text-purple-400" />
            <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-500 text-white font-black text-xs flex items-center justify-center border-2 border-indigo-950 shadow">
              3
            </span>
          </button>
        </div>
      </div>

      {/* Top Gamified Hero Area (Avatar + Speech Bubble + Action Buttons) */}
      <div className="grid grid-cols-12 gap-2 items-center pt-2">
        {/* Left Column: 3D Character Avatar */}
        <div className="col-span-5 flex items-center justify-center relative">
          <div className="w-36 h-44 flex items-center justify-center relative drop-shadow-[0_15px_15px_rgba(0,0,0,0.25)]">
            <img
              src={avatarHeroImg}
              alt="Character Avatar"
              className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_8px_rgba(0,0,0,0.3)] animate-pulse"
            />
          </div>
        </div>

        {/* Right Column: Speech Bubble + Stack of Buttons */}
        <div className="col-span-7 space-y-2.5">
          {/* Speech Bubble */}
          <div className={`relative rounded-2xl p-3 ${cardBgClass} ${cardBorderClass}`}>
            <p className={`text-xs font-black leading-snug ${textPrimaryClass}`}>
              E aí, Herói! Bora upar de nível hoje? 🚀
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
              onClick={() => setShowRankingModal(true)}
              className={`w-full py-2 px-4 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider rounded-full active:translate-y-1 transition-all ${buttonClass}`}
            >
              <Trophy className="w-4 h-4 stroke-[3]" /> RANKING
            </button>

            {/* LOJA */}
            <Link href="/avatar" className="block w-full">
              <div className={`w-full py-2 px-4 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider rounded-full active:translate-y-1 transition-all ${buttonClass}`}>
                <ShoppingBag className="w-4 h-4 stroke-[3]" /> LOJA
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Row Below Avatar: Level & Points Cards */}
      <div className="grid grid-cols-12 gap-3 pt-1">
        {/* NÍVEL Card */}
        <div className={`col-span-7 rounded-3xl p-3 flex flex-col justify-between ${cardBgClass} ${cardBorderClass}`}>
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
          <span className={`text-xs font-black uppercase tracking-wide flex items-center gap-1.5 ${textPrimaryClass}`}>
            🏆 Ranking de Saúde
            {/* Info exclamação abre modal explicativo */}
            <button
              type="button"
              onClick={() => setShowRankingInfoModal(true)}
              className="text-amber-500 hover:text-amber-600 transition-colors"
              title="Como funciona o Ranking?"
            >
              <AlertCircle className="w-4 h-4 stroke-[2.5]" />
            </button>
          </span>
          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border-2 border-indigo-950 ${
            isTop1 ? "bg-amber-400 text-indigo-950 shadow-[1px_1px_0px_#1e1b4b]" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
          }`}>
            {isTop1 ? "🥇 TOP 1" : "🥈 2º Lugar"}
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
            onClick={() => setShowRankingModal(true)}
            className="text-[10px] font-black text-purple-600 dark:text-purple-400 hover:text-purple-800 flex items-center gap-0.5"
          >
            Ver Leaderboard <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>

        {/* Farmacêutico — solicitar orientação */}
        {pharmacistActive ? (
          <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-400 rounded-xl">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🩺</span>
              <div>
                <p className="text-[10px] font-black text-emerald-800 dark:text-emerald-300">Farmacêutico Ativo</p>
                <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">+5% XP em todas as atividades</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setPharmacistActive(false); setPharmacistPending(false); setPharmacistUsername(""); }}
              className="text-[9px] font-black text-rose-600 border border-rose-300 rounded-lg px-2 py-0.5 hover:bg-rose-50"
            >
              Remover
            </button>
          </div>
        ) : pharmacistPending ? (
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-400 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-base animate-spin">⏳</span>
              <p className="text-[10px] font-black text-amber-800 dark:text-amber-300">Aguardando confirmação do farmacêutico...</p>
            </div>
            <p className="text-[9px] font-bold text-amber-700 dark:text-amber-400">Solicitação enviada para <span className="font-black">@{pharmacistUsername}</span>. Assim que o farmacêutico aceitar, o bônus de +5% XP será ativado automaticamente.</p>
            <button
              type="button"
              onClick={() => { setPharmacistPending(false); setPharmacistUsername(""); }}
              className="text-[9px] font-black text-slate-500 underline"
            >
              Cancelar solicitação
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
              <p className="text-[10px] font-black text-purple-800 dark:text-purple-300">Solicitar Orientação de Farmacêutico</p>
              <p className="text-[9px] font-bold text-purple-500 dark:text-purple-400">+5% XP — necessário usuário do farmacêutico</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 stroke-[3] text-purple-400 ml-auto" />
          </button>
        )}

        {isTop1 && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 rounded-xl p-2 flex items-center gap-1.5 text-[9px] font-black text-amber-900 dark:text-amber-300 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Bônus Ativo: +10% Moedas e +5% XP por ser o Top 1!</span>
          </div>
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
                4 / 6 concluídas — quase lá!
              </p>
            </div>
          </div>
        </div>
        {/* Banner Progress Bar */}
        <div className="h-3.5 w-full bg-indigo-950/50 border-2 border-indigo-950 rounded-full overflow-hidden p-0.5">
          <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full w-[66%]" />
        </div>
      </div>

      {/* Quick Metrics Grid 2x2 (Light/Dark/Classic background area) */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Medicamentos */}
        <Link href="/saude/medicamentos">
          <div className={`rounded-3xl p-4 flex flex-col items-center justify-center text-center space-y-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer ${cardBgClass} ${cardBorderClass}`}>
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
          <div className={`rounded-3xl p-4 flex flex-col items-center justify-center text-center space-y-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer ${cardBgClass} ${cardBorderClass}`}>
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
          <div className={`rounded-3xl p-4 flex flex-col items-center justify-center text-center space-y-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer ${cardBgClass} ${cardBorderClass}`}>
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
          <div className={`rounded-3xl p-4 flex flex-col items-center justify-center text-center space-y-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer ${cardBgClass} ${cardBorderClass}`}>
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

      {/* ===================== MISSÕES MODAL ===================== */}
      <Dialog open={showMissionsModal} onOpenChange={setShowMissionsModal}>
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-indigo-950 flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-600" /> Missões Ativas
          </DialogTitle>
          <DialogDescription className="text-xs font-bold text-slate-500">
            Conclua as missões abaixo para ganhar XP e moedas extras!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 my-4">
          <div className="p-3 bg-purple-50 rounded-2xl border-2 border-indigo-950 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-indigo-950">Missão: Hidratação Forte</p>
              <p className="text-[10px] text-slate-500 font-bold">Beber 2.000ml de água hoje</p>
              <span className="inline-block mt-1 text-[9px] font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                +75 XP | +15 Moedas
              </span>
            </div>
            <Button
              onClick={() => {
                gainXpAndCoins(75, 15, "Concluiu Missão: Hidratação Forte");
                setShowMissionsModal(false);
              }}
              size="sm"
              variant="emerald"
              className="border-2 border-indigo-950 font-black text-xs"
            >
              Concluir
            </Button>
          </div>

          <div className="p-3 bg-purple-50 rounded-2xl border-2 border-indigo-950 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-indigo-950">Missão: Rotina Pontual</p>
              <p className="text-[10px] text-slate-500 font-bold">Tomar todos os remédios do dia</p>
              <span className="inline-block mt-1 text-[9px] font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                +60 XP | +10 Moedas
              </span>
            </div>
            <Button
              onClick={() => {
                gainXpAndCoins(60, 10, "Concluiu Missão: Rotina Pontual");
                setShowMissionsModal(false);
              }}
              size="sm"
              variant="purple"
              className="border-2 border-indigo-950 font-black text-xs"
            >
              Concluir
            </Button>
          </div>

          <div className="p-3 bg-purple-50 rounded-2xl border-2 border-indigo-950 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-indigo-950">Missão: Atividade Épica</p>
              <p className="text-[10px] text-slate-500 font-bold">Registrar 30 min de exercícios hoje</p>
              <span className="inline-block mt-1 text-[9px] font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                +100 XP | +20 Moedas
              </span>
            </div>
            <Button
              onClick={() => {
                gainXpAndCoins(100, 20, "Concluiu Missão: Atividade Épica");
                setShowMissionsModal(false);
              }}
              size="sm"
              variant="emerald"
              className="border-2 border-indigo-950 font-black text-xs"
            >
              Concluir
            </Button>
          </div>
        </div>
      </Dialog>

      {/* ===================== RANKING MODAL ===================== */}
      <Dialog open={showRankingModal} onOpenChange={setShowRankingModal}>
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-indigo-950 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" /> Ranking de Heróis
          </DialogTitle>
          <DialogDescription className="text-xs font-bold text-slate-500">
            {currentTier.emoji} Tier atual: {currentTier.name} — +{currentTier.bonus}% bônus nas moedas
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2.5 my-4">
          {/* Top 1 */}
          <div className={`p-3 rounded-2xl border-2 border-indigo-950 flex items-center justify-between text-xs font-black shadow-[2px_2px_0px_#1e1b4b] ${
            isTop1 ? "bg-amber-100 border-amber-400 text-amber-950" : "bg-slate-50 border-slate-300 text-slate-700"
          }`}>
            <span className="flex items-center gap-1.5">
              👑 1. {isTop1 ? "Você" : "Lucas Silva"}
            </span>
            <span>{isTop1 ? `${xp} XP` : `${lucasXp} XP`}</span>
          </div>

          {/* Top 2 */}
          <div className={`p-3 rounded-2xl border-2 border-indigo-950 flex items-center justify-between text-xs font-black shadow-[2px_2px_0px_#1e1b4b] ${
            !isTop1 ? "bg-purple-100 border-purple-400 text-purple-950" : "bg-slate-50 border-slate-300 text-slate-700"
          }`}>
            <span className="flex items-center gap-1.5">
              🥈 2. {!isTop1 ? "Você" : "Lucas Silva"}
            </span>
            <span>{!isTop1 ? `${xp} XP` : `${lucasXp} XP`}</span>
          </div>

          {/* Top 3 */}
          <div className="p-3 bg-slate-50 border-2 border-indigo-950 rounded-2xl flex items-center justify-between text-xs font-black shadow-[2px_2px_0px_#1e1b4b]">
            <span className="flex items-center gap-1.5">
              🥉 3. Beatriz Costa (Lvl {Math.max(0, level - 1)})
            </span>
            <span>{Math.round(maxXp * 0.5)} XP</span>
          </div>

          {/* Top 4 */}
          <div className="p-3 bg-slate-50 border-2 border-indigo-950 rounded-2xl flex items-center justify-between text-xs font-black shadow-[2px_2px_0px_#1e1b4b]">
            <span className="flex items-center gap-1.5">
              🦁 4. Gabriel Oliveira (Lvl {Math.max(0, level - 2)})
            </span>
            <span>{Math.round(maxXp * 0.3)} XP</span>
          </div>

          {isTop1 ? (
            <div className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-3 text-[11px] font-black text-emerald-900 leading-relaxed">
              🎉 Parabéns! Você é o Rank 1! Bônus ativo: +10% moedas e +5% XP em todas as atividades.
            </div>
          ) : (
            <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-3 text-[11px] font-black text-amber-900 leading-relaxed">
              💪 Faltam {lucasXp - xp + 1} XP para assumir o Rank 1 e ativar o bônus de +10% moedas e +5% XP!
            </div>
          )}
        </div>
      </Dialog>

      {/* ===================== RANKING INFO MODAL ===================== */}
      <Dialog open={showRankingInfoModal} onOpenChange={setShowRankingInfoModal}>
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-indigo-950 flex items-center gap-2">
            <Info className="w-6 h-6 text-amber-500" /> Como Funciona o Ranking
          </DialogTitle>
          <DialogDescription className="text-xs font-bold text-slate-500">
            Tudo sobre XP, Níveis e Tiers do FarmHero!
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
              <div className="flex items-center justify-between bg-white rounded-xl px-3 py-1.5 border border-indigo-200">
                <span>👑 Ser o Rank 1 do Ranking</span>
                <span className="text-amber-600 font-black">+5% XP extra</span>
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
                    level === i ? "bg-amber-200 border-amber-400 text-amber-950" : "bg-white border-amber-200 text-amber-900"
                  }`}
                >
                  <span>{level === i ? "⭐ " : ""}Nível {i} → {i + 1}</span>
                  <span className="font-black">{xpNeeded} XP</span>
                </div>
              ))}
              <div className={`flex items-center justify-between rounded-xl px-3 py-1.5 border ${
                level >= 9 ? "bg-amber-200 border-amber-400 text-amber-950" : "bg-white border-amber-200 text-amber-900"
              }`}>
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
                      Níveis {tier.minLevel}–{tier.maxLevel === 999 ? "∞" : tier.maxLevel} • {tier.xpNeeded}
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

          {/* Como subir no Ranking */}
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3 space-y-2">
            <h3 className="text-sm font-black text-emerald-950 flex items-center gap-1.5">
              📈 Como Subir no Ranking
            </h3>
            <div className="space-y-1.5 text-[11px] font-bold text-emerald-900">
              <div className="flex items-start gap-2 bg-white rounded-xl px-3 py-2 border border-emerald-200">
                <span className="text-base">1️⃣</span>
                <span>Acumule XP realizando atividades de saúde todos os dias.</span>
              </div>
              <div className="flex items-start gap-2 bg-white rounded-xl px-3 py-2 border border-emerald-200">
                <span className="text-base">2️⃣</span>
                <span>Complete missões diárias para ganhos expressivos de XP (+60 a +100 por missão).</span>
              </div>
              <div className="flex items-start gap-2 bg-white rounded-xl px-3 py-2 border border-emerald-200">
                <span className="text-base">3️⃣</span>
                <span>Ative a orientação de farmacêutico para ganhar +5% de XP a mais em tudo.</span>
              </div>
              <div className="flex items-start gap-2 bg-white rounded-xl px-3 py-2 border border-emerald-200">
                <span className="text-base">4️⃣</span>
                <span>Quando você ultrapassar o Rank 1, ganha +10% em moedas E +5% XP em todas as ações!</span>
              </div>
              <div className="flex items-start gap-2 bg-white rounded-xl px-3 py-2 border border-emerald-200">
                <span className="text-base">5️⃣</span>
                <span>Suba de nível para avançar nos Tiers e garantir bônus permanentes maiores nas moedas.</span>
              </div>
            </div>
          </div>

          {/* Bônus acumulados atuais */}
          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-indigo-400 rounded-2xl p-3 space-y-2">
            <h3 className="text-sm font-black text-indigo-950">🎁 Seus Bônus Ativos Agora</h3>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between font-bold text-indigo-900 bg-white/70 rounded-lg px-3 py-1.5">
                <span>{currentTier.emoji} Tier {currentTier.name}</span>
                <span className="font-black text-indigo-700">+{currentTier.bonus}% moedas</span>
              </div>
              {isTop1 && (
                <div className="flex justify-between font-bold text-amber-900 bg-amber-50 rounded-lg px-3 py-1.5">
                  <span>👑 Rank 1</span>
                  <span className="font-black text-amber-700">+10% moedas / +5% XP</span>
                </div>
              )}
              {pharmacistActive && (
                <div className="flex justify-between font-bold text-emerald-900 bg-emerald-50 rounded-lg px-3 py-1.5">
                  <span>🩺 Farmacêutico</span>
                  <span className="font-black text-emerald-700">+5% XP</span>
                </div>
              )}
              {!isTop1 && !pharmacistActive && (
                <p className="text-[10px] text-slate-500 font-bold text-center pt-1">
                  Ative mais bônus completando missões e ativando o farmacêutico!
                </p>
              )}
            </div>
          </div>
        </div>
      </Dialog>

      {/* ===================== NOTIFICATIONS MODAL ===================== */}
      <Dialog open={showNotificationModal} onOpenChange={setShowNotificationModal}>
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-indigo-950 flex items-center gap-2">
            <Bell className="w-6 h-6 text-rose-500" /> Notificações
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 my-4 text-xs font-bold">
          <div className="p-3 bg-blue-50 rounded-2xl border-2 border-indigo-950">
            💧 Lembrete de Água: Hora de beber um copo de água!
          </div>
          <div className="p-3 bg-pink-50 rounded-2xl border-2 border-indigo-950">
            💊 Medicamento: Multivitamínico agendado para hoje.
          </div>
          <div className="p-3 bg-amber-50 rounded-2xl border-2 border-indigo-950">
            🏆 Bônus: Você ganhou 50 pontos por manter o streak!
          </div>
        </div>
      </Dialog>
      {/* ===================== PHARMACIST REQUEST MODAL ===================== */}
      <Dialog open={showPharmacistModal} onOpenChange={setShowPharmacistModal}>
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-indigo-950 flex items-center gap-2">
            🩺 Solicitar Farmacêutico
          </DialogTitle>
          <DialogDescription className="text-xs font-bold text-slate-500">
            Informe o usuário do farmacêutico qualificado para solicitar orientação e ganhar +5% XP em todas as atividades.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 my-4">
          {/* Explicação */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-3 space-y-2">
            <p className="text-xs font-black text-purple-900">Como funciona?</p>
            <div className="space-y-1.5 text-[11px] font-bold text-purple-800">
              <div className="flex items-start gap-2">
                <span>1️⃣</span>
                <span>Digite o usuário do farmacêutico cadastrado no FarmHero.</span>
              </div>
              <div className="flex items-start gap-2">
                <span>2️⃣</span>
                <span>O farmacêutico receberá uma notificação para aceitar ou recusar sua solicitação.</span>
              </div>
              <div className="flex items-start gap-2">
                <span>3️⃣</span>
                <span>Após a aceitação, o bônus de <span className="text-purple-600 font-black">+5% XP</span> será ativado automaticamente em todas as suas atividades de saúde.</span>
              </div>
            </div>
          </div>

          {/* Input do usuário */}
          <div className="space-y-2">
            <label className="text-xs font-black text-indigo-950 block">
              Usuário do Farmacêutico
            </label>
            <div className="flex gap-2">
              <span className="flex items-center px-3 bg-slate-100 border-2 border-r-0 border-indigo-950 rounded-l-xl text-sm font-black text-slate-500">
                @
              </span>
              <input
                type="text"
                value={pharmacistUsername}
                onChange={(e) => setPharmacistUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                placeholder="usuario.farmaceutico"
                className="flex-1 border-2 border-indigo-950 rounded-r-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <p className="text-[10px] font-bold text-slate-400">
              Ex: dr.joao.silva, farmacia.central, etc.
            </p>
          </div>

          {/* Aviso */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-2.5 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[10px] font-bold text-amber-800">
              Apenas farmacêuticos qualificados e cadastrados no app podem aceitar solicitações. O bônus só é ativado após a confirmação.
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowPharmacistModal(false)}
              className="flex-1 py-2.5 border-2 border-indigo-950 rounded-xl font-black text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={pharmacistUsername.trim().length < 3}
              onClick={() => {
                if (pharmacistUsername.trim().length >= 3) {
                  setPharmacistPending(true);
                  setShowPharmacistModal(false);
                }
              }}
              className="flex-1 py-2.5 bg-purple-600 border-2 border-indigo-950 rounded-xl font-black text-sm text-white shadow-[2px_2px_0px_#1e1b4b] hover:bg-purple-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Enviar Solicitação
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
