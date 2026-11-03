"""
test_pipeline.py - Automated ML Pipeline Unit Tests
Tests data loading, feature engineering, non-leakage, baseline, Ridge model, and artifact integrity.
"""

import os
import json
import unittest
import numpy as np
import pandas as pd

from src.ml.data_prep import prepare_data
from src.ml.features import get_clean_modeling_dataset, FEATURE_COLUMNS, engineer_features
from src.ml.model import train_ridge_model
from src.ml.evaluate import evaluate_models

class TestLoadCastMLPipeline(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        cls.raw_wide = "data/raw/dataset_tk.csv"
        cls.raw_long = "data/raw/long_data.csv"
        cls.artifacts_dir = "artifacts"
        
    def test_01_raw_files_exist(self):
        """Ensure raw datasets exist in data/raw/"""
        self.assertTrue(os.path.exists(self.raw_wide), "dataset_tk.csv missing in data/raw")
        self.assertTrue(os.path.exists(self.raw_long), "long_data.csv missing in data/raw")
        
    def test_02_data_preparation(self):
        """Test data preparation returns expected schema and non-null values"""
        raj_df, wide_df, states_meta, quality = prepare_data(
            self.raw_wide, self.raw_long, "data/processed"
        )
        self.assertGreater(len(raj_df), 400)
        self.assertIn("Date", raj_df.columns)
        self.assertIn("demand", raj_df.columns)
        self.assertEqual(raj_df["demand"].isnull().sum(), 0)
        self.assertGreater(len(states_meta), 30)
        self.assertEqual(quality["target_state"], "Rajasthan")
        
    def test_03_feature_engineering_no_leakage(self):
        """Verify rolling_mean_7 and lags never look forward"""
        df = pd.DataFrame({
            "Date": pd.date_range("2020-01-01", periods=20, freq="D"),
            "demand": [10.0 * (i + 1) for i in range(20)]
        })
        clean_df, cols = get_clean_modeling_dataset(df)
        
        # Row 0 of clean_df corresponds to index 7 (day 8: value 80.0)
        # lag_1 must be value of index 6: 70.0
        self.assertEqual(clean_df.loc[0, "lag_1"], 70.0)
        # lag_7 must be value of index 0: 10.0
        self.assertEqual(clean_df.loc[0, "lag_7"], 10.0)
        # rolling_mean_7 must be mean of indices 0..6: (10+20+30+40+50+60+70)/7 = 40.0
        self.assertEqual(clean_df.loc[0, "rolling_mean_7"], 40.0)
        # It must NOT include day 8's value (80.0)
        self.assertNotEqual(clean_df.loc[0, "rolling_mean_7"], (20+30+40+50+60+70+80)/7)
        
    def test_04_chronological_split_and_ridge_metrics(self):
        """Test chronological split evaluation and verify Ridge beats baseline or runs honestly"""
        raj_df = pd.read_csv("data/processed/rajasthan_daily.csv")
        clean_df, feature_cols = get_clean_modeling_dataset(raj_df)
        results = evaluate_models(clean_df, feature_cols, train_ratio=0.8, alpha=1.0)
        
        ridge_m = results["metrics"]["ridge"]
        naive_m = results["metrics"]["naive"]
        
        self.assertIn("rmse", ridge_m)
        self.assertIn("mae", ridge_m)
        self.assertIn("mape", ridge_m)
        self.assertGreater(ridge_m["rmse"], 0.0)
        self.assertGreater(naive_m["rmse"], 0.0)
        
        # Verify train dates strictly precede test dates
        self.assertLess(results["train_range"]["end"], results["test_range"]["start"])
        
    def test_05_exported_artifacts_valid(self):
        """Check all required JSON artifacts exist and have valid structure"""
        required = [
            "model_artifact.json",
            "evaluation_metrics.json",
            "historical_data.json",
            "states_data.json",
            "data_quality.json"
        ]
        for fname in required:
            path = os.path.join(self.artifacts_dir, fname)
            self.assertTrue(os.path.exists(path), f"Artifact missing: {fname}")
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.assertIsNotNone(data)

if __name__ == "__main__":
    unittest.main()

