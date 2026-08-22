"use client";

import dynamic from "next/dynamic";
import React from "react";

export const DynamicHeroCardScene = dynamic(
  () => import("./HeroCardScene").then((mod) => mod.HeroCardScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[440px] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-silver border-t-transparent rounded-full animate-spin opacity-40" />
      </div>
    ),
  }
);
