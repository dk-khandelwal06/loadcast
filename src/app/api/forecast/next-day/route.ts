import { NextRequest, NextResponse } from "next/server";
import { getNextDayForecast, getForecastForHistoricalDate, getModelArtifact } from "@/lib/data-service";
import { predictElectricityDemand, FeatureInput } from "@/lib/ml-engine";
import { checkRateLimit } from "@/lib/rate-limiter";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");

    if (dateParam) {
      // Historical backtest for a specific date
      const result = getForecastForHistoricalDate(dateParam);
      if (!result) {
        return NextResponse.json(
          {
            error: "Insufficient lag data or date out of range",
            message: `The date ${dateParam} does not have at least 7 previous days of historical observations in the dataset to construct lag-1, lag-7, and rolling-7 features.`
          },
          { status: 400 }
        );
      }
      return NextResponse.json({
        type: "historical_backtest",
        forecast: result
      });
    }

    // Default next-day production forecast
    const forecast = getNextDayForecast();
    return NextResponse.json({
      type: "next_day_forecast",
      forecast
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Forecasting error", message: error?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { lag_1, lag_7, rolling_mean_7, day_of_week, month, is_weekend, target_date } = body;

    // Validate inputs
    if (
      lag_1 === undefined ||
      lag_7 === undefined ||
      rolling_mean_7 === undefined ||
      day_of_week === undefined ||
      month === undefined
    ) {
      return NextResponse.json(
        {
          error: "Missing required feature fields",
          required: ["lag_1", "lag_7", "rolling_mean_7", "day_of_week", "month"]
        },
        { status: 400 }
      );
    }

    const featureInput: FeatureInput = {
      lag_1: Number(lag_1),
      lag_7: Number(lag_7),
      rolling_mean_7: Number(rolling_mean_7),
      day_of_week: Number(day_of_week),
      month: Number(month),
      is_weekend: is_weekend !== undefined ? Number(is_weekend) : (Number(day_of_week) >= 5 ? 1 : 0)
    };

    const artifact = getModelArtifact();
    const forecast = predictElectricityDemand(
      artifact.deployment_model,
      featureInput,
      target_date || "custom-scenario",
      artifact.version
    );

    return NextResponse.json({
      type: "custom_scenario_forecast",
      forecast
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Invalid scenario payload", details: error?.message },
      { status: 400 }
    );
  }
}

