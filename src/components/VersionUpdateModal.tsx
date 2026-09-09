import React from "react";
import { useVersionUpdateManager, executeFullReset } from "@/lib/version";
import { AlertTriangle, RefreshCw, Sparkles, Zap } from "lucide-react";

export const VersionUpdateModal: React.FC = () => {
  const { showUpdateModal, countdown, fromVersion, toVersion } = useVersionUpdateManager();

  if (!showUpdateModal) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-sans select-none animate-in fade-in duration-300"
      style={{ backgroundColor: "rgba(11, 14, 20, 0.88)", backdropFilter: "blur(8px)" }}
    >
      <div className="w-full max-w-md bg-slate-900 border-4 border-amber-500 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.3)] overflow-hidden text-white relative animate-in zoom-in-95 duration-200">
        {/* Banner de Topo com Animação */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 p-4 text-center border-b-2 border-amber-400/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
          <div className="flex items-center justify-center gap-2 text-indigo-950 font-black text-sm uppercase tracking-wider">
            <AlertTriangle className="w-5 h-5 animate-bounce stroke-[3]" />
            <span>Atualização Gigante Detectada!</span>
          </div>
          <div className="mt-1 flex items-center justify-center gap-2 text-white font-black text-lg drop-shadow">
            <span className="bg-indigo-950/80 px-2.5 py-0.5 rounded-lg border border-indigo-900">
              {fromVersion}
            </span>
            <span className="text-amber-200 text-xl font-bold">➔</span>
            <span className="bg-emerald-950 text-emerald-300 px-3 py-0.5 rounded-lg border border-emerald-500/50 animate-pulse">
              {toVersion}
            </span>
          </div>
        </div>

        {/* Ticker da Contagem Regressiva de 5 Segundos */}
        <div className="p-6 flex flex-col items-center text-center space-y-4">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="10" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="10"
                strokeDasharray={`${(countdown / 5) * 264} 264`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-amber-400 animate-ping absolute opacity-30">
                {countdown}
              </span>
              <span className="text-4xl font-black text-amber-400 drop-shadow-md">
                {countdown}s
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-black text-white leading-tight">
              Reset Total em Andamento!
            </h3>
            <p className="text-xs font-bold text-slate-300 leading-relaxed bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              ⚠️ <span className="text-amber-400 font-black">AVISO IMPORTANTE:</span> Para
              sincronizar a versão <span className="text-emerald-400 font-black">{toVersion}</span>,
              TODOS os dados (nível, XP, moedas, itens, histórico e missões) serão{" "}
              <span className="text-rose-400 font-black uppercase">100% resetados</span> em{" "}
              {countdown} segundos.
            </p>
          </div>

          {/* Barra de Progresso visual */}
          <div className="w-full h-3 bg-slate-800 rounded-full border border-slate-700 overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${(countdown / 5) * 100}%` }}
            />
          </div>

          {/* Botão para forçar reset imediato */}
          <button
            onClick={() => executeFullReset(toVersion, fromVersion)}
            className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-rose-400 shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <RefreshCw className="w-4 h-4 animate-spin" /> Resetar Agora Imediatamente ({countdown}
            s)
          </button>
        </div>
      </div>
    </div>
  );
};
