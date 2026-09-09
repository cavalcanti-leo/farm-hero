import React from "react";
import { useAppState } from "@/lib/app-state";
import { Award, Sparkles, CheckCircle2, Gift, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export const RecompensasRoute: React.FC = () => {
  const { achievements, claimAchievement, streakDays, coins } = useAppState();

  return (
    <div className="p-4 space-y-4 font-sans text-slate-900 animate-in fade-in duration-200">
      {/* Title */}
      <div className="bg-white border-4 border-indigo-950 rounded-3xl p-4 shadow-[4px_4px_0px_#1e1b4b] flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-400 border-3 border-indigo-950 flex items-center justify-center text-white shrink-0">
          <Award className="w-7 h-7 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-base font-black text-indigo-950 leading-tight">
            Conquistas & Recompensas
          </h1>
          <p className="text-xs text-slate-500 font-bold">
            Cumpra metas para resgatar bônus!
          </p>
        </div>
      </div>

      {/* Streak Showcase */}
      <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-orange-500 border-4 border-indigo-950 rounded-3xl p-4 shadow-[4px_4px_0px_#1e1b4b] text-indigo-950 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white border-2 border-indigo-950 flex items-center justify-center text-orange-500 shrink-0">
            <Zap className="w-6 h-6 fill-orange-500 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider">Sequência Ativa!</h3>
            <p className="text-sm font-black">{streakDays} dias seguidos</p>
          </div>
        </div>
        <span className="text-[10px] font-black bg-white px-3 py-1 rounded-full border border-indigo-950">
          🔥 Bônus Ativo
        </span>
      </div>

      {/* Achievements List */}
      <div className="bg-white border-4 border-indigo-950 rounded-3xl p-4 shadow-[4px_4px_0px_#1e1b4b] space-y-3">
        <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-2">
          <Gift className="w-4 h-4 text-purple-600 stroke-[3]" /> Suas Conquistas
        </h3>

        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`p-3 rounded-2xl border-3 border-indigo-950 shadow-[2px_2px_0px_#1e1b4b] space-y-2 ${
              ach.completed ? "bg-emerald-50" : "bg-slate-50"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-black text-indigo-950">{ach.title}</h4>
              <span className="text-[10px] font-black bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full border border-indigo-950">
                +{ach.rewardCoins} 🪙 | +{ach.rewardXp} XP
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-bold">{ach.description}</p>

            <div className="pt-1 flex items-center justify-between gap-2">
              <div className="h-2.5 flex-1 bg-slate-200 border border-indigo-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                  style={{ width: `${ach.progress}%` }}
                />
              </div>
              {ach.completed ? (
                <span className="text-[10px] font-black text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" /> Resgatada
                </span>
              ) : ach.progress >= 100 ? (
                <Button onClick={() => claimAchievement(ach.id)} size="sm" variant="amber" className="text-[10px] font-black border-2 border-indigo-950">
                  Resgatar
                </Button>
              ) : (
                <span className="text-[10px] text-slate-400 font-bold">{ach.progress}%</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
