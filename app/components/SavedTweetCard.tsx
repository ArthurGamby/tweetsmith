"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, Check, Trash2 } from "lucide-react";

interface SavedTweet {
  id: string;
  original: string;
  transformed: string;
  context: string | null;
  createdAt: string;
}

interface SavedTweetCardProps {
  tweet: SavedTweet;
  onUseAsDraft: (text: string) => void;
  onDelete: (id: string) => void;
}

// Twitter verified badge SVG
function VerifiedBadge() {
  return (
    <svg
      viewBox="0 0 22 22"
      aria-label="Verified account"
      className="h-3.5 w-3.5 text-[#1d9bf0]"
      fill="currentColor"
    >
      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
    </svg>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function SavedTweetCard({ tweet, onUseAsDraft, onDelete }: SavedTweetCardProps) {
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(tweet.transformed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/tweets?id=${tweet.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        onDelete(tweet.id);
      }
    } catch (error) {
      console.error("Failed to delete tweet:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  const handleCardClick = () => {
    if (!showDeleteConfirm) {
      onUseAsDraft(tweet.transformed);
    }
  };

  const characterCount = tweet.transformed.length;

  return (
    <div
      onClick={handleCardClick}
      className="w-full bg-card border border-border rounded-xl p-4 cursor-pointer transition-all duration-200 ease-out hover:border-muted/50 hover:bg-border/20"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-full bg-[#5A67D8] flex items-center justify-center flex-shrink-0">
          <Image
            src="/Icon.svg"
            alt="Prisma"
            width={20}
            height={22}
            className="translate-x-[1px]"
          />
        </div>
        <div className="flex items-center gap-1 min-w-0">
          <span className="font-semibold text-foreground text-sm truncate">
            Prisma
          </span>
          <VerifiedBadge />
          <span className="text-muted text-sm">@prisma</span>
          <span className="text-muted text-sm">·</span>
          <span className="text-muted text-sm">{formatDate(tweet.createdAt)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="mt-2.5 pl-[52px]">
        <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
          {tweet.transformed}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-3 pl-[52px] flex items-center justify-between">
        <span className="text-xs text-muted font-mono">
          {characterCount} chars
        </span>

        {showDeleteConfirm ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleDeleteCancel}
              className="px-2.5 py-1 text-xs text-muted hover:text-foreground transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="px-2.5 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-all duration-200 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="p-1.5 text-muted hover:text-foreground rounded-full transition-colors duration-200"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-1.5 text-muted hover:text-red-400 rounded-full transition-colors duration-200"
              title="Delete tweet"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
