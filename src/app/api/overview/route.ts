import { NextRequest, NextResponse } from "next/server";
import { getHistoricalData, getEvaluationMetrics, getNextDayForecast } from "@/lib/data-service";
import { checkRateLimit } from "@/lib/rate-limiter";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.resetTimeMs / 1000)) } }
    );
  }

  try {
    const historical = getHistoricalData();
    const metrics = getEvaluationMetrics();
    const nextDay = getNextDayForecast();

    return NextResponse.json({
      project: {
        name: "LOADCAST",
        tagline: "Teaching a regression model to see tomorrow's electricity demand using yesterday's patterns.",
        target_state: "Rajasthan",
        unit: "MU (Mega Units / Million kWh)"
      },
      kpis: historical.kpis,
      next_day_forecast: {
        forecast_date: nextDay.targetDate,
        predicted_demand_mu: nextDay.predictedDemandMU,
        baseline_demand_mu: nextDay.baselineDemandMU,
        delta_mu: nextDay.deltaFromBaselineMU,
        delta_pct: nextDay.deltaPercentage,
        method: nextDay.method
      },
      model_benchmark: {
        ridge_rmse: metrics.metrics.ridge.rmse,
        ridge_mape: metrics.metrics.ridge.mape,
        naive_rmse: metrics.metrics.naive.rmse,
        naive_mape: metrics.metrics.naive.mape,
        rmse_improvement_pct: metrics.metrics.comparison.rmse_improvement_pct,
        beats_baseline: metrics.metrics.comparison.beats_baseline
      },
      coverage: {
        records: historical.total_records,
        start_date: historical.date_range.start,
        end_date: historical.date_range.end
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error fetching overview", message: error?.message },
      { status: 500 }
    );
  }
}
