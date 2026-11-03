"""
features.py - LoadCast Feature Engineering
Constructs leakage-free temporal lag and rolling features for electricity demand forecasting.
"""

import pandas as pd
import numpy as np

COVID_LOCKDOWN_START = "2020-03-25"
COVID_LOCKDOWN_END = "2020-05-31"

FEATURE_COLUMNS = [
    "lag_1",
    "lag_7",
    "rolling_mean_7",
    "day_of_week",
    "month",
    "is_weekend"
]

def engineer_features(df: pd.DataFrame, demand_col: str = "demand") -> pd.DataFrame:
    """
    Computes time-series features with strict leakage prevention:
    - lag_1: Prior day's demand (y_{t-1})
    - lag_7: Same day last week demand (y_{t-7})
    - rolling_mean_7: 7-day average of past demands strictly prior to day t: mean(y_{t-7} ... y_{t-1})
    - day_of_week: Day of week integer (0 = Monday, 6 = Sunday)
    - month: Calendar month (1 to 12)
    - is_weekend: Binary indicator (1 for Saturday/Sunday, 0 otherwise)
    - is_covid_lockdown: Indicator for India's national lockdown period (2020-03-25 to 2020-05-31)
    """
    df = df.copy()
    
    # Ensure datetime format and sort chronologically
    if not pd.api.types.is_datetime64_any_dtype(df["Date"]):
        df["Date"] = pd.to_datetime(df["Date"])
    df.sort_values("Date", inplace=True)
    df.reset_index(drop=True, inplace=True)
    
    # 1. Autoregressive Lags
    df["lag_1"] = df[demand_col].shift(1)
    df["lag_7"] = df[demand_col].shift(7)
    
    # 2. Rolling 7-day Average (Leakage-free: shifted by 1 so day t never enters the window)
    df["rolling_mean_7"] = df[demand_col].shift(1).rolling(window=7, min_periods=7).mean()
    
    # 3. Calendar & Seasonality Features
    df["day_of_week"] = df["Date"].dt.dayofweek
    df["month"] = df["Date"].dt.month
    df["is_weekend"] = (df["day_of_week"] >= 5).astype(int)
    
    # 4. COVID-19 Lockdown Period Annotation
    date_str = df["Date"].dt.strftime("%Y-%m-%d")
    df["is_covid_lockdown"] = ((date_str >= COVID_LOCKDOWN_START) & (date_str <= COVID_LOCKDOWN_END)).astype(int)
    
    return df

def get_clean_modeling_dataset(df: pd.DataFrame):
    """
    Returns feature dataframe with leading NaNs dropped (first 7 rows due to lag_7).
    """
    df_feat = engineer_features(df)
    clean_df = df_feat.dropna(subset=FEATURE_COLUMNS).copy().reset_index(drop=True)
    return clean_df, FEATURE_COLUMNS

if __name__ == "__main__":
    test_df = pd.read_csv("data/processed/rajasthan_daily.csv")
    clean_df, cols = get_clean_modeling_dataset(test_df)
    print("Features engineered successfully.")
    print(f"Clean rows: {len(clean_df)}, Features: {cols}")
    print(clean_df.head(3)[["Date", "demand"] + cols])
