import React, { useState } from "react";
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
  Clock,
  Calendar,
  Filter,
  ChevronRight,
  TrendingUp,
  HeartPulse,
} from "lucide-react";

type Category =
  | "todos"
  | "agua"
  | "alimentacao"
  | "atividade"
  | "glicemia"
  | "pressao"
  | "humor"
  | "medicamentos";

const CATEGORY_OPTIONS: {
  value: Category;
  label: string;
  icon: React.ElementType;
  color: string;
}[] = [
  { value: "todos", label: "Todos", icon: Filter, color: "bg-gray-100 text-gray-600" },
  { value: "agua", label: "Água", icon: Droplets, color: "bg-cyan-100 text-cyan-700" },
  {
    value: "alimentacao",
    label: "Alimentação",
    icon: Utensils,
    color: "bg-emerald-100 text-emerald-700",
  },
  { value: "atividade", label: "Atividade", icon: Dumbbell, color: "bg-amber-100 text-amber-700" },
  { value: "glicemia", label: "Glicemia", icon: Activity, color: "bg-rose-100 text-rose-700" },
  { value: "pressao", label: "Pressão", icon: HeartPulse, color: "bg-purple-100 text-purple-700" },
  { value: "humor", label: "Humor", icon: Smile, color: "bg-yellow-100 text-yellow-700" },
  { value: "medicamentos", label: "Medicamentos", icon: Pill, color: "bg-pink-100 text-pink-700" },
];

