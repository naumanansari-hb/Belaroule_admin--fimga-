# Home > Dashboard — Admin Panel (Figma Specification)

## Scope
This document defines the **Home > Dashboard** screen for the BellaRoules Admin Panel,
as per FRD (Home → Dashboard).

This screen is:
- Default landing screen after login
- **Read-only**
- Central monitoring + navigation hub

**Access:**
- Super Admin
- Sub Admin (Read-only; RBAC applies)

---

## Navigation Rules
- Dashboard is the default landing screen after successful login.
- Accessible anytime via Sidebar → **Dashboard**.
- Clicking any KPI / chart / row redirects to respective detailed module/report screen.
- No data can be edited from this screen.
- Unauthorized widgets must be hidden based on role permissions.

---

## Global Filters (Top Filter Bar)

### Filters Available
- **Date Range**
  - Default: Current Month (MTD)
  - Custom Start Date – End Date
- **Country**
  - Default: All
- **Platform**
  - Default: All
  - Options: Android, iOS

### Filter Rules
- Filters are applied server-side.
- Filters apply to all widgets except:
  - Pending Moderation KPIs
  - AI / API Failures (last 24 hours)
- Changing filters reloads all applicable widgets.

---

## Dashboard Sections & Widgets

## Section 1: KPI Cards (Top Section)

### KPI 1: Pending Flags (Total)
- Shows total unresolved moderation flags across platform
- Includes flags with status = Pending
- Covers entities: Users, Posts, Comments, Messages, Wardrobe Items
- Derived values:
  - Total Pending Flags = count of pending flags
  - Oldest Pending Flag = duration since earliest pending flag creation
- Action: Click → Moderation Queue (All Flags)

### KPI 2: AI / API Failures (24h)
- Failed AI or API calls in the last 24 hours
- Failures include timeouts, invalid responses, and hard failures
- Derived values:
  - Failure Count
  - Failure Rate (%) = Failed Requests / Total Requests × 100
- Action: Click → API Failure Report

### KPI 3: Revenue Today
- Total successful revenue generated today
- Action: Click → Payment History

### KPI 4: Revenue MTD
- Total revenue from month start to current date

### KPI 5: Purchases Today
- Count of successful purchase transactions today

### KPI 6: OOTD Generated Today
- Total number of successful OOTD generations today
- Only successful/completed sessions are counted
- Action: Click → OOTD Report

### KPI 7: Rerolls Today
- Total rerolls performed today
- Sum of reroll counts across sessions

### KPI 8: New Users Today
- Number of newly registered users today

### KPI 9: Active Users Today
- Unique users with ≥ 1 tracked action today
- Shows:
  - Total Active Users Today
  - Active Users Today – iOS
  - Active Users Today – Android

#### Definition of Active User
A user is active today if they perform at least one tracked action within 00:00–23:59 (system timezone).

Tracked Actions:
- Login
- OOTD generation
- Wardrobe upload
- Mood submission
- Community interaction (post, like, comment, follow)

UI notes:
- Show platform-wise breakdown clearly
- Tooltip/info icon can explain the definition

---

## Section 2: Needs Attention (Action Queue)

### Purpose
Highlights areas that require immediate admin attention.

### Rows Displayed
- Flagged Users (Pending)
- Flagged Posts (Pending)
- Flagged Comments (Pending)
- Flagged Messages (Pending)
- Flagged Wardrobe Items (Pending)
- AI / API Failures (24h)
- Deactivated Users Today

### Per Row Data
- Pending Count
- Oldest Pending Duration (hours)

### Navigation
Each row redirects to respective module listing screen.

---

## Section 3: Core Trend Charts

### OOTD Activity Trend
- Chart Type: Line
- Metrics:
  - OOTD Generated
  - Rerolls
- X-Axis: Date
- Y-Axis: Count

### Revenue Trend
- Chart Type: Line
- Metric: Daily Revenue

### Moderation Load Trend
- Chart Type: Stacked Bar
- Segments:
  - Users
  - Posts
  - Comments
  - Messages
  - Wardrobe Items

---

## Section 4: Mood Analytics

### Mood Distribution
- Chart Type: Donut
- Metrics:
  - Happy
  - Excited
  - Sad
  - Angry

### Mood Trend Over Time
- Chart Type: Stacked Area / Bar
- Metrics: Mood submissions per day grouped by mood type

Derived Metric:
- % Users Submitted Mood Today =
  - Mood submissions today / Active users today × 100

---

## Section 5: Wardrobe Intelligence

### Average Wardrobe Quotient
- Average wardrobe quality score across users
- Scale: 0 to 100

### Wardrobe Quotient Trend
- Chart Type: Line
- Metric: daily average wardrobe quotient

Supplementary Metrics:
- Total Wardrobes Created
- Average Items per Wardrobe

---

## Section 6: Community & Virality

### Top Viral Posts (Top 5)
- Display: Table
- Criteria: Highest share count
- Columns:
  - Post ID (clickable)
  - User
  - Shares
  - Likes
  - Comments
  - Created Date
- Action: Click → Post Detail

### Top Engaged Posts
- Criteria: Engagement Score
- Engagement Formula:
  - Likes + Comments + Saves

---

## Section 7: Reward Economy Overview
- Bella Coins Issued Today (Credit)
- Bella Coins Redeemed Today (Debit)
- Net Coin Flow = Issued – Redeemed

---

## Refresh Rules
- KPI Cards: cached, refreshed every 1–5 minutes
- Charts & Tables: refreshed on filter apply
- Needs Attention section: near real-time

---

## Validations & Error Handling
- No data → show “No data available”
- Zero values displayed as 0
- Partial data must not break layout
- API failure shows fallback message with Retry option
- Unauthorized widgets hidden based on RBAC

---

## Edge Cases
- New platform with no data → show empty states gracefully
- High data volume → aggregation server-side
- Timezone differences handled via server timezone calculations
- Deleted users/posts excluded from aggregates

---

## Acceptance Criteria
- Dashboard loads within performance limits
- KPIs match backend-calculated values
- Read-only enforced
- Navigation redirects correctly
- Filters behave consistently
- Charts render correctly for all date ranges