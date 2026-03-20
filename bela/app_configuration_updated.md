# App Configuration

> **Screen Purpose:** Allows the Super Admin to manage daily free-usage limits for key app features, tune the engagement scoring model that governs bonus coin rewards, and configure the Circular Intelligence sustainability constant used in monthly score calculations.

---

## Access Control

| Role | Access |
|---|---|
| Super Admin | Full read & write |
| Sub Admin | Read/write only if role permission is explicitly granted |

**Preconditions:**
- Admin must be logged in
- Admin must have Super Admin access (or granted Sub Admin permission)
- App Configuration module must be enabled in Admin Panel

**Navigation Path:** `Admin Panel → Configuration → App Configuration`

---

## Screen Layout

The screen is organized into **five collapsible/stacked sections**, followed by a global action bar and audit information panel.

1. Free OOTD Limit Configuration
2. Free Virtual Try-On Limit Configuration
3. Engagement Weight Model Configuration
4. Engagement Tiers & Bonus %
5. Circular Intelligence Settings

**Action Buttons** (sticky footer or end of form): `Save` | `Discard`

**Audit Information** (read-only, bottom of page)

---

## Section 1 — Free OOTD Limit Configuration

### Purpose
Controls how many free Outfit of the Day (OOTD) generations each user can access per day.

### Fields

| Field | Type | Default | Behavior |
|---|---|---|---|
| Free OOTD Option | Radio group | `Limited` | Options: `Limited` / `Unlimited` |
| No. of OOTD Limit | Numeric input | `1` | Shown only when `Limited` is selected; hidden when `Unlimited` |

### Rules
- When **Unlimited** is selected → `No. of OOTD Limit` field is **hidden**
- When **Limited** is selected → `No. of OOTD Limit` field is **visible and editable**
- Limit applies **per user per day**; daily reset occurs automatically based on system-defined day cycle
- Field must contain a value **greater than 0** when `Limited` is active

### Validations

| Scenario | Error Message |
|---|---|
| Limit is zero or empty when Limited is selected | `"The limit value must be greater than 0."` |

---

## Section 2 — Free Virtual Try-On Limit Configuration

### Purpose
Controls how many free Virtual Try-On sessions each user can access per day.

### Fields

| Field | Type | Default | Behavior |
|---|---|---|---|
| Free Virtual Try-On Option | Radio group | `Limited` | Options: `Limited` / `Unlimited` |
| No. of Virtual Try-On Limit | Numeric input | `1` | Shown only when `Limited` is selected; hidden when `Unlimited` |

### Rules
- When **Unlimited** is selected → `No. of Virtual Try-On Limit` field is **hidden**
- When **Limited** is selected → `No. of Virtual Try-On Limit` field is **visible and editable**
- Limit applies **per user per day**; daily reset is automatic
- Field must contain a value **greater than 0** when `Limited` is active

### Validations

| Scenario | Error Message |
|---|---|
| Limit is zero or empty when Limited is selected | `"The limit value must be greater than 0."` |

---

## Section 3 — Engagement Weight Model Configuration

### Purpose
Displays the activity weights used to calculate a user's **7-day engagement score**. The engagement score determines the **bonus tier** applied when a user purchases a Bella Coin pack. The admin can configure only the **Capped (In Days)** value per activity.

### Fields

| Field | Type | Editable | Description |
|---|---|---|---|
| Activity | Text | ❌ Read-only | System-defined activity label |
| Weight | Text (%) | ❌ Read-only | System-defined percentage contribution to engagement score |
| Capped (In Days) | Numeric input | ✅ Editable | Maximum countable occurrences of this activity within the 7-day window |

### Predefined Activities

| Activity | Weight | Default Cap (In Days) |
|---|---|---|
| Login | 5% | 7 |
| OOTD | 10% | 14 |
| Try-On (HD + Downloads) | 10% | 10 |
| Add New Wardrobe Item (Extraction) | 15% | 10 |
| Update / Enrich Wardrobe Item | 10% | 15 |
| Social | 10% | 20 |
| Circular Intelligence | 10% | — *(system-controlled)* |
| Purchases | 10% | 1 |
| Current Wardrobe Quotient | 10% | — *(system-controlled)* |
| Wardrobe Improvement Score | 10% | — *(system-controlled)* |

### Rules
- **Activity** and **Weight** columns are read-only — admin cannot modify them
- **Cap value** must be a **positive integer** where applicable
- Activities marked with `—` are **system-controlled**; their cap field is **hidden or disabled**
- Any activity usage **beyond the configured cap** does not contribute to the engagement score
- Changes **apply immediately** after Save

