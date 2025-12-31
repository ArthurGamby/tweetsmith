"use client";

import { useEffect, useState } from "react";
import { User, ChevronDown } from "lucide-react";

const STORAGE_KEY = "TweetSmith-context";

// Props for ContextButton
interface ContextButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  hasContext: boolean;
}

// Props for ContextPanel
interface ContextPanelProps {
  context: string;
  onContextChange: (context: string) => void;
}

/**
 * Toggle button for context settings
 * Shows a dot indicator when context is set
 */
export function ContextButton({
  isOpen,
  onToggle,
  hasContext,
}: ContextButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="relative flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-muted hover:text-foreground bg-card border border-border rounded-lg transition-colors cursor-pointer"
    >
      <User className="h-3.5 w-3.5" />
      {/* Dot indicator when context is set */}
      {hasContext && (
        <span className="absolute -top-1 -right-1 h-2 w-2 bg-foreground rounded-full" />
      )}
      <ChevronDown
        className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
  );
}

/**
 * Textarea panel for entering context
 * Persists to localStorage
 */
export function ContextPanel({ context, onContextChange }: ContextPanelProps) {
  const [value, setValue] = useState(context);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setValue(saved);
      onContextChange(saved);
    }
  }, [onContextChange]);

  // Save to localStorage and update parent
  const handleChange = (newValue: string) => {
    setValue(newValue);
    onContextChange(newValue);
    localStorage.setItem(STORAGE_KEY, newValue);
  };

  return (
    <div className="w-full">
      <textarea
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Describe your style, tone, or audience..."
        rows={2}
        className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted/60 resize-none focus:outline-none focus:border-muted/50 transition-colors"
      />
    </div>
  );
}
