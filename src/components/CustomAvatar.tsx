import React from "react";
import bodyLightImg from "@/assets/avatar/body_light.png";
import bodyDarkImg from "@/assets/avatar/body_dark.png";

// Short / Male Hair Styles (15 palette colors)
import hair_male_c5979d from "@/assets/avatar/hair_male_c5979d.png";
import hair_male_4b8f8c from "@/assets/avatar/hair_male_4b8f8c.png";
import hair_male_484d6d from "@/assets/avatar/hair_male_484d6d.png";
import hair_male_2c365e from "@/assets/avatar/hair_male_2c365e.png";
import hair_male_2b193d from "@/assets/avatar/hair_male_2b193d.png";
import hair_male_f5e9e2 from "@/assets/avatar/hair_male_f5e9e2.png";
import hair_male_e3b5a4 from "@/assets/avatar/hair_male_e3b5a4.png";
import hair_male_d44d5c from "@/assets/avatar/hair_male_d44d5c.png";
import hair_male_773344 from "@/assets/avatar/hair_male_773344.png";
import hair_male_160029 from "@/assets/avatar/hair_male_160029.png";
import hair_male_e6e626 from "@/assets/avatar/hair_male_e6e626.png";
import hair_male_e57373 from "@/assets/avatar/hair_male_e57373.png";
import hair_male_d96868 from "@/assets/avatar/hair_male_d96868.png";
import hair_male_c55d2b from "@/assets/avatar/hair_male_c55d2b.png";
import hair_male_1e2022 from "@/assets/avatar/hair_male_1e2022.png";

// Long / Female Hair Styles (15 palette colors)
import hair_female_c5979d from "@/assets/avatar/hair_female_c5979d.png";
import hair_female_4b8f8c from "@/assets/avatar/hair_female_4b8f8c.png";
import hair_female_484d6d from "@/assets/avatar/hair_female_484d6d.png";
import hair_female_2c365e from "@/assets/avatar/hair_female_2c365e.png";
import hair_female_2b193d from "@/assets/avatar/hair_female_2b193d.png";
import hair_female_f5e9e2 from "@/assets/avatar/hair_female_f5e9e2.png";
import hair_female_e3b5a4 from "@/assets/avatar/hair_female_e3b5a4.png";
import hair_female_d44d5c from "@/assets/avatar/hair_female_d44d5c.png";
import hair_female_773344 from "@/assets/avatar/hair_female_773344.png";
import hair_female_160029 from "@/assets/avatar/hair_female_160029.png";
import hair_female_e6e626 from "@/assets/avatar/hair_female_e6e626.png";
import hair_female_e57373 from "@/assets/avatar/hair_female_e57373.png";
import hair_female_d96868 from "@/assets/avatar/hair_female_d96868.png";
import hair_female_c55d2b from "@/assets/avatar/hair_female_c55d2b.png";
import hair_female_1e2022 from "@/assets/avatar/hair_female_1e2022.png";

// Extra colors (shared / legacy)
import hair_female_pink from "@/assets/avatar/hair_female_pink.png";
import hair_female_yellow from "@/assets/avatar/hair_female_yellow.png";
import hair_female_black from "@/assets/avatar/hair_female_black.png";
import hair_female_brown from "@/assets/avatar/hair_female_brown.png";

// For male extra colors, use the generic ones as fallbacks
import hair_pinkImg from "@/assets/avatar/hair_pink.png";
import hair_yellowImg from "@/assets/avatar/hair_yellow.png";
import hair_blackImg from "@/assets/avatar/hair_black.png";
import hair_brownImg from "@/assets/avatar/hair_brown.png";

import faceHappyImg from "@/assets/avatar/face_happy.png";

