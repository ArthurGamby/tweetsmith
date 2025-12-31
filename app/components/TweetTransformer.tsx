"use client";

import { useState } from "react";

export default function TweetTransformer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const characterCount = input.length;
  const maxCharacters = 280;
  const isOverLimit = characterCount > maxCharacters;
  const isEmpty = input.trim().length === 0;

  const handleTransform = async () => {
    if (isEmpty || isLoading) return;

    setIsLoading(true);
    console.log("Transforming tweet:", input);

    // Simulate API call delay for now
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Placeholder: In the future, this will call the API
    setOutput(input);
    setIsLoading(false);
  };

  return (
    <div className="w-full space-y-6">
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
            <span
              className={`text-xs font-mono ${
                isOverLimit ? "text-red-400" : "text-muted"
              }`}
            >
              {characterCount} / {maxCharacters}
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
