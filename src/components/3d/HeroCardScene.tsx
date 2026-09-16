"use client";

import React from "react";
import { InteractiveFlippableCard, CardFinish } from "./InteractiveFlippableCard";

export interface HeroCardProps {
  finish?: CardFinish;
  name?: string;
  designation?: string;
  company?: string;
  qrSlug?: string;
  engraving?: string;
  interactive?: boolean;
  isHero?: boolean;
  showFlipButton?: boolean;
  fontStyle?: string;
  fontFamily?: string;
  activeFace?: "front" | "back";
  onFlipChange?: (isBack: boolean) => void;
}

export function HeroCardScene({
  finish = "pitch_black",
  name = "Ritesh Martawar",
  designation = "FOUNDER & CEO",
  company = "NXC Verse",
  qrSlug = "ritesh",
  engraving = "EDITION NO. 001/100",
  interactive = true,
  isHero = true,
  showFlipButton = true,
  fontStyle = "cinzel",
  fontFamily,
  activeFace,
  onFlipChange,
}: HeroCardProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <InteractiveFlippableCard
        finish={finish}
        name={name}
        designation={designation}
        company={company}
        qrSlug={qrSlug}
        engraving={engraving}
        interactiveTilt={interactive}
        isHero={isHero}
        showFlipButton={showFlipButton}
        fontStyle={fontStyle}
        fontFamily={fontFamily}
        activeFace={activeFace}
        onFlipChange={onFlipChange}
      />
    </div>
  );
}
