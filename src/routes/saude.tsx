import React from "react";
import { Link } from "wouter";
import { useAppState } from "@/lib/app-state";
import { useTheme } from "@/lib/theme-context";
import {
  Droplets,
  Utensils,
  Dumbbell,
  Activity,
  Smile,
  Pill,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  HeartPulse
} from "lucide-react";

export const SaudeRoute: React.FC = () => {
  const {
    waterLogs,
    waterGoalMl,
    meals,
    activities,
    glucoseLogs,
    pressureLogs,
    moodLogs,
    medications,
    femaleLog
  } = useAppState();

  const { isDark, isLight, isClassic, pageBgClass, cardBgClass, cardBorderClass, textPrimaryClass, textSecondaryClass } = useTheme();

  const totalWater = waterLogs.reduce((acc, curr) => acc + curr.amountMl, 0);
  const totalCalories = meals.reduce((acc, curr) => acc + curr.calories, 0);
  const totalBurned = activities.reduce((acc, curr) => acc + curr.caloriesBurned, 0);
  const latestGlucose = glucoseLogs[0]?.value || "--";
  const latestPressure = pressureLogs[0] ? `${pressureLogs[0].systolic}/${pressureLogs[0].diastolic}` : "--/--";
  const latestMood = moodLogs[0]?.mood || "Neutro";
  const totalMeds = medications.length;
  const tomadosMeds = medications.filter(m => m.taken).length;

  const modules = [
    {
      title: "Hidratação (Água)",
      desc: `${totalWater}ml de ${waterGoalMl}ml`,
      badge: `${Math.min(100, Math.round((totalWater / waterGoalMl) * 100))}% da meta`,
      icon: Droplets,
      bgColor: "bg-cyan-400",
      badgeColor: isDark ? "bg-cyan-950 text-cyan-300 border-cyan-800" : "bg-cyan-100 text-cyan-800 border-cyan-300",
      link: "/saude/agua",
    },
    {
      title: "Alimentação & Nutrição",
      desc: `${meals.length} refeições (${totalCalories} kcal)`,
      badge: `${totalCalories} kcal`,
      icon: Utensils,
      bgColor: "bg-emerald-400",
      badgeColor: isDark ? "bg-emerald-950 text-emerald-300 border-emerald-800" : "bg-emerald-100 text-emerald-800 border-emerald-300",
      link: "/saude/alimentacao",
    },
    {
      title: "Atividade Física",
      desc: `${activities.length} treino(s) • ${totalBurned} kcal`,
      badge: `${totalBurned} kcal gastas`,
      icon: Dumbbell,
      bgColor: "bg-amber-400",
      badgeColor: isDark ? "bg-amber-950 text-amber-300 border-amber-800" : "bg-amber-100 text-amber-800 border-amber-300",
      link: "/saude/atividade",
    },
    {
      title: "Controle de Glicemia",
      desc: `Última: ${latestGlucose} mg/dL`,
      badge: `${latestGlucose} mg/dL`,
      icon: Activity,
      bgColor: "bg-rose-400",
      badgeColor: isDark ? "bg-rose-950 text-rose-300 border-rose-800" : "bg-rose-100 text-rose-800 border-rose-300",
      link: "/saude/glicemia",
    },
    {
      title: "Pressão Arterial",
      desc: `Última: ${latestPressure} mmHg`,
      badge: "Cardio",
      icon: ShieldCheck,
      bgColor: "bg-purple-400",
      badgeColor: isDark ? "bg-purple-950 text-purple-300 border-purple-800" : "bg-purple-100 text-purple-800 border-purple-300",
      link: "/saude/pressao",
    },
    {
      title: "Diário de Humor",
      desc: `Atual: ${latestMood}`,
      badge: latestMood,
      icon: Smile,
      bgColor: "bg-yellow-400",
      badgeColor: isDark ? "bg-yellow-950 text-yellow-300 border-yellow-800" : "bg-yellow-100 text-yellow-800 border-yellow-300",
      link: "/saude/humor",
    },
    {
      title: "Medicamentos",
      desc: `${tomadosMeds} de ${totalMeds} tomados`,
      badge: `${tomadosMeds}/${totalMeds} tomados`,
      icon: Pill,
      bgColor: "bg-pink-400",
      badgeColor: isDark ? "bg-pink-950 text-pink-300 border-pink-800" : "bg-pink-100 text-pink-800 border-pink-300",
      link: "/saude/medicamentos",
    },
    {
      title: "Saúde Feminina",
      desc: `Dia ${femaleLog.cycleDay} do ciclo`,
      badge: `Dia ${femaleLog.cycleDay}`,
      icon: Sparkles,
      bgColor: "bg-fuchsia-400",
      badgeColor: isDark ? "bg-fuchsia-950 text-fuchsia-300 border-fuchsia-800" : "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300",
      link: "/saude/feminina",
    },
  ];

  return (
    <div className={`p-4 space-y-4 font-sans animate-in fade-in duration-200 ${pageBgClass}`}>
      {/* Page Title */}
      <div className={`rounded-3xl p-4 flex items-center gap-3 ${cardBgClass} ${cardBorderClass}`}>
        <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center border-2 border-indigo-950/30 shrink-0">
          <HeartPulse className="w-7 h-7 animate-pulse" />
        </div>
        <div>
          <h1 className={`text-base font-black leading-tight ${textPrimaryClass}`}>
            Central de Saúde & Bem-Estar
          </h1>
          <p className={`text-xs font-bold ${textSecondaryClass}`}>
            Escolha uma categoria abaixo para registrar dados e acompanhar seu histórico.
          </p>
        </div>
      </div>

      {/* Horizontal / Single Column Cards Stack */}
      <div className="space-y-3">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link key={mod.link} href={mod.link} className="block">
              <div className={`rounded-3xl p-3.5 flex items-center justify-between gap-3 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer ${cardBgClass} ${cardBorderClass}`}>
                {/* Left Icon */}
                <div className={`w-12 h-12 rounded-2xl ${mod.bgColor} border-2 border-indigo-950/20 flex items-center justify-center text-white shrink-0 shadow-sm`}>
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>

                {/* Center Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`text-sm font-black truncate ${textPrimaryClass}`}>
                      {mod.title}
                    </h3>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${mod.badgeColor}`}>
                      {mod.badge}
                    </span>
                  </div>
                  <p className={`text-xs font-bold truncate mt-0.5 ${textSecondaryClass}`}>
                    {mod.desc}
                  </p>
                </div>

                {/* Right Arrow */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-purple-400"
                    : "bg-purple-50 border-purple-200 text-purple-700"
                }`}>
                  <ChevronRight className="w-5 h-5 stroke-[3]" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
