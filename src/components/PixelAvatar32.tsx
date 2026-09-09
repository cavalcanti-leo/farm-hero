import React from "react";

export interface PixelAvatarConfig {
  skinTone?: string;
  hairStyle?: string;
  hairColor?: string;
  eyesStyle?: string;
  eyeColor?: string;
  eyebrowsStyle?: string;
  mouthStyle?: string;
  blushColor?: string;
  accessory?: string;
  frameColor?: string;
  outfitStyle?: string;
  shirtColor?: string;
  pantsColor?: string;
  shoesColor?: string;
}

export const DEFAULT_PIXEL_AVATAR: PixelAvatarConfig = {
  skinTone: "#FFE0BD",
  hairStyle: "default",
  hairColor: "#4B5563",
  shirtColor: "#3B82F6",
};

export type PixelEmotionType =
  | "normal"
  | "happy"
  | "radiant"
  | "downcast"
  | "anxious"
  | "crying"
  | "tired"
  | "confused"
  | "frozen"
  | "annoyed"
  | "tpmAngry"
  | "rage"
  | "silly"
  | "blushing"
  | "surprised";

export interface PixelAvatar32Props {
  config?: Partial<PixelAvatarConfig>;
  size?: number;
  className?: string;
  mode?: "portrait" | "fullbody";
  emotionOverride?: PixelEmotionType;
}

export const PixelAvatar32: React.FC<PixelAvatar32Props> = ({
  size = 128,
  className = "",
  mode = "fullbody",
}) => {
  const isFullBody = mode === "fullbody";
  const viewBoxH = isFullBody ? 28 : 17;

  return (
    <svg
      width={size}
      height={isFullBody ? Math.round((size * 28) / 20) : size}
      viewBox={`0 0 20 ${viewBoxH}`}
      shapeRendering="crispEdges"
      className={`select-none ${className}`}
    >
      {/* Base Avatar Silhouette / Base Sprite Placeholder */}
      <rect x="0" y="0" width="20" height={viewBoxH} fill="transparent" />

      {/* Head Base */}
      <rect x="6" y="2" width="8" height="8" rx="1.5" fill="#E2E8F0" stroke="#475569" strokeWidth="0.5" />
      {/* Eyes */}
      <circle cx="8.5" cy="5.5" r="0.8" fill="#1E293B" />
      <circle cx="11.5" cy="5.5" r="0.8" fill="#1E293B" />
      {/* Smile */}
      <path d="M 8.5 7.5 Q 10 9.0 11.5 7.5" fill="none" stroke="#1E293B" strokeWidth="0.5" strokeLinecap="round" />

      {isFullBody && (
        <>
          {/* Body */}
          <rect x="6.5" y="10.5" width="7" height="9" rx="1" fill="#94A3B8" stroke="#475569" strokeWidth="0.5" />
          {/* Legs */}
          <rect x="7" y="20" width="2" height="6" fill="#64748B" />
          <rect x="11" y="20" width="2" height="6" fill="#64748B" />
        </>
      )}
    </svg>
  );
};
