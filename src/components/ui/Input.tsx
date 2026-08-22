import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-sans font-medium text-text-secondary uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              "w-full bg-[#111114] text-text-primary text-sm px-3.5 py-2.5 rounded-[2px] border border-[#2A2A32] placeholder:text-text-tertiary focus:outline-none focus:border-accent-silver/60 focus:bg-[#18181C] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-status-error focus:border-status-error",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-status-error font-sans">{error}</p>}
        {helperText && !error && <p className="text-xs text-text-tertiary font-sans">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