// Roupas e Calçados — Variações de Cores
import shirtBlueImg from "@/assets/avatar/shirt_blue.png";
import shirtRedImg from "@/assets/avatar/shirt_red.png";
import shirtGreenImg from "@/assets/avatar/shirt_green.png";
import shirtPurpleImg from "@/assets/avatar/shirt_purple.png";
import shirtYellowImg from "@/assets/avatar/shirt_yellow.png";
import shirtOrangeImg from "@/assets/avatar/shirt_orange.png";
import shirtBlackImg from "@/assets/avatar/shirt_black.png";
import shirtPinkImg from "@/assets/avatar/shirt_pink.png";
import shirtWhiteImg from "@/assets/avatar/shirt_white.png";

import pantsBrownImg from "@/assets/avatar/pants_brown.png";
import pantsBlueImg from "@/assets/avatar/pants_blue.png";
import pantsBlackImg from "@/assets/avatar/pants_black.png";
import pantsGreenImg from "@/assets/avatar/pants_green.png";
import pantsGrayImg from "@/assets/avatar/pants_gray.png";
import pantsRedImg from "@/assets/avatar/pants_red.png";

import shoesRedImg from "@/assets/avatar/shoes_red.png";
import shoesBlueImg from "@/assets/avatar/shoes_blue.png";
import shoesBlackImg from "@/assets/avatar/shoes_black.png";
import shoesWhiteImg from "@/assets/avatar/shoes_white.png";
import shoesYellowImg from "@/assets/avatar/shoes_yellow.png";
import shoesGreenImg from "@/assets/avatar/shoes_green.png";

export interface CustomAvatarConfig {
  skinTone: "light" | "dark";
  hairId: string | null;
  faceId: string | null;
  shirtId?: string | null;
  pantsId?: string | null;
  shoesId?: string | null;
}

export const DEFAULT_CUSTOM_AVATAR: CustomAvatarConfig = {
  skinTone: "light",
  hairId: "hair_male_d96868",
  faceId: "face_happy",
  shirtId: "shirt_blue",
  pantsId: "pants_brown",
  shoesId: "shoes_red",
};

export const SHIRT_ASSETS: Record<string, string> = {
  shirt_blue: shirtBlueImg,
  shirt_red: shirtRedImg,
  shirt_green: shirtGreenImg,
  shirt_purple: shirtPurpleImg,
  shirt_yellow: shirtYellowImg,
  shirt_orange: shirtOrangeImg,
  shirt_black: shirtBlackImg,
  shirt_pink: shirtPinkImg,
  shirt_white: shirtWhiteImg,
};

export const PANTS_ASSETS: Record<string, string> = {
  pants_brown: pantsBrownImg,
  pants_blue: pantsBlueImg,
  pants_black: pantsBlackImg,
  pants_green: pantsGreenImg,
  pants_gray: pantsGrayImg,
  pants_red: pantsRedImg,
};

export const SHOES_ASSETS: Record<string, string> = {
  shoes_red: shoesRedImg,
  shoes_blue: shoesBlueImg,
  shoes_black: shoesBlackImg,
  shoes_white: shoesWhiteImg,
  shoes_yellow: shoesYellowImg,
  shoes_green: shoesGreenImg,
};

export const HAIR_ASSETS: Record<string, string> = {
  // Male palette colors (15)
  hair_male_c5979d,
  hair_male_4b8f8c,
  hair_male_484d6d,
  hair_male_2c365e,
  hair_male_2b193d,
  hair_male_f5e9e2,
  hair_male_e3b5a4,
  hair_male_d44d5c,
  hair_male_773344,
  hair_male_160029,
  hair_male_e6e626,
  hair_male_e57373,
  hair_male_d96868,
  hair_male_c55d2b,
  hair_male_1e2022,

  // Male extra colors (mapped to generic assets)
  hair_male_pink: hair_pinkImg,
  hair_male_yellow: hair_yellowImg,
  hair_male_black: hair_blackImg,
  hair_male_brown: hair_brownImg,

  // Female palette colors (15)
  hair_female_c5979d,
  hair_female_4b8f8c,
  hair_female_484d6d,
  hair_female_2c365e,
  hair_female_2b193d,
  hair_female_f5e9e2,
  hair_female_e3b5a4,
  hair_female_d44d5c,
  hair_female_773344,
  hair_female_160029,
  hair_female_e6e626,
  hair_female_e57373,
  hair_female_d96868,
  hair_female_c55d2b,
  hair_female_1e2022,

  // Female extra colors
  hair_female_pink,
  hair_female_yellow,
  hair_female_black,
  hair_female_brown,
};

