import React, { useState } from "react";
import { useAppState, AvatarItem } from "@/lib/app-state";
import { useTheme } from "@/lib/theme-context";
import { AvatarFigure } from "@/components/AvatarFigure";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, ShoppingBag, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AvatarRoute: React.FC = () => {
  const {
    items,
    coins,
    equippedHat,
    equippedOutfit,
    equippedPet,
    equippedBackground,
    buyItem,
    equipItem,
  } = useAppState();

  const { isDark, isLight, pageBgClass, cardBgClass, cardBorderClass, textPrimaryClass, textSecondaryClass } = useTheme();

  const [activeCategory, setActiveCategory] = useState<AvatarItem["category"]>("chapeu");

  const categoryItems = items.filter((i) => i.category === activeCategory);

  const getIsEquipped = (item: AvatarItem) => {
    if (item.category === "chapeu") return equippedHat === item.id;
    if (item.category === "roupa") return equippedOutfit === item.id;
    if (item.category === "pet") return equippedPet === item.id;
    if (item.category === "fundo") return equippedBackground === item.id;
    return false;
  };

  const handleItemClick = (item: AvatarItem) => {
    if (!item.unlocked) {
      buyItem(item.id);
    } else {
      const isEquipped = getIsEquipped(item);
      equipItem(item.category, isEquipped ? null : item.id);
    }
  };

  return (
    <div className={`p-4 space-y-4 font-sans animate-in fade-in duration-200 ${pageBgClass}`}>
      {/* Page Title */}
      <div className={`rounded-3xl p-4 flex items-center justify-between gap-3 ${cardBgClass} ${cardBorderClass}`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-indigo-950/20 flex items-center justify-center text-white shrink-0">
            <Crown className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <h1 className={`text-base font-black leading-tight ${textPrimaryClass}`}>
              Armário & Loja do Avatar
            </h1>
            <p className={`text-xs font-bold ${textSecondaryClass}`}>
              Personalize a aparência do seu herói!
            </p>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-2xl shrink-0 font-black text-xs border ${
          isDark
            ? "bg-amber-950/60 border-amber-800 text-amber-300"
            : "bg-amber-100 border-amber-300 text-amber-900"
        }`}>
          🪙 {coins} pts
        </div>
      </div>

      {/* Live Hero Display */}
      <div className={`rounded-3xl p-4 flex flex-col items-center ${cardBgClass} ${cardBorderClass}`}>
        <AvatarFigure size="md" showStats={true} />
      </div>

      {/* Accessories Catalog */}
      <div className={`rounded-3xl p-4 space-y-4 ${cardBgClass} ${cardBorderClass}`}>
        <div className={`flex items-center gap-2 font-black text-sm uppercase tracking-wider ${textPrimaryClass}`}>
          <ShoppingBag className="w-5 h-5 text-purple-500 stroke-[3]" /> Catálogo de Acessórios
        </div>

        <Tabs defaultValue="chapeu" onValueChange={(val) => setActiveCategory(val as any)}>
          <TabsList className={`w-full grid grid-cols-4 p-1 rounded-2xl border ${
            isDark
              ? "bg-slate-800 border-slate-700 text-slate-300"
              : "bg-purple-50 border-purple-200 text-purple-900"
          }`}>
            <TabsTrigger value="chapeu" className="text-xs font-black">Chapéus 🧢</TabsTrigger>
            <TabsTrigger value="roupa" className="text-xs font-black">Trajes 👕</TabsTrigger>
            <TabsTrigger value="pet" className="text-xs font-black">Pets 🐶</TabsTrigger>
            <TabsTrigger value="fundo" className="text-xs font-black">Fundos 🌳</TabsTrigger>
          </TabsList>

          <div className="space-y-2 mt-4">
            {categoryItems.map((item) => {
              const isEquipped = getIsEquipped(item);
              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-3 cursor-pointer transition-transform active:scale-95 ${
                    isEquipped
                      ? isDark
                        ? "bg-purple-950/60 border-purple-700 text-white"
                        : "bg-purple-100 border-purple-300 text-slate-900"
                      : item.unlocked
                      ? isDark
                        ? "bg-slate-800 border-slate-700 text-white"
                        : "bg-slate-50 border-slate-200 text-slate-900"
                      : isDark
                      ? "bg-slate-900/50 border-slate-800 opacity-60 text-slate-400"
                      : "bg-white border-slate-200 opacity-80 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border ${
                      isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                    }`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className={`text-xs font-black ${textPrimaryClass}`}>{item.name}</p>
                      {item.unlocked ? (
                        <span className="text-[10px] text-emerald-500 font-extrabold">Adquirido</span>
                      ) : (
                        <span className="text-[10px] text-amber-500 font-black">🪙 {item.price} pts</span>
                      )}
                    </div>
                  </div>

                  <div>
                    {isEquipped ? (
                      <span className="text-[10px] font-black bg-emerald-500 text-white px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> Equipado
                      </span>
                    ) : item.unlocked ? (
                      <Button size="sm" variant="outline" className={`text-xs font-black ${
                        isDark ? "border-slate-600 text-white hover:bg-slate-700" : "border-slate-300 text-slate-800"
                      }`}>
                        Equipar
                      </Button>
                    ) : (
                      <Button size="sm" variant="amber" className="text-xs font-black gap-1">
                        <Lock className="w-3 h-3 stroke-[3]" /> Comprar
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export const PersonalizarAvatarRoute = AvatarRoute;
