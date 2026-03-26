# BellaRoules — Admin Dashboard FRD

**Module:** Dashboard  
**Version:** 1.0  
**Status:** In Review  
**Last Updated:** March 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Access & Actors](#access--actors)
3. [User Stories](#user-stories)
4. [Preconditions](#preconditions)
5. [Screen Purpose](#screen-purpose)
6. [Navigation Rules](#navigation-rules)
7. [Layout](#layout)
8. [Global Date Filter](#global-date-filter)
9. [Section 1: Growth & Retention](#section-1-growth--retention)
10. [Section 2: Monetization Intelligence](#section-2-monetization-intelligence)
11. [Section 3: AI Performance & Cost Control](#section-3-ai-performance--cost-control)
12. [Section 4: Moderation Intelligence](#section-4-moderation-intelligence)
13. [Section 5: Wardrobe Intelligence](#section-5-wardrobe-intelligence)
14. [Section 6: Community & Virality](#section-6-community--virality)
15. [Validations & Error Handling](#validations--error-handling)
16. [Non-Functional Requirements](#non-functional-requirements)
17. [Acceptance Criteria](#acceptance-criteria)

---

## Overview

The Admin Dashboard is the central analytics screen for the BellaRoules platform. It provides a single scrollable view of all key platform metrics organized into six sections. The screen is entirely read-only and serves as a navigation hub to detailed admin modules. Section-wise visibility for Sub Admin is managed through RBAC configuration.

---

## Access & Actors

| Actor | Access Level |
|---|---|
| Super Admin | Full access to all sections and metrics |
| Sub Admin | Section-wise access configured via RBAC. Financial and revenue sections restricted by default |

---

## User Stories

### Primary — Super Admin

> As a Super Admin, I want to view a consolidated analytics dashboard covering growth, monetization, AI performance, moderation, wardrobe intelligence, and community metrics so that I can monitor platform health and make informed decisions.

### Secondary — Sub Admin

> As a Sub Admin, I want to view analytics relevant to my assigned role so that I can monitor platform activity within my area of responsibility without accessing restricted financial or sensitive data.

---

## Preconditions

- Admin must be logged in with valid credentials
- Admin must have an active session
- Admin must have access to the Admin Web Application
- Stable internet connection is required
- Required data sources (users, OOTD, rewards, payments, moderation, AI logs) must be available and responsive

---

## Screen Purpose

The Admin Dashboard provides:

- Immediate visibility into platform growth and user activity
- Real-time monitoring of AI performance and cost
- Snapshot of revenue and purchases
- Core moderation health signals
- Wardrobe intelligence and quality metrics
- Community engagement and virality indicators

---

## Navigation Rules

- The Admin Dashboard is the default landing screen after successful admin login
- Accessible anytime via the sidebar menu → Dashboard
- Clicking on any KPI, chart, or table row that has a drill-down navigates to the respective module or report screen
- No data can be edited from this screen

---

## Layout

Single scrollable page. Sections are displayed in the following order:

1. Growth & Retention
2. Monetization Intelligence
3. AI Performance & Cost Control
4. Moderation Intelligence
5. Wardrobe Intelligence
6. Community & Virality

---

## Global Date Filter

| Property | Value |
|---|---|
| Default | Current Month (MTD) |
| Options | Custom Start Date – End Date |
| Application | Server-side |

> **Important:** Each section specifies whether it respects the global filter or uses its own independent filter. Sections with independent filters are explicitly noted under each metric.

---

---

## Section 1: Growth & Retention

---

### 1.1 New Users Today

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | No global filter. Current day only |

**Description:** Total number of users who successfully completed registration within the current calendar day based on system timezone.

**Calculation:**
- Count of users who completed registration after 12:00 AM today
- A user is considered registered immediately after OTP verification is completed
- Guest users are excluded

**Display:** Single numeric count

---

### 1.2 Active Users Today

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | No global filter. Current day only |

**Description:** Total number of unique registered users who performed at least one qualifying activity during the current calendar day.

**Qualifying Activities (at least one required):**
- Login activity or Mood Submission
- OOTD generation or Virtual Try-On generation
- Social Engagement (post, like, comment, follow)

**Calculation:**
- Count of distinct registered user IDs with at least one qualifying activity after 12:00 AM today
- Guest users are excluded
- Multiple actions by the same user are counted once

**Display:** Single numeric count

---

### 1.3 Retention Cohorts

| Property | Value |
|---|---|
| Analytics Type | Table |
| Filter Behaviour | No global filter. Past 1 month from current date |

**Description:** Tracks Day 1, Day 7, and Day 30 retention of registered users by signup date, split by platform.

**Table Structure:**

| Platform | Day 1 | Day 7 | Day 30 |
|---|---|---|---|
| Android | — | — | — |
| iOS | — | — | — |

> ⚠️ **TBD:** Retention cohort value definition (% active vs absolute count) and retention calculation methodology are **to be confirmed by Dimple Panchal.**

---

### 1.4 Churn Risk Users

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | No global filter. Evaluates past 30 days from current date |

**Description:** Count of registered users who have not performed any qualifying activity in the past 30 days.

**Qualifying Activities (same as Active Users Today):**
- Login activity or Mood Submission
- OOTD generation or Virtual Try-On generation
- Social Engagement

**Calculation:**
- Count of registered users with zero qualifying activity in the last 30 days
- Guest users are excluded

**Display:** Single numeric count

---

### 1.5 Reactivation Rate

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | No global filter. Evaluates past 30 days from current date |

**Description:** Percentage of churned users (inactive for 7+ days) who returned and became active within the past 30 days.

**Calculation:**
```
Reactivation Rate (%) = (Users who reactivated in past 30 days ÷ Total inactive users in past 30 days) × 100
```

**Rules:**
- A user is considered reactivated when they perform at least one qualifying activity after being inactive for 7+ consecutive days
- The reactivation window resets every time a user returns

**Display:** Percentage value (e.g. 12.4%)

---

### 1.6 Activation Funnel

| Property | Value |
|---|---|
| Analytics Type | Funnel Chart (Horizontal) |
| Filter Behaviour | No global filter. Evaluates past 7 days from current date |

**Description:** Measures drop-off across four key activation milestones for newly registered users in the past 7 days.

**Funnel Steps:**

| Step | Definition |
|---|---|
| Sign Up | Count of total registered users in past 7 days |
| Onboarding | Count of users who completed onboarding (Style Preference selection as final step) |
| Wardrobe Upload | Count of users who uploaded at least one wardrobe item |
| First 3 OOTDs | Count of users who completed their first 3 OOTD generations |

**Calculation:**
- Each step shows the absolute count of users who reached that milestone
- Drop-off % between steps = ((Previous step count − Current step count) ÷ Previous step count) × 100

**Display:** Horizontal funnel chart with count at each step and drop-off % shown between each step

---

---

## Section 2: Monetization Intelligence

---

### 2.1 Revenue Today

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | No global filter. Current day only |
| Currency | USD |

**Description:** Total gross revenue generated from all successful payment transactions within the current calendar day.

**Calculation:**
- Sum of gross amount from all successful transactions after 12:00 AM today

**Display:** USD amount (e.g. $1,240.00)

---

### 2.2 Revenue MTD (Month-to-Date)

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | No global filter. Current month only |
| Currency | USD |

**Description:** Total gross revenue accumulated from the first day of the current month up to the current date.

**Calculation:**
- Sum of gross amount from all successful transactions from the 1st of the current month to today

**Display:** USD amount (e.g. $28,450.00)

---

### 2.3 Revenue Trend Chart

| Property | Value |
|---|---|
| Analytics Type | Line Chart |
| Filter Behaviour | Admin can select past months (month + year filter). Default: current month MTD |
| Currency | USD |

**Description:** Time-series visualization showing daily gross revenue for the selected month.

**Calculation:**
- X-axis: Day of selected month (1–31)
- Y-axis: Total gross revenue per day in USD
- Only successful transactions included
- Days with no revenue display as 0

**Display:** Line chart with daily data points. Tooltip on hover shows date and revenue amount.

---

### 2.4 Purchases Today

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | No global filter. Current day only |

**Description:** Total number of successful coin pack purchase transactions completed during the current calendar day.

**Calculation:**
- Count of successful payment transactions after 12:00 AM today

**Display:** Single numeric count

---

### 2.5 AI Utilization / Burned Out

| Property | Value |
|---|---|
| Analytics Type | Grouped Bar Chart |
| Filter Behaviour | Independent filter: Last 24 Hours / This Week / This Month / Overall |
| Currency | USD (for cost values) |

**Description:** Total AI consumption across OpenAI and Gemini showing tokens burnt, total cost, and API calls made within the selected time range.

**Chart Structure:**

Two grouped bar clusters — one for Gemini, one for OpenAI. Each cluster contains three bars:

| Bar | Unit |
|---|---|
| Tokens Burnt | Count |
| Total Cost | USD ($) |
| API Calls | Count |

**Display:** Grouped bar chart with values labeled on each bar. Legend distinguishes Gemini and OpenAI.

---

### 2.6 Commission — iOS

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | Independent filter: Last 24 Hours / This Week / This Month / Overall |
| Currency | USD |

**Description:** Total platform commission deducted by Apple App Store for iOS in-app purchases during the selected period.

**Calculation:**
```
Commission (iOS) = Sum of (Gross Amount × iOS Platform Fee %) for all successful iOS transactions
```

**Rules:**
- iOS Platform Fee % is configurable from App Configurations
- Default pre-assumed rate: 30% (no real-time API available from Apple)
- No percentage breakdown or variation is displayed on the card

**Display:** USD amount

---

### 2.7 Commission — Android

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | Independent filter: Last 24 Hours / This Week / This Month / Overall |
| Currency | USD |

**Description:** Total platform commission deducted by Google Play Store for Android in-app purchases during the selected period.

**Calculation:**
```
Commission (Android) = Sum of (Gross Amount × Android Platform Fee %) for all successful Android transactions
```

**Rules:**
- Android Platform Fee % is configurable from App Configurations
- Default pre-assumed rate: 30% (no real-time API available from Google Play)
- No percentage breakdown or variation is displayed on the card

**Display:** USD amount

---

---

## Section 3: AI Performance & Cost Control

> This section incorporates System & Technical Health metrics (AI API Error Rate, AI Success Rate, AI Retry Rate) as they are directly related to AI performance monitoring.

---

### 3.1 OOTD Generated Today

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | No global filter. Current day only |

**Description:** Total number of OOTD generations successfully completed within the current calendar day.

**Calculation:**
- Count of successful OOTD generation events after 12:00 AM today

**Display:** Single numeric count

---

### 3.2 Rerolls Today

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | No global filter. Current day only |

**Description:** Total number of Roll the Dice (OOTD regeneration) actions triggered by users during the current calendar day.

**Calculation:**
- Count of dice reroll events after 12:00 AM today
- Each reroll counts as one API call made

**Display:** Single numeric count

---

### 3.3 AI Latency (Avg / P95)

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | Current month data up to current date. No additional filter |

**Description:** Average and 95th percentile API response time across all configured AI models, with an indicator highlighting the model with comparatively higher latency.

**Calculation:**
- Formula: To be provided by Tech Lead
- Aggregated across all configured AI models
- Secondary indicator identifies the model with higher latency

**Display Format:**
- Primary: Avg Latency and P95 Latency values
- Secondary indicator in **`bold red`**: e.g. `P95 Latency 3.45s — OpenAI 12% higher`

---

### 3.4 Total OOTD Cost

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | Current month data up to current date. No additional filter |
| Currency | USD |

**Description:** Total AI cost incurred for all OOTD generation within the selected time frame.

**Calculation:**
```
Total OOTD Cost = Sum of total cost of all API calls made during OOTD generation in selected period
```

**Display:** USD amount

---

### 3.5 Total Try-On Cost

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | Current month data up to current date. No additional filter |
| Currency | USD |

**Description:** Total AI cost incurred for all Virtual Try-On generation within the selected time frame.

**Calculation:**
```
Total Try-On Cost = Sum of total cost of all API calls made during Virtual Try-On generation in selected period
```

**Display:** USD amount

---

### 3.6 AI API Error Rate & AI Success Rate

| Property | Value |
|---|---|
| Analytics Type | Combined Component (two KPI cards within a single UI block) |
| Filter Behaviour | Current month data up to current date. No additional filter |

**Description:** Displays the percentage of failed and successful AI API calls within the selected period. Both metrics are shown as distinct KPI cards within a single component.

**Card 1 — AI API Error Rate:**
```
AI API Error Rate (%) = (Failed API Calls ÷ Total API Calls) × 100
```

**Card 2 — AI Success Rate:**
```
AI Success Rate (%) = (Successful API Calls ÷ Total API Calls) × 100
```

**Display:** Two distinct KPI cards rendered within one component block

---

### 3.7 AI Retry Rate

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | Current month data up to current date. No additional filter |

**Description:** Percentage of total API calls that were automatically retried by the system after a failure. The system retries up to 3 times after a failed call.

**Calculation:**
```
AI Retry Rate (%) = (Retry API Calls ÷ Total API Calls) × 100
```

**Display:** Percentage (e.g. 1.8%)

---

---

## Section 4: Moderation Intelligence

---

### 4.1 Pending Flags

| Property | Value |
|---|---|
| Analytics Type | Pie Chart |
| Filter Behaviour | Independent filter: Today / Last 7 Days / Last 30 Days / Overall |

**Description:** Total number of content items currently awaiting moderation review, broken down by content type.

**Pie Chart Segments:**
- Flagged Users
- Flagged Comments
- Flagged Posts
- Flagged Messages
- Flagged Wardrobe Items

**Display:** Pie chart with segment labels and counts. Hover shows segment name and count.

> **Note:** This filter is entirely independent from the global date filter.

---

### 4.2 Average Resolution Time

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | Overall data. No separate filter |

**Description:** Average time taken to resolve moderation flags across all content types.

**Calculation:**
```
Average Resolution Time = Average of (Flag Closed Timestamp − Flag Raised Timestamp) across all resolved flags
```

**Display:** Duration value (e.g. 4h 32m)

---

### 4.3 Repeat Offenders

| Property | Value |
|---|---|
| Analytics Type | Table (Top 5) |
| Filter Behaviour | Overall data. No separate filter |

**Description:** Top 5 registered users who have been flagged the most number of times across all content types.

**Table Columns:**

| # | User Name | Flag Count |
|---|---|---|
| 1 | — | — |
| 2 | — | — |
| 3 | — | — |
| 4 | — | — |
| 5 | — | — |

**Business Rules:**
- Index column shows rank (1–5)
- Clicking User Name redirects to the User Detail page
- Configurable flag threshold (default: 3 flags) determines eligibility — configurable from App Configurations

---

### 4.4 Flag Trend Growth

| Property | Value |
|---|---|
| Analytics Type | Line Chart |
| Filter Behaviour | Admin can select past months via month filter. Default: current month MTD |

**Description:** Daily trend of total moderation flag volume for the selected month.

**Calculation:**
- X-axis: Day of selected month
- Y-axis: Total count of all flags raised (all types combined) per day

**Display:** Line chart with daily data points. Tooltip on hover shows date and flag count.

---

### 4.5 SLA Breach Rate

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | No global filter. Evaluates past 30 days from current date |

**Description:** Percentage of flagged items that remained unresolved beyond the configured SLA threshold.

**Calculation:**
```
SLA Breach Rate (%) = (Total flagged items unresolved beyond SLA threshold ÷ Total flagged items) × 100
```

**Rules:**
- SLA threshold default: 1 day (24 hours)
- SLA threshold is configurable from App Configurations

**Display:** Percentage (e.g. 8.3%)

---

---

## Section 5: Wardrobe Intelligence

---

### 5.1 Size Distribution

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | No filter required |

**Description:** Displays the most frequently occurring clothing size across all wardrobe items for Top and Bottom wear categories only.

**Calculation:**
- Size values returned from API as: S, M, L, XL, XXL, XXXL
- Only Top wear and Bottom wear categories considered
- Head, Foot, and Accessories categories excluded
- Value: Single size label with the highest item count across all users

**Display:** Size label (e.g. "M") + item count

---

### 5.2 Color Dominance Index

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | No filter required |

**Description:** The most common color found across all wardrobe items of all users.

**Calculation:**
- Source: Color field of wardrobe items (returned as hex code from API)
- Value: Hex code with the highest item count across all wardrobe items

**Display:** Color swatch rendered from hex code + hex code label + item count  
Example: `⬛ #1A1A2E — 4,210 items`

---

### 5.3 Silhouette Preference

> ⚠️ **Status: TBD — to be confirmed by Dimple Panchal.**  
> Definition, data source, and display format to be documented once confirmed. Placeholder retained in FRD.

---

### 5.4 Average Items per User

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | No filter required. Overall platform data |

**Description:** Mean number of wardrobe items per registered user across the platform.

**Calculation:**
```
Average Items per User = Total Wardrobe Items ÷ Total Registered Users
```

**Display:** Numeric value (e.g. 14.3)

---

### 5.5 Average Wardrobe Quotient

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | No filter required. Overall platform data |

**Description:** Average wardrobe quotient score across all users on the platform.

**Calculation:**
```
Average Wardrobe Quotient = Average of (Wardrobe Quotient Score per user) across all registered users
```

**Display:** Percentage (e.g. 63%)

---

### 5.6 Wardrobe Quotient Trend

| Property | Value |
|---|---|
| Analytics Type | Line Chart |
| Filter Behaviour | Month-wise filter. Only past months can be selected |

**Description:** Daily change in the platform-level average wardrobe quotient for the selected month.

**Calculation:**
- X-axis: Day of selected month
- Y-axis: Daily average wardrobe quotient across all users

**Display:** Line chart with daily data points. Tooltip on hover shows date and average quotient.

---

### 5.7 Total Wardrobes Created

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | Independent filter: Today / Last 7 Days / Last 30 Days / Overall |

**Description:** Total number of wardrobe records created within the selected time frame.

**Calculation:**
- Count of wardrobe records created in the selected period

**Display:** Single numeric count

---

### 5.8 Average Items per Wardrobe

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | Overall data. No additional filter |

**Description:** Mean number of items across all wardrobes on the platform.

**Calculation:**
```
Average Items per Wardrobe = Total Wardrobe Items ÷ Total Wardrobes
```

**Display:** Numeric value (e.g. 11.6)

---

### 5.9 Cost Per Wear (CPW)

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | No filter required |
| Currency | USD |

**Description:** Average cost incurred each time a wardrobe item is worn, across all items where the user has manually added a price.

**Calculation:**
```
CPW per item = Item Cost ÷ Wear Count  (only items with user-entered price)
Platform CPW = Average of CPW across all eligible items
```

**Rules:**
- Items with no user-entered price are excluded
- AI-inferred prices are excluded

**Display:** USD amount (e.g. $4.20)

---

### 5.10 Average CPW (Platform Level)

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | No filter required |
| Currency | USD |

**Description:** Mean cost per wear displayed separately for Android and iOS users.

**Calculation:**
- Same CPW formula as 5.9 above
- Split by platform based on user's last active platform

**Display:** Two values side by side  
Example: `Android: $3.80 | iOS: $4.60`

---

### 5.11 Brand-Level CPW

| Property | Value |
|---|---|
| Analytics Type | Table (Top 5 + Unbranded row) |
| Filter Behaviour | No filter required |
| Currency | USD |

**Description:** Top 5 brands with the highest Cost Per Wear, with Unbranded items shown as a separate highlighted sixth row.

**Table Columns:**

| Brand Name | CPW | Item Count |
|---|---|---|
| Brand A | $X.XX | N |
| Brand B | $X.XX | N |
| Brand C | $X.XX | N |
| Brand D | $X.XX | N |
| Brand E | $X.XX | N |
| **Unbranded** *(highlighted)* | **$X.XX** | **N** |

**Business Rules:**
- Only items with user-entered price included
- CPW per brand = Average of (Item Cost ÷ Wear Count) for all items of that brand across all users
- Unbranded = items with no brand name tagged; always shown as 6th row, visually highlighted

---

### 5.12 Color Trend Index

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | No filter required |

**Description:** The most frequently styled color across all OOTD-generated outfits.

**Calculation:**
```
Color Trend Index = Hex code of the color that appears most frequently across all worn OOTD items
Formula: Count of times each color hex appears in OOTD outfit items → highest count wins
```

**Display:** Color swatch rendered from hex code + hex code label + OOTD inclusion count  
Example: `🟤 #8B5E3C — 6,840 OOTD inclusions`

---

### 5.13 Total Outfits with Prices

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | No filter available |

**Description:** Total number of wardrobe items where users have manually added a price, along with the percentage of total items this represents.

**Calculation:**
```
Count = Total wardrobe items with user-entered price
Percentage = (Total items with price ÷ Total wardrobe items) × 100
```

**Rules:**
- Only user-entered prices are counted
- AI-inferred prices are excluded

**Display:** Count + Percentage  
Example: `4,210 items — 34.2%`

---

---

## Section 6: Community & Virality

---

### 6.1 Engagement Score Index

> ⚠️ **Status: TBD — to be confirmed by Dimple Panchal.**  
> Formula and display format to be documented once confirmed.  
> Pre-agreed: Equal weights for Likes, Comments, Saves, and Shares.

---

### 6.2 Top Influencers

| Property | Value |
|---|---|
| Analytics Type | Table (Top 5 Leaderboard) |
| Filter Behaviour | No filter required. Overall platform data |

**Description:** Top 5 registered users with the highest engagement-to-follower ratio on the platform.

**Table Columns:**

| User Name | Followers | Total Engagement | Ratio |
|---|---|---|---|
| — | — | — | — |
| — | — | — | — |
| — | — | — | — |
| — | — | — | — |
| — | — | — | — |

**Calculation:**
```
Total Engagement = Likes + Comments + Saves + Shares on user's posts
Ratio = Total Engagement ÷ Followers
```

**Business Rules:**
- Clicking a User Name redirects to the User Detail page
- Ranked by Ratio descending

---

### 6.3 Share Rate

| Property | Value |
|---|---|
| Analytics Type | KPI Card |
| Filter Behaviour | No filter required |

**Description:** Average number of shares per post across the platform.

**Calculation:**
```
Share Rate = Total Post Shares ÷ Total Number of Posts
```

**Display:** Numeric value (e.g. 2.4 shares/post)

---

### 6.4 Follower Growth Rate

> ⚠️ **Status: TBD — to be confirmed by Dimple Panchal.**  
> Display format and calculation methodology to be documented once confirmed.

---

---

## Validations & Error Handling

| Scenario | Behaviour |
|---|---|
| No data for a metric | Display "No data available" — no error state |
| Zero value | Display as 0, not blank |
| Partial data | Must not break layout or affect adjacent widgets |
| API failure for any widget | Show fallback message with retry option specific to that widget only |
| RBAC-restricted widget | Must not render any placeholder or error — completely absent from Sub Admin view |
| TBD metrics | Rendered as clearly marked placeholder blocks with no broken UI |

---

## Non-Functional Requirements

| Requirement | Detail |
|---|---|
| KPI Card refresh | Cached, refreshed every 1–5 minutes |
| Charts and Tables refresh | Refreshed on filter change |
| Timezone | All timestamps stored in UTC; displayed in admin's local timezone |
| Deleted entities | Deleted users, posts, and wardrobe items excluded from all aggregates unless the metric explicitly tracks deletions |
| Performance | All visible widgets must load within acceptable performance limits |

---

## Acceptance Criteria

- All KPI cards display backend-calculated values correctly
- All charts render correctly for their respective filter ranges
- All independent filters work correctly without affecting global filter metrics
- Global date filter applies only to metrics explicitly marked as filter-applicable
- RBAC correctly hides restricted sections for Sub Admin roles with no visible placeholder
- All navigation links from clickable metrics redirect to the correct admin module
- Empty states and zero values render gracefully without breaking layout
- No data can be modified from this screen
- TBD metrics (Retention Cohorts, Silhouette Preference, Engagement Score Index, Follower Growth Rate) render as clearly marked placeholder blocks with no broken UI
- AI Latency higher-latency indicator renders in **bold red** with model name and percentage difference
- Unbranded row in Brand-Level CPW table is always rendered as the 6th row with visual highlight
- Color Dominance Index and Color Trend Index display as colour swatch + hex code + count
- Commission iOS and Android calculations use platform fee % from App Configurations
- SLA Breach Rate threshold reads from App Configurations and is not hardcoded

---

*End of BellaRoules Admin Dashboard FRD*