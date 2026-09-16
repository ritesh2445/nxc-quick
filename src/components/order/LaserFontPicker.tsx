"use client";

import React, { useState, useMemo } from "react";
import { GOOGLE_LASER_FONTS, LaserFontOption, loadGoogleFont } from "@/lib/fonts";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { Search, Sparkles, Check, ChevronRight, SlidersHorizontal, Plus } from "lucide-react";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [customFontInput, setCustomFontInput] = useState("");
  const [customFontError, setCustomFontError] = useState("");

  // Quick 8 featured fonts for 1-click immediate selection
  const featuredFontNames = [
    "Cinzel",
    "Playfair Display",
    "Plus Jakarta Sans",
    "Montserrat",
    "Syne",
    "Bodoni Moda",
    "JetBrains Mono",
    "Orbitron",
  ];

  const featuredFonts = useMemo(() => {
    return featuredFontNames
      .map((name) => GOOGLE_LASER_FONTS.find((f) => f.name === name))
      .filter(Boolean) as LaserFontOption[];
  }, []);

  // Filtered fonts inside catalog modal
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
    setModalOpen(false);
  };

  const displayName = (customerName || "RITESH MARTAWAR").toUpperCase();

  return (
    <div className="space-y-3.5">
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

      {/* Active Font Showcase Card */}
      <div className="p-4 rounded-2xl bg-[#0F0F14] border border-white/15 relative overflow-hidden transition-all shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-sm sm:text-base font-semibold text-white tracking-wide">
                {selectedFont.name}
              </span>
              <span className="text-[9px] font-mono text-[#E2E0DC] tracking-widest px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 uppercase">
                {selectedFont.badge}
              </span>
            </div>
            <p className="text-[11px] font-sans text-[#8E8E98] mt-0.5">
              {selectedFont.description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="min-h-[38px] px-4 py-2 rounded-full bg-white text-black font-sans font-semibold text-xs tracking-wider uppercase hover:bg-[#EAE8E4] flex items-center justify-center gap-1.5 shrink-0 transition-colors btn-interactive shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>BROWSE ALL FONTS</span>
          </button>
        </div>

        {/* Live Laser Engraving Preview on Active Font */}
        <div className="pt-3 pb-1">
          <div className="text-[10px] font-mono text-[#6E6E7A] uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Laser Infill Preview:</span>
            <span className="text-[#8E8E98]">{selectedFont.categoryLabel}</span>
          </div>
          <div
            style={{
              fontFamily: selectedFont.family,
              letterSpacing: selectedFont.letterSpacing || "0.14em",
            }}
            className="text-lg sm:text-2xl text-white font-medium truncate py-1 transition-all"
          >
            {displayName}
          </div>
        </div>
      </div>

      {/* Quick-Pick 8 Featured Font Chips */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-mono text-[#8E8E98] uppercase tracking-wider flex items-center justify-between">
          <span>Quick Recommendations:</span>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="text-white hover:underline flex items-center gap-0.5"
          >
            <span>View All (26+)</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {featuredFonts.map((f) => {
            const isSelected = selectedFont.name === f.name;
            return (
              <button
                key={f.name}
                type="button"
                onClick={() => onSelectFont(f)}
                className={cn(
                  "p-2.5 rounded-xl border text-left transition-all btn-interactive flex flex-col justify-between min-h-[58px]",
                  isSelected
                    ? "bg-white/10 border-white/60 shadow-sm"
                    : "bg-white/[0.02] border-white/[0.06] hover:border-white/20 hover:bg-white/[0.04]"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-medium text-white truncate max-w-[100px]">
                    {f.name}
                  </span>
                  {isSelected && <Check className="w-3 h-3 text-[#25D366] shrink-0" />}
                </div>
                <div
                  style={{ fontFamily: f.family }}
                  className="text-[11px] text-[#A0A0AA] truncate mt-1 tracking-wider"
                >
                  {displayName}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Full Google Fonts Catalog Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="CNC Laser Typography Catalog"
        subtitle="Select from 26+ curated Google Fonts tested for high-contrast metal laser etching."
        maxWidth="xl"
      >
        <div className="space-y-4">
          {/* Search & Category Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8E8E98] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by font name or aesthetic (e.g. Playfair, Roman, Minimalist)..."
                className="w-full bg-[#121217] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-[#6E6E7A] focus:outline-none focus:border-white/40 transition-colors font-sans"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: "all", label: "All (26)" },
                { id: "serif", label: "Luxury Serif (8)" },
                { id: "sans", label: "Modern Sans (10)" },
                { id: "mono", label: "Technical & Mono (4)" },
                { id: "display", label: "Editorial & Bold (4)" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-mono tracking-wider whitespace-nowrap transition-all",
                    activeCategory === tab.id
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "bg-white/[0.03] text-[#8E8E98] hover:text-white border border-white/[0.08]"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
            {filteredFonts.map((f) => {
              const isSelected = selectedFont.name === f.name;
              return (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => {
                    onSelectFont(f);
                    setModalOpen(false);
                  }}
                  className={cn(
                    "p-3.5 rounded-2xl border text-left transition-all btn-interactive flex flex-col justify-between gap-2.5",
                    isSelected
                      ? "bg-white/10 border-white/60 shadow-md"
                      : "bg-white/[0.02] border-white/[0.07] hover:border-white/25 hover:bg-white/[0.05]"
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">
                        {f.name}
                      </span>
                      <span className="ml-2 text-[9px] font-mono text-[#8E8E98] tracking-widest px-1.5 py-0.5 rounded bg-white/[0.04]">
                        {f.badge}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="p-1 rounded-full bg-[#25D366]/20 border border-[#25D366] text-[#25D366]">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  {/* Live Rendered Name in This Font */}
                  <div
                    style={{
                      fontFamily: f.family,
                      letterSpacing: f.letterSpacing || "0.12em",
                    }}
                    className="text-base sm:text-lg text-white font-medium truncate tracking-wide py-1"
                  >
                    {displayName}
                  </div>

                  <p className="text-[10px] font-sans text-[#7E7E8E] leading-relaxed line-clamp-2">
                    {f.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Custom Google Font Search / Write-In */}
          <div className="pt-3 border-t border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#8E8E98] uppercase tracking-wider">
                Custom Google Font Input
              </span>
              <span className="text-[10px] font-mono text-[#6E6E7A]">
                Any font from fonts.google.com
              </span>
            </div>

            <form onSubmit={handleApplyCustomFont} className="flex gap-2">
              <input
                type="text"
                value={customFontInput}
                onChange={(e) => setCustomFontInput(e.target.value)}
                placeholder="e.g. Merriweather, Lora, Righteous, Cinzel Decorative..."
                className="flex-1 bg-[#121217] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-[#5E5E6A] focus:outline-none focus:border-white/40 font-sans"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 text-xs font-mono text-white flex items-center gap-1.5 transition-colors shrink-0 btn-interactive"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>LOAD FONT</span>
              </button>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}
