# Reward Plans

> **Module:** Plan Management
> **Screen Purpose:** Allows Super Admins to view, create, and manage reward purchase plans (coin packs) available for in-app purchases. Plans define how many reward coins a user receives for a given price and are consumed by the mobile application and app store billing systems.

---

## Access Control

| Role | Access |
|---|---|
| Super Admin | Full read & write — create, edit, activate, deactivate plans |
| Sub Admin | No access |

**Preconditions:**
- Admin must be logged in with Super Admin credentials
- Admin must have access to the Plan Management module

---

## Business Context

- Plans are **global** — no platform-specific pricing; the same plan applies to both Android and iOS
- Only **Active** plans are exposed to the mobile application
- **Inactive** plans are hidden from users but remain visible to admins in the listing
- **Payment history is never affected** by plan status changes or edits
- Duplicate plans with the same **Coins Count are not permitted**

---

## 5.1.1 — Reward Plans Listing

**Navigation Path:** `Plan Management → Reward Plans`

### Screen Purpose
Displays all reward purchase plans with status control, filtering, and sorting. Entry point for creating or editing a plan.

### Navigation Rules
- Clicking on a **plan row** or the **Edit** action redirects to the Reward Plan Detail screen
- Clicking **Add Reward Plan** opens a blank Reward Plan Detail screen in create mode

---

### Listing Table

| Column | Description |
|---|---|
| Plan ID | System-generated unique identifier |
| Plan Name | Display name of the coin pack |
| Product Identifier | Unique backend identifier; no spaces allowed |
| Coins Count | Number of base reward coins in the pack |
| Price | Monetary value of the plan |
| Currency | Currency code (e.g. USD) |
| Display Order | Order in which plans appear in the mobile app |
| Status | `Active` / `Inactive` |
| Last Modified Date | Format: `DD/MM/YYYY HH:MM` |
| Action | Edit |

---

### Filters

| Filter | Options |
|---|---|
| Status | Active / Inactive |
| Currency | Currency code |

Filters can be applied individually or in combination.

### Sorting

| Column | Order |
|---|---|
| Coins Count | Ascending / Descending |
| Price | Ascending / Descending |
| Display Order | Ascending |
| Last Modified Date | Latest First *(default)* |

---

### Pagination

| Property | Detail |
|---|---|
| Type | Server-side |
| Default page size | 10 records |
| Page size options | 10 / 25 / 50 |
| Controls | Next / Previous, page number navigation |
| Total count | Displayed |
| Empty state | Shown if no plans exist |

---

### Edge Cases

| Scenario | Expected Behavior |
|---|---|
| No plans exist | Display empty state with **Add Reward Plan** action visible |
| All plans are inactive | Mobile app receives an empty plan list |
| Duplicate Coins Count exists | Blocked at creation/edit — see Detail screen validations |

---

### Acceptance Criteria

- [ ] All reward plans are displayed with correct values for all columns
- [ ] Filters for Status and Currency work correctly and in combination
- [ ] Sorting works correctly on Coins Count, Price, Display Order, and Last Modified Date
- [ ] Default sorting is Last Modified Date — Latest First
- [ ] Pagination works with configurable page size (10 / 25 / 50)
- [ ] Clicking a plan row or Edit opens the Reward Plan Detail screen
- [ ] Inactive plans are not exposed to the mobile application
- [ ] Empty and error states are handled gracefully

---

## 5.1.2 — Reward Plan Detail

**Navigation Path:** `Plan Management → Reward Plans → Plan Detail`

**Breadcrumb:** `Plan Management → Reward Plans → Plan Detail`

**Page Title:** `Reward Plan Detail` *(edit mode)* / `Add Reward Plan` *(create mode)*

### Screen Purpose
Allows the Super Admin to create or edit a coin pack plan. Also displays a read-only **Engagement Tier Bonus Breakdown** showing the effective coins a user will receive per engagement tier for this plan, calculated live against current App Configuration values.

### Navigation Rules
- Admin lands here by clicking **Edit** from the listing or **Add Reward Plan**
- Admin can **Save** and return to listing, or **Cancel** and return to listing without saving
- Only one plan can be edited at a time

---

### Section 1 — Plan Configuration

#### Editable Fields

| Field | Type | Mandatory | Rules |
|---|---|---|---|
| Plan Name | Free text | ✅ Yes | Display name shown to users in the mobile app |
| Product Identifier | Text | ✅ Yes | No spaces allowed; configured from backend |
| Coins Count | Numeric | ✅ Yes | Positive integer. Represents base coins before any engagement bonus |
| Price | Numeric | ✅ Yes | Must be greater than zero. Represents the real-money price of the pack |
| Display Order | Numeric | ✅ Yes | Positive integer. Controls appearance order in the mobile app |
| Description | Text | ❌ Optional | Short description shown to users in the app |
| Status | Toggle | ✅ Yes | `Active` / `Inactive`. Defaults to **Active** on creation |

