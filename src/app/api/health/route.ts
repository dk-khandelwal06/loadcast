import { NextResponse } from "next/server";
import { getModelArtifact, getHistoricalData } from "@/lib/data-service";

export async function GET() {
  try {
    const model = getModelArtifact();
    const historical = getHistoricalData();

    return NextResponse.json(
      {
        status: "healthy",
        service: "LoadCast Energy Intelligence Platform",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        model_loaded: Boolean(model?.version),
        model_type: model?.model_type,
        target_state: model?.target_state,
        historical_records: historical?.total_records,
        environment: process.env.NODE_ENV || "production"
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120"
        }
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Failed to verify model or data availability",
        details: error?.message
      },
      { status: 500 }
    );
  }
}

