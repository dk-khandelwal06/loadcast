# LoadCast Architecture Documentation

## 1. System Overview

LoadCast bridges local scientific machine-learning training in Python with zero-overhead, serverless production deployment in Next.js on Vercel.

```
┌───────────────────────────────────────────────────────────┐
│                      OFFLINE PYTHON ML                    │
│                                                           │
│  data/raw/dataset_tk.csv                                  │
│         │                                                 │
│         ▼                                                 │
│  src/ml/data_prep.py (Parse dates, deduplicate, clean)    │
│         │                                                 │
│         ▼                                                 │
│  src/ml/features.py (Lags, rolling means, calendar feats) │
│         │                                                 │
│         ▼                                                 │
│  src/ml/model.py & evaluate.py (Ridge L2, holdout eval)   │
│         │                                                 │
│         ▼                                                 │
│  src/ml/export_artifacts.py                               │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼ Versioned JSON Artifacts
┌───────────────────────────────────────────────────────────┐
│                    NEXT.JS APP ROUTER                     │
│                 (Vercel Edge / Serverless)                │
│                                                           │
│  artifacts/model_artifact.json                            │
│  artifacts/evaluation_metrics.json                        │
│  artifacts/historical_data.json                           │
│         │                                                 │
│         ▼                                                 │
│  src/lib/ml-engine.ts (Pure TypeScript Ridge math)        │
│         │                                                 │
│         ├────────► API Routes (/api/forecast/next-day)    │
│         │                                                 │
│         └────────► Interactive UI Pages (SSR / Client)    │
└───────────────────────────────────────────────────────────┘
```

## 2. Key Architectural Decisions

### A. Local Python Training vs. Serverless Inference
- **Problem:** Hosting Python machine learning runtimes (e.g., FastAPI with Scikit-Learn and Pandas) requires dedicated container hosting (e.g. Docker, Railway, AWS ECS), introducing cold starts, recurring hosting expenses, and latency.
- **Solution:** Ridge Regression is mathematically linear:
  $$\hat{y} = \beta_0 + \sum_{i=1}^p \beta_i \left( \frac{x_i - \mu_i}{\sigma_i} \right)$$
  By exporting the fitted weights $\beta$, intercept $\beta_0$, and StandardScaler parameters $(\mu, \sigma)$ into a compact JSON artifact, Next.js can execute the inference formula natively in TypeScript with zero latency and zero Python runtime dependencies.
- **Verification:** `src/ml/verify_inference.py` rigorously validates that the TypeScript mathematical formula matches Python scikit-learn outputs within $10^{-10}$ floating-point tolerance.

### B. Prevention of Data Leakage
1. **Feature Engineering Shift:** Lags and rolling means are applied to `demand.shift(1)` so that the day $t$ target observation is never visible in the calculation of predictors for day $t$.
2. **Scaler Fit Isolation:** `StandardScaler` is fitted strictly on the 80% chronological training slice; testing data is transformed using the training parameters.
3. **Chronological Holdout Split:** Observations are never randomly shuffled.

### C. Public API Security & Rate Limiting
- In-memory sliding-window rate limiting prevents denial-of-service abuse.
- Security response headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: origin-when-cross-origin`) are injected automatically via Next.js config.
- Zero secrets or API keys are exposed to client code or committed to Git.
