# LoadCast Learnings & Time-Series Engineering Insights

## 1. Why Naive Persistence is Formidable in Power Systems
In power grid analytics, `lag_1` (yesterday's demand) has a Pearson correlation coefficient $r \approx 0.88$ with today's demand. Electricity consumption represents aggregate human habit and industrial production, which cannot change instantaneously. 

**The Lesson:** Many machine learning projects claim high $R^2$ or low MAPE without reporting a baseline. Achieving 5.5% MAPE with a complex model is meaningless if a zero-parameter naive forecast achieves 5.55% MAPE. Honest evaluation demands measuring the marginal delta over persistence.

## 2. The Danger of Random Shuffling
When evaluating standard tabular data (e.g., customer churn), `train_test_split(shuffle=True)` is appropriate. In time series, shuffling is disastrous:
- If day $t-1$ and day $t+1$ are in the training set, predicting day $t$ in the test set is trivial interpolation, not forecasting.
- Reported RMSE will appear artificially low (e.g. 5 MU), but the model will collapse in production.
- **Rule:** Always split sequentially along the temporal axis.

## 3. Strict Shifting for Rolling Windows
A common coding error in pandas is:
```python
# LEAKAGE ERROR: Includes current day's target in the rolling average!
df['rolling_7'] = df['demand'].rolling(7).mean()

# CORRECT: Shift prior to rolling calculation
df['rolling_7'] = df['demand'].shift(1).rolling(7).mean()
```
The first variant allows the model to predict $y_t$ using a feature that contains $\frac{1}{7}y_t$, which produces target leakage.

## 4. Handling Structural Breaks (COVID-19 Lockdown)
On March 25, 2020, India enacted a nationwide lockdown. Industrial electricity demand plummeted overnight. 
- In our test set, during the lockdown period, model RMSE was higher because the underlying data generating process (DGP) underwent a discrete regime change.
- Rather than discarding the lockdown rows, LoadCast explicitly isolates the lockdown sensitivity to demonstrate how linear models respond to macroeconomic shocks.

