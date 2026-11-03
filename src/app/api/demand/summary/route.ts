import { NextRequest, NextResponse } from "next/server";
import { getHistoricalData } from "@/lib/data-service";
import { checkRateLimit } from "@/lib/rate-limiter";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const historical = getHistoricalData();
    return NextResponse.json({
      state: historical.state,
      unit: historical.unit,
      date_range: historical.date_range,
      kpis: historical.kpis,
      day_of_week: historical.day_of_week,
      monthly: historical.monthly,
      weekly: historical.weekly,
      distribution: historical.distribution
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to load summary", message: error?.message }, { status: 500 });
  }
}

