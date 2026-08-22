import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-24 select-none">
      <div className="space-y-4 max-w-md">
        <span className="font-mono text-xs text-[#70707C] tracking-[0.25em] uppercase">
          404 ERROR
        </span>
        <h1 className="font-sans font-medium text-4xl text-[#F2F0EC] tracking-tight">
          Page Not Found
        </h1>
        <p className="font-sans text-sm text-[#A09E9A] leading-relaxed">
          The requested profile or page does not exist or has been relocated.
        </p>
        <div className="pt-4">
          <Link href="/">
            <button className="px-6 py-2.5 rounded-[8px] bg-white text-black font-sans font-semibold text-xs tracking-wider uppercase flex items-center gap-2 mx-auto hover:bg-[#E2E0DC] transition-colors">
              <ArrowLeft className="w-4 h-4" /> RETURN HOME
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