export interface CustomAvatarProps {
  config?: Partial<CustomAvatarConfig>;
  skinTone?: "light" | "dark";
  hairId?: string | null;
  faceId?: string | null;
  shirtId?: string | null;
  pantsId?: string | null;
  shoesId?: string | null;
  size?: number | string;
  className?: string;
  showShadow?: boolean;
}

export const CustomAvatar: React.FC<CustomAvatarProps> = ({
  config,
  skinTone,
  hairId,
  faceId,
  shirtId,
  pantsId,
  shoesId,
  size,
  className = "",
  showShadow = true,
}) => {
  const currentSkin = skinTone ?? config?.skinTone ?? "light";
  const currentHair = hairId !== undefined ? hairId : (config?.hairId ?? "hair_male_d96868");
  const currentFace = faceId !== undefined ? faceId : (config?.faceId || "face_happy");
  const currentShirt = shirtId !== undefined ? shirtId : (config?.shirtId || "shirt_blue");
  const currentPants = pantsId !== undefined ? pantsId : (config?.pantsId || "pants_brown");
  const currentShoes = shoesId !== undefined ? shoesId : (config?.shoesId || "shoes_red");

  const bodySrc = currentSkin === "dark" ? bodyDarkImg : bodyLightImg;
  const hairSrc = currentHair && HAIR_ASSETS[currentHair] ? HAIR_ASSETS[currentHair] : null;
  const faceSrc = currentFace === "none" ? null : faceHappyImg;
  const shirtSrc = currentShirt && SHIRT_ASSETS[currentShirt] ? SHIRT_ASSETS[currentShirt] : null;
  const pantsSrc = currentPants && PANTS_ASSETS[currentPants] ? PANTS_ASSETS[currentPants] : null;
  const shoesSrc = currentShoes && SHOES_ASSETS[currentShoes] ? SHOES_ASSETS[currentShoes] : null;

  return (
    <div
      className={`relative select-none pointer-events-none ${className}`}
      style={{
        aspectRatio: "693 / 985",
        width: size ? (typeof size === "number" ? `${size}px` : size) : "100%",
      }}
    >
      {showShadow && (
        <div
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4/5 h-[8%] bg-black/15 dark:bg-black/30 rounded-[100%] blur-[2px] z-0"
        />
      )}

      {/* Layer 1: Body Base */}
      <img
        src={bodySrc}
        alt="Corpo do Personagem"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        style={{ zIndex: 10 }}
      />

      {/* Layer 2: Face Expression (Olhos e Boca) — sempre visível acima do corpo */}
      <img
        src={faceHappyImg}
        alt="Rosto do Personagem"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        style={{ zIndex: 20 }}
      />

      {/* Layer 3: Shoes (Calçados) */}
      {shoesSrc && (
        <img
          src={shoesSrc}
          alt="Calçado do Personagem"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{ zIndex: 22 }}
        />
      )}

      {/* Layer 4: Pants / Shorts (Bermuda) */}
      {pantsSrc && (
        <img
          src={pantsSrc}
          alt="Bermuda do Personagem"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{ zIndex: 24 }}
        />
      )}

      {/* Layer 5: Shirt (Camisa) */}
      {shirtSrc && (
        <img
          src={shirtSrc}
          alt="Camisa do Personagem"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{ zIndex: 26 }}
        />
      )}

      {/* Layer 6: Hair */}
      {hairSrc && (
        <img
          src={hairSrc}
          alt="Cabelo do Personagem"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{ zIndex: 30 }}
        />
      )}
    </div>
  );
};
