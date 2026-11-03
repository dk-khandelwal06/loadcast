/**
 * data-service.ts - Server and Client Data Access Service
 * Provides typed access to ML models, metrics, historical time-series, and quality reports.
 */

import modelArtifactJson from "@/data/model_artifact.json";
import evalMetricsJson from "@/data/evaluation_metrics.json";
import historicalDataJson from "@/data/historical_data.json";
import statesDataJson from "@/data/states_data.json";
import dataQualityJson from "@/data/data_quality.json";
import { ModelArtifact, predictElectricityDemand, ForecastResult, FeatureInput } from "./ml-engine";

export interface DailyRecord {
  date: string;
  demand: number;
  lag_1: number;
  lag_7: number;
  rolling_mean_7: number;
  day_of_week: number;
  month: number;
  is_weekend: boolean;
  is_covid: boolean;
}

export interface HistoricalArtifact {
  state: string;
  unit: string;
  total_records: number;
  date_range: {
    start: string;
    end: string;
  };
  kpis: {
    latest_demand: number;
    latest_date: string;
    average_demand: number;
    peak_demand: number;
    peak_date: string;
    lowest_demand: number;
    lowest_date: string;
    week_over_week_change_pct: number;
  };
  daily: DailyRecord[];
  weekly: Array<{
    week: string;
    start_date: string;
    end_date: string;
    mean_demand: number;
    total_demand: number;
    observations: number;
  }>;
  monthly: Array<{
    month_num: number;
    month_name: string;
    average_demand: number;
    count: number;
  }>;
  day_of_week: Array<{
    day_index: number;
    day_name: string;
    average_demand: number;
    std_demand: number;
    count: number;
    is_weekend: boolean;
  }>;
  distribution: Array<{
    bin_start: number;
    bin_end: number;
    count: number;
  }>;
}

export interface EvaluationMetricsArtifact {
  train_range: {
    start: string;
    end: string;
    count: number;
    percentage: number;
  };
  test_range: {
    start: string;
    end: string;
    count: number;
    percentage: number;
  };
  metrics: {
    ridge: { rmse: number; mae: number; mape: number };
    naive: { rmse: number; mae: number; mape: number };
    comparison: {
      rmse_improvement_pct: number;
      mae_improvement_pct: number;
      mape_improvement_pct: number;
      beats_baseline: boolean;
    };
  };
  covid_sensitivity: {
    description: string;
    lockdown_period: { start: string; end: string };
    lockdown_points_in_test: number;
    lockdown_metrics_ridge: { rmse: number; mae: number; mape: number } | null;
    non_lockdown_metrics_ridge: { rmse: number; mae: number; mape: number } | null;
  };
  holdout_predictions: Array<{
    date: string;
    actual: number;
    predicted_ridge: number;
    predicted_naive: number;
    residual: number;
    is_covid: boolean;
  }>;
  residual_distribution: Array<{
    bin_start: number;
    bin_end: number;
    count: number;
  }>;
}

export interface StateMetadata {
  state: string;
  region: string;
  latitude: number;
  longitude: number;
  record_count: number;
  mean_demand_mu: number;
  min_demand_mu: number;
  max_demand_mu: number;
  std_demand_mu: number;
  has_trained_model: boolean;
}

export function getModelArtifact(): ModelArtifact {
  return modelArtifactJson as unknown as ModelArtifact;
}

export function getHistoricalData(): HistoricalArtifact {
  return historicalDataJson as unknown as HistoricalArtifact;
}

export function getEvaluationMetrics(): EvaluationMetricsArtifact {
  return evalMetricsJson as unknown as EvaluationMetricsArtifact;
}

export function getStatesData(): Record<string, StateMetadata> {
  return statesDataJson as unknown as Record<string, StateMetadata>;
}

export function getDataQualityReport(): any {
  return dataQualityJson;
}

/**
 * Computes next-day forecast using the deployment Ridge model
 */
export function getNextDayForecast(): ForecastResult {
  const artifact = getModelArtifact();
  const seed = artifact.next_day_inference_seed;
  const features = seed.seed_features as unknown as FeatureInput;
  
  return predictElectricityDemand(
    artifact.deployment_model,
    features,
    seed.target_forecast_date,
    artifact.version
  );
}

/**
 * Computes backtest forecast for any specific historical date with lag context
 */
export function getForecastForHistoricalDate(targetDate: string): ForecastResult | null {
  const historical = getHistoricalData();
  const artifact = getModelArtifact();
  
  const daily = historical.daily;
  const targetIndex = daily.findIndex(d => d.date === targetDate);
  if (targetIndex < 7) {
    return null; // Insufficient lag context
  }
  
  const targetRow = daily[targetIndex];
  const features: FeatureInput = {
    lag_1: targetRow.lag_1,
    lag_7: targetRow.lag_7,
    rolling_mean_7: targetRow.rolling_mean_7,
    day_of_week: targetRow.day_of_week,
    month: targetRow.month,
    is_weekend: targetRow.is_weekend ? 1 : 0
  };
  
  return predictElectricityDemand(
    artifact.evaluation_model,
    features,
    targetDate,
    artifact.version,
    targetRow.demand
  );
}

