import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

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

    // Check for existing username (case-insensitive)
    const { data: existing, error: checkError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .ilike("username", username)
      .limit(1);

    if (checkError) {
      console.error("Username check error:", checkError);
      return NextResponse.json({ error: "Internal" }, { status: 500 });
    }

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: "username_taken" }, { status: 409 });
    }

    const { data, error } = await supabaseAdmin.from("profiles").insert([
      {
        id,
        username,
        full_name: full_name ?? null,
      },
    ]);

    if (error) {
      console.error("Insert profile error:", error);
      return NextResponse.json(
        { error: "Failed to create profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile: data?.[0] ?? null }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unexpected" }, { status: 500 });
  }
}
