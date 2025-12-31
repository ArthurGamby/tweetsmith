import { NextRequest, NextResponse } from "next/server";
import { generateWithOllama } from "@/app/lib/ollama";

/**
 * POST /api/transform
 * Transforms a draft tweet into a cleaner, more engaging version
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.draft || typeof body.draft !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'draft' field. Expected a string." },
        { status: 400 }
      );
    }

    const draft = body.draft.trim();
    const maxChars = body.filters?.maxChars ?? 280;
    const emojiMode = body.filters?.emojiMode ?? "few";
    const context = body.context?.trim() || "";

    // Build emoji rule based on mode
    const emojiRule =
      emojiMode === "none"
        ? "No emojis allowed"
        : emojiMode === "few"
          ? "Use 1-2 emojis max"
          : "Use emojis freely";

    // Build the prompt - strict limits first for better LLM compliance
    const prompt = `Rewrite this tweet:
"${draft}"

STRICT LIMITS:
- Maximum ${maxChars} characters (THIS IS MANDATORY)
- ${emojiRule}
- No hashtags
${context ? `\nAuthor style: ${context}` : ""}

GUIDELINES:
- Lead with value
- Sound human, be engaging
- Preserve original meaning

Respond with ONLY the rewritten tweet. No quotes, no explanation.`;

    const transformed = await generateWithOllama(prompt);

    return NextResponse.json({ transformed: transformed.trim() });
  } catch (error) {
    console.error("Transform API error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: `Failed to transform tweet: ${errorMessage}. Is Ollama running at http://localhost:11434?`,
      },
      { status: 500 }
    );
  }
}
