"use client";

import { useState, useEffect, useCallback } from "react";
import { FilterButton, FilterPanel, type Filters } from "./FilterOptions";
import { ContextButton, ContextPanel } from "./ContextSettings";

type OpenPanel = "none" | "context" | "filters";

export default function TweetTransformer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<Filters>({
    maxChars: 280,
    emojiMode: "few",
  });
  const [openPanel, setOpenPanel] = useState<OpenPanel>("none");
  const [context, setContext] = useState("");
  const [hasContext, setHasContext] = useState(false);

  // Check localStorage for existing context on mount
  useEffect(() => {
    const saved = localStorage.getItem("TweetSmith-context");
    if (saved && saved.trim().length > 0) {
      setContext(saved);
      setHasContext(true);
    }
  }, []);

  // Handle context changes
  const handleContextChange = useCallback((newContext: string) => {
    setContext(newContext);
    setHasContext(newContext.trim().length > 0);
  }, []);

  // Toggle panel - clicking one closes the other
  const togglePanel = (panel: "context" | "filters") => {
    setOpenPanel((current) => (current === panel ? "none" : panel));
  };

  const characterCount = input.length;
  const isEmpty = input.trim().length === 0;

  const handleTransform = async () => {
    if (isEmpty || isLoading) return;

    // Reset states before starting
    setError("");
    setOutput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/transform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ draft: input, filters, context }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to transform tweet");
      }

      setOutput(data.transformed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Settings Row - Both buttons inline, above input */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ContextButton
            isOpen={openPanel === "context"}
            onToggle={() => togglePanel("context")}
            hasContext={hasContext}
          />
          <FilterButton
            isOpen={openPanel === "filters"}
            onToggle={() => togglePanel("filters")}
            filters={filters}
          />
        </div>

        {/* Context Panel with smooth animation */}
        <div
          className={`grid transition-all duration-200 ease-out ${
            openPanel === "context"
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <ContextPanel context={context} onContextChange={handleContextChange} />
          </div>
        </div>

        {/* Filter Panel with smooth animation */}
        <div
          className={`grid transition-all duration-200 ease-out ${
            openPanel === "filters"
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <FilterPanel filters={filters} onFiltersChange={setFilters} />
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-2">
        <label className="block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
          Your Draft
        </label>
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your tweet draft..."
            className="w-full min-h-[120px] px-4 py-3 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted/60 resize-none focus:outline-none focus:border-muted/50 transition-colors"
          />
          <div className="absolute bottom-3 right-3">
            <span className="text-xs font-mono text-muted">
              {characterCount}
            </span>
          </div>
        </div>
      </div>

      {/* Transform Button */}
      <button
        onClick={handleTransform}
        disabled={isEmpty || isLoading}
        className="w-full py-2.5 px-4 bg-foreground text-background text-sm font-medium rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.99]"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Transforming...
          </span>
        ) : (
          "Transform"
        )}
      </button>

      {/* Error Message */}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* Output Section */}
      {output && (
        <div className="space-y-2 animate-in fade-in duration-300">
          <label className="block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
            Result
          </label>
          <div className="w-full px-4 py-3 bg-card border border-border rounded-lg">
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {output}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
