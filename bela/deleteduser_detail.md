````md
# deleted_user_detail.md — Deleted Users (Details Screen)

All UI components already exist in the system. This document defines how to compose existing React components to build the **Deleted User Details** screen using mock APIs. No backend implementation is required.

Scope: **3.4.2 Deleted Users (Details)** — full details view (read-only) with strict restrictions.

---

## 1. Access & Roles

### Access To
- Super Admin only

### Preconditions
- Admin is authenticated and has an active session
- Deleted user record exists (from mobile app account deletion flow)
- Admin has access to User Management module

---

## 2. Screen Identity

- Screen Name: Deleted User Details
- Route: `/user-management/deleted-users/:deletedUserId`
- Entry Point: From Deleted Users listing by clicking User Name
- Breadcrumb: `User Management > Deleted Users > {Deleted User}`

---

## 3. Screen Purpose

To display complete historical user information in a **read-only** format for audit and reference.

Key rules:
- Layout must be **identical** to the Registered User Details screen
- All sections are reused
- All fields are read-only
- No actions must be available (strictly restricted)

---

## 4. Layout Rules (Reuse Existing Components Only)

### View Area Composition
Reuse the same detail-page layout used for **Registered User Details**:
1) Page Header
- Title: `Deleted User Details`
- Breadcrumb
- Back button: returns to Deleted Users listing (preserve listing query params)

2) User Summary / Header Card (same as registered user details)
- Avatar / initials
- Name
- User identifiers
- Status indicator: `Deleted` (badge/chip; if you already have a status chip component)
- Deletion metadata summary (Reason + Deleted At)

3) Key Statistics (same structure as registered user details)
- Display the same KPI card layout (read-only)

4) Tabs Section (same tabs as registered user details)
- Basic User Profile
- Wardrobe Details
- Wishlist Items
- Rewards
(Reuse same tab components and table/list components)

5) No action bar at the bottom (no Update/Cancel/Deactivate etc.)

No new UI components are allowed.

---

## 5. Data Displayed (What to Show)

### 5.1 Core Rule
“All details are same as the User Details with no actions.”

Therefore, **show the same sections as User Details**:
- Key Statistics (read-only)
- Profile (read-only)
- Mood history (read-only)
- Wardrobe details + history (read-only)
- Wishlist (read-only)
- Rewards history (read-only)

Additionally for deleted users, show deletion metadata:
- Reason for Deletion
- Date of Deletion
- Last Device Model (if available)
- Last OS Version (if available)

If device/OS data is not available:
- Display `N/A`

If deletion reason is empty:
- Deletion should not be allowed at app level, but if encountered in data:
  - Display `N/A` and do not break UI

---

## 6. Strictly Restricted Actions (Must NOT Exist)

The following actions MUST NOT be available anywhere on this screen:
- Edit user
- Restore user
- Reactivate user
- Reset password
- Login as user

Also ensure:
- No status dropdown
- No “Update” button
- No “Deactivate/Activate” controls
- No context menu actions

This screen is view-only.

---

## 7. Status & Access Rules (Deleted Users)

- Deleted users:
  - Cannot log in
  - Cannot be searched via global user search
  - Cannot trigger notifications
- Admin access is view-only

Frontend handling:
- Do not show any “Send notification” or similar CTA
- If the app has a global search bar, ensure deleted users are excluded from search results when in user-search contexts (mock rule)

---

## 8. Navigation Rules

### 8.1 Entry from Listing
- Clicking User Name from `/user-management/deleted-users` opens:
  `/user-management/deleted-users/:deletedUserId`

### 8.2 Back Navigation
- Back returns to deleted users listing
- Preserve listing state (recommended):
  - keep `page`, `pageSize`, `filters`, `sort` and `q` in query params

---

## 9. States & Error Handling

### Loading
- Show existing detail-page skeleton loaders (same as user details)

### Not Found
- If deleted user does not exist:
  - Show empty state: `User not found`
  - Show Back button → listing

### Unauthorized / Session Expired
- Redirect to login (existing auth flow)

### API Failure
- Show generic error state:
  - `Something went wrong. Please try again.`
- Provide Retry action

---