#### View-Only Fields

| Field | Description | Visibility |
|---|---|---|
| Currency | Currency code (e.g. USD). System-defined | Always |
| Plan ID | System-generated unique identifier | Edit mode only |
| Created Date | Format: `DD/MM/YYYY HH:MM`. System-generated | Edit mode only |
| Last Modified Date | Format: `DD/MM/YYYY HH:MM`. System-generated | Edit mode only |

---

### Section 2 — Engagement Tier Bonus Breakdown *(Read-Only)*

Displayed below Plan Configuration. Entirely read-only. Provides a live preview of effective coins a user will receive at purchase time, calculated per engagement tier.

#### Informational Note *(shown to admin)*

> Bella Coins uses an engagement-based bonus model. When a user purchases a coin pack, they receive bonus coins on top of the base pack coins depending on their current 7-day engagement score. The engagement score is calculated based on a weighted model that tracks user activities such as login streaks, OOTD generation, wardrobe updates, social interactions, and purchases over the last 7 days.
>
> The bonus percentage per tier and the activity caps used to calculate the engagement score are fully configurable from **App Configurations → Engagement Tiers & Bonus %**. This breakdown reflects whatever bonus percentages are currently saved there.

#### Engagement Score → Tier Mapping

| Score Range | Tier |
|---|---|
| 0 – 20 | Tier 0 |
| 21 – 40 | Tier 1 |
| 41 – 70 | Tier 2 |
| 71 – 85 | Tier 3 |
| 86 – 100 | Tier 4 |

#### Bonus Calculation Formula

```
Bonus Coins = Base Pack Coins (Coins Count) × Bonus (%)    [rounded down to nearest whole number]
Total Coins = Base Pack Coins + Bonus Coins
```

#### Breakdown Table

| Tier Name | Score | Bonus on Coin Pack (%) | Bonus Coins | Total Coins |
|---|---|---|---|---|
| Tier 0 | 0 – 20 | 0% | 0 | `[Coins Count]` |
| Tier 1 | 21 – 40 | 5% | `[Coins Count × 5%]` | `[Coins Count + Bonus]` |
| Tier 2 | 41 – 70 | 10% | `[Coins Count × 10%]` | `[Coins Count + Bonus]` |
| Tier 3 | 71 – 85 | 15% | `[Coins Count × 15%]` | `[Coins Count + Bonus]` |
| Tier 4 | 86 – 100 | 20% | `[Coins Count × 20%]` | `[Coins Count + Bonus]` |

#### Example — Pack with 300 Base Coins

| Tier Name | Score | Bonus % | Bonus Coins | Total Coins |
|---|---|---|---|---|
| Tier 0 | 0 – 20 | 0% | 0 | 300 |
| Tier 1 | 21 – 40 | 5% | 15 | 315 |
| Tier 2 | 41 – 70 | 10% | 30 | 330 |
| Tier 3 | 71 – 85 | 15% | 45 | 345 |
| Tier 4 | 86 – 100 | 20% | 60 | 360 |

#### Breakdown Table Rules

- All columns are **read-only** — cannot be edited from this screen
- **Tier Name, Score range, and Bonus %** are sourced from App Configurations → Engagement Tiers & Bonus %
- **Bonus Coins and Total Coins recalculate automatically** whenever the admin changes Coins Count in Section 1 — no Save required
- Bonus Coins are **rounded down** to the nearest whole number
- If Engagement Tier configurations have not been set up in App Configurations, the Bonus % column displays `0%` for all tiers and the following note is shown:
  > *"Engagement tier bonus percentages have not been configured. Visit App Configurations to set them up."*
- To modify Bonus % values, the Super Admin must navigate to **App Configurations → Engagement Tiers & Bonus %**
- This breakdown is for **admin reference only** — it is not displayed in tabular format on the mobile app; the mobile app shows only the applicable bonus to the user based on their tier at the time of purchase
- If App Configurations bonus percentages are updated by another admin while this screen is open, the breakdown reflects updated values **only on next page load**

---

### Action Buttons

| Button | Behavior |
|---|---|
| **Save** | Validates all mandatory fields. Saves the plan. Active plans become immediately available to the mobile application. Redirects admin to Reward Plans Listing with a success message. |
| **Cancel** | Discards all unsaved changes. Redirects admin to Reward Plans Listing without saving. |

