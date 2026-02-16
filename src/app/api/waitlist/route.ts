import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { waitlistSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = waitlistSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, projectDescription } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Extract UTM params from referrer or query
    const url = new URL(request.url);
    const utm_source = url.searchParams.get("utm_source");
    const utm_medium = url.searchParams.get("utm_medium");
    const utm_campaign = url.searchParams.get("utm_campaign");

    const supabase = await createClient();

    const { error } = await supabase.from("waitlist").insert({
      email: normalizedEmail,
      project_description: projectDescription || null,
      source: "landing_page",
      utm_source,
      utm_medium,
      utm_campaign,
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Already on the list" },
          { status: 409 }
        );
      }
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Successfully joined the waitlist" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
