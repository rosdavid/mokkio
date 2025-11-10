import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, username, full_name } = body as {
      id?: string;
      username?: string;
      full_name?: string | null;
    };

    if (!id || !username) {
      return NextResponse.json(
        { error: "id and username required" },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Check for existing username (case-insensitive), excluding the current user's profile
    const { data: existing, error: checkError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .ilike("username", username)
      .neq("id", id)
      .limit(1);

    if (checkError) {
      logger.error("Username check error:", checkError);
      return NextResponse.json({ error: "Internal" }, { status: 500 });
    }

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: "username_taken" }, { status: 409 });
    }

    // Check if profile already exists
    const { data: existingProfile, error: selectError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", id)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      // PGRST116 is "not found"
      logger.error("Profile select error:", selectError);
      return NextResponse.json({ error: "Internal" }, { status: 500 });
    }

    let data, error;
    if (existingProfile) {
      // Update existing profile
      const { data: updateData, error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          username,
          full_name: full_name ?? null,
        })
        .eq("id", id);
      data = updateData;
      error = updateError;
    } else {
      // Insert new profile
      const { data: insertData, error: insertError } = await supabaseAdmin
        .from("profiles")
        .insert([
          {
            id,
            username,
            full_name: full_name ?? null,
          },
        ]);
      data = insertData;
      error = insertError;
    }

    if (error) {
      logger.error("Insert profile error:", error);
      return NextResponse.json(
        { error: "Failed to create profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile: data?.[0] ?? null }, { status: 201 });
  } catch (err) {
    logger.error(err);
    return NextResponse.json({ error: "Unexpected" }, { status: 500 });
  }
}