### Validations

| Scenario | Error Message |
|---|---|
| Cap value is zero or non-numeric | `"Cap value must be a positive number."` |

---

## Section 4 — Engagement Tiers & Bonus %

### Purpose
Defines the **bonus percentage** applied to a Bella Coin pack purchase based on the user's current engagement score. The bonus is calculated and displayed to the user at the **purchase confirmation step** before payment. The admin can configure only the **Bonus on Coin Pack (%)** value.

### Fields

| Field | Type | Editable | Description |
|---|---|---|---|
| Score | Text (range) | ❌ Read-only | System-defined score range |
| Tier | Text | ❌ Read-only | System-defined tier label |
| Bonus on Coin Pack (%) | Numeric input | ✅ Editable | Percentage bonus applied to the base coin pack at purchase |

### Predefined Tiers

| Score Range | Tier | Default Bonus on Coin Pack |
|---|---|---|
| 0 – 20 | Tier 0 | 0% |
| 21 – 40 | Tier 1 | 5% |
| 41 – 70 | Tier 2 | 10% |
| 71 – 85 | Tier 3 | 15% |
| 86 – 100 | Tier 4 | 20% |

### Bonus Calculation Formula

```
Total Coins = Base Pack Coins + (Base Pack Coins × Bonus %)
```

### Rules
- **Score range** and **Tier label** are read-only — admin cannot modify them
- **Bonus %** must be a **non-negative integer** (0 is valid for Tier 0)
- Bonus % for each tier must be **equal to or greater than** the tier below it *(ascending order enforced)*
- **Maximum bonus % allowed** across all tiers is **20%** *(system-enforced cap)*
  - > ⚠️ Note: The spec document contains a conflict — the business rules state a system cap of 100%, but the validations table specifies a maximum of 20%. The enforced cap in the system is **20%**.
- Bonus is applied **only at the purchase confirmation screen**, before payment is completed
- Bonus is a **one-time benefit** at purchase; it does not carry forward or stack across purchases
- Changes **apply immediately** after Save

### Validations

| Scenario | Error Message |
|---|---|
| Bonus % is non-numeric or negative | `"Bonus percentage must be a non-negative number."` |
| Bonus % exceeds 20% | `"Bonus percentage cannot exceed the maximum allowed limit of 20%."` |
| Bonus % for a tier is lower than the tier below it | `"Bonus percentage must be equal to or greater than the previous tier."` |

---

## Section 5 — Circular Intelligence Settings

### Purpose
Configures the **TargetWear** platform constant used in the Circular Intelligence score calculation. The Circular Intelligence module measures sustainable wardrobe behavior by scoring how frequently and broadly a user wears their wardrobe items within a calendar month. Users are rewarded with **Bella Coins** at the end of each month based on this score.

### Fields

| Field | Type | Default | Description |
|---|---|---|---|
| Target Wear *(wears per item per month)* | Numeric input | `2` | Platform constant used in circular score normalization |

### Score Calculation Logic

```
AverageWear           = Total monthly wears ÷ Total wardrobe items
AverageWearNormalized = AverageWear ÷ TargetWear          [capped at 1.0]
UtilizationRate       = Items worn at least once ÷ Total items
CircularScore         = (AverageWearNormalized + UtilizationRate) ÷ 2
```

Score is surfaced to users as a **percentage (0–100%)**.

### Rules
- **TargetWear** must be a **positive integer**, minimum value = `1`
- **Increasing TargetWear** → raises the benchmark → harder for users to achieve high scores
- **Decreasing TargetWear** → lowers the benchmark → high scores more accessible
- `AverageWearNormalized` is **capped at 1.0** regardless of actual wear frequency *(prevents score distortion)*
- Score is **recalculated** on every new wardrobe item addition and every OOTD generation
- TargetWear changes are **not retroactive** — already-calculated months are unaffected
- Changes **apply immediately** after Save

### Validations

| Scenario | Error Message |
|---|---|
| TargetWear is zero, empty, or non-numeric | `"Target Wear must be a positive number."` |

---

## Action Buttons

| Button | Behavior |
|---|---|
| **Save** | Persists all configurations across all sections and applies immediately. Triggers inline validation before saving. |
| **Discard** | Discards all unsaved changes across all sections and restores the last saved values. |

### Save Behavior
- All sections are validated together on Save
- If **any** section has an invalid field, Save is **blocked** and inline errors are surfaced per field
- On success → toast/notification: `"App configurations saved successfully."`
- On backend failure → `"Failed to save configurations. Please try again."`

