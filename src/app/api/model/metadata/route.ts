import { NextRequest, NextResponse } from "next/server";
import { getModelArtifact } from "@/lib/data-service";
import { checkRateLimit } from "@/lib/rate-limiter";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const artifact = getModelArtifact();
    return NextResponse.json({
      version: artifact.version,
      model_type: artifact.model_type,
      target_state: artifact.target_state,
      alpha: artifact.alpha,
      feature_names: artifact.feature_names,
      deployment_model: artifact.deployment_model,
      evaluation_model: artifact.evaluation_model,
      next_day_inference_seed: artifact.next_day_inference_seed
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to load model metadata", message: error?.message },
      { status: 500 }
    );
  }
}

