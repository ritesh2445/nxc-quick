"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = "md" }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#000000]/85 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Content Container */}
      <div
        className={cn(
          "relative w-full bg-[#06060A]/95 border border-white/[0.12] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_25px_70px_rgba(0,0,0,0.95)] z-10 animate-in fade-in zoom-in-95 duration-200 text-left max-h-[90vh] overflow-y-auto backdrop-blur-2xl",
          maxWidths[maxWidth]
        )}
      >
        <div className="flex items-start justify-between pb-3.5 border-b border-white/[0.08] gap-3">
          <div>
            {title && <h3 className="font-cinzel text-lg sm:text-xl font-medium text-white tracking-wide">{title}</h3>}
            {subtitle && <p className="font-sans text-xs text-[#8E8E98] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/[0.04] text-[#8E8E98] hover:text-white hover:bg-white/10 border border-white/10 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
