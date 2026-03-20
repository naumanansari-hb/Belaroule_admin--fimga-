# User Detail

> **Screen Purpose:** Allows admins to view complete user profile information, activity statistics, wardrobe data, rewards, and wishlist details. Also enables admins to control user access through activation or deactivation of user accounts.

---

## Access Control

| Role | Access |
|---|---|
| Super Admin | Full read & write |
| Sub Admin | Read/write only if role permission is explicitly granted |

**Preconditions:**
- Admin must have valid login credentials and access to the Admin Panel
- Admin must have permission to access User Management
- Selected user must exist in the system
- Admin must have an active and stable internet connection

---

## Navigation Rules

- Admin navigates to this screen by clicking on a **User ID** from the User Listing screen
- Clicking **Back** redirects the admin to the User Listing screen
- Any successful update action must **retain the admin on the detail screen** with a confirmation message

---

## Key Statistics *(Read-Only)*

Displayed as a statistics bar/card row at the top of the screen.

| Statistic | Description |
|---|---|
| Wardrobe Count | Total number of wardrobes created by the user |
| Wardrobe Item Total Count | Total number of items across all wardrobes |
| OOTD Count | Total number of outfit generations (lifetime) |
| Reward Wallet Balance | Current Bella Coins balance |
| Virtual Try-On Count | Total number of virtual try-ons generated (lifetime) |
| Wardrobe Index | User's current wardrobe index. Updated via configured cron jobs |
| Average Cost Per Wear | Sum of Total Item Cost in Wardrobe ÷ Sum of Total Items |
| Wardrobe Improvement Score | Numeric value (0–100). Formula: `100 − (Total Zone Deviation ÷ 2)`. Higher score = more balanced wardrobe. Updated via cron jobs |
| Circular Intelligence Score | Percentage (0–100%). Formula below. Recalculated on every wardrobe item addition and OOTD generation |

### Circular Intelligence Score Formula

```
AverageWear           = Total monthly wears ÷ Total wardrobe items
AverageWearNormalized = AverageWear ÷ TargetWear              [capped at 1.0]
UtilizationRate       = Items worn at least once ÷ Total items
CircularScore         = (AverageWearNormalized + UtilizationRate) ÷ 2
```

---

## User Status

| Property | Detail |
|---|---|
| Input type | Single selection dropdown |
| Values | `Active` / `Inactive` |
| Mandatory | Yes |
| Deactivation type | Soft lock — user cannot access the app, but all data remains intact |

### Status Transition Flow

| Transition | Effect |
|---|---|
| Active → Inactive | User cannot log in or access the application. All data, wardrobe, rewards, and history are preserved. |
| Inactive → Active | Platform access is fully restored. |

---

## Tabs

The screen is organized into **7 tabs**. All data across tabs is read-only unless explicitly noted.

---

### Tab 1 — Basic User Profile

#### Profile Information *(Read-Only)*

| Field | Notes |
|---|---|
| User ID | System-generated identifier |
| Name | Full name |
| Email | Displayed with verified status indicator |
| Bio | User-entered bio |
| Country | |
| Profile Image | |
| Date of Birth | |
| Zodiac Sign | System-derived from Date of Birth |
| Gender | |
| Age Group | |
| Location | |
| Body Shape | |
| Color Preference | |
| Device Model (Last Used) | |
| OS Version (Last Used) | |
| Signed Up By | Registration method (e.g., Email, Google, Apple) |
| Style Preference | |
| Last Login Date | Format: `DD/MM/YYYY` |
| Sign Up Date | Format: `DD/MM/YYYY` |

#### Sub-Section: Mood Change History

| Property | Detail |
|---|---|
| Layout | Tabular |
| Columns | Date, Mood |
| Pagination | Supported |
| Editable | No — Read-only |

---

### Tab 2 — Wardrobe Details

Displays all wardrobe items belonging to the user.

#### Wardrobe Items Table

| Column | Description |
|---|---|
| Item Image | Thumbnail of the wardrobe item |
| Name | Item name |
| Category | Top / Bottom / Headwear / Accessories / Shoes |
| Color | Item color |
| Added Date | Format: `DD/MM/YYYY` |
| Item Cost | Cost if provided by the user |
| Wardrobe Name | Name of the wardrobe the item belongs to |
| Wardrobe ID | System-generated wardrobe identifier |
| Pattern | Item pattern (if available) |
| Material | Item material (if available) |
| Brand | Brand name (if tagged) |
| Wardrobe Zone | System-assigned zone label displayed as a read-only colour-coded badge |

---

#### Wardrobe Zone Classification *(Read-Only)*

Zone is system-calculated and auto-assigned. Admin view is strictly read-only; no manual override is possible.

