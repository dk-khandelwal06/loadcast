"""
verify_inference.py - Verifies mathematical prediction consistency between Python and JSON artifact.
Tests that manual evaluation of the formula matches model output within float tolerance.
"""

import json
import numpy as np

def verify_inference():
    with open("artifacts/model_artifact.json", "r", encoding="utf-8") as f:
        artifact = json.load(f)
        
    deploy_model = artifact["deployment_model"]
    seed = artifact["next_day_inference_seed"]
    
    features = artifact["feature_names"]
    intercept = deploy_model["intercept"]
    coefs = deploy_model["coefficients"]
    means = deploy_model["scaler"]["mean"]
    scales = deploy_model["scaler"]["scale"]
    
    input_data = seed["seed_features"]
    
    # Mathematical calculation: y = intercept + sum_i( coef_i * (x_i - mean_i) / scale_i )
    scaled_contributions = {}
    total_linear = intercept
    for feat in features:
        val = input_data[feat]
        scaled_val = (val - means[feat]) / scales[feat]
        contribution = coefs[feat] * scaled_val
        scaled_contributions[feat] = {
            "raw_value": val,
            "mean": means[feat],
            "scale": scales[feat],
            "scaled_value": scaled_val,
            "coefficient": coefs[feat],
            "contribution_mu": contribution
        }
        total_linear += contribution
        
    expected = seed.get("expected_next_day_demand_exact", seed["expected_next_day_demand_mu"])
    diff = abs(total_linear - expected)
    
    print("=" * 60)
    print("LOADCAST MATHEMATICAL INFERENCE VERIFICATION")
    print("=" * 60)
    print(f"Target Forecast Date: {seed['target_forecast_date']}")
    print(f"Intercept: {intercept:.4f}")
    for feat, info in scaled_contributions.items():
        print(f"  {feat:<16}: raw={info['raw_value']:<7} scaled={info['scaled_value']:<8.4f} * coef={info['coefficient']:<8.4f} = {info['contribution_mu']:+.4f} MU")
    print("-" * 60)
    print(f"Calculated Forecast: {total_linear:.4f} MU")
    print(f"Artifact Expected  : {expected:.4f} MU")
    print(f"Absolute Difference: {diff:.8e}")
    assert diff < 1e-4, f"Prediction discrepancy too high: {diff}"
    print("VERIFICATION RESULT: PASSED! Exact mathematical equivalence confirmed.")
    print("=" * 60)

if __name__ == "__main__":
    verify_inference()