export const HistoricoRoute: React.FC = () => {
  const { waterLogs, meals, activities, glucoseLogs, pressureLogs, moodLogs, medications } =
    useAppState();
  const {
    isDark,
    cardBgClass,
    cardBorderClass,
    textPrimaryClass,
    textSecondaryClass,
    pageBgClass,
  } = useTheme();
  const [activeCategory, setActiveCategory] = useState<Category>("todos");

  // Build unified event list
  const allEvents: {
    id: string;
    category: Category;
    title: string;
    detail: string;
    time: string;
    icon: React.ElementType;
    color: string;
  }[] = [
    ...waterLogs.map((e) => ({
      id: e.id,
      category: "agua" as Category,
      title: "Hidratação registrada",
      detail: `${e.amountMl} ml de água`,
      time: e.time,
      icon: Droplets,
      color: "text-cyan-500",
    })),
    ...meals.map((e) => ({
      id: e.id,
      category: "alimentacao" as Category,
      title: `Refeição: ${e.type}`,
      detail: `${e.name} — ${e.calories} kcal`,
      time: e.time,
      icon: Utensils,
      color: "text-emerald-500",
    })),
    ...activities.map((e) => ({
      id: e.id,
      category: "atividade" as Category,
      title: e.title,
      detail: `${e.durationMinutes} min • ${e.caloriesBurned} kcal`,
      time: e.time,
      icon: Dumbbell,
      color: "text-amber-500",
    })),
    ...glucoseLogs.map((e) => ({
      id: e.id,
      category: "glicemia" as Category,
      title: "Glicemia registrada",
      detail: `${e.value} mg/dL — ${e.timing}`,
      time: e.time,
      icon: Activity,
      color: "text-rose-500",
    })),
    ...pressureLogs.map((e) => ({
      id: e.id,
      category: "pressao" as Category,
      title: "Pressão arterial",
      detail: `${e.systolic}/${e.diastolic} mmHg • Pulso: ${e.pulse}`,
      time: e.time,
      icon: HeartPulse,
      color: "text-purple-500",
    })),
    ...moodLogs.map((e) => ({
      id: e.id,
      category: "humor" as Category,
      title: "Diário de humor",
      detail: e.mood + (e.note ? ` — ${e.note}` : ""),
      time: e.time,
      icon: Smile,
      color: "text-yellow-500",
    })),
    ...medications
      .filter((m) => m.taken)
      .map((m) => ({
        id: m.id,
        category: "medicamentos" as Category,
        title: "Medicamento tomado",
        detail: `${m.name} ${m.dosage} — ${m.scheduledTime}`,
        time: m.scheduledTime,
        icon: Pill,
        color: "text-pink-500",
      })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const filtered =
    activeCategory === "todos" ? allEvents : allEvents.filter((e) => e.category === activeCategory);

  const formatTime = (t: string) => {
    try {
      const d = new Date(t);
      if (isNaN(d.getTime())) return t;
      return d.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return t;
    }
  };

  return (
    <div className={`p-4 space-y-4 font-sans animate-in fade-in duration-200 ${pageBgClass}`}>
      {/* Header */}
      <div className={`rounded-3xl p-4 flex items-center gap-3 ${cardBgClass} ${cardBorderClass}`}>
        <div className="w-12 h-12 rounded-2xl bg-[#1a7a4a] text-white flex items-center justify-center shrink-0">
          <Clock className="w-7 h-7" />
        </div>
        <div>
          <h1 className={`text-base font-black leading-tight ${textPrimaryClass}`}>
            Histórico de Atividades
          </h1>
          <p className={`text-xs font-bold ${textSecondaryClass}`}>
            Acompanhe tudo o que você registrou ao longo do tempo.
          </p>
        </div>
      </div>

      {/* Filtros de categoria */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORY_OPTIONS.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                isActive
                  ? "bg-[#1a7a4a] text-white border-[#1a7a4a] shadow-sm"
                  : isDark
                    ? "bg-slate-800 border-slate-700 text-slate-400"
                    : "bg-white border-gray-200 text-gray-600"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Stats resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Registros totais",
            value: allEvents.length,
            icon: TrendingUp,
            color: "text-[#1a7a4a] bg-green-50",
          },
          {
            label: "Água",
            value: waterLogs.length,
            icon: Droplets,
            color: "text-cyan-600 bg-cyan-50",
          },
          {
            label: "Atividades",
            value: activities.length,
            icon: Dumbbell,
            color: "text-amber-600 bg-amber-50",
          },
          {
            label: "Refeições",
            value: meals.length,
            icon: Utensils,
            color: "text-emerald-600 bg-emerald-50",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`rounded-2xl p-3 flex items-center gap-3 ${cardBgClass} ${cardBorderClass}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-lg font-black ${textPrimaryClass}`}>{stat.value}</div>
                <div className={`text-[10px] font-bold ${textSecondaryClass}`}>{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lista de eventos */}
      {filtered.length === 0 ? (
        <div className={`rounded-3xl p-10 text-center ${cardBgClass} ${cardBorderClass}`}>
          <Calendar className={`w-12 h-12 mx-auto mb-3 opacity-30 ${textSecondaryClass}`} />
          <p className={`font-bold text-sm ${textSecondaryClass}`}>Nenhum registro encontrado.</p>
          <p className={`text-xs mt-1 ${textSecondaryClass}`}>
            Comece a registrar sua saúde para ver o histórico aqui.
          </p>
        </div>
      ) : (
        <div className={`rounded-3xl overflow-hidden ${cardBgClass} ${cardBorderClass}`}>
          <div className={`px-4 py-3 border-b ${isDark ? "border-slate-700" : "border-gray-100"}`}>
            <p className={`text-xs font-black ${textSecondaryClass}`}>
              {filtered.length} registro{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {filtered.map((event) => {
              const Icon = event.icon;
              return (
                <div
                  key={event.id}
                  className={`flex items-center gap-3 px-4 py-3 ${isDark ? "divide-slate-700" : ""}`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isDark ? "bg-slate-800" : "bg-gray-50"}`}
                  >
                    <Icon
                      className={`w-4.5 h-4.5 ${event.color}`}
                      style={{ width: 18, height: 18 }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${textPrimaryClass}`}>
                      {event.title}
                    </p>
                    <p className={`text-xs truncate ${textSecondaryClass}`}>{event.detail}</p>
                  </div>
                  <div className={`text-[10px] font-bold shrink-0 ${textSecondaryClass}`}>
                    {formatTime(event.time)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
