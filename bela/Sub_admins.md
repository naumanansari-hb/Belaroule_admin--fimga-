# Sub Admin Management – Admin Panel (Figma Specification)

## Scope
This document defines all **User management >> Sub admins**
for the BellaRoules Admin Panel.

**Access:** Super Admin role only

---

## 1. Sub Admins – Listing

### Purpose
Enable Super Admins to view, search, filter, create, and manage Sub Admin accounts.

### Header Actions
- Search by:
  - Sub Admin ID
  - Name
  - Email
- Filter by:
  - Status (Active / Inactive)
  - Role (from Role Master)
- Add Sub Admin
- Mark Active / Inactive (bulk action)

### Table Columns
- Selection Checkbox (bulk activate/deactivate)
- Sub Admin ID (system-generated, clickable)
- Sub Admin Name
- Sub Admin Email
- Assigned Role
- Status (Active / Inactive)
- Last Login Date (DD/MM/YYYY)
- Action:
  - Reset Password

### Pagination
- Server-side pagination
- Default page size: 10
- Rows per page: 10 / 25 / 50
- Total record count visible
- Empty state when no data found

---

## 2. Add Sub Admin (Modal)

### Fields
- Full Name
  - Mandatory
  - Alphabets only
  - Length: 1–100 characters
- Email
  - Mandatory
  - Unique
  - Valid email format
- Role
  - Mandatory
  - Single-select dropdown
  - Active roles only
- Status
  - Mandatory
  - Active / Inactive
  - Default: Active

### Actions
- Create New
  - Validates email uniqueness
  - Creates Sub Admin
  - Sends Set Password email
- Discard
  - Closes modal without saving

---

## 3. Sub Admin – Detail

### Purpose
View and manage details of an individual Sub Admin.

### Fields
- Sub Admin ID (read-only)
- Full Name (editable)
- Email (editable, must be unique)
- Role (dropdown, active roles only)
- Account Status (Active / Inactive)
- Last Login Date (read-only)
- Account Created Date (read-only)

### Actions
- Update
  - Shows confirmation popup
  - Applies changes
  - Forces logout if role or status is changed
- Cancel
  - Discards changes
  - Redirects to Sub Admin listing

---

## 4. Status & Security Rules

- Only Active Sub Admins can log in
- Inactive Sub Admins:
  - Are immediately logged out
  - Cannot access any Admin Panel module
- Role or status change:
  - Terminates active session
  - Requires fresh login

---

## Global Rules

- Only Super Admin can access Sub Admin screens
- All lists support pagination and empty states