## 10. Mock API Specs — Deleted User Details

### 10.1 GET Deleted User Details (Summary + Profile + Stats)
Endpoint: `GET /mock/deleted-users/:deletedUserId`

200 Response:
```json
{
  "deletedUserId": "DU-00123",
  "userId": "U10234",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "country": "United States",
  "deletedAt": "2026-01-20T12:30:00Z",
  "deletionReason": "Privacy concerns",
  "deviceModel": "iPhone 14 Pro",
  "osVersion": "iOS 17.2",
  "profile": {
    "bio": "Casual chic all day",
    "profileImageUrl": "https://...",
    "dateOfBirth": "1997-04-18",
    "zodiacSign": "Aries",
    "gender": "Male",
    "ageGroup": "25-34",
    "location": "New York",
    "bodyShape": "Rectangle",
    "colorPreference": ["Black", "Pastel"],
    "stylePreference": ["Minimal", "Streetwear"],
    "signUpDate": "2025-11-20",
    "lastLoginDate": "2026-01-18"
  },
  "stats": {
    "wardrobeCount": 5,
    "wardrobeItemCount": 87,
    "ootdCount": 120,
    "rewardWalletBalance": 340
  },
  "status": "deleted"
}
````

Display rules:

* If `deviceModel` is null → show `N/A`
* If `osVersion` is null → show `N/A`
* If `deletionReason` is null/empty → show `N/A`

404 Response:

```json
{ "message": "User not found" }
```

---

### 10.2 GET Mood History (Paginated)

Endpoint: `GET /mock/deleted-users/:deletedUserId/moods`
Query Params: `page`, `pageSize`

200 Response:

```json
{
  "data": [
    { "date": "2026-01-18", "mood": "Happy" },
    { "date": "2026-01-17", "mood": "Sad" }
  ],
  "pagination": { "page": 1, "pageSize": 10, "total": 24 }
}
```

---

### 10.3 GET Wardrobes (Paginated)

Endpoint: `GET /mock/deleted-users/:deletedUserId/wardrobes`
Query Params: `page`, `pageSize`

Response item:

```json
{
  "wardrobeId": "W001",
  "wardrobeName": "Workwear",
  "wardrobeQuotient": 78,
  "wardrobeItemCount": 24
}
```

---

### 10.4 GET Wardrobe Quotient History (Paginated)

Endpoint: `GET /mock/deleted-users/:deletedUserId/wardrobes/:wardrobeId/quotient-history`
Query Params: `page`, `pageSize`

---

### 10.5 GET Wardrobe Suggestion History (Paginated)

Endpoint: `GET /mock/deleted-users/:deletedUserId/wardrobes/:wardrobeId/suggestions`
Query Params: `page`, `pageSize`

---

### 10.6 GET Wishlist (Paginated)

Endpoint: `GET /mock/deleted-users/:deletedUserId/wishlist`
Query Params: `page`, `pageSize`

Response item:

```json
{
  "itemId": "IT-9001",
  "title": "Black blazer",
  "category": "Outerwear",
  "imageUrl": "https://..."
}
```

---

### 10.7 GET Rewards Transactions (Paginated)

Endpoint: `GET /mock/deleted-users/:deletedUserId/rewards`
Query Params: `page`, `pageSize`

Response item:

```json
{
  "points": 40,
  "transactionType": "credit",
  "actionDone": "OOTD Generation",
  "transactionDate": "2026-01-10T11:22:00Z"
}
```

---

## 11. UI/UX Rules (Read-only Enforcement Checklist)

* No editable inputs (all fields rendered as text/display components)
* No primary action buttons (Update/Save/etc.)
* No kebab menu or row actions (within detail screen)
* All tables are read-only
* Tabs can be navigated; pagination works within each tab

---

## 12. Acceptance Criteria

* Deleted user details screen loads and matches Registered User Details layout
* All sections are present and read-only
* Deletion metadata (reason/date/device/os) is visible and uses N/A fallback when missing
* Restricted actions are not visible anywhere on the page
* Not found, unauthorized, loading, and error states are handled gracefully
* Back navigation returns to listing with preserved filters/sort/page

```
```
