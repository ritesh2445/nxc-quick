import React from "react";
import { NXC_LOGO_DATA_URI } from "@/components/3d/nxcLogoDataUri";

export interface PhoenixProps {
  className?: string;
  fill?: string;
  alt?: string;
}

export function PhoenixEmblem({ className = "w-full h-full object-contain", alt = "NXC Verse Official Logo" }: PhoenixProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={NXC_LOGO_DATA_URI}
      alt={alt}
      style={{ mixBlendMode: "screen" }}
      className={`pointer-events-none select-none ${className}`}
    />
  );
}

