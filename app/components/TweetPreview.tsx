"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, Check } from "lucide-react";

interface TweetPreviewProps {
  content: string | null;
  isLoading: boolean;
}

// Twitter verified badge SVG
function VerifiedBadge() {
  return (
    <svg
      viewBox="0 0 22 22"
      aria-label="Verified account"
      className="h-4 w-4 text-[#1d9bf0]"
      fill="currentColor"
    >
      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
    </svg>
  );
}

export default function TweetPreview({ content, isLoading }: TweetPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasContent = content && content.trim().length > 0;
  const characterCount = content?.length ?? 0;

  return (
    <div className="w-full bg-card border border-border rounded-xl p-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#5A67D8] flex items-center justify-center">
            <Image
              src="/Icon.svg"
              alt="Prisma"
              width={24}
              height={27}
              className="translate-x-[1px]"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-foreground text-[15px]">
                Prisma
              </span>
              <VerifiedBadge />
            </div>
            <span className="text-muted text-[15px]">@prisma</span>
          </div>
        </div>

        {/* Copy button - only show when content exists */}
        {hasContent && !isLoading && (
          <button
            onClick={handleCopy}
            className="p-2 text-muted hover:text-foreground hover:bg-border/50 rounded-full transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="mt-3 min-h-[80px]">
        {isLoading ? (
          // LOADING state - skeleton bars
          <div className="space-y-3">
            <div className="h-4 bg-border rounded animate-pulse" style={{ width: "90%" }} />
            <div className="h-4 bg-border rounded animate-pulse" style={{ width: "75%" }} />
            <div className="h-4 bg-border rounded animate-pulse" style={{ width: "60%" }} />
          </div>
        ) : hasContent ? (
          // CONTENT state - actual tweet
          <p className="text-foreground text-[15px] leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        ) : (
          // EMPTY state - placeholder
          <p className="text-muted text-[15px] leading-relaxed whitespace-pre-wrap">
            Follow us on X to stay updated on all the latest features and releases from Prisma! 🚀
            {"\n\n"}
            Your polished tweet will appear here ✨
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-border">
        {isLoading ? (
          // Loading skeleton for footer
          <div className="h-3 bg-border rounded animate-pulse w-20" />
        ) : hasContent ? (
          // Character count
          <span className="text-xs text-muted font-mono">
            {characterCount} / 280 characters
          </span>
        ) : (
          // Placeholder link
          <span className="text-xs text-muted">prisma.io</span>
        )}
      </div>
    </div>
  );
}
