import React from "react";
import pixelHeroSheet from "@/assets/pixel-hero-emotions.png";

// ── Emotion States ─────────────────────────────────────────────────────────
// Sprite sheet: 3 columns × 6 rows = 18 frames of 64×64px each
// Grid position (col, row) — 0-indexed

export type PixelEmotion =
  | "neutral"
  | "smile"
  | "happy"
  | "veryHappy"
  | "energetic"
  | "sleepy"
  | "sad"
  | "sick"
  | "angry"
  | "blush"
  | "cool"
  | "surprised"
  | "focused"
  | "inLove"
  | "scared"
  | "confused"
  | "strong"
  | "thinking";

const EMOTION_POSITIONS: Record<PixelEmotion, [number, number]> = {
  neutral:   [0, 0],
  smile:     [1, 0],
  happy:     [2, 0],
  veryHappy: [0, 1],
  energetic: [1, 1],
  sleepy:    [2, 1],
  sad:       [0, 2],
  sick:      [1, 2],
  angry:     [2, 2],
  blush:     [0, 3],
  cool:      [1, 3],
  surprised: [2, 3],
  focused:   [0, 4],
  inLove:    [1, 4],
  scared:    [2, 4],
  confused:  [0, 5],
  strong:    [1, 5],
  thinking:  [2, 5],
};

// ── Health Score → Emotion mapping ────────────────────────────────────────
export function getEmotionFromHealth(
  healthScore: number,
  medsProgress: number,
  waterProgress: number,
  totalMeds: number,
): PixelEmotion {
  if (medsProgress < 1 && totalMeds > 0) {
    if (medsProgress < 0.3) return "sick";
    return "sad";
  }
  if (waterProgress < 0.2) return "sleepy";
  if (waterProgress < 0.4) return "neutral";
  if (healthScore >= 90)   return "veryHappy";
  if (healthScore >= 80)   return "happy";
  if (healthScore >= 65)   return "energetic";
  if (healthScore >= 50)   return "smile";
  if (healthScore >= 30)   return "neutral";
  return "confused";
}

// ── Labels for display ────────────────────────────────────────────────────
const EMOTION_LABELS: Record<PixelEmotion, string> = {
  neutral:   "😐 Tranquilo",
  smile:     "🙂 Bem",
  happy:     "😊 Feliz",
  veryHappy: "🌟 Radiante",
  energetic: "⚡ Energético",
  sleepy:    "😴 Sonolento",
  sad:       "😢 Tristinho",
  sick:      "🤒 Precisando de remédio",
  angry:     "😤 Irritado",
  blush:     "😊 Tímido",
  cool:      "😎 Cool",
  surprised: "😲 Surpreso",
  focused:   "🎯 Focado",
  inLove:    "❤️ Apaixonado",
  scared:    "😨 Assustado",
  confused:  "😵 Confuso",
  strong:    "💪 Forte",
  thinking:  "🤔 Pensando",
};

// ── Sprite frame size in the original sheet (px) ─────────────────────────
const FRAME_W = 64;
const FRAME_H = 64;
const COLS    = 3;

// ── Component Props ───────────────────────────────────────────────────────
interface PixelHeroSpriteProps {
  emotion: PixelEmotion;
  /** Pixel size to display the sprite at (default 96) */
  size?: number;
  /** Show emotion label below */
  showLabel?: boolean;
  /** Additional className for wrapper */
  className?: string;
}

export const PixelHeroSprite: React.FC<PixelHeroSpriteProps> = ({
  emotion,
  size = 96,
  showLabel = true,
  className = "",
}) => {
  const [col, row] = EMOTION_POSITIONS[emotion];
  const scale = size / FRAME_W;

  // background-position shifts the sprite sheet to show only the correct frame
  const bgX = -(col * FRAME_W * scale);
  const bgY = -(row * FRAME_H * scale);
  const totalW = COLS * FRAME_W * scale;
  const totalH = (Object.keys(EMOTION_POSITIONS).length / COLS) * FRAME_H * scale;

  // Animation class based on emotion
  const animClass =
    emotion === "sick" || emotion === "sad"
      ? "animate-pixel-shake"
      : emotion === "veryHappy" || emotion === "happy" || emotion === "energetic"
        ? "animate-pixel-float"
        : emotion === "sleepy"
          ? "animate-pixel-blink"
          : "animate-pixel-float";

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      {/* Pixel Window — Win95 style picture frame */}
      <div className="pixel-window" style={{ display: "inline-block" }}>
        {/* Win95 Title Bar */}
        <div className="pixel-title-bar" style={{ fontSize: 7, padding: "3px 5px" }}>
          <span className="font-pixel" style={{ fontSize: 6 }}>💊 FarmHero</span>
          <div className="flex gap-0.5 items-center">
            <span className="pixel-title-btn">_</span>
            <span className="pixel-title-btn">□</span>
            <span className="pixel-title-btn">×</span>
          </div>
        </div>

        {/* Sprite Canvas area — checkerboard background like Win95 photo viewer */}
        <div
          className="pixel-sprite"
          style={{
            width: size,
            height: size,
            backgroundImage: `url(${pixelHeroSheet})`,
            backgroundSize: `${totalW}px ${totalH}px`,
            backgroundPosition: `${bgX}px ${bgY}px`,
            backgroundRepeat: "no-repeat",
            imageRendering: "pixelated",
          }}
        />

        {/* Bottom status bar like Win95 */}
        <div
          style={{
            background: "#c0c0c0",
            borderTop: "2px solid #808080",
            padding: "2px 5px",
            fontSize: 7,
            fontFamily: "'Press Start 2P', monospace",
            color: "#000",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              background: "#00aa00",
              border: "1px solid #000",
              imageRendering: "pixelated",
            }}
          />
          <span style={{ fontSize: 6 }}>OK</span>
        </div>
      </div>

      {/* Emotion label */}
      {showLabel && (
        <span
          className="font-pixel text-center"
          style={{ fontSize: 7, color: "#000080", letterSpacing: "0.02em", marginTop: 2 }}
        >
          {EMOTION_LABELS[emotion]}
        </span>
      )}
    </div>
  );
};

export default PixelHeroSprite;
