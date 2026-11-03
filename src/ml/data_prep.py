"""
data_prep.py - LoadCast Data Preparation Pipeline
Validates raw Kaggle dataset, parses dates, deduplicates, and generates processed datasets.
"""

import os
import json
import pandas as pd
import numpy as np

def prepare_data(
    raw_wide_path: str = "data/raw/dataset_tk.csv",
    raw_long_path: str = "data/raw/long_data.csv",
    processed_dir: str = "data/processed"
):
    os.makedirs(processed_dir, exist_ok=True)
    
    # 1. Load Raw Datasets
    print(f"Loading raw wide dataset from {raw_wide_path}...")
    df_wide = pd.read_csv(raw_wide_path)
    
    # Rename first column to Date
    date_col = df_wide.columns[0]
    df_wide.rename(columns={date_col: "Date"}, inplace=True)
    
    # Check for missing values in raw wide
    raw_null_counts = df_wide.isnull().sum().to_dict()
    total_raw_rows = len(df_wide)
    raw_columns = df_wide.columns.tolist()
    
    # 2. Parse Dates
    # Format in dataset_tk is DD/MM/YYYY HH:MM:SS
    df_wide["ParsedDate"] = pd.to_datetime(df_wide["Date"], format="%d/%m/%Y %H:%M:%S")
    
    # Check duplicate dates
    duplicate_date_count = int(df_wide["ParsedDate"].duplicated().sum())
    duplicate_rows_sample = df_wide[df_wide["ParsedDate"].duplicated(keep=False)][["Date", "Rajasthan"]].to_dict(orient="records")
    print(f"Found {duplicate_date_count} duplicate date rows. Resolving by taking daily mean.")
    
    # 3. Deduplicate by taking the daily mean across numeric columns
    numeric_cols = [c for c in df_wide.columns if c not in ["Date", "ParsedDate"]]
    daily_wide = df_wide.groupby("ParsedDate", as_index=False)[numeric_cols].mean()
    daily_wide.sort_values("ParsedDate", inplace=True)
    daily_wide.reset_index(drop=True, inplace=True)
    
    # 4. Check Date Continuity & Gaps
    daily_wide["DateStr"] = daily_wide["ParsedDate"].dt.strftime("%Y-%m-%d")
    daily_wide["PrevDate"] = daily_wide["ParsedDate"].shift(1)
    daily_wide["DayGap"] = (daily_wide["ParsedDate"] - daily_wide["PrevDate"]).dt.days
    
    gaps_gt_1 = daily_wide[daily_wide["DayGap"] > 1][["PrevDate", "ParsedDate", "DayGap"]]
    gaps_summary = []
    for _, row in gaps_gt_1.iterrows():
        gaps_summary.append({
            "from": row["PrevDate"].strftime("%Y-%m-%d"),
            "to": row["ParsedDate"].strftime("%Y-%m-%d"),
            "gap_days": int(row["DayGap"])
        })
    
    # Clean temporary columns
    daily_wide.drop(columns=["PrevDate", "DayGap"], inplace=True)
    daily_wide.rename(columns={"ParsedDate": "Date"}, inplace=True)
    
    # 5. Extract Rajasthan Primary Time Series
    raj_df = daily_wide[["Date", "DateStr", "Rajasthan"]].copy()
    raj_df.rename(columns={"Rajasthan": "demand"}, inplace=True)
    raj_df.sort_values("Date", inplace=True)
    raj_df.reset_index(drop=True, inplace=True)
    
    # Save processed Rajasthan daily
    raj_out_path = os.path.join(processed_dir, "rajasthan_daily.csv")
    raj_df.to_csv(raj_out_path, index=False)
    print(f"Saved processed Rajasthan time series to {raj_out_path} ({len(raj_df)} rows)")
    
    # Save processed wide dataset
    wide_out_path = os.path.join(processed_dir, "all_states_daily.csv")
    daily_wide.to_csv(wide_out_path, index=False)
    print(f"Saved processed all-states daily dataset to {wide_out_path}")
    
    # 6. Process Geographic Metadata from long_data.csv if present
    states_meta = {}
    if os.path.exists(raw_long_path):
        print(f"Extracting geographic metadata from {raw_long_path}...")
        df_long = pd.read_csv(raw_long_path)
        for state_name, group in df_long.groupby("States"):
            region = str(group["Regions"].iloc[0])
            lat = float(group["latitude"].iloc[0])
            lon = float(group["longitude"].iloc[0])
            avg_usage = float(group["Usage"].mean())
            min_usage = float(group["Usage"].min())
            max_usage = float(group["Usage"].max())
            std_usage = float(group["Usage"].std())
            count = int(len(group))
            
            states_meta[state_name] = {
                "state": state_name,
                "region": region,
                "latitude": lat,
                "longitude": lon,
                "record_count": count,
                "mean_demand_mu": round(avg_usage, 2),
                "min_demand_mu": round(min_usage, 2),
                "max_demand_mu": round(max_usage, 2),
                "std_demand_mu": round(std_usage, 2),
                "has_trained_model": (state_name == "Rajasthan")
            }
        
        meta_out_path = os.path.join(processed_dir, "states_metadata.json")
        with open(meta_out_path, "w", encoding="utf-8") as f:
            json.dump(states_meta, f, indent=2)
        print(f"Saved states metadata to {meta_out_path} ({len(states_meta)} states)")
        
    # 7. Quality Summary Object
    quality_report = {
        "dataset_name": "Power Consumption in India (2019-2020)",
        "source": "POSOCO Energy Reports via Kaggle (twinkle0705)",
        "total_raw_rows": total_raw_rows,
        "clean_daily_rows": len(raj_df),
        "columns_count": len(raw_columns),
        "state_columns": [c for c in raw_columns if c != "Date"],
        "target_state": "Rajasthan",
        "date_range": {
            "start": raj_df["DateStr"].min(),
            "end": raj_df["DateStr"].max(),
            "total_days_span": int((raj_df["Date"].max() - raj_df["Date"].min()).days + 1),
            "actual_observations": len(raj_df)
        },
        "duplicate_dates_found": duplicate_date_count,
        "duplicate_resolution_strategy": "Daily arithmetic mean across duplicate date entries to preserve all sensor readings without arbitrary record deletion",
        "missing_values_raw": raw_null_counts,
        "missing_values_processed": int(raj_df["demand"].isnull().sum()),
        "continuity_gaps_count": len(gaps_summary),
        "continuity_gaps": gaps_summary,
        "demand_summary": {
            "mean": round(float(raj_df["demand"].mean()), 2),
            "median": round(float(raj_df["demand"].median()), 2),
            "std": round(float(raj_df["demand"].std()), 2),
            "min": round(float(raj_df["demand"].min()), 2),
            "max": round(float(raj_df["demand"].max()), 2),
            "unit": "MU (Mega Units / Million kWh)"
        }
    }
    
    quality_out_path = os.path.join(processed_dir, "data_quality_report.json")
    with open(quality_out_path, "w", encoding="utf-8") as f:
        json.dump(quality_report, f, indent=2)
        
    return raj_df, daily_wide, states_meta, quality_report

if __name__ == "__main__":
    prepare_data()

