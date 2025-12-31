"use client";

import {
  SlidersHorizontal,
  ChevronDown,
  Ban,
  Smile,
  SmilePlus,
} from "lucide-react";

// Filter configuration type
export type EmojiMode = "none" | "few" | "many";

export interface Filters {
  maxChars: number;
  emojiMode: EmojiMode;
}

// Props for FilterButton
interface FilterButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  filters: Filters;
}

// Props for FilterPanel
interface FilterPanelProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

/**
 * Toggle button that shows current filter values
 */
export function FilterButton({ isOpen, onToggle, filters }: FilterButtonProps) {
  const emojiLabel = filters.emojiMode;

  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted hover:text-foreground bg-card border border-border rounded-lg transition-colors cursor-pointer"
    >
      <SlidersHorizontal className="h-3.5 w-3.5" />
      <span className="font-mono">
        {filters.maxChars} · {emojiLabel}
      </span>
      <ChevronDown
        className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
  );
}

/**
 * Expanded controls panel for adjusting filters
 */
export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const handleMaxCharsChange = (value: number) => {
    onFiltersChange({ ...filters, maxChars: value });
  };

  const handleEmojiModeChange = (mode: EmojiMode) => {
    onFiltersChange({ ...filters, emojiMode: mode });
  };

  const emojiOptions: { mode: EmojiMode; icon: typeof Ban; label: string }[] = [
    { mode: "none", icon: Ban, label: "No emojis" },
    { mode: "few", icon: Smile, label: "Few emojis" },
    { mode: "many", icon: SmilePlus, label: "Many emojis" },
  ];

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-card border border-border rounded-lg">
      {/* Max Characters Slider */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-wider text-muted">
          Max
        </span>
        <input
          type="range"
          min={100}
          max={280}
          step={20}
          value={filters.maxChars}
          onChange={(e) => handleMaxCharsChange(Number(e.target.value))}
          className="w-20 h-1 bg-border rounded-lg appearance-none cursor-pointer accent-foreground"
        />
        <span className="text-xs font-mono text-muted w-7">
          {filters.maxChars}
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-border" />

      {/* Emoji Mode Buttons */}
      <div className="flex items-center gap-1">
        {emojiOptions.map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            onClick={() => handleEmojiModeChange(mode)}
            title={label}
            className={`h-7 w-7 flex items-center justify-center rounded-md transition-colors ${
              filters.emojiMode === mode
                ? "bg-foreground text-background"
                : "text-muted hover:text-foreground hover:bg-border"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>
    </div>
  );
}
