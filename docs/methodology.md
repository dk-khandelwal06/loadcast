# LoadCast Machine Learning Methodology

## 1. Problem Definition
Electricity demand forecasting for power grids is a one-step-ahead regression problem:
Given a univariate historical daily load time series $y_1, y_2, \dots, y_t$ in Mega Units (MU), forecast $y_{t+1}$.

## 2. Feature Transformations

| Feature Name | Mathematical Definition | Physical Grid Rationale |
|---|---|---|
| `lag_1` | $y_{t-1}$ | Immediate load persistence (yesterday's continuous baseline) |
| `lag_7` | $y_{t-7}$ | Weekly periodicity (same day last week anchor) |
| `rolling_mean_7` | $\frac{1}{7}\sum_{i=1}^{7} y_{t-i}$ | Smoothed weekly trend, acts as a mean-reversion dampener |
| `day_of_week` | Integer $0..6$ | Industrial and commercial schedule variations |
| `month` | Integer $1..12$ | Seasonal monsoon, summer cooling, and agricultural pumping |
| `is_weekend` | $\mathbb{I}(\text{day\_of\_week} \ge 5)$ | Binary indicator for Saturday/Sunday operational shifts |

## 3. Regularization & Ridge Objective Function
When multiple lagged variables are included as features in linear regression, they exhibit high mutual collinearity ($\text{Corr}(y_{t-1}, y_{t-7}) \approx 0.85$). Ordinary Least Squares (OLS) produces erratic parameter estimates with inflated variance.

Ridge Regression solves this by adding an L2 penalty on coefficient weights:
$$\mathcal{L}_{\text{Ridge}}(\beta) = \sum_{i=1}^N \left( y_i - \beta_0 - \sum_{j=1}^p \beta_j x_{ij} \right)^2 + \alpha \sum_{j=1}^p \beta_j^2$$

- **Alpha Parameter:** $\alpha = 1.0$.
- **Standardization:** All features are standardized via $z = \frac{x - \mu}{\sigma}$ so the L2 penalty treats all predictors equally regardless of physical units.

## 4. Benchmark & Metrics
We benchmark Ridge Regression against the **Naive Persistence Model**:
$$\hat{y}_t^{\text{naive}} = y_{t-1}$$

Evaluation metrics on the chronological test holdout (99 days):
1. **Root Mean Squared Error (RMSE):**
   $$\text{RMSE} = \sqrt{\frac{1}{n}\sum_{i=1}^n (y_i - \hat{y}_i)^2}$$
2. **Mean Absolute Error (MAE):**
   $$\text{MAE} = \frac{1}{n}\sum_{i=1}^n |y_i - \hat{y}_i|$$
3. **Mean Absolute Percentage Error (MAPE):**
   $$\text{MAPE} = \frac{100\%}{n}\sum_{i=1}^n \left| \frac{y_i - \hat{y}_i}{y_i} \right|$$

## 5. Holdout Evaluation Results (Rajasthan)
- **Ridge RMSE:** 18.28 MU vs. **Naive RMSE:** 19.36 MU (+5.6% improvement)
- **Ridge MAE:** 11.25 MU vs. **Naive MAE:** 11.32 MU (+0.5% improvement)
- **Ridge MAPE:** 5.52% vs. **Naive MAPE:** 5.56%
