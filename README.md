# LOADCAST

> **Teaching a regression model to see tomorrow’s electricity demand using yesterday’s patterns.**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.13-yellow?logo=python)](https://python.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-Ridge_L2-orange?logo=scikit-learn)](https://scikit-learn.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 1. Executive Summary

**LoadCast** is an open-source Energy Intelligence and Electricity Demand Forecasting Platform for the Indian power grid, initially focused on the state of **Rajasthan**.

Rather than relying on opaque deep neural networks or simulated dummy data, LoadCast demonstrates how **time-series feature engineering** and **L2-regularized Ridge Regression** predict next-day state-level power consumption using genuine historical records from POSOCO (Power System Operation Corporation of India).

---

## 2. Core Methodology & Machine Learning Architecture

1. **Verified Historical Telemetry:** 498 clean daily observations (January 2019 – May 2020) sourced from POSOCO energy reports via Kaggle (`twinkle0705`).
2. **Leakage-Free Feature Engineering:**
   - **Lag-1 ($y_{t-1}$):** Immediate autoregressive load persistence.
   - **Lag-7 ($y_{t-7}$):** Weekly cyclical load periodicity.
   - **Rolling 7-Day Mean:** Leakage-free running average of the preceding 7 observations ($\frac{1}{7}\sum_{i=1}^7 y_{t-i}$).
   - **Calendar Dynamics:** Day of week ($0..6$), month ($1..12$), and weekend indicator ($0/1$).
3. **Chronological 80/20 Holdout Split:** Preserves temporal order; test data strictly succeeds training data.
4. **Ridge Regression (L2 Regularization):** Solves severe multicollinearity between lags while penalizing coefficient inflation.
5. **StandardScaler Fit Isolation:** Fit strictly on the training set; parameters $(\mu, \sigma)$ exported to prevent test set data leakage.
6. **Zero-Overhead Edge Deployment:** The mathematical Ridge formula is executed natively in TypeScript on Vercel without requiring an always-running Python process.

### Holdout Empirical Benchmark (99 Out-of-Sample Test Days)
- **Ridge RMSE:** `18.28 MU` vs. **Naive Baseline RMSE:** `19.36 MU` (**+5.6% gain**)
- **Ridge MAE:** `11.25 MU` vs. **Naive Baseline MAE:** `11.32 MU`
- **Ridge MAPE:** `5.52%` vs. **Naive Baseline MAPE:** `5.56%`

---

## 3. Application Pages

- **`/` Overview:** Hero with animated electrical transmission lines, power grid topology canvas, and ML dataflow.
- **`/dashboard` Energy Dashboard:** Top 6 KPI cards, interactive daily load curve, weekly aggregations, monthly seasonality, and day-of-week analysis.
- **`/forecast` Forecast Centre:** Interactive next-day demand predictor, historical backtesting selector, and live parameter what-if simulator.
- **`/state-explorer` State Explorer:** Interactive SVG India map showcasing all 33 states with telemetry, highlighting Rajasthan.
- **`/model-intelligence` Model Intelligence:** Mathematical formulation, regularized objective functions, and fitted coefficients.
- **`/evaluation` Forecast Evaluation:** Empirical benchmark scorecard, residual distribution histogram, and COVID-19 sensitivity breakdown.
- **`/historical` Historical Analytics:** Full searchable time-series browser with pagination and custom date-range CSV export.
- **`/data-lab` Data Laboratory:** Data quality audit, schema validator, duplicate resolution log, and continuity gap table.
- **`/about` About LoadCast:** Mission, audience, architectural philosophy, and operational disclaimers.

---

## 4. Repository Structure

```text
loadcast/
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules (secrets, venv, caches)
├── README.md                 # Project documentation
├── package.json              # Node.js dependencies & scripts
├── requirements.txt          # Python dependencies
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.ts        # Energy theme & custom keyframes
├── next.config.js            # Security headers & Next.js config
│
├── data/
│   ├── raw/                  # Original raw Kaggle CSVs (dataset_tk.csv, long_data.csv)
│   └── processed/            # Cleaned daily CSVs and states metadata
│
├── notebooks/
│   ├── 01_eda.ipynb          # Exploratory Data Analysis notebook
│   └── 02_feature_engineering.ipynb # Feature transformations & modeling
│
├── src/
│   ├── ml/                   # Python ML training pipeline
│   │   ├── data_prep.py      # Cleans, deduplicates, and parses dates
│   │   ├── features.py       # Computes leakage-free lags and rolling features
│   │   ├── model.py          # Fits StandardScaler and Ridge model
│   │   ├── evaluate.py       # Chronological holdout evaluation
│   │   ├── export_artifacts.py # Exports versioned JSON artifacts
│   │   └── verify_inference.py # Verifies Python/TypeScript mathematical equivalence
│   ├── data/                 # Bundled JSON artifacts for Next.js
│   ├── lib/                  # TypeScript utilities (ml-engine, audio, themes)
│   ├── components/           # UI components, animated hero, charts, map
│   └── app/                  # Next.js App Router multi-page routes & APIs
│
├── artifacts/                # Exported standalone JSON model artifacts
├── docs/                     # Architecture, methodology, data dictionary, learnings
└── tests/                    # Automated Python ML unit tests
```

---

## 5. Quickstart & Local Development

### Prerequisites
- Node.js `v18+` (or Node `v20+`)
- Python `3.10+` with `pip`

### Step 1: Install Dependencies
```bash
# Install Node.js frontend dependencies
npm install

# Install Python ML dependencies
pip install -r requirements.txt
```

### Step 2: Run ML Pipeline & Tests
```bash
# Execute end-to-end Python ML pipeline and export artifacts
npm run ml:train

# Verify exact mathematical equivalence (Python vs TypeScript)
npm run ml:verify

# Run automated Python pipeline unit tests
npm run test:ml
```

### Step 3: Start the Next.js Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 6. GitHub & Vercel Deployment Guide

### Deploying to GitHub
1. Initialize the repository:
   ```bash
   git init
   git add .
   git commit -m "feat: complete LoadCast electricity demand forecasting platform"
   ```
2. Verify no secrets or `.env` files are tracked:
   ```bash
   git status --ignored
   ```
3. Push to your GitHub account:
   ```bash
   git remote add origin https://github.com/<your-username>/loadcast.git
   git branch -M main
   git push -u origin main
   ```

### Deploying to Vercel
1. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Select your imported `loadcast` GitHub repository.
3. Configure project settings:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`
4. Set Environment Variables (optional):
   - `NODE_ENV=production`
   - `NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app`
5. Click **"Deploy"**. Vercel will build the production bundle and serve the app across its global edge network.

---

## 7. Operational Disclaimer

> **Disclaimer:** LoadCast is an educational and scientific demonstration of time-series regression on historical power consumption data. Its predictions are experimental academic models and must not be used as operational grid-control, safety-critical switching, or electricity-dispatch instructions.

