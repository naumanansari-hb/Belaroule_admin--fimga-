

````md
# deleted_users.md — Deleted Users Module (Listing + Details Redirect Only)

All UI components already exist in the system. This document defines how to compose existing React components for the **Deleted Users (Listing)** screen and how to **redirect to Deleted User Details** on click. No backend is built; use mock APIs.

Scope in this file:
- Deleted Users (Listing) — full spec
- Deleted Users (Details) — redirect/navigation rules only (details UI will be handled in a separate file later)

---

## 1. Access & Roles

### Access To
- Super Admin (required)

### Module Constraints (Strict)
- Deleted users must NEVER appear in:
  - Active Users listing
  - Guest Users listing
- No bulk actions allowed
- No inline actions allowed
- View-only auditing module

---

## 2. Routes & Navigation

### Sidebar Path
User Management → Deleted Users

### Routes
- Listing: `/user-management/deleted-users`
- Details: `/user-management/deleted-users/:deletedUserId`

### Navigation Rules
- From listing:
  - Clicking **User Name** redirects to **Deleted User Details route**
  - No edit/view modal on listing; only redirect

### Default State Preservation (Recommended)
- Preserve listing state (filters/sort/page) in URL query params so “Back” from details returns to the same list state.

---

# 3.4.1 Deleted Users (Listing)

## 3. Screen Identity
- Screen Name: Deleted Users (Listing)
- Route: `/user-management/deleted-users`
- Breadcrumb: User Management > Deleted Users

---

## 4. Screen Purpose
Provide a searchable, filterable, sortable, paginated, exportable list of all deleted users for audit/reference.

---

## 5. Layout & Component Composition (Reuse Existing)
Use existing layout shell:
- Global Header
- Sidebar
- View Area includes:

1) Page Header
- Title: `Deleted Users`
- Breadcrumb: `User Management > Deleted Users`

2) Toolbar (existing toolbar components)
- Date of Deletion range filter
- Reason for Deletion filter
- Device Model filter (optional; only if API provides values)
- OS Version filter (optional; only if API provides values)
- Export CSV button (existing export/button component)
- Clear/Reset filters control (if already exists)

3) Data Table (existing table component)
- Server-side pagination + sorting
- User Name is clickable (link-style)

4) Pagination Footer (existing component)
- total count
- page size selector

No new UI components must be created.

---

## 6. Listing Table Columns
Render exactly these columns:

1) **User Name** (clickable → details route)
2) **Reason for Deletion**
3) **Date of Deletion** (timestamp; display in consistent admin format)
4) **Device Model** (if unavailable show `N/A`)
5) **OS Version** (if unavailable show `N/A`)

Notes:
- There must be NO Action column
- There must be NO selection checkbox column

---

## 7. Filters (Server-side)

### 7.1 Date of Deletion (From–To)
- Input: start date + end date
- Default: empty (no filter) unless product has a default window
- Rule: applying filter resets page to 1

### 7.2 Reason for Deletion
- Input: dropdown (preferred) if backend provides distinct reasons; otherwise text search-style filter (reuse existing control only)
- Rule: applying filter resets page to 1

### 7.3 Device Model (If available)
- Input: dropdown
- If options endpoint fails/unavailable:
  - disable control and show helper “Unavailable”
- Rule: applying filter resets page to 1

### 7.4 OS Version (If available)
- Input: dropdown
- Same availability handling as Device Model
- Rule: applying filter resets page to 1

---

## 8. Sorting (Server-side)
- Sort by all columns:
  - User Name
  - Reason for Deletion
  - Date of Deletion
  - Device Model
  - OS Version

Recommended default:
- Date of Deletion: Descending (latest first)

Sorting must respect applied filters.

---

## 9. Search (Optional)
FRD emphasizes filter/sort/export; if a global search input already exists in the shared listing toolbar component, you may reuse it as keyword search.

If enabled:
- Placeholder: `Search deleted users...`
- Searches only within deleted users dataset (not global users search)
- Search fields (recommended):
  - User Name
  - Reason for Deletion

If no search component exists for this module, do not add a new one.

---

## 10. Pagination (Server-side)
- Default page size: 10
- Options: 10 / 25 / 50
- Controls: next/previous + page numbers
- Display: “Showing X–Y of Z”
- Any filter/sort/search change resets page to 1

---

## 11. Export CSV
### Availability
- Show Export button only if user has permission (Super Admin always allowed)

### Export Rules
Export must respect:
- Applied filters
- Search keyword (if enabled)
- Sorting order

### Export Columns
Export must include exactly the visible table columns:
- User Name
- Reason for Deletion
- Date of Deletion
- Device Model
- OS Version

