import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import { publicApiLimiter, getClientIp } from "@/lib/rate-limit";

interface TextOverlay {
  id: string;
  content: string;
  color: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  x: number;
  y: number;
  lineHeight: number;
  letterSpacing: number;
  textAlign: "left" | "center" | "right" | "justify";
  opacity: number;
}

interface MockupData {
  name: string;
  uploadedImages: (string | null)[];
  selectedDevice: string;
  selectedTemplate: string | null;
  backgroundType: string;
  backgroundColor: string;
  backgroundImage?: string;
  selectedPreset: string;
  backgroundNoise: number;
  backgroundBlur: number;
  deviceStyle: string;
  styleEdge: number;
  borderType: string;
  borderRadius: number;
  shadowType: string;
  shadowOpacity: number;
  shadowPosition: string;
  shadowMode: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowColor: string;
  sceneType: string;
  zoom: number;
  panX: number;
  panY: number;
  layoutMode: string;
  mockupGap: number;
  siteUrl: string;
  hideMockup: boolean;
  canvasWidth: number;
  canvasHeight: number;
  selectedResolution: string;
  browserMode: string;
  texts: TextOverlay[];
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIp = getClientIp(request);
    const rateLimitResult = await publicApiLimiter.check(clientIp);

    if (!rateLimitResult.success) {
      logger.warn(`Rate limit exceeded for IP: ${clientIp}`);
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
    const mockupData: MockupData = await request.json();

    logger.log("Received mockup data:", {
      name: mockupData.name,
      selectedDevice: mockupData.selectedDevice,
      dataSize: JSON.stringify(mockupData).length,
    });

    // Check if a mockup with this name already exists
    const { data: existingMockup, error: checkError } = await supabase
      .from("saved_mockups")
      .select("id")
      .eq("name", mockupData.name)
      .single();

    let result;
    let isUpdate = false;

    if (existingMockup && !checkError) {
      // Update existing mockup
      logger.log("Updating existing mockup:", existingMockup.id);
      const { data, error } = await supabase
        .from("saved_mockups")
        .update({
          data: mockupData,
          created_at: new Date().toISOString(), // Update timestamp
        })
        .eq("id", existingMockup.id)
        .select()
        .single();

      if (error) {
        logger.error("Supabase error updating mockup:", error);
        return NextResponse.json(
          {
            error: `Failed to update mockup: ${error.message}`,
            details: error,
          },
          { status: 500 }
        );
      }

      result = data;
      isUpdate = true;
    } else {
      // Create new mockup
      logger.log("Creating new mockup");
      const { data, error } = await supabase
        .from("saved_mockups")
        .insert({
          name: mockupData.name,
          data: mockupData,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        logger.error("Supabase error saving mockup:", error);
        return NextResponse.json(
          { error: `Failed to save mockup: ${error.message}`, details: error },
          { status: 500 }
        );
      }

      result = data;
    }

    logger.log(
      `${isUpdate ? "Mockup updated" : "Mockup saved"} successfully:`,
      result.id
    );
    return NextResponse.json({
      success: true,
      mockup: result,
      isUpdate,
      message: isUpdate
        ? "Mockup updated successfully"
        : "Mockup saved successfully",
    });
  } catch (error) {
    logger.error("Error in mockups API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIp = getClientIp(request);
    const rateLimitResult = await publicApiLimiter.check(clientIp);

    if (!rateLimitResult.success) {
      logger.warn(`Rate limit exceeded for IP: ${clientIp}`);
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

    const { data: mockups, error } = await supabase
      .from("saved_mockups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Error fetching mockups:", error);
      return NextResponse.json(
        { error: "Failed to fetch mockups" },
        { status: 500 }
      );
    }

    return NextResponse.json({ mockups: mockups || [] });
  } catch (error) {
    logger.error("Error in mockups GET API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
