import React from "react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAppState } from "@/lib/app-state";
import {
  Droplets,
  Plus,
  ArrowLeft,
  GlassWater,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  RotateCcw,
  Play,
  Lock,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Limites recomendados de saúde (em mL)
const MIN_HEALTHY_WATER_ML = 2000; // Mínimo diário saudável
const GOAL_WATER_ML = 2500; // Meta ideal diária
const MAX_SAFE_WATER_ML = 4000; // Limite diário máximo seguro

export const SaudeAguaRoute: React.FC = () => {
  const {
    waterLogs,
    addWater,
    clearWaterLogs,
    waterTimerTargetTimestamp,
    waterTimerIntervalMinutes,
    waterResetDisabledUntil,
    setWaterTimerIntervalMinutes,
    cancelWaterTimer,
    setWaterTimerTargetTimestamp,
  } = useAppState();

  const [customMl, setCustomMl] = useState<number>(250);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [resetSecondsLeft, setResetSecondsLeft] = useState<number>(0);

  // Derive running states based on global timestamps
  const isTimerRunning =
    waterTimerTargetTimestamp !== null && waterTimerTargetTimestamp > Date.now();
  const isResetDisabled = waterResetDisabledUntil !== null && waterResetDisabledUntil > Date.now();

  const totalWater = waterLogs.reduce((acc, curr) => acc + curr.amountMl, 0);

  // Synchronize local countdowns with global target timestamps
  useEffect(() => {
    const updateCountdowns = () => {
      const now = Date.now();

      if (waterTimerTargetTimestamp && waterTimerTargetTimestamp > now) {
        setSecondsLeft(Math.max(0, Math.floor((waterTimerTargetTimestamp - now) / 1000)));
      } else {
        setSecondsLeft(0);
        // Clean up expired timer in state silently
        if (waterTimerTargetTimestamp && waterTimerTargetTimestamp <= now) {
          setWaterTimerTargetTimestamp(null);
        }
      }

      if (waterResetDisabledUntil && waterResetDisabledUntil > now) {
        setResetSecondsLeft(Math.max(0, Math.floor((waterResetDisabledUntil - now) / 1000)));
      } else {
        setResetSecondsLeft(0);
      }
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [waterTimerTargetTimestamp, waterResetDisabledUntil, setWaterTimerTargetTimestamp]);

  // Log water immediately and start the block timer
  const handleScheduleWater = (amount: number) => {
    if (amount <= 0) return;

    if (totalWater + amount > MAX_SAFE_WATER_ML) {
      toast.error("🛑 Limite Máximo Saudável Atingido!", {
        description: `O limite diário máximo seguro é de ${MAX_SAFE_WATER_ML}ml (4 Litros). Ingerir água em excesso pode causar intoxicação por água (hiponatremia).`,
      });
      return;
    }

    const success = addWater(amount);
    if (success) {
      toast.success(`💧 +${amount} ml adicionados!`, {
        description: `Seu consumo foi contabilizado e os botões ficarão inativos por ${waterTimerIntervalMinutes} minutos.`,
      });
    }
  };

  const handleCancelTimer = () => {
    cancelWaterTimer();
  };

  const handleResetWater = () => {
    clearWaterLogs();
  };

  const handleSelectInterval = (mins: number) => {
    if (isTimerRunning) {
      toast.warning("Não é possível alterar o intervalo enquanto o temporizador está rodando.");
      return;
    }
    setWaterTimerIntervalMinutes(mins);
  };

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTimerRunning && customMl > 0) {
      handleScheduleWater(customMl);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatResetTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Progresso do temporizador em %
  const timerPercentage =
    waterTimerIntervalMinutes > 0
      ? Math.round(
          ((waterTimerIntervalMinutes * 60 - secondsLeft) / (waterTimerIntervalMinutes * 60)) * 100,
        )
      : 0;

  return (
    <div className="p-4 space-y-4 font-sans text-slate-900 animate-in fade-in duration-200">
      {/* Barra Superior */}
      <div className="flex items-center justify-between">
        <Link
          href="/saude"
          className="inline-flex items-center gap-1 text-xs font-black text-purple-700 bg-white border-2 border-indigo-950 px-3 py-1.5 rounded-full shadow-[2px_2px_0px_#1e1b4b]"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3]" /> Voltar para Saúde
        </Link>
        <span
          className="text-[10px] font-black text-slate-500 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-full flex items-center gap-1"
          title="Reset automático diário às 00:00 meia-noite"
        >
          🔄 Auto resete às 00:00
        </span>
      </div>

      {/* Card Principal de Hidratação */}
      <div className="bg-white border-4 border-indigo-950 rounded-3xl p-5 shadow-[4px_4px_0px_#1e1b4b] space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-400 border-3 border-indigo-950 flex items-center justify-center text-white shrink-0">
              <Droplets className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-base font-black text-indigo-950">Hidratação Diária</h1>
              <p className="text-xs text-slate-500 font-bold">
                Mínimo: 2.000 ml | Máximo seguro: 4.000 ml
              </p>
            </div>
          </div>

          {/* Botão de Zerar a Quantia */}
          <button
            onClick={handleResetWater}
            disabled={isResetDisabled}
            className={`flex items-center gap-1 border-2 border-indigo-950 px-3 py-1.5 rounded-2xl text-xs font-black shadow-[2px_2px_0px_#1e1b4b] active:translate-y-0.5 transition-all ${
              isResetDisabled
                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed shadow-none"
                : "bg-red-100 hover:bg-red-200 text-red-700 active:translate-y-0.5"
            }`}
            title={
              isResetDisabled
                ? `Reset bloqueado. Aguarde ${formatResetTime(resetSecondsLeft)}`
                : "Zerar o total de água consumido hoje"
            }
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {isResetDisabled ? `Aguarde (${formatResetTime(resetSecondsLeft)})` : "Zerar (0 ml)"}
          </button>
        </div>

        {/* Mostrador de Progresso do Dia */}
        <div className="bg-cyan-50 rounded-3xl border-3 border-indigo-950 p-5 flex flex-col items-center justify-center space-y-3">
          <GlassWater className="w-10 h-10 text-cyan-600 animate-bounce" />
          <div className="text-center">
            <span className="text-4xl font-black text-indigo-950">{totalWater}</span>
            <span className="text-sm font-black text-slate-500"> / {GOAL_WATER_ML} ml</span>
          </div>

          {/* Barra de Progresso com Indicador de Limites */}
          <div className="w-full space-y-1">
            <div className="w-full h-4 bg-slate-200 rounded-full border-2 border-indigo-950 overflow-hidden relative">
              <div
                className={`h-full transition-all duration-500 ${
                  totalWater >= MAX_SAFE_WATER_ML
                    ? "bg-red-500"
                    : totalWater >= MIN_HEALTHY_WATER_ML
                      ? "bg-emerald-500"
                      : "bg-cyan-500"
                }`}
                style={{ width: `${Math.min(100, (totalWater / MAX_SAFE_WATER_ML) * 100)}%` }}
              />
              {/* Linha indicadora do Mínimo Saudável (50% de 4.000ml = 2.000ml) */}
              <div
                className="absolute top-0 bottom-0 left-[50%] w-0.5 bg-indigo-950 border-r border-white"
                title="Mínimo Saudável (2.000ml)"
              />
            </div>

            <div className="flex justify-between text-[10px] font-black text-slate-500 px-1">
              <span>0 ml</span>
              <span className="text-emerald-700">Mínimo: 2.000 ml</span>
              <span className="text-red-600">Max: 4.000 ml</span>
            </div>
          </div>

          {/* Banner de Alerta de Saúde */}
          {totalWater < MIN_HEALTHY_WATER_ML ? (
            <div className="w-full bg-amber-100 border-2 border-indigo-950 p-2.5 rounded-2xl flex items-center gap-2 text-xs text-amber-900 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Abaixo do mínimo saudável! Faltam {MIN_HEALTHY_WATER_ML - totalWater}ml para atingir
                2.000ml.
              </span>
            </div>
          ) : totalWater <= 3500 ? (
            <div className="w-full bg-emerald-100 border-2 border-indigo-950 p-2.5 rounded-2xl flex items-center gap-2 text-xs text-emerald-900 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Excelente! Sua hidratação está na faixa saudável recomendada.</span>
            </div>
          ) : (
            <div className="w-full bg-red-100 border-2 border-indigo-950 p-2.5 rounded-2xl flex items-center gap-2 text-xs text-red-900 font-bold">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>
                Atenção: Você atingiu a faixa de limite máximo diário. Evite consumir água em
                excesso.
              </span>
            </div>
          )}
        </div>

        {/* Temporizador de Hidratação */}
        <div className="bg-purple-50 rounded-3xl border-3 border-indigo-950 p-4 space-y-3 shadow-[2px_2px_0px_#1e1b4b]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-700 stroke-[2.5]" />
              <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider">
                Temporizador da Hidratação
              </h3>
            </div>
            {isTimerRunning && (
              <button
                onClick={handleCancelTimer}
                className="flex items-center gap-1 text-[10px] font-black text-red-700 bg-red-100 border border-red-400 px-2 py-0.5 rounded-lg hover:bg-red-200 transition-all"
                title="Cancelar Temporizador Atual"
              >
                <XCircle className="w-3 h-3" /> Cancelar
              </button>
            )}
          </div>

          {/* Estado do Temporizador: Rodando vs Aguardando Clique */}
          {isTimerRunning ? (
            <div className="bg-white border-2 border-indigo-950 rounded-2xl p-3.5 flex flex-col items-center justify-center space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-3xl font-black font-mono text-purple-800 tracking-widest">
                  {formatTime(secondsLeft)}
                </span>
              </div>
              <div className="text-center space-y-0.5">
                <p className="text-xs font-extrabold text-purple-900">
                  Próxima hidratação liberada em
                </p>
                <p className="text-[10px] font-bold text-slate-500">
                  Os botões estão bloqueados temporariamente para incentivar um ritmo saudável de
                  hidratação.
                </p>
              </div>

              {/* Barra do Temporizador */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full border border-indigo-950 overflow-hidden mt-1">
                <div
                  className="h-full bg-purple-600 transition-all duration-1000"
                  style={{ width: `${timerPercentage}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-indigo-950 rounded-2xl p-3.5 flex flex-col items-center text-center space-y-1.5">
              <div className="flex items-center gap-2 text-purple-800 font-black text-xs">
                <Play className="w-4 h-4 text-purple-600 fill-purple-600" />
                <span>Pronto para iniciar</span>
              </div>
              <p className="text-[11px] font-bold text-slate-500">
                Clique em um dos botões abaixo para registrar o consumo e dar partida no
                temporizador!
              </p>
            </div>
          )}

          {/* Seleção do Intervalo do Temporizador */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-black text-slate-600">Intervalo do Lembrete:</span>
            <div className="flex gap-1">
              {[30, 45, 60, 90].map((mins) => (
                <button
                  key={mins}
                  disabled={isTimerRunning}
                  onClick={() => handleSelectInterval(mins)}
                  className={`px-2 py-1 text-[10px] font-black rounded-lg border border-indigo-950 transition-all ${
                    isTimerRunning
                      ? "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed"
                      : waterTimerIntervalMinutes === mins
                        ? "bg-purple-700 text-white shadow-[1px_1px_0px_#1e1b4b]"
                        : "bg-white text-indigo-950 hover:bg-purple-100"
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Botões de Adição Rápida (FICAM CINZAS E INATIVOS ENQUANTO O TEMPO RODA) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider">
              {isTimerRunning ? "Botões Inativos (Temporizador Rodando)" : "Escolha a Quantidade:"}
            </h3>
            {isTimerRunning && (
              <span className="text-[10px] font-black text-slate-500 flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-400" /> Bloqueado
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[150, 250, 350, 500].map((amount) => (
              <button
                key={amount}
                disabled={isTimerRunning}
                onClick={() => handleScheduleWater(amount)}
                className={`border-3 rounded-2xl p-3 text-center transition-all ${
                  isTimerRunning
                    ? "bg-slate-200 border-slate-400 text-slate-400 opacity-60 cursor-not-allowed shadow-none"
                    : "bg-cyan-50 hover:bg-cyan-100 border-indigo-950 text-cyan-900 shadow-[2px_2px_0px_#1e1b4b] active:translate-y-0.5 cursor-pointer"
                }`}
              >
                <span
                  className={`text-sm font-black block ${isTimerRunning ? "text-slate-400" : "text-cyan-900"}`}
                >
                  +{amount} ml
                </span>
                <span className="text-[10px] font-extrabold text-slate-400 block">
                  {amount === 150
                    ? "Copo pequeno"
                    : amount === 250
                      ? "Copo padrão"
                      : amount === 350
                        ? "Caneca"
                        : "Garrafinha"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Formulário de Quantidade Personalizada */}
        <form onSubmit={handleCustomAdd} className="flex gap-2 pt-2">
          <Input
            type="number"
            value={customMl}
            min={50}
            max={1500}
            disabled={isTimerRunning}
            onChange={(e) => setCustomMl(Number(e.target.value))}
            className={`border-3 rounded-xl text-xs font-bold ${
              isTimerRunning
                ? "bg-slate-200 border-slate-400 text-slate-400 cursor-not-allowed"
                : "bg-white border-indigo-950 text-indigo-950 placeholder:text-slate-400"
            }`}
          />
          <Button
            type="submit"
            variant="emerald"
            disabled={isTimerRunning}
            className={`border-3 font-black text-xs ${
              isTimerRunning
                ? "bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed shadow-none opacity-60"
                : "border-indigo-950"
            }`}
          >
            <Plus className="w-4 h-4 mr-1 stroke-[3]" /> Adicionar
          </Button>
        </form>
      </div>

      {/* Histórico do Dia */}
      <div className="bg-white border-4 border-indigo-950 rounded-3xl p-4 shadow-[4px_4px_0px_#1e1b4b] space-y-3">
        <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider">
          Histórico de Hoje:
        </h3>
        {waterLogs.length === 0 ? (
          <p className="text-xs text-slate-400 font-bold">Nenhum registro finalizado ainda hoje.</p>
        ) : (
          waterLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-2.5 bg-slate-50 border-2 border-indigo-950 rounded-2xl text-xs font-black"
            >
              <span className="text-cyan-700">+{log.amountMl} ml</span>
              <span className="text-slate-400 font-mono">{log.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
