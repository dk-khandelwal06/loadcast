import { NextRequest, NextResponse } from "next/server";
import { getEvaluationMetrics } from "@/lib/data-service";
import { checkRateLimit } from "@/lib/rate-limiter";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const metrics = getEvaluationMetrics();
    return NextResponse.json(metrics, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600"
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to load metrics", message: error?.message },
      { status: 500 }
    );
  }
}
