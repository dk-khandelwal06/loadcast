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
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");
    const format = searchParams.get("format");
    const maxLimit = searchParams.get("limit");

    let records = historical.daily;

    if (startDate) {
      records = records.filter(r => r.date >= startDate);
    }
    if (endDate) {
      records = records.filter(r => r.date <= endDate);
    }
    if (maxLimit) {
      const parsedLimit = parseInt(maxLimit, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        records = records.slice(0, parsedLimit);
      }
    }

    if (format === "csv") {
      const headers = ["date", "demand_mu", "lag_1", "lag_7", "rolling_mean_7", "day_of_week", "month", "is_weekend", "is_covid"];
      const rows = records.map(r => [
        r.date,
        r.demand,
        r.lag_1,
        r.lag_7,
        r.rolling_mean_7,
        r.day_of_week,
        r.month,
        r.is_weekend ? 1 : 0,
        r.is_covid ? 1 : 0
      ].join(","));
      const csvContent = [headers.join(","), ...rows].join("\n");

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="loadcast_rajasthan_demand_${new Date().toISOString().slice(0, 10)}.csv"`
        }
      });
    }

    return NextResponse.json({
      state: historical.state,
      unit: historical.unit,
      count: records.length,
      start_date: records.length > 0 ? records[0].date : null,
      end_date: records.length > 0 ? records[records.length - 1].date : null,
      records
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to load history", message: error?.message }, { status: 500 });
  }
}
