import { useId } from "react";
import type { AvatarLook } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const skinTones = ["#F9D9BC", "#F0BE97", "#DC9F6F", "#AE754E", "#7C4E2D"] as const;
export const hairColors = ["#2B2118", "#5C3A21", "#B5651D", "#E7C063", "#E2E2E2", "#8B3FCF", "#3FA9F5", "#FF5EA0"] as const;
export const outfitColors = ["#8B5CF6", "#3FA9F5", "#22C55E", "#FF8A3D", "#FF5EA0", "#111827"] as const;
export const hairStyles = ["curto", "medio", "longo", "cacheado", "coque", "careca"] as const;
export const accessories = ["nenhum", "oculos", "bone", "fone"] as const;

export type HairStyle = (typeof hairStyles)[number];
export type Accessory = (typeof accessories)[number];

/** clareia/escurece uma cor hex para criar volume tipo desenho 3D */
function shade(hex: string, amount: number) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(full, 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const r = clamp(((num >> 16) & 255) + 255 * amount);
  const g = clamp(((num >> 8) & 255) + 255 * amount);
  const b = clamp((num & 255) + 255 * amount);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function AvatarFigure({
  look,
  className,
}: {
  look: AvatarLook;
  className?: string;
}) {
  const { skin, hairColor, hairStyle, outfitColor, gender, accessory } = look;
  const uid = useId().replace(/:/g, "");
  const skinG = `skin-${uid}`;
  const outfitG = `outfit-${uid}`;
  const hairG = `hair-${uid}`;
  const line = shade(skin, -0.32);

  return (
    <svg
      viewBox="0 0 200 260"
      className={cn("h-full w-auto", className)}
      role="img"
      aria-label="Avatar personalizado"
    >
      <defs>
        <radialGradient id={skinG} cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor={shade(skin, 0.16)} />
          <stop offset="65%" stopColor={skin} />
          <stop offset="100%" stopColor={shade(skin, -0.14)} />
        </radialGradient>
        <radialGradient id={outfitG} cx="32%" cy="22%" r="85%">
          <stop offset="0%" stopColor={shade(outfitColor, 0.2)} />
          <stop offset="60%" stopColor={outfitColor} />
          <stop offset="100%" stopColor={shade(outfitColor, -0.16)} />
        </radialGradient>
        <radialGradient id={hairG} cx="32%" cy="18%" r="80%">
          <stop offset="0%" stopColor={shade(hairColor, 0.22)} />
          <stop offset="60%" stopColor={hairColor} />
          <stop offset="100%" stopColor={shade(hairColor, -0.16)} />
        </radialGradient>
      </defs>

      {/* sombra no chão */}
      <ellipse cx="100" cy="246" rx="52" ry="9" fill="#2B1B3D" opacity="0.14" />

      {/* pernas roliças */}
      <g>
        <rect x="80" y="196" width="20" height="46" rx="10" fill={`url(#${skinG})`} />
        <rect x="104" y="196" width="20" height="46" rx="10" fill={`url(#${skinG})`} />
        <ellipse cx="90" cy="242" rx="14" ry="8" fill="#fff" stroke={shade(outfitColor, -0.1)} strokeWidth="3" />
        <ellipse cx="114" cy="242" rx="14" ry="8" fill="#fff" stroke={shade(outfitColor, -0.1)} strokeWidth="3" />
      </g>

      {/* corpo fofinho */}
      {gender === "feminino" ? (
        <path
          d="M100 128 c26 0 32 10 34 22 l10 58 c1 8 -8 12 -44 12 s-45 -4 -44 -12 l10 -58 c2 -12 8 -22 34 -22 Z"
          fill={`url(#${outfitG})`}
        />
      ) : (
        <path
          d="M100 128 c24 0 34 12 34 28 v42 c0 12 -12 18 -34 18 s-34 -6 -34 -18 v-42 c0 -16 10 -28 34 -28 Z"
          fill={`url(#${outfitG})`}
        />
      )}
      {/* brilho na roupa */}
      <path d="M78 142 q8 -10 20 -12 q-14 8 -16 22 Z" fill="#fff" opacity="0.22" />

      {/* braços */}
      <rect x="48" y="140" width="20" height="56" rx="10" fill={`url(#${skinG})`} transform="rotate(8 58 168)" />
      <rect x="132" y="140" width="20" height="56" rx="10" fill={`url(#${skinG})`} transform="rotate(-8 142 168)" />
      <circle cx="55" cy="198" r="12" fill={`url(#${skinG})`} />
      <circle cx="145" cy="198" r="12" fill={`url(#${skinG})`} />

      {/* pescoço */}
      <rect x="90" y="112" width="20" height="24" rx="10" fill={shade(skin, -0.08)} />

      {/* cabeça grande estilo chibi */}
      <ellipse cx="100" cy="80" rx="46" ry="46" fill={`url(#${skinG})`} />
      <ellipse cx="54" cy="86" rx="8" ry="10" fill={shade(skin, -0.06)} />
      <ellipse cx="146" cy="86" rx="8" ry="10" fill={shade(skin, -0.06)} />

      {/* cabelo */}
      <Hair style={hairStyle} fill={`url(#${hairG})`} shine={shade(hairColor, 0.35)} />

      {/* olhos grandes e brilhantes */}
      <g>
        <ellipse cx="84" cy="82" rx="9" ry="11" fill="#fff" />
        <ellipse cx="116" cy="82" rx="9" ry="11" fill="#fff" />
        <circle cx="85" cy="84" r="6.4" fill="#3A2A1E" />
        <circle cx="117" cy="84" r="6.4" fill="#3A2A1E" />
        <circle cx="83" cy="81" r="2.4" fill="#fff" />
        <circle cx="115" cy="81" r="2.4" fill="#fff" />
        <circle cx="87" cy="87" r="1.2" fill="#fff" opacity="0.8" />
        <circle cx="119" cy="87" r="1.2" fill="#fff" opacity="0.8" />
        {/* sobrancelhas */}
        <path d="M76 68 q8 -5 16 -1" fill="none" stroke={shade(hairColor, -0.1)} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M108 67 q8 -4 16 1" fill="none" stroke={shade(hairColor, -0.1)} strokeWidth="3.5" strokeLinecap="round" />
      </g>

      {/* bochechas + sorriso */}
      <ellipse cx="70" cy="96" rx="8" ry="5.5" fill="#FF8FA3" opacity="0.5" />
      <ellipse cx="130" cy="96" rx="8" ry="5.5" fill="#FF8FA3" opacity="0.5" />
      <path d="M89 100 q11 12 22 0 q-11 6 -22 0 Z" fill="#B3465E" />
      <path d="M89 100 q11 12 22 0" fill="none" stroke={line} strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="100" cy="60" rx="16" ry="8" fill="#fff" opacity="0.16" />

      {/* acessórios */}
      {accessory === "oculos" && (
        <g stroke="#2B1B3D" strokeWidth="4" fill="#BFE9FF" fillOpacity="0.35">
          <rect x="70" y="70" width="28" height="24" rx="10" />
          <rect x="102" y="70" width="28" height="24" rx="10" />
          <path d="M98 82 h4" strokeLinecap="round" />
        </g>
      )}
      {accessory === "bone" && (
        <g>
          <path d="M56 58 a44 44 0 0 1 88 0 q-44 -12 -88 0 Z" fill={`url(#${outfitG})`} />
          <path d="M100 56 h54 a10 10 0 0 1 0 14 h-54 Z" fill={shade(outfitColor, -0.12)} />
        </g>
      )}
      {accessory === "fone" && (
        <g>
          <path d="M56 74 a44 40 0 0 1 88 0" fill="none" stroke={shade(outfitColor, -0.05)} strokeWidth="9" strokeLinecap="round" />
          <rect x="42" y="70" width="22" height="32" rx="11" fill={`url(#${outfitG})`} />
          <rect x="136" y="70" width="22" height="32" rx="11" fill={`url(#${outfitG})`} />
        </g>
      )}
    </svg>
  );
}

function Hair({ style, fill, shine }: { style: HairStyle; fill: string; shine: string }) {
  switch (style) {
    case "careca":
      return <ellipse cx="88" cy="48" rx="16" ry="9" fill="#fff" opacity="0.18" />;
    case "curto":
      return (
        <g>
          <path d="M56 76 a44 44 0 0 1 88 0 q-10 -18 -30 -14 q-18 4 -30 6 q-16 2 -28 8 Z" fill={fill} />
          <path d="M76 46 q14 -8 28 -4 q-16 2 -24 10 Z" fill={shine} opacity="0.5" />
        </g>
      );
    case "medio":
      return (
        <g>
          <path d="M56 80 a44 44 0 0 1 88 0 q-4 -26 -44 -26 q-40 0 -44 26 Z" fill={fill} />
          <path d="M56 80 q-10 18 -6 32 q10 -10 10 -30 Z" fill={fill} />
          <path d="M144 80 q10 18 6 32 q-10 -10 -10 -30 Z" fill={fill} />
          <path d="M76 48 q14 -8 28 -4 q-16 2 -24 10 Z" fill={shine} opacity="0.5" />
        </g>
      );
    case "longo":
      return (
        <g>
          <path d="M52 82 q-10 68 8 88 q18 -20 12 -60 Z" fill={fill} />
          <path d="M148 82 q10 68 -8 88 q-18 -20 -12 -60 Z" fill={fill} />
          <path d="M54 82 a46 46 0 0 1 92 0 q-8 -30 -46 -30 q-38 0 -46 30 Z" fill={fill} />
          <path d="M76 46 q16 -8 30 -4 q-18 2 -26 10 Z" fill={shine} opacity="0.5" />
        </g>
      );
    case "cacheado":
      return (
        <g fill={fill}>
          <circle cx="72" cy="52" r="18" />
          <circle cx="100" cy="40" r="20" />
          <circle cx="128" cy="52" r="18" />
          <circle cx="57" cy="72" r="14" />
          <circle cx="143" cy="72" r="14" />
          <circle cx="92" cy="34" r="7" fill={shine} opacity="0.45" />
        </g>
      );
    case "coque":
      return (
        <g>
          <circle cx="100" cy="26" r="17" fill={fill} />
          <path d="M56 76 a44 44 0 0 1 88 0 q-6 -26 -44 -26 q-38 0 -44 26 Z" fill={fill} />
          <circle cx="94" cy="20" r="6" fill={shine} opacity="0.45" />
        </g>
      );
  }
}
