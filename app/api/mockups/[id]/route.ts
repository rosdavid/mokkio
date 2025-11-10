import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { publicApiLimiter, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting check
    const clientIp = getClientIp(request);
    const rateLimitResult = await publicApiLimiter.check(clientIp);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Too many requests",
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "10",
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": new Date(rateLimitResult.reset).toISOString(),
            "Retry-After": rateLimitResult.retryAfter?.toString() || "60",
          },
        }
      );
    }

    const supabase = getSupabaseAdmin();
    const { id } = await params;

    const { error } = await supabase
      .from("saved_mockups")
      .delete()
      .eq("id", id);

    if (error) {
      logger.error("Error deleting mockup:", error);
      return NextResponse.json(
        { error: "Failed to delete mockup" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error in mockups DELETE API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
