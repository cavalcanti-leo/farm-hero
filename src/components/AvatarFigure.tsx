import React from "react";
import { useAppState } from "@/lib/app-state";
import avatarHeroImg from "@/assets/avatar-hero.png";
import backyardImg from "@/assets/backyard.png";
import { Sparkles, Shield, Crown, Zap } from "lucide-react";

interface AvatarFigureProps {
  size?: "sm" | "md" | "lg";
  showStats?: boolean;
}

export const AvatarFigure: React.FC<AvatarFigureProps> = ({
  size = "md",
  showStats = true,
}) => {
  const {
    level,
    xp,
    maxXp,
    coins,
    streakDays,
    equippedHat,
    equippedOutfit,
    equippedPet,
    equippedBackground,
    items,
  } = useAppState();

  const hatItem = items.find((i) => i.id === equippedHat);
  const outfitItem = items.find((i) => i.id === equippedOutfit);
  const petItem = items.find((i) => i.id === equippedPet);
  const bgItem = items.find((i) => i.id === equippedBackground);

  const containerSizes = {
    sm: "w-36 h-36",
    md: "w-64 h-64",
    lg: "w-80 h-80",
  };

  return (
    <div className="relative flex flex-col items-center justify-center group">
      {/* Background Container */}
      <div
        className={`relative ${containerSizes[size]} rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-700/60 transition-all duration-300 group-hover:border-blue-500/50 flex items-center justify-center bg-slate-900`}
      >
        {/* Background Image / Pattern */}
        {equippedBackground === "bg-park" ? (
          <img
            src={backyardImg}
            alt="Fundo Parque"
            className="absolute inset-0 w-full h-full object-cover opacity-60 filter brightness-90 saturate-125"
          />
        ) : bgItem ? (
          <div
            className="absolute inset-0 opacity-40 transition-colors duration-500"
            style={{
              background: `radial-gradient(circle at center, ${bgItem.colorHex || "#3b82f6"} 0%, #0f172a 100%)`,
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950" />
        )}

        {/* Dynamic Glow Aura */}
        <div className="absolute w-40 h-40 bg-blue-500/20 rounded-full blur-2xl animate-pulse pointer-events-none" />

        {/* Pet Icon floating */}
        {petItem && (
          <div className="absolute bottom-3 right-3 text-3xl sm:text-4xl animate-bounce z-20 drop-shadow-md bg-slate-950/60 p-2 rounded-2xl border border-slate-700">
            {petItem.icon}
          </div>
        )}

        {/* Hat Icon Floating */}
        {hatItem && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-3xl sm:text-4xl z-30 drop-shadow-lg animate-pulse">
            {hatItem.icon}
          </div>
        )}

        {/* Main Avatar Character Image */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
          <img
            src={avatarHeroImg}
            alt="Hero Avatar"
            className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Badge of Equipped Outfit */}
        {outfitItem && (
          <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-semibold text-cyan-300 border border-cyan-500/30 flex items-center gap-1 z-20">
            <span>{outfitItem.icon}</span>
            <span>{outfitItem.name}</span>
          </div>
        )}
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
              <Zap className="w-4 h-4 text-orange-400 fill-orange-400/30 animate-bounce" />
              <span>{streakDays} Dias Seguidos</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
