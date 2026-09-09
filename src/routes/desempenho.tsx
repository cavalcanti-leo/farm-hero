import React from "react";
import { useAppState } from "@/lib/app-state";
import { useTheme } from "@/lib/theme-context";
import {
  TrendingUp,
  Droplets,
  Utensils,
  Dumbbell,
  Heart,
  CheckCircle2,
  AlertCircle,
  Star,
  Flame,
  Activity,
  Award,
} from "lucide-react";

const HealthBar: React.FC<{ value: number; color: string }> = ({ value, color }) => (
  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
    <div
      className={`h-2 rounded-full transition-all duration-700 ${color}`}
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

const StatusBadge: React.FC<{ value: number }> = ({ value }) => {
  if (value >= 80)
    return (
      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-green-100 text-green-700">
        Ótimo ✅
      </span>
    );
  if (value >= 50)
    return (
      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
        Em progresso ⚡
      </span>
    );
  return (
    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-100 text-red-700">
      Atenção ⚠️
    </span>
  );
};

export const DesempenhoRoute: React.FC = () => {
  const {
    waterLogs,
    waterGoalMl,
    meals,
    activities,
    medications,
    glucoseLogs,
    pressureLogs,
    moodLogs,
    level,
    xp,
    maxXp,
    streakDays,
    coins,
  } = useAppState();
  const {
    isDark,
    cardBgClass,
    cardBorderClass,
    textPrimaryClass,
    textSecondaryClass,
    pageBgClass,
  } = useTheme();

  // ── Calcular scores de saúde ──────────────────────────────────────
  const totalWater = waterLogs.reduce((a, c) => a + c.amountMl, 0);
  const waterScore = Math.min(100, Math.round((totalWater / waterGoalMl) * 100));

  const totalCal = meals.reduce((a, c) => a + c.calories, 0);
  const nutritionScore = Math.min(100, Math.round((Math.min(totalCal, 2000) / 2000) * 100));

  const activityScore = Math.min(100, activities.length * 20);

  const medsTaken = medications.filter((m) => m.taken).length;
  const medScore =
    medications.length > 0 ? Math.round((medsTaken / medications.length) * 100) : 100;

  const glucoseScore =
    glucoseLogs.length > 0
      ? glucoseLogs[0].value >= 70 && glucoseLogs[0].value <= 140
        ? 100
        : 50
      : 50;
  const pressureScore = pressureLogs.length > 0 ? (pressureLogs[0].systolic <= 130 ? 100 : 60) : 60;

  const moodMap = { Ótimo: 100, Bem: 80, Neutro: 60, Cansado: 40, Estressado: 20 };
  const moodScore = moodLogs.length > 0 ? (moodMap[moodLogs[0].mood] ?? 60) : 60;

  const overallScore = Math.round(
    (waterScore +
      nutritionScore +
      activityScore +
      medScore +
      glucoseScore +
      pressureScore +
      moodScore) /
      7,
  );

  const metrics = [
    {
      label: "Hidratação",
      value: waterScore,
      detail: `${totalWater}ml / ${waterGoalMl}ml`,
      icon: Droplets,
      color: "bg-cyan-500",
    },
    {
      label: "Nutrição",
      value: nutritionScore,
      detail: `${totalCal} kcal hoje`,
      icon: Utensils,
      color: "bg-emerald-500",
    },
    {
      label: "Atividade Física",
      value: activityScore,
      detail: `${activities.length} treino(s) registrado(s)`,
      icon: Dumbbell,
      color: "bg-amber-500",
    },
    {
      label: "Medicamentos",
      value: medScore,
      detail: `${medsTaken} de ${medications.length} tomados`,
      icon: Activity,
      color: "bg-pink-500",
    },
    {
      label: "Glicemia",
      value: glucoseScore,
      detail: glucoseLogs[0] ? `${glucoseLogs[0].value} mg/dL` : "Sem dados",
      icon: Heart,
      color: "bg-rose-500",
    },
    {
      label: "Pressão Arterial",
      value: pressureScore,
      detail: pressureLogs[0]
        ? `${pressureLogs[0].systolic}/${pressureLogs[0].diastolic} mmHg`
        : "Sem dados",
      icon: Activity,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className={`p-4 space-y-4 font-sans animate-in fade-in duration-200 ${pageBgClass}`}>
      {/* Header */}
      <div className={`rounded-3xl p-4 flex items-center gap-3 ${cardBgClass} ${cardBorderClass}`}>
        <div className="w-12 h-12 rounded-2xl bg-[#1a7a4a] text-white flex items-center justify-center shrink-0">
          <TrendingUp className="w-7 h-7" />
        </div>
        <div>
          <h1 className={`text-base font-black leading-tight ${textPrimaryClass}`}>
            Desempenho de Saúde
          </h1>
          <p className={`text-xs font-bold ${textSecondaryClass}`}>
            Sua saúde está ficando cada vez mais em dia 💪
          </p>
        </div>
      </div>

      {/* Score geral */}
      <div
        className={`rounded-3xl p-6 flex flex-col items-center text-center gap-2 ${cardBgClass} ${cardBorderClass}`}
      >
        <div className="relative w-28 h-28">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={isDark ? "#1e293b" : "#f0f4f8"}
              strokeWidth="12"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={overallScore >= 80 ? "#1a7a4a" : overallScore >= 50 ? "#f59e0b" : "#ef4444"}
              strokeWidth="12"
              strokeDasharray={`${(overallScore / 100) * 264} 264`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-black ${textPrimaryClass}`}>{overallScore}%</span>
            <span className={`text-[9px] font-bold ${textSecondaryClass}`}>SAÚDE</span>
          </div>
        </div>

        <div>
          <p className={`font-black text-base ${textPrimaryClass}`}>
            {overallScore >= 80
              ? "🏆 Saúde em dia!"
              : overallScore >= 50
                ? "⚡ Progredindo bem!"
                : "💡 Ainda melhorando!"}
          </p>
          <p className={`text-xs font-bold ${textSecondaryClass} mt-0.5`}>
            {overallScore >= 80
              ? "Seus hábitos estão excelentes. Continue assim!"
              : overallScore >= 50
                ? "Você está no caminho certo. Mantenha o ritmo!"
                : "Registre mais hábitos para melhorar seu desempenho!"}
          </p>
        </div>

        {/* Streak & XP */}
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-xl">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-black text-orange-700">{streakDays} dias seguidos</span>
          </div>
          <div className="flex items-center gap-1.5 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl">
            <Star className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-black text-purple-700">Nível {level}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-xl">
            <Award className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-black text-yellow-700">{coins} moedas</span>
          </div>
        </div>
      </div>

      {/* Métricas individuais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className={`rounded-2xl p-4 ${cardBgClass} ${cardBorderClass}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${m.color} bg-opacity-15`}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{
                        color: m.color.replace("bg-", "").includes("-") ? undefined : undefined,
                      }}
                    />
                  </div>
                  <span className={`text-sm font-black ${textPrimaryClass}`}>{m.label}</span>
                </div>
                <StatusBadge value={m.value} />
              </div>
              <HealthBar value={m.value} color={m.color} />
              <div className="flex items-center justify-between mt-1.5">
                <span className={`text-[11px] font-bold ${textSecondaryClass}`}>{m.detail}</span>
                <span className={`text-[11px] font-black ${textPrimaryClass}`}>{m.value}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conquistas */}
      <div className={`rounded-3xl p-4 ${cardBgClass} ${cardBorderClass}`}>
        <h2 className={`font-black text-sm mb-3 ${textPrimaryClass}`}>🏅 Conquistas Recentes</h2>
        <div className="space-y-2">
          {[
            { label: "Meta de água atingida", ok: waterScore >= 100 },
            { label: "Medicamentos em dia", ok: medScore === 100 },
            { label: "Atividade física registrada", ok: activities.length > 0 },
            { label: "Glicemia controlada", ok: glucoseScore === 100 },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-2.5">
              {c.ok ? (
                <CheckCircle2 className="w-5 h-5 text-[#1a7a4a] shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-gray-300 shrink-0" />
              )}
              <span
                className={`text-sm font-semibold ${c.ok ? textPrimaryClass : textSecondaryClass}`}
              >
                {c.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
