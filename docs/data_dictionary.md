# LoadCast Data Dictionary

## 1. Raw Source Dataset
- **Origin:** POSOCO (Power System Operation Corporation of India) National Load Despatch Centre reports.
- **Curator:** Kaggle dataset `twinkle0705/state-wise-power-consumption-in-india`.
- **Format:** Wide-format daily time-series (`dataset_tk.csv`) and long-format geographical series (`long_data.csv`).
- **Raw Dimensions:** 503 rows &times; 34 columns.
- **Original Units:** Mega Units (MU = $10^6\text{ kWh}$).

## 2. Processed Time-Series Schema (`data/processed/rajasthan_daily.csv`)

| Column Name | Data Type | Units | Description |
|---|---|---|---|
| `Date` | Datetime (ISO 8601) | YYYY-MM-DD | Daily calendar timestamp of power dispatch |
| `demand` | Float | Mega Units (MU) | Total recorded electricity consumption for Rajasthan |

## 3. Engineered Features Schema

| Feature Name | Data Type | Nullability | Range | Description |
|---|---|---|---|---|
| `lag_1` | Float | Dropped for row 0 | 105.8 – 278.0 | Electricity demand on day $t-1$ |
| `lag_7` | Float | Dropped for rows 0..6 | 105.8 – 278.0 | Electricity demand on day $t-7$ |
| `rolling_mean_7`| Float | Dropped for rows 0..6 | 115.0 – 265.0 | Mean demand over days $t-7$ through $t-1$ |
| `day_of_week` | Integer | Non-null | 0 – 6 | 0 = Monday, 6 = Sunday |
| `month` | Integer | Non-null | 1 – 12 | Calendar month index |
| `is_weekend` | Integer (0/1) | Non-null | 0 or 1 | 1 if day_of_week &ge; 5, else 0 |
| `is_covid_lockdown`| Integer (0/1)| Non-null | 0 or 1 | 1 for dates between 2020-03-25 and 2020-05-31 |

## 4. State Metadata Schema (`states_data.json`)

| Attribute | Type | Description |
|---|---|---|
| `state` | String | State or Union Territory name |
| `region` | String | Regional grid dispatch code (NR, WR, SR, ER, NER) |
| `latitude` | Float | Geographic latitude in degrees North |
| `longitude` | Float | Geographic longitude in degrees East |
| `mean_demand_mu`| Float | Average historical daily consumption in MU |
| `min_demand_mu` | Float | Lowest observed daily demand in MU |
| `max_demand_mu` | Float | Peak observed daily demand in MU |
| `has_trained_model`| Boolean | True for Rajasthan, False for telemetry-only states |
