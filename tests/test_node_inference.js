// tests/test_node_inference.js
const fs = require("fs");
const path = require("path");

const model = JSON.parse(fs.readFileSync(path.join(__dirname, "../artifacts/model_artifact.json"), "utf8"));
const hist = JSON.parse(fs.readFileSync(path.join(__dirname, "../artifacts/historical_data.json"), "utf8"));
const evalMetrics = JSON.parse(fs.readFileSync(path.join(__dirname, "../artifacts/evaluation_metrics.json"), "utf8"));

console.log("=" .repeat(60));
console.log("NODE.JS INFERENCE VERIFICATION");
console.log("=" .repeat(60));

const deploy = model.deployment_model;
const seed = model.next_day_inference_seed;
const features = model.feature_names;

let total = deploy.intercept;
for (const feat of features) {
  const raw = seed.seed_features[feat];
  const mean = deploy.scaler.mean[feat];
  const scale = deploy.scaler.scale[feat];
  const coef = deploy.coefficients[feat];
  const z = (raw - mean) / scale;
  const impact = z * coef;
  total += impact;
  console.log(`  ${feat.padEnd(16)}: raw=${raw} z=${z.toFixed(4)} impact=${impact >= 0 ? '+' : ''}${impact.toFixed(4)} MU`);
}

const calculated = Math.round(total * 100) / 100;
const expected = seed.expected_next_day_demand_mu;
console.log("-".repeat(60));
console.log(`Calculated in Node.js: ${calculated} MU`);
console.log(`Expected in Artifact : ${expected} MU`);
console.log(`Delta: ${Math.abs(calculated - expected).toExponential(4)}`);

if (Math.abs(calculated - expected) < 1e-4) {
  console.log("NODE.JS MATHEMATICAL INFERENCE PASSED! Exact match.");
  console.log("=" .repeat(60));
} else {
  console.error("Mismatch!");
  process.exit(1);
}