#### Save Behavior
- All mandatory fields are validated before Save is processed
- If any field is invalid, Save is blocked and inline errors are surfaced per field
- Save failure **retains all entered values** in the form without resetting fields

---

### Validations & Error Messages

| Scenario | System Message |
|---|---|
| Coins Count is empty | `"Coin count is required."` |
| Coins Count is non-numeric or zero | `"Coins count must be a positive number."` |
| Price is empty | `"Please enter a valid price."` |
| Price is zero or negative | `"The price must be greater than zero."` |
| Display Order is empty | `"Display order is required."` |
| Display Order is non-numeric | `"Display order must be a positive number."` |
| Duplicate Coins Count detected | `"A reward plan with the same coin count already exists."` |
| Save failed (generic) | `"Unable to save reward plan. Please try again."` |
| System error | `"Something went wrong. Please contact support if the issue persists."` |

---

### Edge Cases

| Scenario | Expected Behavior |
|---|---|
| Coins Count updated | Engagement Tier Bonus Breakdown recalculates instantly without requiring Save |
| Engagement Tier bonus percentages not configured | All Bonus % values show as 0% with informational note |
| Duplicate Coins Count detected on Save | Blocked with inline validation error |
| Admin cancels mid-edit | All changes discarded, including any Coins Count changes made during the session |
| Save failure | All entered values retained in the form; no field reset |
| App Config bonus percentages updated by another admin while screen is open | Breakdown reflects updated values only on next page load |

---

### Business Rules

- Coins Count must be a **positive integer**
- Price must be **greater than zero**
- Status defaults to **Active** on plan creation
- Plans are **global** — no platform distinction between Android and iOS
- **Duplicate Coins Count** is not permitted across plans
- Changes to a plan **apply immediately** after Save
- **Existing payment history is never affected** by plan edits or status changes
- Bonus is applied **only at the purchase confirmation step** in the mobile app, before payment is completed
- Bonus is a **one-time benefit** per purchase; does not carry forward or stack across purchases

---

### Acceptance Criteria

- [ ] Admin can create a new reward plan with all mandatory fields validated
- [ ] Admin can edit Plan Name, Product Identifier, Coins Count, Price, Display Order, Description, and Status
- [ ] Currency, Plan ID, Created Date, and Last Modified Date are view-only
- [ ] Engagement Tier Bonus Breakdown section is displayed below plan configuration
- [ ] Breakdown table shows correct Tier Name, Score, Bonus %, Bonus Coins, and Total Coins for all 5 tiers
- [ ] Breakdown table recalculates automatically and instantly when Coins Count is changed
- [ ] Bonus Coins = Base Coins × Bonus %, rounded down to nearest whole number
- [ ] Total Coins = Base Coins + Bonus Coins per tier
- [ ] Breakdown table is entirely read-only
- [ ] Informational note about App Configurations is displayed in the breakdown section
- [ ] Active plans appear in the mobile app immediately after Save
- [ ] Deactivated plans are not available for purchase; existing purchase records remain intact
- [ ] Duplicate Coins Count is blocked with a clear inline validation error
- [ ] Cancel discards all changes and returns admin to the listing

---

## Component Mapping (BellaRoules Frontend)

| UI Element | Suggested Component / File |
|---|---|
| Listing screen container | Likely new `RewardPlansManagement.tsx` or existing pattern |
| Detail screen container | Likely new `RewardPlanDetail.tsx` |
| Listing table | MUI `Table` with sortable column headers |
| Status filter | MUI `Select` |
| Currency filter | MUI `Select` |
| Pagination | MUI `TablePagination` |
| Add Reward Plan button | MUI `Button` (primary) |
| Edit action | MUI `IconButton` or inline text action |
| Plan Name, Description | MUI `TextField` |
| Product Identifier | MUI `TextField` (no-spaces validation on change) |
| Coins Count, Price, Display Order | MUI `TextField` with `type="number"` |
| Status toggle | MUI `Switch` or `ToggleButtonGroup` (`Active` / `Inactive`) |
| View-only fields (Currency, Plan ID, Dates) | Read-only MUI `TextField` or labelled display rows |
| Engagement Tier Bonus Breakdown | MUI `Table` (read-only, auto-recalculates on Coins Count change) |
| Informational note | MUI `Alert` (info severity) |
| Save / Cancel buttons | MUI `Button` (primary / outlined) |
| Inline validation errors | MUI `FormHelperText` with error state |
| Toast notifications | MUI `Snackbar` + `Alert` |