##### Cost Index (CI)

Normalizes item cost relative to the user's average wardrobe item cost.

```
CI = C ÷ Cavg
```

Where `C` = Item cost and `Cavg` = Average cost of all wardrobe items.

| CI Value | Cost Level |
|---|---|
| CI ≥ 1.2 | High Cost |
| 0.7 ≤ CI < 1.2 | Medium Cost |
| CI < 0.7 | Low Cost |

> **Note:** CI can only be calculated for items where the user has provided an item cost. Items with no cost entered are excluded from CI-based zone classification and displayed without a zone label.

##### Usage Index (UI)

Reflects both the frequency and recency of item wear.

```
UI = W ÷ (W + D/30)
```

Where `W` = number of times worn and `D` = number of days since the item was last worn.

| UI Value | Usage Level |
|---|---|
| UI ≥ 0.60 | High Usage |
| 0.30 ≤ UI < 0.60 | Moderate Usage |
| UI < 0.30 | Low Usage |

##### Zone Classification Matrix

| Cost Index (CI) | Usage Index (UI) | Zone |
|---|---|---|
| CI ≥ 1.2 | UI < 0.30 | 🔴 Locked Capital |
| CI ≥ 0.7 | 0.30 ≤ UI < 0.60 | 🟠 Event / Occasion |
| CI < 1.2 | UI < 0.30 | 🟡 Dormant Asset |
| Any | UI ≥ 0.60 | 🟢 Core Rotation |

##### Zone Descriptions

| Zone | Description |
|---|---|
| 🔴 Locked Capital | High cost, rarely worn. Expensive item sitting unused in the wardrobe |
| 🟠 Event / Occasion | Moderate to high cost, occasionally worn. Reserved for specific events or occasions |
| 🟡 Dormant Asset | Low to moderate cost, rarely or never worn. Forgotten or seasonal items |
| 🟢 Core Rotation | Any cost, frequently and recently worn. Everyday wardrobe staples |

##### Zone Classification Rules

- Zone is system-calculated and auto-assigned; admin view is **read-only**
- **Core Rotation takes priority:** any item with `UI ≥ 0.60` is classified as Core Rotation regardless of CI
- Zone is **recalculated** whenever the user logs a wear or adds a new wardrobe item
- Items with **no cost provided** cannot be classified into Locked Capital or Event / Occasion; they display without a zone badge or are assigned Dormant Asset based on UI alone
- If an item has **never been worn** (`W = 0`) and `D` is undefined, UI is treated as `0`; item defaults to Dormant Asset or Locked Capital based on CI
- Zone badge is displayed as a **colour-coded label** alongside each item row in the wardrobe table

> ⚠️ **Open Question — Zone Matrix Overlap:** An item with CI between 0.7 and 1.2 and UI < 0.30 could simultaneously match both Event/Occasion (CI ≥ 0.7) and Dormant Asset (CI < 1.2). The recommended tie-breaking priority order is: **Core Rotation → Locked Capital → Event/Occasion → Dormant Asset**. This must be confirmed with the team before dev picks up this screen.

##### Ideal vs. Current Zone Distribution *(Reference Benchmark)*

Used in the backend to compute the user's Wardrobe Improvement Score shown in Key Statistics.

| Zone | Ideal Distribution |
|---|---|
| Core Rotation | 40% |
| Event / Occasion | 30% |
| Dormant Asset | 20% |
| Locked Capital | 10% |

---

### Tab 3 — Wishlist Items

| Property | Detail |
|---|---|
| Layout | Card or table |
| Columns | Item Image, Item Category, Item Title |
| Editable | No — Read-only |
| Pagination | Supported |

---

### Tab 4 — Rewards

#### Reward Transaction History

| Column | Description |
|---|---|
| Reward Points | Coins earned or spent |
| Transaction Type | `Credit` / `Debit` |
| Action Performed | See action list below |
| Transaction Date | Format: `DD/MM/YYYY` with timestamp |

**Credit Actions:**
User Registration, Full Name Added, Age Group Selected, Body Shape Added, Color Preference Added, Valid User Image Uploaded, Style Preference Added, First Outfit Added, Onboarding Completed, Daily Login – Day 1 through Day 6, Weekly Streak Bonus, First Outfit Upload, Complete Outfit Set, Monthly Wardrobe Update, First Social Post, Like Post, Comment Post, Follow User

**Debit Actions:**
Single Wardrobe Slot, Buy Wardrobe Space, Roll the Dice, Restore Streak, Virtual Try-Ons

| Property | Detail |
|---|---|
| Editable | No — Read-only |
| Pagination | Supported |
| Filter / Search / Sort | Not available |

---

