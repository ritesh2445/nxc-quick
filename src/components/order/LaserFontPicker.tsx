"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { GOOGLE_LASER_FONTS, LaserFontOption, loadGoogleFont } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ChevronDown, Search, Check, Type, Sparkles } from "lucide-react";

export interface LaserFontPickerProps {
  selectedFont: LaserFontOption;
  onSelectFont: (font: LaserFontOption) => void;
  customerName: string;
}

export function LaserFontPicker({
  selectedFont,
  onSelectFont,
  customerName,
}: LaserFontPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [customFontInput, setCustomFontInput] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      // Focus search input when opened
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Filtered fonts based on search & category
  const filteredFonts = useMemo(() => {
    return GOOGLE_LASER_FONTS.filter((font) => {
      const matchesCategory =
        activeCategory === "all" || font.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        font.name.toLowerCase().includes(query) ||
        font.badge.toLowerCase().includes(query) ||
        font.categoryLabel.toLowerCase().includes(query) ||
        font.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleApplyCustomFont = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFontInput.trim()) return;

    const fontName = customFontInput.trim();
    loadGoogleFont(fontName);

    const customOption: LaserFontOption = {
      name: fontName,
      family: `"${fontName}", sans-serif`,
      category: "sans",
      categoryLabel: "Custom Google Font",
      badge: "CUSTOM",
      description: `Custom Google Font: ${fontName}`,
      letterSpacing: "0.10em",
    };

    onSelectFont(customOption);
    setCustomFontInput("");
    setIsOpen(false);
  };

  const displayName = (customerName || "RITESH MARTAWAR").toUpperCase();

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      {/* Label Header */}
      <div className="flex items-center justify-between">
        <label className="font-mono text-xs text-[#C8C6C0] uppercase tracking-widest font-semibold flex items-center gap-2">
          <span>03</span>
          <span>SELECT LASER TYPOGRAPHY</span>
        </label>
        <span className="text-[10px] font-mono text-[#8E8E98] flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#E2E0DC]" />
          <span>26+ Google Fonts</span>
        </span>
      </div>

      {/* Main Luxury Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full bg-[#101015] border rounded-xl px-4 py-3 text-left transition-all duration-200 flex items-center justify-between gap-3 btn-interactive",
          isOpen
            ? "border-white/50 bg-[#14141B] shadow-[0_0_20px_rgba(255,255,255,0.08)]"
            : "border-white/10 hover:border-white/30 hover:bg-[#131318]"
        )}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0">
            <Type className="w-4 h-4 text-[#E2E0DC]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                style={{ fontFamily: selectedFont.family }}
                className="text-sm sm:text-base font-semibold text-white tracking-wide truncate"
              >
                {selectedFont.name}
              </span>
              <span className="text-[9px] font-mono text-[#A0A0AA] tracking-widest px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 uppercase shrink-0">
                {selectedFont.categoryLabel}
              </span>
            </div>

            <div className="text-[11px] text-[#7A7A88] font-sans truncate mt-0.5">
              {selectedFont.description}
            </div>
          </div>
        </div>

        {/* Live Sample Badge & Chevron */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex flex-col items-end pr-1 border-r border-white/10">
            <span className="text-[9px] font-mono text-[#6E6E7A] uppercase tracking-wider">
              Live Etch Preview
            </span>
            <span
              style={{ fontFamily: selectedFont.family }}
              className="text-xs text-white/90 font-medium tracking-wider max-w-[130px] truncate"
            >
              {displayName}
            </span>
          </div>

          <ChevronDown
            className={cn(
              "w-4 h-4 text-[#A0A0AA] transition-transform duration-200 shrink-0",
              isOpen && "rotate-180 text-white"
            )}
          />
        </div>
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#0C0C10] border border-white/15 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Search & Category Tabs Header */}
          <div className="p-3 border-b border-white/[0.08] space-y-2.5 bg-[#0F0F14]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8E8E98] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search font by name (e.g. Playfair, Bodoni, JetBrains)..."
                className="w-full bg-[#16161D] border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-[#6E6E7A] focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
              {[
                { id: "all", label: "All (26)" },
                { id: "serif", label: "Luxury Serif" },
                { id: "sans", label: "Modern Sans" },
                { id: "mono", label: "Monospace" },
                { id: "display", label: "Editorial" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider whitespace-nowrap transition-all",
                    activeCategory === tab.id
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "bg-white/[0.04] text-[#8E8E98] hover:text-white hover:bg-white/[0.08]"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-[280px] overflow-y-auto divide-y divide-white/[0.04] p-1.5">
            {filteredFonts.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#7A7A88] font-mono">
                No fonts matching &ldquo;{searchQuery}&rdquo;
              </div>
            ) : (
              filteredFonts.map((font) => {
                const isSelected = selectedFont.name === font.name;
                return (
                  <button
                    key={font.name}
                    type="button"
                    onClick={() => {
                      onSelectFont(font);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full px-3 py-2.5 rounded-xl text-left transition-all flex items-center justify-between gap-3 group",
                      isSelected
                        ? "bg-white/[0.1] text-white"
                        : "hover:bg-white/[0.05] text-[#D0D0D8]"
                    )}
                  >
                    {/* Left: Font Name & Category */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          style={{ fontFamily: font.family }}
                          className="text-sm font-medium text-white tracking-wide truncate group-hover:text-white"
                        >
                          {font.name}
                        </span>
                        <span className="text-[8px] font-mono text-[#8E8E98] px-1.5 py-0.2 rounded bg-white/[0.04] border border-white/5 uppercase">
                          {font.badge}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#7A7A88] font-sans truncate">
                        {font.categoryLabel}
                      </div>
                    </div>

                    {/* Right: Actual Name Sample & Selection Check */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        style={{
                          fontFamily: font.family,
                          letterSpacing: font.letterSpacing || "0.10em",
                        }}
                        className="text-xs text-white/80 font-medium tracking-wider max-w-[140px] truncate hidden min-[420px]:block"
                      >
                        {displayName}
                      </span>

                      <div className="w-4 h-4 flex items-center justify-center">
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#25D366]" />}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Optional: Load Any Custom Google Font */}
          <form
            onSubmit={handleApplyCustomFont}
            className="p-2.5 border-t border-white/[0.08] bg-[#0E0E12] flex items-center gap-2"
          >
            <input
              type="text"
              value={customFontInput}
              onChange={(e) => setCustomFontInput(e.target.value)}
              placeholder="Or enter any custom Google Font (e.g. Oswald, Lora)..."
              className="flex-1 bg-[#14141A] border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white placeholder:text-[#6E6E7A] focus:outline-none focus:border-white/30"
            />
            <button
              type="submit"
              disabled={!customFontInput.trim()}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono tracking-wider uppercase transition-colors disabled:opacity-30 shrink-0"
            >
              Apply
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
