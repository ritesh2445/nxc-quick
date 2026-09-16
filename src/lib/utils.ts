import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: "INR" | "USD" = "INR"): string {
  if (currency === "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | number | string | null | undefined): string {
  if (!date) return "—";
  try {
    let d: Date;
    if (typeof date === "number") {
      // If over-multiplied (e.g. ms multiplied by 1000)
      if (date > 1e14) {
        d = new Date(date / 1000);
      } else if (date < 1e11) {
        // Unix timestamp in seconds
        d = new Date(date * 1000);
      } else {
        d = new Date(date);
      }
    } else if (date instanceof Date) {
      if (date.getFullYear() > 3000) {
        d = new Date(date.getTime() / 1000);
      } else {
        d = date;
      }
    } else {
      const num = Number(date);
      if (!isNaN(num) && num > 0) {
        if (num > 1e14) {
          d = new Date(num / 1000);
        } else if (num < 1e11) {
          d = new Date(num * 1000);
        } else {
          d = new Date(num);
        }
      } else {
        d = new Date(date);
        if (d.getFullYear() > 3000) {
          d = new Date(d.getTime() / 1000);
        }
      }
    }

    if (isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d);
  } catch {
    return "—";
  }
}

export function cleanUsername(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9_.-]/g, "");
}