### Discard Behavior
- Reverts **all** fields across **all** sections to the last persisted values
- No confirmation dialog is required (per spec), but this can be revisited in UX review

---

## Audit Information *(Read-Only)*

Displayed at the bottom of the screen. Updated automatically after every successful Save.

| Field | Description |
|---|---|
| Last Modified By | Username of the admin who last saved |
| Last Modified Date | Format: `DD/MM/YYYY HH:MM` |

---

## Global Business Rules

- All configurations are **global** and apply to **all app users**
- Free usage limits (OOTD and Try-On) are evaluated **per user per day**; daily reset occurs automatically based on the system-defined day cycle
- Engagement score is calculated based on the **last 7 days of activity** at the point of a coin pack purchase
- Engagement tier bonus is a **one-time benefit** applied at purchase; does not carry forward or stack
- Circular Intelligence score is recalculated on wardrobe item addition and OOTD generation; it is **not retroactively affected** by TargetWear changes for already-calculated months
- **No approval flow or versioning** is involved; all changes take effect immediately after Save
- **Unauthorized users** cannot access or modify app configurations

---

## Edge Cases

| Scenario | Expected Behavior |
|---|---|
| Admin switches OOTD or Try-On from Limited → Unlimited | Numeric limit value is retained in UI but ignored by the system |
| Admin clicks Discard | No configuration changes are saved across any section |
| Activity cap is removed or set to zero | System blocks Save and shows validation error |
| Bonus % for a lower tier exceeds a higher tier | System blocks Save and highlights the conflicting tier(s) |
| TargetWear is set to 0 or left empty | System blocks Save and shows validation error |
| Save attempted with any invalid field | System blocks Save and surfaces inline errors per field |

---

## Error & Notification Messages (Complete Reference)

| Scenario | System Message |
|---|---|
| OOTD or Try-On limit is zero or empty (Limited selected) | `"The limit value must be greater than 0."` |
| Activity cap is zero or non-numeric | `"Cap value must be a positive number."` |
| Bonus % is non-numeric or negative | `"Bonus percentage must be a non-negative number."` |
| Bonus % exceeds 20% | `"Bonus percentage cannot exceed the maximum allowed limit of 20%."` |
| Bonus % for a tier is lower than the tier below it | `"Bonus percentage must be equal to or greater than the previous tier."` |
| TargetWear is zero, empty, or non-numeric | `"Target Wear must be a positive number."` |
| Save successful | `"App configurations saved successfully."` |
| Save failed (backend error) | `"Failed to save configurations. Please try again."` |
| Unauthorized action | `"You are not authorized to perform this action."` |

---

## Acceptance Criteria

- [ ] Admin can configure Free OOTD limit as `Limited` or `Unlimited`
- [ ] Admin can configure Free Virtual Try-On limit as `Limited` or `Unlimited`
- [ ] Numeric limit fields appear **only** when `Limited` is selected
- [ ] Default limit value is set to `1` when `Limited` is enabled
- [ ] Admin can view all engagement activities with their weights; only cap values are editable
- [ ] Activities with system-controlled caps show the cap field as hidden or disabled
- [ ] Admin can view all engagement tiers; only bonus percentages are editable
- [ ] Bonus % validations enforce ascending order and the 20% maximum cap
- [ ] Admin can configure the TargetWear constant for Circular Intelligence scoring
- [ ] Save applies all configurations immediately across all sections
- [ ] Discard restores all previously saved values across all sections
- [ ] Daily free limits reset automatically for all users
- [ ] Circular Intelligence score uses the updated TargetWear for all future calculations
- [ ] Last Modified By and Last Modified Date are updated correctly after every Save
- [ ] Unauthorized users cannot access or modify app configurations

---

## Component Mapping (BellaRoules Frontend)

| UI Element | Suggested Component / File |
|---|---|
| Screen container | `AppConfiguration.tsx` |
| Radio group (OOTD / Try-On) | Radix UI `RadioGroup` |
| Numeric input fields | MUI `TextField` with `type="number"` |
| Engagement weight table | MUI `Table` (read-only rows + editable cap cell) |
| Tiers table | MUI `Table` (read-only rows + editable bonus cell) |
| Save / Discard buttons | MUI `Button` (primary / outlined) |
| Inline error messages | MUI `FormHelperText` with error state |
| Toast notifications | MUI `Snackbar` + `Alert` |
| Audit info panel | Read-only `TextField` or plain text display |

> **Note:** Global config state should be initialized from the API on mount. All section states should be managed together so that Save and Discard operate atomically across sections.