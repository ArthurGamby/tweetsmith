"use client";

import { useState, useEffect } from "react";
import { X, Inbox, Loader2 } from "lucide-react";
import SavedTweetCard from "./SavedTweetCard";

interface SavedTweet {
  id: string;
  original: string;
  transformed: string;
  context: string | null;
  createdAt: string;
}

interface LibraryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onUseAsDraft: (text: string) => void;
  onCountChange: (count: number) => void;
}

export default function LibraryPanel({
  isOpen,
  onClose,
  onUseAsDraft,
  onCountChange,
}: LibraryPanelProps) {
  const [tweets, setTweets] = useState<SavedTweet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch tweets when panel opens
  useEffect(() => {
    if (isOpen) {
      fetchTweets();
    }
  }, [isOpen]);

  const fetchTweets = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/tweets");
      if (!response.ok) {
        throw new Error("Failed to fetch tweets");
      }
      const data = await response.json();
      setTweets(data);
      onCountChange(data.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setTweets((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      onCountChange(updated.length);
      return updated;
    });
  };

  const handleUseAsDraft = (text: string) => {
    onUseAsDraft(text);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[360px] bg-card border-l border-border shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-foreground">Library</h2>
            <span className="text-sm text-muted">({tweets.length})</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted hover:text-foreground hover:bg-border/50 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-65px)] overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <Loader2 className="h-6 w-6 text-muted animate-spin" />
              <span className="text-sm text-muted">Loading tweets...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <span className="text-sm text-red-400">{error}</span>
              <button
                onClick={fetchTweets}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                Try again
              </button>
            </div>
          ) : tweets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
              <Inbox className="h-10 w-10 text-muted/50" />
              <div>
                <p className="text-sm text-muted">No saved tweets yet</p>
                <p className="text-xs text-muted/60 mt-1">
                  Transform and save tweets to build your library
                </p>
              </div>
            </div>
          ) : (
            tweets.map((tweet) => (
              <SavedTweetCard
                key={tweet.id}
                tweet={tweet}
                onUseAsDraft={handleUseAsDraft}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
