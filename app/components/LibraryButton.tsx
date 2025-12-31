"use client";

import { Library } from "lucide-react";

interface LibraryButtonProps {
  count: number;
  isOpen: boolean;
  onToggle: () => void;
}

export default function LibraryButton({ count, isOpen, onToggle }: LibraryButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`fixed top-6 right-6 z-40 flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ease-out ${
        isOpen
          ? "bg-foreground text-background border-foreground"
          : "bg-card text-foreground border-border hover:border-muted/50 hover:bg-border/50"
      }`}
      title="Open library"
    >
      <Library className="h-4 w-4" />
      {count > 0 && (
        <span
          className={`min-w-[20px] h-5 px-1.5 flex items-center justify-center text-xs font-medium rounded-full transition-colors duration-200 ${
            isOpen
              ? "bg-background text-foreground"
              : "bg-foreground text-background"
          }`}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
