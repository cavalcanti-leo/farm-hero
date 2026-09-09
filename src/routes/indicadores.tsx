import React, { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { useTheme } from "@/lib/theme-context";
import { useAuth, User } from "@/lib/auth-context";
import { useAppState } from "@/lib/app-state";
import {
  getExamRequests,
  saveExamRequest,
  addPharmacistRating,
  getPharmacistRatings,
  incrementPharmacistPatients,
  type ExamRequest,
  type PharmacistRating,
} from "@/lib/database";
import {
  ShieldCheck,
  Star,
  Search,
  MapPin,
  Building,
  Award,
  ChevronRight,
  Activity,
  Heart,
  Stethoscope,
  Clock,
  UserCheck,
  CheckCircle2,
  Calendar,
  FileText,
  AlertCircle,
  Plus,
  Send,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// ── Componente de Estrelas ────────────────────────────────────────────────────
const StarRating: React.FC<{
  value: number;
  interactive?: boolean;
  onRate?: (stars: number) => void;
}> = ({ value, interactive = false, onRate }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const displayVal = hovered !== null ? hovered : value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => onRate && onRate(i)}
          onMouseEnter={() => interactive && setHovered(i)}
          onMouseLeave={() => interactive && setHovered(null)}
          className={`${interactive ? "cursor-pointer hover:scale-110 active:scale-95 transition-transform" : "cursor-default"}`}
        >
          <Star
            className={`w-4 h-4 ${
              i <= Math.round(displayVal)
                ? "text-yellow-400 fill-yellow-400"
                : "text-slate-300 dark:text-slate-600"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export const IndicadoresRoute: React.FC = () => {
  const {
    isDark,
    cardBgClass,
    cardBorderClass,
    textPrimaryClass,
    textSecondaryClass,
    pageBgClass,
  } = useTheme();
  const { currentUser, getAllUsers, refreshUser } = useAuth();
  const { gainXpAndCoins } = useAppState();

  const isPharmacist = currentUser?.role === "farmaceutico";

  // ── Estados para Paciente ──────────────────────────────────────────────────
  const [pharmacists, setPharmacists] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedPharm, setSelectedPharm] = useState<User | null>(null);

  // Modal de Avaliação por Estrelas
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [targetPharm, setTargetPharm] = useState<User | null>(null);
  const [starsGiven, setStarsGiven] = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);

  // Modal de Solicitação de Exame
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [examType, setExamType] = useState<
    "Glicemia" | "Pressão Arterial" | "Aferição Geral" | "Revisão de Medicamentos"
  >("Glicemia");
  const [examNotes, setExamNotes] = useState("");
  const [submittingExam, setSubmittingExam] = useState(false);

  // ── Estados para Farmacêutico (Fila de Pacientes) ──────────────────────────
  const [examRequests, setExamRequests] = useState<ExamRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<"todos" | "pendente" | "avaliado">("todos");

  // Modal de Avaliação Clínica do Paciente
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [evalTargetReq, setEvalTargetReq] = useState<ExamRequest | null>(null);
  const [evalSystolic, setEvalSystolic] = useState("120");
  const [evalDiastolic, setEvalDiastolic] = useState("80");
  const [evalGlucose, setEvalGlucose] = useState("95");
  const [evalAdvice, setEvalAdvice] = useState("");
  const [evalHealthStatus, setEvalHealthStatus] = useState<"Estável ✅" | "Atenção ⚠️" | "Controlado 🎯">("Controlado 🎯");
  const [submittingEval, setSubmittingEval] = useState(false);

  // ── Carregar Dados ──────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    // 1. Carrega todos os farmacêuticos
    const all = await getAllUsers();
    const pharms = all.filter((u) => u.role === "farmaceutico");
    setPharmacists(pharms);

    // 2. Carrega solicitações de exame
    const reqs = getExamRequests();
    setExamRequests(reqs);
  }, [getAllUsers]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Handler: Enviar Avaliação por Estrelas ──────────────────────────────────
  const handleSubmitRating = async () => {
    if (!targetPharm) return;
    if (!currentUser) {
      toast.error("Você precisa estar conectado para avaliar.");
      return;
    }

    setSubmittingRating(true);
    await addPharmacistRating({
      pharmacistId: targetPharm.id,
      patientId: currentUser.id,
      patientName: `${currentUser.nome} ${currentUser.sobrenome}`.trim(),
      stars: starsGiven,
      comment: ratingComment.trim() || undefined,
    });

    toast.success(`Avaliação de ${starsGiven} estrela(s) enviada para ${targetPharm.nome}! ⭐`);
    setRateModalOpen(false);
    setRatingComment("");
    setSubmittingRating(false);
    await loadData();
  };

  // ── Handler: Solicitar Exame com Farmacêutico ───────────────────────────────
  const handleRequestExam = () => {
    if (!targetPharm || !currentUser) {
      toast.error("Selecione um farmacêutico e faça login para solicitar.");
      return;
    }

    setSubmittingExam(true);
    const newReq: ExamRequest = {
      id: `exam_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      patientId: currentUser.id,
      patientName: `${currentUser.nome} ${currentUser.sobrenome}`.trim(),
      patientCpf: currentUser.cpf,
      patientBirthDate: currentUser.birthDate,
      patientCity: currentUser.city,
      patientState: currentUser.state,
      pharmacistId: targetPharm.id,
      pharmacistName: `${targetPharm.nome} ${targetPharm.sobrenome}`.trim(),
      pharmacyName: targetPharm.pharmacyName,
      branch: targetPharm.branch,
      examType,
      notes: examNotes.trim() || undefined,
      status: "pendente",
      createdAt: new Date().toISOString(),
    };

    saveExamRequest(newReq);
    toast.success(`Solicitação de ${examType} enviada com sucesso para ${targetPharm.nome}! 🩺`);
    setExamModalOpen(false);
    setExamNotes("");
    setSubmittingExam(false);
    loadData();
  };

  // ── Handler: Farmacêutico Concluir Avaliação Clínica ─────────────────────────
  const handleSubmitEvaluation = async () => {
    if (!evalTargetReq || !currentUser) return;
    setSubmittingEval(true);

    const updatedReq: ExamRequest = {
      ...evalTargetReq,
      status: "avaliado",
      evaluatedAt: new Date().toISOString(),
      evaluationNotes: evalAdvice.trim() || "Avaliação clínica concluída com sucesso.",
      evaluationMetrics: {
        systolic: Number(evalSystolic) || undefined,
        diastolic: Number(evalDiastolic) || undefined,
        glucose: Number(evalGlucose) || undefined,
        status: evalHealthStatus,
        advice: evalAdvice.trim(),
      },
    };

    saveExamRequest(updatedReq);
    await incrementPharmacistPatients(currentUser.id);
    await refreshUser();

    // Recompensa diária do Farmacêutico
    gainXpAndCoins(100, 50, "Avaliação Clínica de Paciente");

    toast.success(
      `Avaliação de ${evalTargetReq.patientName} concluída com sucesso! +50 Moedas e +100 XP adicionados! 🎉`,
    );

    setEvalModalOpen(false);
    setEvalAdvice("");
    setSubmittingEval(false);
    loadData();
  };

  // ════════════════════════════════════════════════════════════════════════════
  //  VISÃO DO FARMACÊUTICO — "Pacientes & Solicitações de Exame"
  // ════════════════════════════════════════════════════════════════════════════
  if (isPharmacist) {
    // Filtra solicitações atribuídas a este farmacêutico (ou todas se dev)
    const myRequests = examRequests.filter(
      (r) => currentUser.isDev || r.pharmacistId === currentUser.id,
    );

    const filteredRequests = myRequests.filter((r) => {
      if (filterStatus === "pendente") return r.status === "pendente";
      if (filterStatus === "avaliado") return r.status === "avaliado";
      return true;
    });

    const pendingCount = myRequests.filter((r) => r.status === "pendente").length;
    const evaluatedCount = myRequests.filter((r) => r.status === "avaliado").length;

    return (
      <div className={`p-4 space-y-4 font-sans animate-in fade-in duration-200 ${pageBgClass}`}>
        {/* Header Farmacêutico */}
        <div
          className={`rounded-3xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${cardBgClass} ${cardBorderClass}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shrink-0 shadow-md">
              <Stethoscope className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-base font-black leading-tight ${textPrimaryClass}`}>
                  Meus Pacientes & Exames
                </h1>
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  🧑‍⚕️ Farmacêutico
                </span>
              </div>
              <p className={`text-xs font-bold ${textSecondaryClass} mt-0.5`}>
                {currentUser.pharmacyName || "Sua Farmácia"} — {currentUser.branch || "Sua Filial"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-2xl px-3 py-1.5 text-center">
              <span className="text-[10px] font-black text-emerald-600 block">Atendidos</span>
              <span className="text-sm font-black text-emerald-900 dark:text-emerald-100">
                {currentUser.patientsServed || evaluatedCount}
              </span>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-2xl px-3 py-1.5 text-center">
              <span className="text-[10px] font-black text-amber-600 block">Reputação</span>
              <span className="text-sm font-black text-amber-900 dark:text-amber-100 flex items-center justify-center gap-0.5">
                {(currentUser.stars || 0).toFixed(1)} ⭐
              </span>
            </div>
          </div>
        </div>

        {/* Filtros de Status */}
        <div className="flex rounded-2xl bg-slate-800/60 p-1 border border-slate-700 gap-1">
          {[
            { id: "todos", label: `Todos (${myRequests.length})` },
            { id: "pendente", label: `Pendentes (${pendingCount}) ⏳` },
            { id: "avaliado", label: `Avaliados (${evaluatedCount}) ✅` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id as typeof filterStatus)}
              className={`flex-1 py-1.5 text-xs font-black rounded-xl transition-all ${
                filterStatus === tab.id
                  ? "bg-emerald-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lista de Solicitações de Pacientes */}
        {filteredRequests.length === 0 ? (
          <div
            className={`rounded-3xl p-8 text-center space-y-3 ${cardBgClass} ${cardBorderClass}`}
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
              <UserCheck className="w-7 h-7 stroke-[2]" />
            </div>
            <div>
              <h3 className={`text-sm font-black ${textPrimaryClass}`}>
                Nenhuma solicitação encontrada
              </h3>
              <p className={`text-xs font-bold ${textSecondaryClass} max-w-sm mx-auto mt-1`}>
                Quando os pacientes solicitarem exames (Glicemia, Pressão Arterial ou Consulta) com
                você no diretório da sua farmácia, as solicitações aparecerão aqui em tempo real.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className={`rounded-3xl p-4 border-2 transition-all space-y-3 ${cardBgClass} ${cardBorderClass} ${
                  req.status === "pendente"
                    ? "border-amber-400/70"
                    : "border-emerald-500/70 opacity-95"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow">
                      {req.patientName.charAt(0)}
                    </div>
                    <div>
                      <h3 className={`text-sm font-black ${textPrimaryClass}`}>
                        {req.patientName}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 mt-0.5 flex-wrap">
                        {req.patientCity && (
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3" />
                            {req.patientCity}
                          </span>
                        )}
                        {req.patientBirthDate && (
                          <span className="flex items-center gap-0.5">
                            <Calendar className="w-3 h-3" />
                            {req.patientBirthDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                      req.status === "pendente"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    }`}
                  >
                    {req.status === "pendente" ? "Pendente ⏳" : "Avaliado ✅"}
                  </span>
                </div>

                {/* Dados do Exame Solicitado */}
                <div className="bg-slate-800/50 dark:bg-slate-900/60 rounded-2xl p-3 border border-slate-700/60 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-purple-400" />
                      {req.examType}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {new Date(req.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  {req.notes && (
                    <p className="text-slate-300 text-[11px] font-semibold italic">
                      "{req.notes}"
                    </p>
                  )}

                  {/* Detalhes se já avaliado */}
                  {req.status === "avaliado" && req.evaluationMetrics && (
                    <div className="pt-2 mt-2 border-t border-slate-700/60 flex flex-wrap gap-3 text-[11px] font-bold text-emerald-400">
                      {req.evaluationMetrics.glucose && (
                        <span>🩸 Glicemia: {req.evaluationMetrics.glucose} mg/dL</span>
                      )}
                      {req.evaluationMetrics.systolic && req.evaluationMetrics.diastolic && (
                        <span>
                          💓 Pressão: {req.evaluationMetrics.systolic}/
                          {req.evaluationMetrics.diastolic} mmHg
                        </span>
                      )}
                      <span>Status: {req.evaluationMetrics.status}</span>
                    </div>
                  )}
                </div>

                {/* Ação: Avaliar Paciente */}
                {req.status === "pendente" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEvalTargetReq(req);
                      setEvalModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-md active:scale-95 transition-all"
                  >
                    <Stethoscope className="w-4 h-4" />
                    Realizar Avaliação Clínica do Paciente
                  </button>
                ) : (
                  <div className="text-right">
                    <span className="text-[10px] font-black text-emerald-400">
                      Atendimento concluído em{" "}
                      {req.evaluatedAt
                        ? new Date(req.evaluatedAt).toLocaleDateString("pt-BR")
                        : "Hoje"}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ===================== MODAL DE AVALIAÇÃO CLÍNICA ===================== */}
        <Dialog open={evalModalOpen} onOpenChange={setEvalModalOpen}>
          <DialogHeader>
            <DialogTitle className="text-base font-black text-indigo-950 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-emerald-600" />
              Avaliação de {evalTargetReq?.patientName}
            </DialogTitle>
            <DialogDescription className="text-xs font-bold text-slate-500">
              Registre as métricas clínicas do paciente ({evalTargetReq?.examType}).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            {/* Pressão Arterial */}
            <div className="space-y-1">
              <label className="font-black text-slate-700 block">
                Pressão Arterial (Sistólica / Diastólica mmHg)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={evalSystolic}
                  onChange={(e) => setEvalSystolic(e.target.value)}
                  placeholder="120"
                  className="w-full rounded-xl border-2 border-slate-300 p-2 font-bold text-center"
                />
                <input
                  type="number"
                  value={evalDiastolic}
                  onChange={(e) => setEvalDiastolic(e.target.value)}
                  placeholder="80"
                  className="w-full rounded-xl border-2 border-slate-300 p-2 font-bold text-center"
                />
              </div>
            </div>

            {/* Glicemia */}
            <div className="space-y-1">
              <label className="font-black text-slate-700 block">Glicemia (mg/dL)</label>
              <input
                type="number"
                value={evalGlucose}
                onChange={(e) => setEvalGlucose(e.target.value)}
                placeholder="95"
                className="w-full rounded-xl border-2 border-slate-300 p-2 font-bold"
              />
            </div>

            {/* Status Clínico */}
            <div className="space-y-1">
              <label className="font-black text-slate-700 block">Parecer de Saúde</label>
              <div className="flex gap-1">
                {(["Controlado 🎯", "Estável ✅", "Atenção ⚠️"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setEvalHealthStatus(st)}
                    className={`flex-1 py-1.5 text-xs font-black rounded-xl border ${
                      evalHealthStatus === st
                        ? "bg-emerald-600 text-white border-emerald-700 shadow"
                        : "bg-slate-100 text-slate-700 border-slate-300"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orientações */}
            <div className="space-y-1">
              <label className="font-black text-slate-700 block">Orientações Farmacêuticas</label>
              <textarea
                value={evalAdvice}
                onChange={(e) => setEvalAdvice(e.target.value)}
                rows={3}
                placeholder="Ex: Paciente com adesão correta aos anti-hipertensivos. Orientado a manter ingestão de água e reduzir sódio."
                className="w-full rounded-xl border-2 border-slate-300 p-2 font-medium text-xs"
              />
            </div>

            <Button
              onClick={handleSubmitEvaluation}
              disabled={submittingEval}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs rounded-xl shadow mt-2"
            >
              {submittingEval ? "Salvando Avaliação..." : "Concluir Avaliação & Liberar Recompensa 🪙"}
            </Button>
          </div>
        </Dialog>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  VISÃO DO PACIENTE — "Diretório Real de Farmacêuticos & Solicitação"
  // ════════════════════════════════════════════════════════════════════════════
  const filteredPharm = pharmacists.filter(
    (f) =>
      `${f.nome} ${f.sobrenome}`.toLowerCase().includes(search.toLowerCase()) ||
      (f.pharmacyName || "").toLowerCase().includes(search.toLowerCase()) ||
      (f.branch || "").toLowerCase().includes(search.toLowerCase()) ||
      (f.city || "").toLowerCase().includes(search.toLowerCase()) ||
      (f.specialty || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={`p-4 space-y-4 font-sans animate-in fade-in duration-200 ${pageBgClass}`}>
      {/* Header Paciente */}
      <div className={`rounded-3xl p-4 flex items-center gap-3 ${cardBgClass} ${cardBorderClass}`}>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
          <Award className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <h1 className={`text-base font-black leading-tight ${textPrimaryClass}`}>
            Farmacêuticos Credenciados
          </h1>
          <p className={`text-xs font-bold ${textSecondaryClass}`}>
            Profissionais cadastrados no sistema. Avalie com estrelas e solicite exames.
          </p>
        </div>
      </div>

      {/* Busca */}
      <div
        className={`relative flex items-center rounded-2xl border ${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        }`}
      >
        <Search className={`absolute left-3 w-4 h-4 ${textSecondaryClass}`} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por farmacêutico, farmácia, filial ou cidade..."
          className={`w-full pl-9 pr-4 py-3 text-sm font-semibold bg-transparent focus:outline-none ${textPrimaryClass} placeholder:${textSecondaryClass}`}
        />
      </div>

      {/* Lista de Farmacêuticos Reais */}
      {filteredPharm.length === 0 ? (
        <div className={`rounded-3xl p-8 text-center space-y-3 ${cardBgClass} ${cardBorderClass}`}>
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
            <ShieldCheck className="w-7 h-7 stroke-[2]" />
          </div>
          <div>
            <h3 className={`text-sm font-black ${textPrimaryClass}`}>
              Nenhum farmacêutico cadastrado ainda
            </h3>
            <p className={`text-xs font-bold ${textSecondaryClass} max-w-sm mx-auto mt-1 leading-relaxed`}>
              Assim que um farmacêutico realizar o cadastro informando sua farmácia e filial, ele
              aparecerá aqui automaticamente começando com 0 estrelas para ser avaliado pelos pacientes.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPharm.map((f) => {
            const stars = f.stars || 0;
            const reviewsCount = f.ratingCount || 0;
            const served = f.patientsServed || 0;

            return (
              <div
                key={f.id}
                className={`rounded-3xl p-4 border-2 transition-all space-y-3.5 ${cardBgClass} ${cardBorderClass} hover:border-purple-500/50`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00b09b] to-[#1a7a4a] text-white flex items-center justify-center font-black text-lg shrink-0 shadow">
                      {f.nome.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm font-black ${textPrimaryClass}`}>
                          Dr(a). {f.nome} {f.sobrenome}
                        </h3>
                        {f.crfNumber && (
                          <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            {f.crfNumber}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-black text-[#00b09b] mt-0.5">
                        <Building className="w-3.5 h-3.5" />
                        <span>
                          {f.pharmacyName || "Farmácia Parceira"}
                          {f.branch ? ` • ${f.branch}` : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 mt-0.5">
                        {f.city && (
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3" />
                            {f.city}
                            {f.state ? ` - ${f.state}` : ""}
                          </span>
                        )}
                        {f.specialty && <span>• {f.specialty}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {served} pessoa(s) atendida(s)
                    </span>
                  </div>
                </div>

                {/* Avaliação em Estrelas (começa sempre em 0) */}
                <div className="bg-slate-800/40 dark:bg-slate-900/50 rounded-2xl p-3 border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StarRating value={stars} />
                    <span className="text-xs font-black text-white">
                      {stars.toFixed(1)} / 5.0
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      ({reviewsCount} avaliaç{reviewsCount === 1 ? "ão" : "ões"})
                    </span>
                  </div>

                  {/* Botão para Paciente dar Estrela */}
                  <button
                    type="button"
                    onClick={() => {
                      setTargetPharm(f);
                      setStarsGiven(5);
                      setRateModalOpen(true);
                    }}
                    className="text-[11px] font-black text-amber-300 hover:text-amber-200 flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 rounded-xl active:scale-95 transition-all"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    Avaliar com Estrelas
                  </button>
                </div>

                {/* Ação de Solicitar Exame com o Farmacêutico */}
                <button
                  type="button"
                  onClick={() => {
                    setTargetPharm(f);
                    setExamModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl border-2 border-indigo-950 shadow-[2px_2px_0px_#1e1b4b] active:scale-95 transition-all"
                >
                  <Stethoscope className="w-4 h-4" />
                  Solicitar Exame com este Farmacêutico
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ===================== MODAL DAR ESTRELAS ===================== */}
      <Dialog open={rateModalOpen} onOpenChange={setRateModalOpen}>
        <DialogHeader>
          <DialogTitle className="text-base font-black text-indigo-950 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            Avaliar Dr(a). {targetPharm?.nome}
          </DialogTitle>
          <DialogDescription className="text-xs font-bold text-slate-500">
            Dê uma nota de 1 a 5 estrelas baseada no atendimento recebido.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-center">
          <div className="flex justify-center py-2">
            <StarRating value={starsGiven} interactive onRate={setStarsGiven} />
          </div>
          <span className="text-xs font-black text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
            {starsGiven} de 5 estrelas selecionadas
          </span>

          <textarea
            value={ratingComment}
            onChange={(e) => setRatingComment(e.target.value)}
            rows={3}
            placeholder="Deixe um comentário sobre a atenção farmacêutica recebida (opcional)..."
            className="w-full rounded-xl border-2 border-slate-300 p-2.5 text-xs font-medium focus:outline-none focus:border-purple-600"
          />

          <Button
            onClick={handleSubmitRating}
            disabled={submittingRating}
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs rounded-xl shadow"
          >
            {submittingRating ? "Enviando..." : "Confirmar Avaliação ⭐"}
          </Button>
        </div>
      </Dialog>

      {/* ===================== MODAL SOLICITAR EXAME ===================== */}
      <Dialog open={examModalOpen} onOpenChange={setExamModalOpen}>
        <DialogHeader>
          <DialogTitle className="text-base font-black text-indigo-950 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-purple-600" />
            Solicitar Exame com Dr(a). {targetPharm?.nome}
          </DialogTitle>
          <DialogDescription className="text-xs font-bold text-slate-500">
            {targetPharm?.pharmacyName} ({targetPharm?.branch})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          <div className="space-y-1">
            <label className="font-black text-slate-700 block">Tipo de Exame / Procedimento</label>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  "Glicemia",
                  "Pressão Arterial",
                  "Aferição Geral",
                  "Revisão de Medicamentos",
                ] as const
              ).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setExamType(type)}
                  className={`p-2 rounded-xl text-[11px] font-black border transition-all ${
                    examType === type
                      ? "bg-purple-600 text-white border-purple-800 shadow"
                      : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-black text-slate-700 block">
              Observações ou Sintomas (Opcional)
            </label>
            <textarea
              value={examNotes}
              onChange={(e) => setExamNotes(e.target.value)}
              rows={3}
              placeholder="Ex: Gostaria de medir minha glicemia em jejum ou checar se minha pressão está alta hoje."
              className="w-full rounded-xl border-2 border-slate-300 p-2.5 font-medium text-xs focus:outline-none focus:border-purple-600"
            />
          </div>

          <Button
            onClick={handleRequestExam}
            disabled={submittingExam}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs rounded-xl shadow mt-2"
          >
            {submittingExam ? "Enviando Solicitação..." : "Enviar Solicitação de Exame 🚀"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
};
