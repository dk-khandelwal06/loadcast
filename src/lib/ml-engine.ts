/**
 * ml-engine.ts - Pure TypeScript Ridge Regression Inference Engine
 * Mathematically replicates the scikit-learn Ridge model + StandardScaler pipeline.
 */

export interface ModelParameters {
  alpha: number;
  features: string[];
  intercept: number;
  coefficients: Record<string, number>;
  scaler: {
    mean: Record<string, number>;
    scale: Record<string, number>;
  };
}

export interface ModelArtifact {
  version: string;
  model_type: string;
  target_state: string;
  alpha: number;
  feature_names: string[];
  deployment_model: ModelParameters;
  evaluation_model: ModelParameters;
  next_day_inference_seed: {
    last_recorded_date: string;
    last_recorded_demand_mu: number;
    target_forecast_date: string;
    seed_features: Record<string, number>;
    expected_next_day_demand_mu: number;
    expected_next_day_demand_exact?: number;
  };
}

export interface FeatureInput {
  lag_1: number;
  lag_7: number;
  rolling_mean_7: number;
  day_of_week: number; // 0 (Mon) to 6 (Sun)
  month: number;       // 1 to 12
  is_weekend: number;  // 0 or 1
}

export interface FeatureContribution {
  feature: string;
  label: string;
  rawValue: number;
  mean: number;
  scale: number;
  standardizedValue: number;
  coefficient: number;
  impactMU: number;
  percentageImpact: number;
}

export interface ForecastResult {
  targetDate: string;
  predictedDemandMU: number;
  baselineDemandMU: number; // Naive persistence lag_1
  deltaFromBaselineMU: number;
  deltaPercentage: number;
  intercept: number;
  features: FeatureInput;
  contributions: FeatureContribution[];
  method: string;
  modelVersion: string;
  isHistoricalBacktest: boolean;
  actualDemandMU?: number;
  residualMU?: number;
}

const FEATURE_LABELS: Record<string, string> = {
  lag_1: "Yesterday's Demand (Lag-1)",
  lag_7: "Same Day Last Week (Lag-7)",
  rolling_mean_7: "Prior 7-Day Rolling Mean",
  day_of_week: "Day of Week Pattern",
  month: "Annual Month Seasonality",
  is_weekend: "Weekend Factor"
};

/**
 * Executes Ridge regression inference:
 * y_hat = intercept + sum_i( coef_i * ((x_i - mean_i) / scale_i) )
 */
export function predictElectricityDemand(
  model: ModelParameters,
  input: FeatureInput,
  targetDate: string,
  modelVersion: string = "1.0.0",
  actualDemand?: number
): ForecastResult {
  const { intercept, coefficients, scaler, features } = model;
  
  let totalImpact = 0;
  const contributions: FeatureContribution[] = [];

  for (const feat of features) {
    const rawVal = Number(input[feat as keyof FeatureInput]);
    const mean = scaler.mean[feat] ?? 0;
    const scale = scaler.scale[feat] || 1;
    const coef = coefficients[feat] ?? 0;

    const standardized = (rawVal - mean) / scale;
    const impact = standardized * coef;
    totalImpact += impact;

    contributions.push({
      feature: feat,
      label: FEATURE_LABELS[feat] || feat,
      rawValue: rawVal,
      mean: Math.round(mean * 1000) / 1000,
      scale: Math.round(scale * 1000) / 1000,
      standardizedValue: Math.round(standardized * 1000) / 1000,
      coefficient: Math.round(coef * 1000) / 1000,
      impactMU: Math.round(impact * 100) / 100,
      percentageImpact: 0 // calculated below
    });
  }

  const rawPrediction = intercept + totalImpact;
  const predictedDemandMU = Math.round(rawPrediction * 100) / 100;
  const baselineDemandMU = Math.round(input.lag_1 * 100) / 100;
  const deltaFromBaselineMU = Math.round((predictedDemandMU - baselineDemandMU) * 100) / 100;
  const deltaPercentage = baselineDemandMU !== 0 
    ? Math.round((deltaFromBaselineMU / baselineDemandMU) * 10000) / 100 
    : 0;

  // Percentage contribution
  const sumAbsImpact = contributions.reduce((acc, c) => acc + Math.abs(c.impactMU), 0);
  contributions.forEach(c => {
    c.percentageImpact = sumAbsImpact > 0 
      ? Math.round((Math.abs(c.impactMU) / sumAbsImpact) * 1000) / 10 
      : 0;
  });

  // Sort contributions by absolute impact descending
  contributions.sort((a, b) => Math.abs(b.impactMU) - Math.abs(a.impactMU));

  return {
    targetDate,
    predictedDemandMU,
    baselineDemandMU,
    deltaFromBaselineMU,
    deltaPercentage,
    intercept: Math.round(intercept * 100) / 100,
    features: input,
    contributions,
    method: "Ridge Regression with StandardScaler",
    modelVersion,
    isHistoricalBacktest: actualDemand !== undefined,
    actualDemandMU: actualDemand,
    residualMU: actualDemand !== undefined ? Math.round((actualDemand - predictedDemandMU) * 100) / 100 : undefined
  };
}
