import React from "react";
import { useAppState } from "@/lib/app-state";
import { CustomAvatar } from "@/components/CustomAvatar";
import { Crown, Zap } from "lucide-react";

interface AvatarFigureProps {
  size?: "sm" | "md" | "lg";
  showStats?: boolean;
}

export const AvatarFigure: React.FC<AvatarFigureProps> = ({ size = "md", showStats = true }) => {
  const { level, xp, maxXp, coins, streakDays, customAvatarConfig } = useAppState();

  const containerSizes = {
    sm: "w-36 h-48",
    md: "w-56 h-72",
    lg: "w-72 h-96",
  };

  return (
    <div className="relative flex flex-col items-center justify-center group">
      {/* Background Container */}
      <div
        className={`relative ${containerSizes[size]} rounded-3xl overflow-hidden shadow-xl border-4 border-slate-800 transition-all duration-300 flex items-center justify-center bg-slate-900/90 p-4`}
      >
        {/* Main 2D Layered Character Avatar */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <CustomAvatar config={customAvatarConfig} className="w-full drop-shadow-md" />
        </div>
      </div>

      {/* Stats bar if enabled */}
      {showStats && (
        <div className="mt-4 w-full max-w-xs space-y-2">
          {/* Level & XP Info */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              <Crown className="w-3.5 h-3.5" /> Nível {level}
            </span>
            <span className="text-slate-400">
              {xp} / {maxXp} XP
            </span>
          </div>

          {/* XP Bar */}
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (xp / maxXp) * 100)}%` }}
            />
          </div>

          {/* Currency & Streak */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-400 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-yellow-500/30 shadow-inner">
              <span className="text-base">🪙</span>
              <span>{coins} Moedas</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-orange-500/30 shadow-inner">
              <Zap className="w-4 h-4 text-orange-400 fill-orange-400/30" />
              <span>{streakDays} Dias Seguidos</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
