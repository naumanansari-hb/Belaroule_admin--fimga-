# Flagged Comments — Flagged Content Management (Figma Specification)

## Scope
Listing + Detail screens for monitoring and resolving **flagged comments**.

Access:
- Super Admin
- Sub Admin (role-based)

---

## Global Impact Rule
When a comment is marked **Inactive**:
- Comment removed from the application

---

## 1) Flagged Comments — Listing

### Header Actions
- Search:
  - Flag ID
  - Flagged By
  - Post Owner
  - Comment ID
- Filters:
  - Status: Flagged / Resolved
  - Flagged Date: Date Range
- Sort:
  - Date (Asc / Desc)

### Table Columns
- Flag ID
- Comment ID
- Comment Owner
- Post ID (linked)
- Post Owner (linked)
- Flagged By
- Flagged Date (DD/MM/YYYY)
- Status
- Action: Edit

### Pagination
- Server-side pagination (10 / 25 / 50)
- Empty state: “No Flagged Comments Available.”

---

## 2) Flagged Comment — Detail

### Sections
- Flag Details:
  - Flag ID
  - Flagged By (linked)
  - Flagged Date
  - Flag Reason
  - Flag Status
- Comment Details:
  - Comment ID
  - Comment Owner (linked)
  - Post ID (linked)
  - Comment Text

### Admin Actions
- Comment Status (Active / Inactive) — Mandatory
- Admin Note (optional)

### Actions
- Update
- Cancel

### Confirmation Logic
- Same as flagged users (single vs multiple flags)

### Success
- “Comment status updated successfully.”