import { NextRequest, NextResponse } from "next/server";
import prisma from "../../lib/prisma";

/**
 * GET /api/tweets
 * Fetch all saved tweets ordered by createdAt desc
 */
export async function GET() {
  try {
    const tweets = await prisma.savedTweet.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tweets);
  } catch (error) {
    console.error("Error fetching tweets:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { error: `Failed to fetch tweets: ${errorMessage}` },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tweets
 * Save a new tweet with { original, transformed, context?, imageUrl?, imageAlt? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.original || typeof body.original !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'original' field. Expected a string." },
        { status: 400 }
      );
    }

    if (!body.transformed || typeof body.transformed !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'transformed' field. Expected a string." },
        { status: 400 }
      );
    }

    const tweet = await prisma.savedTweet.create({
      data: {
        original: body.original,
        transformed: body.transformed,
        context: body.context ?? null,
        imageUrl: body.imageUrl ?? null,
        imageAlt: body.imageAlt ?? null,
      },
    });

    return NextResponse.json(tweet, { status: 201 });
  } catch (error) {
    console.error("Error saving tweet:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { error: `Failed to save tweet: ${errorMessage}` },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tweets?id=xxx
 * Delete a tweet by id
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing 'id' query parameter." },
        { status: 400 }
      );
    }

    await prisma.savedTweet.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tweet:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    // Check for "Record not found" error
    if (errorMessage.includes("Record to delete does not exist")) {
      return NextResponse.json(
        { error: "Tweet not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: `Failed to delete tweet: ${errorMessage}` },
      { status: 500 }
    );
  }
}
