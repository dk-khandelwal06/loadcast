// tests/test_inference.js - Validates TypeScript Inference Engine
const { getModelArtifact, getHistoricalData, getEvaluationMetrics, getNextDayForecast, getForecastForHistoricalDate } = require("../src/lib/data-service.ts");

console.log("=" .repeat(60));
console.log("TESTING TYPESCRIPT DATA SERVICE & INFERENCE ENGINE");
console.log("=" .repeat(60));

try {
  // 1. Model Artifact
  const model = getModelArtifact();
  console.log("✓ Model Artifact loaded:", model.model_type, "v" + model.version);
  console.log("  Target State:", model.target_state, "Alpha:", model.alpha);

  // 2. Historical Data
  const hist = getHistoricalData();
  console.log("✓ Historical Data loaded:", hist.total_records, "records");
  console.log("  Latest Demand:", hist.kpis.latest_demand, "MU on", hist.kpis.latest_date);

  // 3. Evaluation Metrics
  const metrics = getEvaluationMetrics();
  console.log("✓ Metrics loaded: Ridge RMSE =", metrics.metrics.ridge.rmse, "Naive RMSE =", metrics.metrics.naive.rmse);
  console.log("  Beats Baseline:", metrics.metrics.comparison.beats_baseline);

  // 4. Next-Day Production Forecast
  const nextDay = getNextDayForecast();
  console.log("✓ Next-Day Forecast:", nextDay.predictedDemandMU, "MU for", nextDay.targetDate);
  console.log("  Baseline:", nextDay.baselineDemandMU, "MU, Delta:", nextDay.deltaFromBaselineMU, "MU");

  // 5. Historical Backtest
  const backtest = getForecastForHistoricalDate("2020-05-15");
  if (backtest) {
    console.log("✓ Backtest (2020-05-15): Predicted =", backtest.predictedDemandMU, "MU, Actual =", backtest.actualDemandMU, "MU");
  }

  console.log("=" .repeat(60));
  console.log("ALL INFERENCE CHECKS PASSED!");
  console.log("=" .repeat(60));
} catch (e) {
  console.error("Test failed:", e);
  process.exit(1);
}