### Tab 5 — Virtual Try-On

| Property | Detail |
|---|---|
| Layout | Card layout |
| Card Contents | Try-on preview, Date & time, Associated items (if applicable) |
| Detail View | Matches mobile app Figma for Virtual Try-On |
| Editable | No — Read-only |

---

### Tab 6 — OOTD

| Property | Detail |
|---|---|
| Layout | Card layout |
| Card Contents | Outfit preview, ERA, Occasion, Outfit Items, Hair Style, Body Shape, Mood, Style Comfort, Dress Code, Fabric Choice |
| Detail View | Matches mobile app Figma for OOTD |
| Editable | No — Read-only |

---

### Tab 7 — Past Wardrobe Indexes

| Property | Detail |
|---|---|
| Layout | Table |
| Columns | Wardrobe Index, Date/Time, Suggestions, Category-wise breakdown |
| Editable | No — Read-only |
| Pagination | Supported |

---

## Action Buttons

| Button | Behavior |
|---|---|
| **Update** | Opens confirmation pop-up: *"Are you sure you want to update the user status?"* On confirmation, updates status and shows toast: *"User status updated successfully."* |
| **Cancel** | Discards changes and retains admin on the User Detail screen |

---

## Edge Cases

| Scenario | Expected Behavior |
|---|---|
| User record does not exist | Display: `"User not found"` |
| Selected status is same as current status | System must prevent duplicate update |
| Item has no cost entered | CI cannot be calculated; zone badge is hidden or defaults to Dormant Asset based on UI value alone |
| Item has never been worn (W = 0, D undefined) | UI is treated as `0`; item defaults to Dormant Asset or Locked Capital based on CI |
| Session expires during update | Admin must be redirected to the login screen |
| Backend service fails or times out | Display generic error message |

---

## Error & Notification Messages

| Scenario | System Message |
|---|---|
| Status updated successfully | `"User status updated successfully."` |
| User record not found | `"User not found."` |
| Backend error on update | Generic error message |
| Unauthorized access | `"You are not authorized to perform this action."` |

---

## Acceptance Criteria

- [ ] Admin can view complete user profile information
- [ ] Key Statistics section displays Wardrobe Improvement Score and Circular Intelligence Score correctly alongside existing statistics
- [ ] Wardrobe Improvement Score reflects the formula: `100 − (Total Zone Deviation ÷ 2)`
- [ ] Circular Intelligence Score is displayed as a percentage (0–100%)
- [ ] Each wardrobe item in Tab 2 displays a Wardrobe Zone badge calculated from CI and UI
- [ ] Zone classification follows the matrix: Core Rotation (UI ≥ 0.60), Locked Capital (CI ≥ 1.2, UI < 0.30), Event / Occasion (CI ≥ 0.7, 0.30 ≤ UI < 0.60), Dormant Asset (CI < 1.2, UI < 0.30)
- [ ] Zone badge is read-only and not editable by any admin role
- [ ] Items with no cost provided are handled gracefully without breaking zone display
- [ ] Admin can navigate across all 7 tabs
- [ ] Admin can activate or deactivate a user account via the status dropdown
- [ ] Confirmation pop-up appears before status update is applied
- [ ] Pagination functions correctly across all history sections (Moods, Rewards, Wishlist, Past Wardrobe Indexes)
- [ ] Virtual Try-On and OOTD detail views match mobile app Figma
- [ ] Unauthorized users cannot access the User Detail screen

---

## Component Mapping (BellaRoules Frontend)

| UI Element | Suggested Component / File |
|---|---|
| Screen container | `UserDetail.tsx` |
| Key Statistics bar | Stat card grid (read-only MUI `Card` or custom component) |
| User Status dropdown | MUI `Select` (controlled, mandatory) |
| Tab navigation | MUI `Tabs` + `Tab` |
| Profile fields | Read-only MUI `TextField` or labelled display rows |
| Mood History table | MUI `Table` with pagination (`TablePagination`) |
| Wardrobe Items table | MUI `Table` with zone badge chip (`MUI Chip`, colour-coded) |
| Zone badge | MUI `Chip` with colour mapping: 🔴 red / 🟠 orange / 🟡 yellow / 🟢 green |
| Wishlist tab | Card grid (read-only) |
| Rewards table | MUI `Table` with pagination |
| Virtual Try-On cards | Card layout matching mobile app Figma |
| OOTD cards | Card layout matching mobile app Figma |
| Past Wardrobe Indexes table | MUI `Table` with pagination |
| Update / Cancel buttons | MUI `Button` (primary / outlined) |
| Confirmation pop-up | MUI `Dialog` |
| Toast notification | MUI `Snackbar` + `Alert` |