### UX Behavior (Frontend)
- Clicking Export triggers mock API call
- While exporting:
  - disable button and show loading state/spinner (existing pattern)
- On success:
  - browser download of CSV (or show success toast if download handled elsewhere)
- On failure:
  - show error toast: “Unable to export. Please try again.”

---

## 12. States & Error Handling

### Loading
- Show existing table skeleton/loader

### Empty (No records at all)
- Message: `No Deleted Users Available.`

### Empty (No results for filters/search)
- Message: `No results found.`

### API Failure
- Inline message: `Something went wrong. Please try again.`
- Provide Retry action (existing button)

### Unauthorized / Session Expired
- Redirect to login (existing auth flow)

---

## 13. Row Click & Details Redirect
- Only **User Name** is clickable
- On click:
  - Navigate to: `/user-management/deleted-users/:deletedUserId`
  - Preserve listing context via query params (recommended)

No modal or inline view is allowed on listing.

---

## 14. Mock API Specs — Deleted Users Listing

### 14.1 GET Deleted Users List
Endpoint: `GET /mock/deleted-users`

Query Params:
- `dateFrom` (YYYY-MM-DD) optional
- `dateTo` (YYYY-MM-DD) optional
- `reason` (string or reasonKey) optional
- `deviceModel` (string) optional
- `osVersion` (string) optional
- `q` (string) optional (only if search enabled)
- `sortBy` = `userName|reason|deletedAt|deviceModel|osVersion`
- `sortOrder` = `asc|desc`
- `page` (number)
- `pageSize` (number)

200 Response:
```json
{
  "data": [
    {
      "deletedUserId": "DU-00123",
      "userName": "John Doe",
      "reason": "Not using the app",
      "deletedAt": "2026-01-20T12:30:00Z",
      "deviceModel": "iPhone 14 Pro",
      "osVersion": "iOS 17.2"
    },
    {
      "deletedUserId": "DU-00124",
      "userName": "Aanya Sharma",
      "reason": "Privacy concerns",
      "deletedAt": "2026-01-18T09:10:00Z",
      "deviceModel": null,
      "osVersion": null
    }
  ],
  "pagination": { "page": 1, "pageSize": 10, "total": 240 }
}
````

Frontend display rule for null device/os:

* Show `N/A`

Empty Response (200):

```json
{ "data": [], "pagination": { "page": 1, "pageSize": 10, "total": 0 } }
```

401:

```json
{ "message": "Unauthorized" }
```

500:

```json
{ "message": "Something went wrong" }
```

---

### 14.2 GET Filter Options (Optional; use only if dropdowns already exist)

Device Models:

* Endpoint: `GET /mock/deleted-users/filters/device-models`
* Response:

```json
{ "options": ["iPhone 14 Pro", "Samsung Galaxy S23"] }
```

OS Versions:

* Endpoint: `GET /mock/deleted-users/filters/os-versions`
* Response:

```json
{ "options": ["iOS 17.2", "Android 14"] }
```

Deletion Reasons:

* Endpoint: `GET /mock/deleted-users/filters/reasons`
* Response:

```json
{
  "options": [
    { "key": "NOT_USING", "label": "Not using the app" },
    { "key": "PRIVACY", "label": "Privacy concerns" }
  ]
}
```

If any options endpoint fails:

* Disable the corresponding dropdown and continue rendering the list.

---

### 14.3 Export CSV

Endpoint: `GET /mock/deleted-users/export`

Query Params:

* Same as list endpoint for filters/sort/search

Response (200):

* `text/csv` file stream OR a pre-signed mock URL payload (choose whichever matches existing export implementation)

Option A (CSV stream):

* Response headers:

  * `Content-Type: text/csv`
  * `Content-Disposition: attachment; filename="deleted_users.csv"`

Option B (download url):

```json
{ "downloadUrl": "https://example.com/mock/deleted_users.csv" }
```

---

# 3.4.2 Deleted Users (Details) — Redirect Only (No UI Spec Here)

## 15. Details Redirect Rules (Only)

* Clicking User Name in listing navigates to:

  * `/user-management/deleted-users/:deletedUserId`
* Details screen layout must be identical to Registered User Details (reuse components)
* All fields are read-only
* No actions must be visible (Edit/Restore/Reactivate/Reset password/Login as user)

> Details UI and mock APIs for details will be defined in a separate markdown file when requested.

---

## 16. Acceptance Criteria

* Admin can view deleted users listing with server-side pagination
* Filters (date, reason, device model, os version) apply correctly
* Sorting works for all columns
* Export generates CSV respecting filters/sort/search
* User Name redirects to deleted user detail route
* Empty and error states are handled gracefully
* No bulk actions or inline actions exist on this screen

```
```
