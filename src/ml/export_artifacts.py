"""
export_artifacts.py - LoadCast Artifact Export Pipeline
Executes end-to-end ML workflow, trains evaluation and deployment models,
and exports compact, versioned JSON artifacts for the Next.js application.
"""

import os
import sys
import json
import shutil
import pandas as pd
import numpy as np

# Ensure workspace root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from src.ml.data_prep import prepare_data
from src.ml.features import get_clean_modeling_dataset, FEATURE_COLUMNS, engineer_features
from src.ml.model import train_ridge_model
from src.ml.evaluate import evaluate_models

def run_export_pipeline():
    print("=" * 60)
    print("LOADCAST MACHINE LEARNING & ARTIFACT EXPORT PIPELINE")
    print("=" * 60)
    
    artifacts_dir = "artifacts"
    nextjs_data_dir = "src/data"
    os.makedirs(artifacts_dir, exist_ok=True)
    os.makedirs(nextjs_data_dir, exist_ok=True)
    
    # Step 1: Prepare Cleaned Data
    print("\n[Step 1/5] Preparing and cleaning dataset...")
    raj_df, wide_df, states_meta, quality_report = prepare_data()
    
    # Step 2: Feature Engineering
    print("\n[Step 2/5] Engineering temporal features...")
    clean_df, feature_cols = get_clean_modeling_dataset(raj_df)
    print(f"Engineered {len(feature_cols)} features for {len(clean_df)} daily records.")
    
    # Step 3: Holdout Evaluation
    print("\n[Step 3/5] Performing chronological 80/20 train/test evaluation...")
    eval_results = evaluate_models(clean_df, feature_cols, train_ratio=0.8, alpha=1.0)
    
    print("\n--- Model Evaluation Results ---")
    ridge_m = eval_results["metrics"]["ridge"]
    naive_m = eval_results["metrics"]["naive"]
    comp = eval_results["metrics"]["comparison"]
    print(f"Ridge Model : RMSE = {ridge_m['rmse']} MU | MAE = {ridge_m['mae']} MU | MAPE = {ridge_m['mape']}%")
    print(f"Naive Model : RMSE = {naive_m['rmse']} MU | MAE = {naive_m['mae']} MU | MAPE = {naive_m['mape']}%")
    print(f"RMSE Improvement: {comp['rmse_improvement_pct']}% (Ridge beats baseline: {comp['beats_baseline']})")
    
    # Step 4: Final Deployment Model Training
    print("\n[Step 4/5] Training final production deployment model on full historical dataset...")
    X_full = clean_df[feature_cols]
    y_full = clean_df["demand"]
    deploy_ridge, deploy_scaler, deploy_meta = train_ridge_model(X_full, y_full, alpha=1.0)
    
    # Prepare Next-Day Feature Seed from latest known observations
    latest_row = clean_df.iloc[-1]
    last_date_str = latest_row["Date"].strftime("%Y-%m-%d")
    next_date = latest_row["Date"] + pd.Timedelta(days=1)
    next_date_str = next_date.strftime("%Y-%m-%d")
    
    # Features for the day immediately following the dataset end:
    # lag_1 is the demand on the last recorded day
    # lag_7 is the demand 7 days prior to next_date (which is 6 days prior to latest_row)
    # rolling_mean_7 is the mean of the last 7 observed days
    last_7_demands = clean_df["demand"].iloc[-7:].tolist()
    next_day_features = {
        "lag_1": round(float(latest_row["demand"]), 2),
        "lag_7": round(float(clean_df["demand"].iloc[-7]), 2),
        "rolling_mean_7": round(float(np.mean(last_7_demands)), 2),
        "day_of_week": int(next_date.dayofweek),
        "month": int(next_date.month),
        "is_weekend": int(1 if next_date.dayofweek >= 5 else 0)
    }
    
    # Calculate prediction for next day in Python for reference verification
    x_input = [next_day_features[col] for col in feature_cols]
    x_scaled = (np.array(x_input) - np.array([deploy_meta["scaler"]["mean"][c] for c in feature_cols])) / np.array([deploy_meta["scaler"]["scale"][c] for c in feature_cols])
    next_day_prediction = float(deploy_meta["intercept"] + np.sum(x_scaled * np.array([deploy_meta["coefficients"][c] for c in feature_cols])))
    
    print(f"Latest Recorded Date: {last_date_str} (Demand: {latest_row['demand']} MU)")
    print(f"Target Next-Day Date: {next_date_str}")
    print(f"Next-Day Predicted Demand: {round(next_day_prediction, 2)} MU")
    
    # Full Model Artifact
    model_artifact = {
        "version": "1.0.0",
        "model_type": "Ridge Regression with StandardScaler",
        "target_state": "Rajasthan",
        "alpha": 1.0,
        "feature_names": feature_cols,
        "deployment_model": deploy_meta,
        "evaluation_model": eval_results["eval_model_parameters"],
        "next_day_inference_seed": {
            "last_recorded_date": last_date_str,
            "last_recorded_demand_mu": round(float(latest_row["demand"]), 2),
            "target_forecast_date": next_date_str,
            "seed_features": next_day_features,
            "expected_next_day_demand_mu": round(next_day_prediction, 2),
            "expected_next_day_demand_exact": float(next_day_prediction)
        }
    }
    
    # Step 5: Historical Analytics Aggregations
    print("\n[Step 5/5] Building historical analytics dataset...")
    # Day-of-week averages
    dow_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    dow_avg = []
    for dow in range(7):
        sub = clean_df[clean_df["day_of_week"] == dow]
        dow_avg.append({
            "day_index": dow,
            "day_name": dow_names[dow],
            "average_demand": round(float(sub["demand"].mean()), 2),
            "std_demand": round(float(sub["demand"].std()), 2),
            "count": int(len(sub)),
            "is_weekend": bool(dow >= 5)
        })
        
    # Monthly averages
    month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    monthly_avg = []
    for m in range(1, 13):
        sub = clean_df[clean_df["month"] == m]
        if len(sub) > 0:
            monthly_avg.append({
                "month_num": m,
                "month_name": month_names[m - 1],
                "average_demand": round(float(sub["demand"].mean()), 2),
                "count": int(len(sub))
            })
            
    # Weekly aggregate trend
    clean_df["YearWeek"] = clean_df["Date"].dt.strftime("%Y-W%W")
    weekly_agg = []
    for yw, grp in clean_df.groupby("YearWeek"):
        weekly_agg.append({
            "week": yw,
            "start_date": grp["Date"].min().strftime("%Y-%m-%d"),
            "end_date": grp["Date"].max().strftime("%Y-%m-%d"),
            "mean_demand": round(float(grp["demand"].mean()), 2),
            "total_demand": round(float(grp["demand"].sum()), 2),
            "observations": int(len(grp))
        })
        
    # Daily timeline records
    daily_records = []
    for _, r in clean_df.iterrows():
        daily_records.append({
            "date": r["Date"].strftime("%Y-%m-%d"),
            "demand": round(float(r["demand"]), 2),
            "lag_1": round(float(r["lag_1"]), 2),
            "lag_7": round(float(r["lag_7"]), 2),
            "rolling_mean_7": round(float(r["rolling_mean_7"]), 2),
            "day_of_week": int(r["day_of_week"]),
            "month": int(r["month"]),
            "is_weekend": bool(r["is_weekend"]),
            "is_covid": bool(r["is_covid_lockdown"])
        })
        
    # Demand Distribution Histogram
    hist, bin_edges = np.histogram(clean_df["demand"], bins=20)
    distribution_bins = [
        {
            "bin_start": round(float(bin_edges[i]), 1),
            "bin_end": round(float(bin_edges[i+1]), 1),
            "count": int(hist[i])
        }
        for i in range(len(hist))
    ]
    
    historical_artifact = {
        "state": "Rajasthan",
        "unit": "MU",
        "total_records": len(daily_records),
        "date_range": {
            "start": daily_records[0]["date"],
            "end": daily_records[-1]["date"]
        },
        "kpis": {
            "latest_demand": daily_records[-1]["demand"],
            "latest_date": daily_records[-1]["date"],
            "average_demand": round(float(clean_df["demand"].mean()), 2),
            "peak_demand": round(float(clean_df["demand"].max()), 2),
            "peak_date": clean_df.loc[clean_df["demand"].idxmax()]["Date"].strftime("%Y-%m-%d"),
            "lowest_demand": round(float(clean_df["demand"].min()), 2),
            "lowest_date": clean_df.loc[clean_df["demand"].idxmin()]["Date"].strftime("%Y-%m-%d"),
            "week_over_week_change_pct": round(float((daily_records[-1]["demand"] - daily_records[-8]["demand"]) / daily_records[-8]["demand"] * 100), 2) if len(daily_records) >= 8 else 0.0
        },
        "daily": daily_records,
        "weekly": weekly_agg,
        "monthly": monthly_avg,
        "day_of_week": dow_avg,
        "distribution": distribution_bins
    }
    
    # Save artifacts to both artifacts/ and src/data/
    artifacts_to_save = {
        "model_artifact.json": model_artifact,
        "evaluation_metrics.json": eval_results,
        "historical_data.json": historical_artifact,
        "states_data.json": states_meta,
        "data_quality.json": quality_report
    }
    
    for filename, data in artifacts_to_save.items():
        # Save to artifacts/
        p1 = os.path.join(artifacts_dir, filename)
        with open(p1, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
            
        # Save to src/data/
        p2 = os.path.join(nextjs_data_dir, filename)
        with open(p2, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
            
        print(f"Exported artifact: {filename} ({os.path.getsize(p1) // 1024} KB)")
        
    print("\nAll ML artifacts generated and exported successfully!")

if __name__ == "__main__":
    run_export_pipeline()
