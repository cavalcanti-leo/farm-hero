import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAppState } from "@/lib/app-state";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import {
  getExamRequests,
  saveExamRequest,
  incrementPharmacistPatients,
  type ExamRequest,
} from "@/lib/database";
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
  HeartPulse,
  Stethoscope,
  UserCheck,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const SaudeRoute: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const {
    waterLogs,
    waterGoalMl,
    meals,
    activities,
    glucoseLogs,
    pressureLogs,
    moodLogs,
    medications,
    femaleLog,
    gainXpAndCoins,
  } = useAppState();

  const {
    isDark,
    isLight,
    isClassic,
    pageBgClass,
    cardBgClass,
    cardBorderClass,
    textPrimaryClass,
    textSecondaryClass,
    bgStyle,
  } = useTheme();

  const isPharmacist = currentUser?.role === "farmaceutico";

  // ── Estados da Central Clínica (Farmacêutico) ──────────────────────────────
  const [requests, setRequests] = useState<ExamRequest[]>([]);
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<ExamRequest | null>(null);
  const [systolic, setSystolic] = useState("120");
  const [diastolic, setDiastolic] = useState("80");
  const [glucose, setGlucose] = useState("95");
  const [advice, setAdvice] = useState("");
  const [healthStatus, setHealthStatus] = useState<"Controlado 🎯" | "Estável ✅" | "Atenção ⚠️">("Controlado 🎯");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isPharmacist) {
      const allReqs = getExamRequests();
      setRequests(allReqs.filter((r) => currentUser.isDev || r.pharmacistId === currentUser.id));
    }
  }, [isPharmacist, currentUser]);

  const handleEvaluate = async () => {
    if (!selectedReq || !currentUser) return;
    setSubmitting(true);

    const updated: ExamRequest = {
      ...selectedReq,
      status: "avaliado",
      evaluatedAt: new Date().toISOString(),
      evaluationNotes: advice.trim() || "Avaliação clínica farmacêutica concluída com sucesso.",
      evaluationMetrics: {
        systolic: Number(systolic) || undefined,
        diastolic: Number(diastolic) || undefined,
        glucose: Number(glucose) || undefined,
        status: healthStatus,
        advice: advice.trim(),
      },
    };

    saveExamRequest(updated);
    await incrementPharmacistPatients(currentUser.id);
    await refreshUser();

    // Tarefa diária do farmacêutico: avaliar paciente
    gainXpAndCoins(100, 50, "Avaliação de Saúde de Paciente");

    toast.success(
      `Avaliação de ${selectedReq.patientName} registrada com sucesso! +50 Moedas e +100 XP liberados! 🎉`,
    );

    setEvalModalOpen(false);
    setAdvice("");
    setSubmitting(false);

    const allReqs = getExamRequests();
    setRequests(allReqs.filter((r) => currentUser.isDev || r.pharmacistId === currentUser.id));
  };

  // ════════════════════════════════════════════════════════════════════════════
  //  SE FOR FARMACÊUTICO: Renderiza a Avaliação de Saúde dos Pacientes
  // ════════════════════════════════════════════════════════════════════════════
  if (isPharmacist) {
    const pendingList = requests.filter((r) => r.status === "pendente");
    const evaluatedList = requests.filter((r) => r.status === "avaliado");

    return (
      <div
        className={`p-4 space-y-4 font-sans animate-in fade-in duration-200 ${pageBgClass}`}
        style={bgStyle}
      >
        {/* Banner do Módulo Clínico */}
        <div className={`rounded-3xl p-4 flex items-center gap-3 ${cardBgClass} ${cardBorderClass}`}>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center border-2 border-emerald-900/30 shrink-0 shadow-md">
            <Stethoscope className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-base font-black leading-tight ${textPrimaryClass}`}>
                Avaliação de Saúde dos Pacientes
              </h1>
              <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                Módulo Clínico
              </span>
            </div>
            <p className={`text-xs font-bold ${textSecondaryClass} mt-0.5`}>
              Analise os sinais vitais, registre exames e emita pareceres farmacêuticos para os pacientes.
            </p>
          </div>
        </div>

        {/* Resumo de Atividades Clínicas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className={`rounded-2xl p-3 border ${cardBgClass} ${cardBorderClass}`}>
            <span className="text-[10px] font-black text-amber-500 block">Aguardando Avaliação</span>
            <span className="text-xl font-black text-amber-400">{pendingList.length}</span>
            <span className={`text-[10px] font-bold ${textSecondaryClass} block mt-0.5`}>
              solicitações pendentes
            </span>
          </div>
          <div className={`rounded-2xl p-3 border ${cardBgClass} ${cardBorderClass}`}>
            <span className="text-[10px] font-black text-emerald-500 block">Pacientes Avaliados</span>
            <span className="text-xl font-black text-emerald-400">
              {currentUser.patientsServed || evaluatedList.length}
            </span>
            <span className={`text-[10px] font-bold ${textSecondaryClass} block mt-0.5`}>
              atendimentos feitos
            </span>
          </div>
          <div
            className={`col-span-2 sm:col-span-1 rounded-2xl p-3 border ${cardBgClass} ${cardBorderClass}`}
          >
            <span className="text-[10px] font-black text-purple-400 block">Missão Diária</span>
            <span className="text-xs font-black text-white flex items-center gap-1 mt-1">
              {evaluatedList.length > 0 ? "✅ Avaliação Realizada" : "⏳ Avaliar 1 Paciente"}
            </span>
            <span className={`text-[10px] font-bold ${textSecondaryClass} block mt-0.5`}>
              Gera +50 Moedas e +100 XP
            </span>
          </div>
        </div>

        {/* Pacientes Pendentes de Avaliação */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className={`text-xs font-black uppercase tracking-wider ${textPrimaryClass} flex items-center gap-1.5`}>
              <Clock className="w-4 h-4 text-amber-400" /> Pacientes para Avaliar Hoje
            </h2>
            <Link href="/indicadores" className="text-[11px] font-black text-emerald-400 hover:underline">
              Ver Fila Completa ➔
            </Link>
          </div>

          {pendingList.length === 0 ? (
            <div className={`rounded-3xl p-6 text-center space-y-2 ${cardBgClass} ${cardBorderClass}`}>
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400 opacity-60" />
              <h3 className={`text-xs font-black ${textPrimaryClass}`}>
                Todos os pacientes foram avaliados!
              </h3>
              <p className={`text-[11px] font-bold ${textSecondaryClass} max-w-xs mx-auto`}>
                Novas solicitações de exames de pacientes aparecerão automaticamente aqui para sua avaliação clínica.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {pendingList.map((req) => (
                <div
                  key={req.id}
                  className={`rounded-2xl p-3.5 border-2 border-amber-400/60 flex items-center justify-between gap-3 ${cardBgClass}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow">
                      {req.patientName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className={`text-xs font-black truncate ${textPrimaryClass}`}>
                        {req.patientName}
                      </h4>
                      <p className="text-[11px] font-bold text-amber-300 flex items-center gap-1 mt-0.5">
                        <Activity className="w-3 h-3" /> Exame: {req.examType}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReq(req);
                      setEvalModalOpen(true);
                    }}
                    className="shrink-0 text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-1.5 rounded-xl shadow active:scale-95 transition-all"
                  >
                    Avaliar Agora 🩺
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Histórico de Pacientes Avaliados */}
        {evaluatedList.length > 0 && (
          <div className="space-y-3 pt-2">
            <h2 className={`text-xs font-black uppercase tracking-wider ${textPrimaryClass} flex items-center gap-1.5`}>
              <UserCheck className="w-4 h-4 text-emerald-400" /> Últimas Avaliações Realizadas
            </h2>
            <div className="space-y-2">
              {evaluatedList.slice(0, 5).map((req) => (
                <div
                  key={req.id}
                  className={`rounded-2xl p-3 border ${cardBgClass} ${cardBorderClass} flex items-center justify-between gap-2`}
                >
                  <div>
                    <h4 className={`text-xs font-black ${textPrimaryClass}`}>{req.patientName}</h4>
                    <p className={`text-[10px] font-bold ${textSecondaryClass} mt-0.5`}>
                      {req.examType} • {req.evaluationMetrics?.status || "Avaliado"}
                    </p>
                  </div>
                  <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
                    Concluído ✅
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== MODAL DE AVALIAÇÃO ===================== */}
        <Dialog open={evalModalOpen} onOpenChange={setEvalModalOpen}>
          <DialogHeader>
            <DialogTitle className="text-base font-black text-indigo-950 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-emerald-600" />
              Avaliar {selectedReq?.patientName}
            </DialogTitle>
            <DialogDescription className="text-xs font-bold text-slate-500">
              Registre a aferição clínica para {selectedReq?.examType}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-black text-slate-700 block">
                Pressão Arterial (Sistólica / Diastólica mmHg)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  placeholder="120"
                  className="w-full rounded-xl border-2 border-slate-300 p-2 font-bold text-center"
                />
                <input
                  type="number"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  placeholder="80"
                  className="w-full rounded-xl border-2 border-slate-300 p-2 font-bold text-center"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-black text-slate-700 block">Glicemia (mg/dL)</label>
              <input
                type="number"
                value={glucose}
                onChange={(e) => setGlucose(e.target.value)}
                placeholder="95"
                className="w-full rounded-xl border-2 border-slate-300 p-2 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-black text-slate-700 block">Parecer de Saúde</label>
              <div className="flex gap-1">
                {(["Controlado 🎯", "Estável ✅", "Atenção ⚠️"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setHealthStatus(st)}
                    className={`flex-1 py-1.5 text-xs font-black rounded-xl border ${
                      healthStatus === st
                        ? "bg-emerald-600 text-white border-emerald-700 shadow"
                        : "bg-slate-100 text-slate-700 border-slate-300"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-black text-slate-700 block">Orientações Farmacêuticas</label>
              <textarea
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                rows={3}
                placeholder="Ex: Parâmetros controlados. Orientado a manter ingestão de água e horários da medicação."
                className="w-full rounded-xl border-2 border-slate-300 p-2 font-medium text-xs"
              />
            </div>

            <Button
              onClick={handleEvaluate}
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs rounded-xl shadow mt-2"
            >
              {submitting ? "Registrando..." : "Registrar Avaliação & Concluir Missão 🪙"}
            </Button>
          </div>
        </Dialog>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  SE FOR PACIENTE: Mantém as Métricas de Saúde Pessoal
  // ════════════════════════════════════════════════════════════════════════════
  const totalWater = waterLogs.reduce((acc, curr) => acc + curr.amountMl, 0);
  const totalCalories = meals.reduce((acc, curr) => acc + curr.calories, 0);
  const totalBurned = activities.reduce((acc, curr) => acc + curr.caloriesBurned, 0);
  const latestGlucose = glucoseLogs[0]?.value || "--";
  const latestPressure = pressureLogs[0]
    ? `${pressureLogs[0].systolic}/${pressureLogs[0].diastolic}`
    : "--/--";
  const latestMood = moodLogs[0]?.mood || "Neutro";
  const totalMeds = medications.length;
  const tomadosMeds = medications.filter((m) => m.taken).length;

  const modules = [
    {
      title: "Hidratação (Água)",
      desc: `${totalWater}ml de ${waterGoalMl}ml`,
      badge: `${Math.min(100, Math.round((totalWater / waterGoalMl) * 100))}% da meta`,
      icon: Droplets,
      bgColor: "bg-cyan-400",
      badgeColor: isDark
        ? "bg-cyan-950 text-cyan-300 border-cyan-800"
        : "bg-cyan-100 text-cyan-800 border-cyan-300",
      link: "/saude/agua",
    },
    {
      title: "Alimentação & Nutrição",
      desc: `${meals.length} refeições (${totalCalories} kcal)`,
      badge: `${totalCalories} kcal`,
      icon: Utensils,
      bgColor: "bg-emerald-400",
      badgeColor: isDark
        ? "bg-emerald-950 text-emerald-300 border-emerald-800"
        : "bg-emerald-100 text-emerald-800 border-emerald-300",
      link: "/saude/alimentacao",
    },
    {
      title: "Atividade Física",
      desc: `${activities.length} treino(s) • ${totalBurned} kcal`,
      badge: `${totalBurned} kcal gastas`,
      icon: Dumbbell,
      bgColor: "bg-amber-400",
      badgeColor: isDark
        ? "bg-amber-950 text-amber-300 border-amber-800"
        : "bg-amber-100 text-amber-800 border-amber-300",
      link: "/saude/atividade",
    },
    {
      title: "Controle de Glicemia",
      desc: `Última: ${latestGlucose} mg/dL`,
      badge: `${latestGlucose} mg/dL`,
      icon: Activity,
      bgColor: "bg-rose-400",
      badgeColor: isDark
        ? "bg-rose-950 text-rose-300 border-rose-800"
        : "bg-rose-100 text-rose-800 border-rose-300",
      link: "/saude/glicemia",
    },
    {
      title: "Pressão Arterial",
      desc: `Última: ${latestPressure} mmHg`,
      badge: "Cardio",
      icon: ShieldCheck,
      bgColor: "bg-purple-400",
      badgeColor: isDark
        ? "bg-purple-950 text-purple-300 border-purple-800"
        : "bg-purple-100 text-purple-800 border-purple-300",
      link: "/saude/pressao",
    },
    {
      title: "Diário de Humor",
      desc: `Atual: ${latestMood}`,
      badge: latestMood,
      icon: Smile,
      bgColor: "bg-yellow-400",
      badgeColor: isDark
        ? "bg-yellow-950 text-yellow-300 border-yellow-800"
        : "bg-yellow-100 text-yellow-800 border-yellow-300",
      link: "/saude/humor",
    },
    {
      title: "Medicamentos",
      desc: `${tomadosMeds} de ${totalMeds} tomados`,
      badge: `${tomadosMeds}/${totalMeds} tomados`,
      icon: Pill,
      bgColor: "bg-pink-400",
      badgeColor: isDark
        ? "bg-pink-950 text-pink-300 border-pink-800"
        : "bg-pink-100 text-pink-800 border-pink-300",
      link: "/saude/medicamentos",
    },
    {
      title: "Saúde Feminina",
      desc: `Dia ${femaleLog.cycleDay} do ciclo`,
      badge: `Dia ${femaleLog.cycleDay}`,
      icon: Sparkles,
      bgColor: "bg-fuchsia-400",
      badgeColor: isDark
        ? "bg-fuchsia-950 text-fuchsia-300 border-fuchsia-800"
        : "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300",
      link: "/saude/feminina",
    },
  ];

  return (
    <div
      className={`p-4 space-y-4 font-sans animate-in fade-in duration-200 ${pageBgClass}`}
      style={bgStyle}
    >
      {/* Page Title Paciente */}
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

      {/* Cards de Saúde do Paciente */}
      <div className="space-y-3">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link key={mod.link} href={mod.link} className="block">
              <div
                className={`rounded-3xl p-3.5 flex items-center justify-between gap-3 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer ${cardBgClass} ${cardBorderClass}`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${mod.bgColor} border-2 border-indigo-950/20 flex items-center justify-center text-white shrink-0 shadow-sm`}
                >
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`text-sm font-black truncate ${textPrimaryClass}`}>
                      {mod.title}
                    </h3>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${mod.badgeColor}`}
                    >
                      {mod.badge}
                    </span>
                  </div>
                  <p className={`text-xs font-bold truncate mt-0.5 ${textSecondaryClass}`}>
                    {mod.desc}
                  </p>
                </div>

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-purple-400"
                      : "bg-purple-50 border-purple-200 text-purple-700"
                  }`}
                >
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
