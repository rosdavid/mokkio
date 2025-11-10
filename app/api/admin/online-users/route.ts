import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { adminApiLimiter, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIp = getClientIp(request);
    const rateLimitResult = await adminApiLimiter.check(clientIp);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Too many requests",
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "20",
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": new Date(rateLimitResult.reset).toISOString(),
            "Retry-After": rateLimitResult.retryAfter?.toString() || "60",
          },
        }
      );
    }

    const supabase = getSupabaseAdmin();

    // Get users who have signed in recently (last 24 hours)
    // This gives us an indication of active users
    const twentyFourHoursAgo = new Date(
      Date.now() - 24 * 60 * 60 * 1000
    ).toISOString();

    const { data: recentUsers, error } = await supabase.auth.admin.listUsers();

    if (error) {
      logger.error("Error fetching users:", error);
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }

    // Filter users who have been active recently
    const onlineUsers = recentUsers.users
      .filter(
        (user) =>
          user.last_sign_in_at &&
          new Date(user.last_sign_in_at) > new Date(twentyFourHoursAgo)
      )
      .map((user) => ({
        id: user.id,
        email: user.email,
        last_seen: user.last_sign_in_at,
        username: user.user_metadata?.username || null,
      }))
      .slice(0, 20); // Limit to 20 most recent

    return NextResponse.json({ onlineUsers });
  } catch (error) {
    logger.error("Error in online-users API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
