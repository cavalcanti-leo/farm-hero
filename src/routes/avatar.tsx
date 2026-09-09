import React, { useState } from "react";
import { useAppState } from "@/lib/app-state";
import { useTheme } from "@/lib/theme-context";
import { CustomAvatar } from "@/components/CustomAvatar";
import { Check } from "lucide-react";

export const AvatarRoute: React.FC = () => {
  const { customAvatarConfig, updateCustomAvatarConfig } = useAppState();

  const {
    pageBgClass,
    cardBgClass,
    cardBorderClass,
    textPrimaryClass,
    textSecondaryClass,
  } = useTheme();

  const [hairGender, setHairGender] = useState<"female" | "male">("female");

  // Skin tone color options
  const SKIN_COLORS = [
    { id: "light" as const, colorHex: "#E8C8B5" },
    { id: "dark" as const, colorHex: "#A97663" },
  ];

  // Hair Color Palette — 19 cores
  const HAIR_COLOR_PALETTE = [
    { id: "c5979d", hex: "#C5979D" },
    { id: "4b8f8c", hex: "#4B8F8C" },
    { id: "484d6d", hex: "#484D6D" },
    { id: "2c365e", hex: "#2C365E" },
    { id: "2b193d", hex: "#2B193D" },
    { id: "f5e9e2", hex: "#F5E9E2" },
    { id: "e3b5a4", hex: "#E3B5A4" },
    { id: "d44d5c", hex: "#D44D5C" },
    { id: "773344", hex: "#773344" },
    { id: "160029", hex: "#160029" },
    { id: "e6e626", hex: "#E6E626" },
    { id: "e57373", hex: "#E57373" },
    { id: "d96868", hex: "#D96868" },
    { id: "c55d2b", hex: "#C55D2B" },
    { id: "1e2022", hex: "#1E2022" },
    { id: "pink",   hex: "#E91E8C" },
    { id: "yellow", hex: "#F5C400" },
    { id: "black",  hex: "#111111" },
    { id: "brown",  hex: "#795548" },
  ];

  // Face options
  const FACE_OPTIONS = [
    { id: "face_happy", icon: "😊" },
    { id: null, icon: "😶" },
  ];

  const handleGenderSelect = (gender: "female" | "male") => {
    setHairGender(gender);
    if (customAvatarConfig.hairId !== null) {
      const currentColorSuffix = customAvatarConfig.hairId
        ? customAvatarConfig.hairId.split("_").slice(2).join("_")
        : "d96868";
      updateCustomAvatarConfig({ hairId: `hair_${gender}_${currentColorSuffix}` });
    }
  };

  const handleSelectColor = (colorId: string) => {
    updateCustomAvatarConfig({ hairId: `hair_${hairGender}_${colorId}` });
  };

  const getCurrentColorId = () => {
    if (!customAvatarConfig.hairId) return null;
    return customAvatarConfig.hairId.split("_").slice(2).join("_");
  };

  return (
    <div className={`p-4 pb-8 space-y-4 font-sans max-w-lg mx-auto animate-in fade-in duration-200 ${pageBgClass}`}>

      {/* Avatar Preview Card */}
      <div className={`rounded-3xl p-5 flex flex-col items-center gap-4 ${cardBgClass} ${cardBorderClass} shadow-xl`}>

        {/* Character Preview */}
        <div className="relative w-44 sm:w-52 bg-gradient-to-b from-indigo-50/50 to-purple-50/50 dark:from-slate-900/50 dark:to-slate-950/50 rounded-2xl border-2 border-indigo-100 dark:border-slate-800 p-2 flex items-center justify-center">
          <CustomAvatar
            config={customAvatarConfig}
            className="w-full drop-shadow-md"
          />
        </div>

        {/* Símbolos de Gênero abaixo do avatar */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => handleGenderSelect("female")}
            title="Feminino"
            className={`w-12 h-12 rounded-2xl border-2 font-black text-xl flex items-center justify-center transition-all active:scale-95 shadow-sm ${
              customAvatarConfig.hairId !== null && hairGender === "female"
                ? "border-rose-500 bg-rose-500 text-white shadow-rose-500/30 scale-105"
                : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-rose-400"
            }`}
          >
            ♀
          </button>

          <button
            onClick={() => handleGenderSelect("male")}
            title="Masculino"
            className={`w-12 h-12 rounded-2xl border-2 font-black text-xl flex items-center justify-center transition-all active:scale-95 shadow-sm ${
              customAvatarConfig.hairId !== null && hairGender === "male"
                ? "border-blue-500 bg-blue-500 text-white shadow-blue-500/30 scale-105"
                : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-400"
            }`}
          >
            ♂
          </button>
        </div>
      </div>

      {/* Tom de Pele */}
      <div className={`rounded-3xl p-5 space-y-3 ${cardBgClass} ${cardBorderClass}`}>
        <h2 className={`text-xs font-black uppercase tracking-wider ${textSecondaryClass}`}>
          Tom de Pele
        </h2>
        <div className="flex items-center gap-3">
          {SKIN_COLORS.map((skin) => {
            const isSelected = customAvatarConfig.skinTone === skin.id;
            return (
              <button
                key={skin.id}
                onClick={() => updateCustomAvatarConfig({ skinTone: skin.id })}
                className={`w-14 h-14 rounded-2xl transition-all flex items-center justify-center active:scale-95 shadow-md border-[3px] ${
                  isSelected
                    ? "border-indigo-600 scale-110 ring-4 ring-indigo-500/20"
                    : "border-slate-300 dark:border-slate-700 hover:scale-105"
                }`}
                style={{ backgroundColor: skin.colorHex }}
              >
                {isSelected && <Check className="w-6 h-6 text-slate-900 stroke-[3] drop-shadow" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cor do Cabelo */}
      <div className={`rounded-3xl p-5 space-y-3 ${cardBgClass} ${cardBorderClass}`}>
        <h2 className={`text-xs font-black uppercase tracking-wider ${textSecondaryClass}`}>
          Cor do Cabelo
        </h2>

        <div className="grid grid-cols-5 gap-2.5">
          {/* Botão Careca — símbolo 🚫 */}
          <button
            onClick={() => updateCustomAvatarConfig({ hairId: null })}
            title="Careca / Sem Cabelo"
            className={`w-full aspect-square rounded-2xl transition-all flex items-center justify-center active:scale-95 shadow-md text-xl border-[3px] ${
              customAvatarConfig.hairId === null
                ? "border-amber-500 scale-110 ring-4 ring-amber-500/20 bg-slate-800 dark:bg-slate-900"
                : "border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:scale-105"
            }`}
          >
            🚫
          </button>

          {/* 19 Cores */}
          {HAIR_COLOR_PALETTE.map((c) => {
            const currentColorId = getCurrentColorId();
            const isSelected = currentColorId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleSelectColor(c.id)}
                title={c.id}
                className={`w-full aspect-square rounded-2xl transition-all flex items-center justify-center active:scale-95 shadow-md border-[3px] ${
                  isSelected
                    ? "border-amber-500 scale-110 ring-4 ring-amber-500/20"
                    : "border-slate-300 dark:border-slate-700 hover:scale-105"
                }`}
                style={{ backgroundColor: c.hex }}
              >
                {isSelected && <Check className="w-4 h-4 text-white stroke-[3] drop-shadow" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rosto / Expressão */}
      <div className={`rounded-3xl p-5 space-y-3 ${cardBgClass} ${cardBorderClass}`}>
        <h2 className={`text-xs font-black uppercase tracking-wider ${textSecondaryClass}`}>
          Rosto
        </h2>
        <div className="flex items-center gap-3">
          {FACE_OPTIONS.map((face) => {
            const isSelected = customAvatarConfig.faceId === face.id;
            return (
              <button
                key={face.id ?? "none"}
                onClick={() => updateCustomAvatarConfig({ faceId: face.id })}
                className={`w-12 h-12 rounded-2xl border-2 transition-all flex items-center justify-center text-xl active:scale-95 shadow-sm ${
                  isSelected
                    ? "border-rose-500 bg-rose-500/10 scale-105 ring-2 ring-rose-500/30"
                    : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                }`}
              >
                {face.icon}
              </button>
            );
          })}
        </div>
      </div>

      {/* Roupas & Calçados */}
      <div className={`rounded-3xl p-5 space-y-5 ${cardBgClass} ${cardBorderClass}`}>
        <div>
          <h2 className={`text-xs font-black uppercase tracking-wider ${textSecondaryClass}`}>
            Roupas & Calçados
          </h2>
          <p className={`text-[11px] font-semibold mt-0.5 ${textSecondaryClass}`}>
            Escolha as cores da camisa, bermuda e tênis do seu personagem!
          </p>
        </div>

        {/* 1. Camisetas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-black flex items-center gap-1.5 ${textPrimaryClass}`}>
              <span>👕</span> Camisetas (9 Cores)
            </span>
            <button
              type="button"
              onClick={() =>
                updateCustomAvatarConfig({
                  shirtId: customAvatarConfig.shirtId ? null : "shirt_blue",
                })
              }
              className="text-[10px] font-bold text-slate-400 hover:text-slate-200"
            >
              {customAvatarConfig.shirtId ? "Desequipar" : "Equipar"}
            </button>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
            {[
              { id: "shirt_blue", name: "Azul", hex: "#314F8E" },
              { id: "shirt_red", name: "Vermelho", hex: "#B93B3B" },
              { id: "shirt_green", name: "Verde", hex: "#2D7A4D" },
              { id: "shirt_purple", name: "Roxo", hex: "#6A3A9A" },
              { id: "shirt_yellow", name: "Amarelo", hex: "#D49D26" },
              { id: "shirt_orange", name: "Laranja", hex: "#CB5D24" },
              { id: "shirt_black", name: "Preto", hex: "#282A30" },
              { id: "shirt_pink", name: "Rosa", hex: "#C84E85" },
              { id: "shirt_white", name: "Branco", hex: "#E8ECF2" },
            ].map((s) => {
              const isSelected = customAvatarConfig.shirtId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  title={s.name}
                  onClick={() => updateCustomAvatarConfig({ shirtId: s.id })}
                  className={`h-11 rounded-xl border-2 transition-all flex items-center justify-center relative active:scale-95 shadow-sm ${
                    isSelected
                      ? "ring-2 ring-white scale-105 border-white shadow-md"
                      : "border-black/30 hover:scale-105 opacity-85 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: s.hex }}
                >
                  {isSelected && <Check className="w-4 h-4 text-white drop-shadow-md stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Bermudas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-black flex items-center gap-1.5 ${textPrimaryClass}`}>
              <span>🩳</span> Bermudas (6 Cores)
            </span>
            <button
              type="button"
              onClick={() =>
                updateCustomAvatarConfig({
                  pantsId: customAvatarConfig.pantsId ? null : "pants_brown",
                })
              }
              className="text-[10px] font-bold text-slate-400 hover:text-slate-200"
            >
              {customAvatarConfig.pantsId ? "Desequipar" : "Equipar"}
            </button>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {[
              { id: "pants_brown", name: "Cáqui", hex: "#8C714F" },
              { id: "pants_blue", name: "Azul Jeans", hex: "#2B4865" },
              { id: "pants_black", name: "Preto", hex: "#22252A" },
              { id: "pants_green", name: "Verde Militar", hex: "#4A5D3F" },
              { id: "pants_gray", name: "Cinza", hex: "#8B939E" },
              { id: "pants_red", name: "Vinho", hex: "#822B34" },
            ].map((p) => {
              const isSelected = customAvatarConfig.pantsId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  title={p.name}
                  onClick={() => updateCustomAvatarConfig({ pantsId: p.id })}
                  className={`h-11 rounded-xl border-2 transition-all flex items-center justify-center relative active:scale-95 shadow-sm ${
                    isSelected
                      ? "ring-2 ring-white scale-105 border-white shadow-md"
                      : "border-black/30 hover:scale-105 opacity-85 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: p.hex }}
                >
                  {isSelected && <Check className="w-4 h-4 text-white drop-shadow-md stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Tênis / Calçados */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-black flex items-center gap-1.5 ${textPrimaryClass}`}>
              <span>👟</span> Tênis (6 Cores)
            </span>
            <button
              type="button"
              onClick={() =>
                updateCustomAvatarConfig({
                  shoesId: customAvatarConfig.shoesId ? null : "shoes_red",
                })
              }
              className="text-[10px] font-bold text-slate-400 hover:text-slate-200"
            >
              {customAvatarConfig.shoesId ? "Desequipar" : "Equipar"}
            </button>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {[
              { id: "shoes_red", name: "Vermelho", hex: "#C94636" },
              { id: "shoes_blue", name: "Azul", hex: "#2D63C8" },
              { id: "shoes_black", name: "Preto", hex: "#222429" },
              { id: "shoes_white", name: "Branco", hex: "#EAEDF3" },
              { id: "shoes_yellow", name: "Amarelo", hex: "#D99C26" },
              { id: "shoes_green", name: "Verde", hex: "#3CA352" },
            ].map((sh) => {
              const isSelected = customAvatarConfig.shoesId === sh.id;
              return (
                <button
                  key={sh.id}
                  type="button"
                  title={sh.name}
                  onClick={() => updateCustomAvatarConfig({ shoesId: sh.id })}
                  className={`h-11 rounded-xl border-2 transition-all flex items-center justify-center relative active:scale-95 shadow-sm ${
                    isSelected
                      ? "ring-2 ring-white scale-105 border-white shadow-md"
                      : "border-black/30 hover:scale-105 opacity-85 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: sh.hex }}
                >
                  {isSelected && <Check className="w-4 h-4 text-white drop-shadow-md stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
