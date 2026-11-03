"""
model.py - LoadCast Ridge Regression Model Pipeline
Fits Ridge Regression with StandardScaler fitted strictly on train data to prevent data leakage.
"""

import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge
from sklearn.preprocessing import StandardScaler
from typing import Dict, Any, Tuple

def train_ridge_model(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    alpha: float = 1.0
) -> Tuple[Ridge, StandardScaler, Dict[str, Any]]:
    """
    Fits StandardScaler on X_train only, then fits Ridge Regression.
    Returns:
    - fitted Ridge model
    - fitted StandardScaler
    - metadata dictionary with coefficients and scaler parameters
    """
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    
    ridge = Ridge(alpha=alpha, random_state=42)
    ridge.fit(X_train_scaled, y_train)
    
    feature_names = X_train.columns.tolist()
    
    model_metadata = {
        "alpha": float(alpha),
        "features": feature_names,
        "intercept": float(ridge.intercept_),
        "coefficients": {
            feat: float(coef) for feat, coef in zip(feature_names, ridge.coef_)
        },
        "scaler": {
            "mean": {
                feat: float(m) for feat, m in zip(feature_names, scaler.mean_)
            },
            "scale": {
                feat: float(s) for feat, s in zip(feature_names, scaler.scale_)
            }
        }
    }
    
    return ridge, scaler, model_metadata

def predict_ridge(
    model: Ridge,
    scaler: StandardScaler,
    X: pd.DataFrame
) -> np.ndarray:
    """Predicts electricity demand using fitted scaler and Ridge model."""
    X_scaled = scaler.transform(X)
    return model.predict(X_scaled)

