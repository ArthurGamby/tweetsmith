import { NextRequest, NextResponse } from "next/server";
import { generateWithOllama } from "@/app/lib/ollama";

/**
 * POST /api/transform
 * Transforms a draft tweet into a cleaner, more engaging version
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate that draft exists and is a string
    if (!body.draft || typeof body.draft !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'draft' field. Expected a string." },
        { status: 400 }
      );
    }

    const draft = body.draft.trim();

    // Build the prompt for the LLM
    const prompt = `You are a tweet formatter. Your job is to improve tweets.

            Given this draft tweet:
            "${draft}"

            Improve it by:
            - Making it cleaner and more engaging
            - Ensuring it's well-formatted and readable
            - Keeping it under 280 characters

            Rules:
            - Return ONLY the improved tweet text
            - No quotes, no explanations, no extra text
            - Preserve the original meaning and intent`;

    // Call Ollama to generate the improved tweet
    const transformed = await generateWithOllama(prompt);

    // Return the transformed tweet
    return NextResponse.json({ transformed: transformed.trim() });
  } catch (error) {
    // Log the error for debugging
    console.error("Transform API error:", error);

    // Return a helpful error message
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
