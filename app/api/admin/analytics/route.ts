import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    // Get user registration stats for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const supabaseAdmin = getSupabaseAdmin();
    const { data: users, error: usersError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return NextResponse.json(
        { error: "Failed to fetch analytics" },
        { status: 500 }
      );
    }

    // Calculate registration stats
    const totalUsers = users.users.length;
    const recentUsers = users.users.filter(
      (user) => new Date(user.created_at) > thirtyDaysAgo
    ).length;

    // Get daily signups for the last 30 days
    const dailySignups = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const dayUsers = users.users.filter((user) => {
        const userDate = new Date(user.created_at);
        return userDate >= startOfDay && userDate <= endOfDay;
      });

      dailySignups.push({
        date: startOfDay.toISOString().split("T")[0],
        count: dayUsers.length,
      });
    }

    return NextResponse.json({
      totalUsers,
      recentUsers,
      dailySignups,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
