"""
evaluate.py - LoadCast Temporal Holdout Evaluation
Chronological split evaluation comparing Ridge Regression to Naive Persistence Baseline.
Includes COVID-19 lockdown sensitivity analysis and residual distribution.
"""

import os
import sys
import numpy as np
import pandas as pd
from sklearn.metrics import mean_squared_error, mean_absolute_error, mean_absolute_percentage_error
from typing import Dict, Any, Tuple

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from src.ml.model import train_ridge_model, predict_ridge

def evaluate_models(
    df: pd.DataFrame,
    feature_cols: list,
    train_ratio: float = 0.8,
    alpha: float = 1.0
) -> Dict[str, Any]:
    """
    Evaluates Ridge vs Naive Baseline on a strictly chronological train/test holdout split.
    """
    n_total = len(df)
    split_idx = int(n_total * train_ratio)
    
    train_df = df.iloc[:split_idx].copy().reset_index(drop=True)
    test_df = df.iloc[split_idx:].copy().reset_index(drop=True)
    
    X_train = train_df[feature_cols]
    y_train = train_df["demand"]
    X_test = test_df[feature_cols]
    y_test = test_df["demand"]
    
    # Train Ridge model on train split
    ridge, scaler, eval_model_meta = train_ridge_model(X_train, y_train, alpha=alpha)
    
    # Generate predictions
    y_pred_ridge = predict_ridge(ridge, scaler, X_test)
    y_pred_naive = test_df["lag_1"].values
    
    # 1. Overall Test Metrics
    def calc_metrics(y_true, y_pred):
        rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))
        mae = float(mean_absolute_error(y_true, y_pred))
        mape = float(mean_absolute_percentage_error(y_true, y_pred) * 100)
        return {"rmse": round(rmse, 4), "mae": round(mae, 4), "mape": round(mape, 3)}
    
    metrics_ridge = calc_metrics(y_test, y_pred_ridge)
    metrics_naive = calc_metrics(y_test, y_pred_naive)
    
    # Improvement calculation
    rmse_improvement = (metrics_naive["rmse"] - metrics_ridge["rmse"]) / metrics_naive["rmse"] * 100
    mae_improvement = (metrics_naive["mae"] - metrics_ridge["mae"]) / metrics_naive["mae"] * 100
    mape_improvement = (metrics_naive["mape"] - metrics_ridge["mape"]) / metrics_naive["mape"] * 100
    
    # 2. Residuals & Error Distribution
    residuals_ridge = y_test.values - y_pred_ridge
    residuals_naive = y_test.values - y_pred_naive
    
    # 3. COVID-19 Lockdown Sensitivity Evaluation
    covid_mask = test_df["is_covid_lockdown"] == 1
    non_covid_mask = test_df["is_covid_lockdown"] == 0
    
    covid_metrics_ridge = calc_metrics(y_test[covid_mask], y_pred_ridge[covid_mask]) if covid_mask.sum() > 0 else None
    non_covid_metrics_ridge = calc_metrics(y_test[non_covid_mask], y_pred_ridge[non_covid_mask]) if non_covid_mask.sum() > 0 else None
    
    # 4. Actual vs Predicted Points for Holdout Chart
    test_points = []
    test_dates = test_df["Date"].dt.strftime("%Y-%m-%d").tolist()
    for i in range(len(test_df)):
        test_points.append({
            "date": test_dates[i],
            "actual": round(float(y_test.iloc[i]), 2),
            "predicted_ridge": round(float(y_pred_ridge[i]), 2),
            "predicted_naive": round(float(y_pred_naive[i]), 2),
            "residual": round(float(residuals_ridge[i]), 2),
            "is_covid": bool(test_df["is_covid_lockdown"].iloc[i])
        })
        
    # Residual histogram bins
    hist, bin_edges = np.histogram(residuals_ridge, bins=15)
    residual_hist = [
        {
            "bin_start": round(float(bin_edges[i]), 2),
            "bin_end": round(float(bin_edges[i+1]), 2),
            "count": int(hist[i])
        }
        for i in range(len(hist))
    ]
    
    evaluation_result = {
        "train_range": {
            "start": train_df["Date"].dt.strftime("%Y-%m-%d").min(),
            "end": train_df["Date"].dt.strftime("%Y-%m-%d").max(),
            "count": int(len(train_df)),
            "percentage": round(train_ratio * 100, 1)
        },
        "test_range": {
            "start": test_df["Date"].dt.strftime("%Y-%m-%d").min(),
            "end": test_df["Date"].dt.strftime("%Y-%m-%d").max(),
            "count": int(len(test_df)),
            "percentage": round((1 - train_ratio) * 100, 1)
        },
        "metrics": {
            "ridge": metrics_ridge,
            "naive": metrics_naive,
            "comparison": {
                "rmse_improvement_pct": round(rmse_improvement, 2),
                "mae_improvement_pct": round(mae_improvement, 2),
                "mape_improvement_pct": round(mape_improvement, 2),
                "beats_baseline": bool(metrics_ridge["rmse"] < metrics_naive["rmse"])
            }
        },
        "covid_sensitivity": {
            "description": "Evaluation comparing model behavior during the March 25 - May 31, 2020 national lockdown structural break versus standard periods.",
            "lockdown_period": {"start": "2020-03-25", "end": "2020-05-31"},
            "lockdown_points_in_test": int(covid_mask.sum()),
            "lockdown_metrics_ridge": covid_metrics_ridge,
            "non_lockdown_metrics_ridge": non_covid_metrics_ridge
        },
        "holdout_predictions": test_points,
        "residual_distribution": residual_hist,
        "eval_model_parameters": eval_model_meta
    }
    
    return evaluation_result
