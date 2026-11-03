import { NextRequest, NextResponse } from "next/server";
import { getDataQualityReport, getStatesData } from "@/lib/data-service";
import { checkRateLimit } from "@/lib/rate-limiter";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const report = getDataQualityReport();
    const states = getStatesData();

    return NextResponse.json({
      data_quality: report,
      states_coverage: {
        total_states_available: Object.keys(states).length,
        states_list: Object.keys(states),
        primary_supported_state: "Rajasthan"
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to load data quality report", message: error?.message },
      { status: 500 }
    );
  }
}
