# Users — User Management (Figma Specification)

## Scope
This document defines the **Users module** in the BellaRoules Admin Panel.

Covers:
- Users Listing
- User Detail (Profile + Tabs)
- User Status management (Active / Inactive)

Applies to:
- Super Admin
- Sub Admin (role-based permission)

---

## 1) Users — Listing Screen

### Purpose
View, search, filter, sort and manage all registered users.

### Navigation
- Sidebar → User Management → Users
- Click User ID → User Detail screen

---

### Header Actions

#### Search User
Search by:
- User ID
- Name
- Email

#### Filters
- Status
  - Active
  - Inactive
- Signup Method
  - Email
  - Social
  - Guest
- Country

#### Sorting
- Wardrobe Count (Asc / Desc)
- Item Count (Asc / Desc)

#### Bulk Action
- Mark Active / Inactive (bulk using selection checkbox)

---

### Business Rules
- Users are created only via BellaRoules Mobile App
- Admin Panel cannot create users
- Status update immediately restricts/restores access
- Bulk actions supported

---

### Table Columns
- Selection Checkbox
- User ID (System-generated; clickable)
- User Name
- User Email
- Wardrobe Count
- Items Count
- Status (Active / Inactive)
- Last Login Date (DD/MM/YYYY)
- Action:
  - View Details
  - Edit (opens User Detail screen)
  - Mark Inactive

---

### Pagination
- Server-side pagination
- Default page size: 10
- Rows per page: 10 / 25 / 50
- Total count display
- Empty state supported

---

### Edge Cases
- No records → “No Users Available.”
- No results found → “No results found”
- Session expiry → redirect to login
- Backend failure → generic error message

---

## 2) User — Detail Screen

### Purpose
View complete user profile information and activity, and manage user status.

---

## Header: Key Statistics (Read-only)
- Wardrobe Count
- Wardrobe Item Total Count
- OOTD Count
- Reward Wallet Balance

---

## User Status
- Dropdown: Active / Inactive
- Mandatory
- Soft lock when inactive (data preserved)

---

## Tabs

### Tab 1: Basic User Profile (Read-only)
Fields:
- User ID
- Name
- Email (with verified status)
- Bio
- Country
- Profile Image
- Date of Birth
- Zodiac Sign
- Gender
- Age Group
- Location
- Body Shape
- Color Preference
- Style Preference
- Last Login Date (DD/MM/YYYY)
- Sign Up Date (DD/MM/YYYY)

#### Mood Change History (Table, Read-only, Paginated)
Columns:
- Date
- Mood

---

### Tab 2: Wardrobe Details (Read-only)

#### Wardrobe Overview (per wardrobe)
- Wardrobe Name / ID
- Wardrobe Quotient
- Wardrobe Item Count

#### Wardrobe Quotient Change History (Paginated)
- Quotient Value
- Date of Change

#### Wardrobe Suggestion History
- Item Name
- Item Image
- Item Title

---

### Tab 3: Wishlist Items (Read-only)
Fields:
- Item Image
- Item Category
- Item Title
- Pagination supported

---

### Tab 4: Rewards (Read-only)

Reward Transaction History (Paginated):
- Reward Points
- Transaction Type (Credit / Debit)
- Action Done
- Transaction Date with Timestamp (DD/MM/YYYY)

---

## Actions
- Update
  - Confirmation popup:
    - “Are you sure you want to update the user status?”
  - On confirm:
    - Update status
    - toaster: “User status updated successfully.”
- Cancel
  - Discard changes and stay on screen

---

## Edge Cases
- User not found → “User not found”
- Prevent duplicate status update
- Session expiry → redirect to login
- Backend failure → generic error

---

## Acceptance Criteria
- Admin can view paginated user listing
- Admin can search/filter/sort users
- Admin can view full user detail with all tabs
- Admin can update user status with confirmation
- Unauthorized users cannot access Users module